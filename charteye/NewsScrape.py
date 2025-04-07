import os
import requests
from bs4 import BeautifulSoup
import re
import schedule
import time
import json
from datetime import datetime
import pathlib
import sys

# Get the absolute path to the script directory
SCRIPT_DIR = pathlib.Path(__file__).parent.absolute()
# Create news-data directory next to the script
NEWS_DATA_DIR = SCRIPT_DIR / "news-data"

# Print environment info for debugging
print(f"Python version: {sys.version}")
print(f"Script directory: {SCRIPT_DIR}")
print(f"News data directory: {NEWS_DATA_DIR}")

# Make sure the directory exists
NEWS_DATA_DIR.mkdir(exist_ok=True)

# Create a metadata file to track the latest news
METADATA_FILE = NEWS_DATA_DIR / "metadata.json"

# For SiteGround compatibility, ensure we use proper permissions
def ensure_dir_permissions(directory):
    """Ensure the directory has the right permissions (755)"""
    try:
        os.chmod(directory, 0o755)
        print(f"Set permissions for {directory}")
    except Exception as e:
        print(f"Warning: Could not set permissions for {directory}: {e}")

# Ensure we have proper permissions
ensure_dir_permissions(NEWS_DATA_DIR)

# Code To Bypass 403 For Some Sites That Prevent Crawling
def get_text_from_url(url):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        response = requests.get(url, headers=headers, timeout=30)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')  # Using html.parser for better compatibility
            text = soup.get_text()
            return text
        else:
            print(f"Failed to retrieve content from {url}. Status code: {response.status_code}")

    except requests.exceptions.RequestException as e:
        print(f"An error occurred while requesting {url}:", e)

    return None

def clean_text(text):
    # Remove extra whitespace, tabs, and line breaks
    cleaned_text = re.sub(r'\s+', ' ', text)
    # Remove any strange characters
    cleaned_text = re.sub(r'[^\x00-\x7F]+', ' ', cleaned_text)
    return cleaned_text.strip()

def extract_titles_and_snippets(text):
    """Extract potential headlines and news snippets from text"""
    # Simple approach: Look for sentences that might be headlines
    # Start by splitting into paragraphs
    paragraphs = re.split(r'\n\n|\.\s+', text)
    
    # Filter for potential headlines (shorter text, often with keywords)
    news_keywords = ['market', 'stock', 'economy', 'fed', 'reserve', 'inflation', 'interest rate', 
                    'gdp', 'growth', 'recession', 'bull', 'bear', 'rally', 'crash', 'index',
                    'dow', 'nasdaq', 'sp500', 's&p', 'forex', 'currency', 'bond', 'yield',
                    'treasury', 'crude', 'oil', 'gold', 'investor', 'trade', 'earnings']
    
    headlines = []
    content_snippets = []
    
    for i, para in enumerate(paragraphs):
        para = para.strip()
        if not para or len(para) < 10:  # Skip empty or very short paragraphs
            continue
            
        # Check if this paragraph is likely a headline
        is_headline = (len(para) < 150 and 
                      any(keyword in para.lower() for keyword in news_keywords) and
                      not para.endswith(','))
        
        if is_headline and len(headlines) < 20:  # Collect up to 20 headlines
            headlines.append(para)
        elif i < len(paragraphs) - 1 and len(para) > 150 and len(content_snippets) < 30:  # Collect content snippets
            content_snippets.append(para)
    
    return headlines, content_snippets

def save_text_to_file(text, filename):
    if not text:
        print("No text to save.")
        return
    
    # Clean up the text
    cleaned_text = clean_text(text)
    
    # Extract potential headlines and content
    headlines, content_snippets = extract_titles_and_snippets(cleaned_text)
    
    # Create a structured data object
    news_data = {
        "source_url": urls[int(filename.split('_')[1].split('.')[0])],
        "timestamp": datetime.now().isoformat(),
        "headlines": headlines,
        "snippets": content_snippets,
        "full_text": cleaned_text[:5000]  # Limit to first 5000 chars to avoid huge files
    }
    
    # Save as JSON for better structure
    try:
        file_path = NEWS_DATA_DIR / filename.replace('.txt', '.json')
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(news_data, file, indent=2)
        print(f"News data saved to {filename.replace('.txt', '.json')}")
        
        # For SiteGround compatibility, ensure file has right permissions
        try:
            os.chmod(file_path, 0o644)
        except Exception as e:
            print(f"Warning: Could not set permissions for {file_path}: {e}")
            
    except IOError as e:
        print("An error occurred while saving the file:", e)

