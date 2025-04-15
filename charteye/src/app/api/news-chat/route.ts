import { NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import fs from 'fs';
import path from 'path';

// Initialize OpenAI
const openai = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
  modelName: 'gpt-3.5-turbo',
});

// Initialize embeddings
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Path to news data directory - handle both local and Render environments
function getNewsDataDir() {
  // Check for environment variables that might be set in deployment
  if (process.env.NEWS_DATA_DIR) {
    return process.env.NEWS_DATA_DIR;
  }
  
  // Try multiple possible locations
  const possiblePaths = [
    // Default path relative to project root
    path.join(process.cwd(), 'news-data'),
    // Absolute path for Render
    '/data/news-data',
    // Path relative to the server directory
    path.join(process.cwd(), '..', 'news-data'),
    // Path relative to the Next.js app directory
    path.join(process.cwd(), '..', '..', 'news-data')
  ];
  
  // Try each path and use the first one that exists or is creatable
  for (const dirPath of possiblePaths) {
    try {
      if (!fs.existsSync(dirPath)) {
        // Try to create the directory
        console.log(`[News Chat API] Attempting to create directory: ${dirPath}`);
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      // Test if directory is writable
      const testFile = path.join(dirPath, '.test-write');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      
      console.log(`[News Chat API] Using news data directory: ${dirPath}`);
      return dirPath;
    } catch (error: any) {
      console.log(`[News Chat API] Cannot use directory ${dirPath}: ${error.message}`);
      // Continue to next path
    }
  }
  
  // If no path works, fall back to default
  const defaultPath = path.join(process.cwd(), 'news-data');
  console.log(`[News Chat API] Falling back to default path: ${defaultPath}`);
  return defaultPath;
}

interface NewsDocument {
  pageContent: string;
  metadata: {
    source: string;
    timestamp: string;
    currency: string;
  };
}

// Function to get more detailed news documents with source and timestamp
async function getNewsDocuments(currency: string): Promise<Document[]> {
  const NEWS_DATA_DIR = getNewsDataDir();
  const documents: Document[] = [];

  if (!fs.existsSync(NEWS_DATA_DIR)) {
    console.log(`[News Chat API] Directory not found: ${NEWS_DATA_DIR}`);
    return documents;
  }

  try {
    const files = fs.readdirSync(NEWS_DATA_DIR)
      .filter(file => file.endsWith('.json') && file !== 'metadata.json')
      .sort((a, b) => {
        return fs.statSync(path.join(NEWS_DATA_DIR, b)).mtime.getTime() - 
               fs.statSync(path.join(NEWS_DATA_DIR, a)).mtime.getTime();
      })
      .slice(0, 20); // Process last 20 news files (increased from 10)

    console.log(`[News Chat API] Processing ${files.length} news files`);
    
    for (const file of files) {
      const filePath = path.join(NEWS_DATA_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      try {
        const fileData = JSON.parse(fileContent);
        const timestamp = fileData.timestamp || new Date().toISOString();
        const source = fileData.source || fileData.source_url || 'Financial News';
        
        console.log(`[News Chat API] Processing file: ${file}, source: ${source}`);

        // Add headlines with metadata
        if (fileData.headlines && Array.isArray(fileData.headlines)) {
          for (const headline of fileData.headlines) {
            if (headline && headline.trim()) {
              documents.push(new Document({
                pageContent: `HEADLINE: ${headline}`,
                metadata: {
                  source,
                  timestamp,
                  currency,
                  type: 'headline'
                }
              }));
            }
          }
        }

        // Add snippets with metadata
        if (fileData.snippets && Array.isArray(fileData.snippets)) {
          for (const snippet of fileData.snippets) {
            if (snippet && snippet.trim()) {
              documents.push(new Document({
                pageContent: `NEWS SNIPPET: ${snippet}`,
                metadata: {
                  source,
                  timestamp,
                  currency,
                  type: 'snippet'
                }
              }));
            }
          }
        }
      } catch (parseError) {
        console.error(`[News Chat API] Error parsing file ${file}:`, parseError);
      }
    }
  } catch (error) {
    console.error('[News Chat API] Error reading news files:', error);
  }

  console.log(`[News Chat API] Total documents loaded: ${documents.length}`);
  return documents;
}

// Create vector store from documents
async function createVectorStore(documents: Document[]) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await textSplitter.splitDocuments(documents);
  return await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
}

// Create chat prompt template with better formatting
const chatPromptTemplate = PromptTemplate.fromTemplate(`
You are an expert financial news analyst assistant. Use the following pieces of financial news context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Be specific and reference the news you're basing your answer on.

Financial news context about {currency}:
{context}

Previous chat history:
{chat_history}

Question: {question}

Answer: Let me analyze the latest financial news about {currency} to answer your question.
`);

// Create a chain that will format the prompt and parse the output as a string
const chain = RunnableSequence.from([
  chatPromptTemplate,
  openai,
  new StringOutputParser(),
]);

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export async function POST(request: Request) {
  try {
    console.log('[News Chat API] Received request');
    const { message, currency, history } = await request.json();
    console.log(`[News Chat API] Processing message: "${message}" for currency: ${currency}`);

    // Get relevant news documents
    console.log('[News Chat API] Getting news documents');
    const documents = await getNewsDocuments(currency);
    console.log(`[News Chat API] Found ${documents.length} documents`);
    
    if (documents.length === 0) {
      console.log('[News Chat API] No documents found, returning empty response');
      return NextResponse.json({
        response: "I apologize, but I don't have any recent news data available to answer your question. Please try again later when more news data is available."
      });
    }

    // Create vector store
    console.log('[News Chat API] Creating vector store');
    try {
      const vectorStore = await createVectorStore(documents);

      // Search for relevant documents - increasing from 5 to 10
      console.log('[News Chat API] Searching for relevant documents');
      const relevantDocs = await vectorStore.similaritySearch(message, 10);
      console.log(`[News Chat API] Found ${relevantDocs.length} relevant documents`);

      // Format the context with source and timestamp information
      const formattedContext = relevantDocs.map((doc: Document) => {
        const metadata = doc.metadata || {};
        const timestamp = metadata.timestamp ? new Date(metadata.timestamp).toLocaleString() : 'Unknown time';
        return `[${timestamp} from ${metadata.source || 'Unknown source'}] ${doc.pageContent}`;
      }).join('\n\n');

      console.log('[News Chat API] Context length:', formattedContext.length);

      // Format chat history
      console.log('[News Chat API] Formatting chat history');
      const chatHistory = (history as ChatMessage[])
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      // Get response from OpenAI using the chain
      console.log('[News Chat API] Getting response from OpenAI');
      try {
        // Use the chain to get a response as a string
        const responseText = await chain.invoke({
          context: formattedContext,
          chat_history: chatHistory,
          question: message,
          currency: currency
        });
        
        console.log('[News Chat API] Received response from OpenAI');
        return NextResponse.json({ response: responseText });
      } catch (openaiError) {
        console.error('[News Chat API] OpenAI API error:', openaiError);
        return NextResponse.json(
          { error: 'Error communicating with OpenAI API', details: String(openaiError) },
          { status: 500 }
        );
      }
    } catch (vectorError) {
      console.error('[News Chat API] Vector store error:', vectorError);
      return NextResponse.json(
        { error: 'Error processing news data', details: String(vectorError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[News Chat API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message', details: String(error) },
      { status: 500 }
    );
  }
} 