def scrape_and_save():
    print(f"Running news scrape at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    # Record scrape time for the feed
    metadata = {}
    if METADATA_FILE.exists():
        try:
            with open(METADATA_FILE, 'r') as f:
                metadata = json.load(f)
        except Exception as e:
            print(f"Error reading metadata: {e}")
            metadata = {}
    
    metadata["last_scrape"] = datetime.now().isoformat()
    
    # Track new headlines
    all_headlines = []
    
    for i, url in enumerate(urls):
        print(f"Scraping {url}")
        text = get_text_from_url(url)
        if text:
            output_filename = f"news_{i}.json"
            save_text_to_file(text, output_filename)
            
            # Extract headlines for metadata
            cleaned_text = clean_text(text)
            headlines, _ = extract_titles_and_snippets(cleaned_text)
            all_headlines.extend(headlines[:5])  # Add up to 5 headlines from each source
    
    # Update metadata with new headlines
    metadata["latest_headlines"] = all_headlines[:20]  # Keep up to 20 latest headlines
    
    # Save metadata
    try:
        with open(METADATA_FILE, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        # Set file permissions for SiteGround
        try:
            os.chmod(METADATA_FILE, 0o644)
        except Exception as e:
            print(f"Warning: Could not set permissions for {METADATA_FILE}: {e}")
    
    except Exception as e:
        print(f"Error saving metadata: {e}")
    
    print(f"Completed news scrape with {len(all_headlines)} potential headlines")

# URLs to scrape - using the same list from the original script
urls = [ 
    "https://www.dailyfx.com/economic-calendar",
    "https://www.fxstreet.com/currencies/usdjpy",
    "https://www.fxstreet.com/currencies/gbpusd",
    "https://www.fxstreet.com/currencies/audusd",
    "https://www.fxstreet.com/currencies/usdcad",
    "https://www.fxstreet.com/cryptocurrencies/bitcoin",
    "https://markets.businessinsider.com/currencies",
    "https://www.fxstreet.com/currencies/eurgbp",
    "https://www.fxstreet.com/markets/commodities/metals/gold",        
    "https://www.dailyfx.com/real-time-news",
    "https://www.dailyfx.com/economic-calendar",
    "https://www.dailyfx.com/sentiment",
    "https://www.dailyfx.com/forex-rates#currencies",
    "https://www.dailyfx.com/nas-100",
    "https://www.dailyfx.com/nas-100/news-and-analysis",
    "https://www.dailyfx.com/analyst-picks",
    "https://www.dailyfx.com/gold-price",
    "https://www.dailyfx.com/market-news",
    "https://www.dailyfx.com/real-time-news",
    "https://www.dailyfx.com/forex-rates#currencies"
]

# Function to handle exceptions and prevent the script from crashing
def run_scraper_with_error_handling():
    try:
        scrape_and_save()
    except Exception as e:
        print(f"Error in scraper: {e}")
        # Log the error to a file
        try:
            with open(NEWS_DATA_DIR / "error_log.txt", "a") as f:
                f.write(f"{datetime.now().isoformat()}: {str(e)}\n")
        except:
            pass

if __name__ == "__main__":
    print(f"News scraper starting. Data will be saved to {NEWS_DATA_DIR}")
    # Run the scraping initially
    run_scraper_with_error_handling()

    # Schedule the job to run every 15 minutes
    schedule.every(15).minutes.do(run_scraper_with_error_handling)

    # Keep the script running to execute scheduled tasks
    print("Scraper running. Press Ctrl+C to stop.")
    try:
        while True:
            schedule.run_pending()
            time.sleep(1)
    except KeyboardInterrupt:
        print("Scraper stopped by user.")
    except Exception as e:
        print(f"Unexpected error: {e}")
        # Log the error
        with open(NEWS_DATA_DIR / "error_log.txt", "a") as f:
            f.write(f"{datetime.now().isoformat()}: Unexpected error: {str(e)}\n")