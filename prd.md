Product Requirements Document: AI Trading Chart Analyst & Tools Suite
Version: 1.0
Date: April 7, 2025
1. Introduction
Product Name: [User to decide final name - Suggestion: InsightAI Trader, Chart Oracle, QuantumChart]
Product Goal: To provide forex, futures, stock, and crypto traders with an advanced, AI-driven web application for analyzing chart images, grading potential trades based on technical variables, assisting with trading indicator code generation, and facilitating social sharing of analyses.
Target Audience: Active retail and professional traders across various asset classes who utilize technical analysis and may require assistance coding custom indicators or seek AI-powered insights.
Problem Solved: This tool aims to reduce the time, effort, and potential subjective bias involved in manual chart analysis. It provides objective, data-driven trade setup grading, lowers the barrier to entry for creating custom indicators (MQL, Pine Script), and fosters community interaction through easy sharing of insights.
2. Goals
Primary:
Deliver high-quality, advanced-level technical analysis derived from user-uploaded chart images using AI (OpenAI).
Provide a clear, quantitative grading scale (table or chart format) for evaluated trade setups based on predefined variables.
Offer an AI assistant specifically prompted ("pre-trained" via prompt engineering) to generate code for trading indicators in specified languages (MQL4/5, Pine Script initially).
Enable seamless, one-click sharing of analysis results on major social media platforms.
Implement secure and user-friendly authentication using Google Auth.
Integrate Square for payment processing, offering a free trial followed by a one-time purchase for lifetime access.
Secondary:
Create an intuitive, aesthetically pleasing user interface adhering to a futuristic dark theme.
Build a scalable, reliable, and performant platform using modern web technologies (Firebase/Supabase, OpenAI).
Ensure robust security practices for user data, authentication, and payments.
3. User Personas
Alex (Experienced Day Trader): Trades Forex & Futures. Uses complex multi-indicator charts. Wants quick AI validation/second opinion on potential trades and occasional help coding indicator modifications for MT4/MT5. Values advanced analysis and objective grading.
Priya (Swing Trader & Learner): Trades Stocks & Crypto part-time. Is comfortable with basic patterns but wants AI analysis to confirm findings, learn advanced concepts, and understand risk better via the grading scale. Uses TradingView (Pine Script). Might share interesting setups with her online trading group.
Sam (Systematic Trader/Dev): Focuses on Crypto & Stock options. Develops and tests strategies. Primarily interested in the AI coding assistant to rapidly prototype indicator ideas in Pine Script and potentially Python for backtesting frameworks.
4. Functional Requirements (Features)
4.1. User Authentication & Account Management
Requirement: Secure user registration and login.
Implementation: Google Authentication (OAuth 2.0).
Frontend: Google Sign-In button/flow.
Backend: Handle Google callback, verify token, create/retrieve user record, manage session/token.
Database: Firebase Authentication or Supabase Auth for managing user identities. User profile data (ID, email, name, account status, usage count) stored in Firebase Firestore or Supabase Database.
User Profile: Minimal page displaying user email, account status (e.g., "Free Trial", "Lifetime Access"), and remaining free analysis uploads (if applicable).
4.2. AI Chart Analysis & Grading
Requirement: Allow users to upload chart images, receive detailed AI analysis, and view a structured trade grading.
Workflow:
User Interface: Prominent "Upload Chart" button or drag-and-drop area.
Input: Accept standard image formats (JPG, PNG, GIF). Client-side validation for file type/size (e.g., max 5-10MB).
Upload: Securely upload image to cloud storage (Firebase Storage / Supabase Storage).
AI Processing (Backend):
Send the image (or secure URL) to OpenAI Vision API (e.g., GPT-4 Vision).
Prompt Engineering: Instruct the AI to perform advanced technical analysis: identify asset/timeframe (if possible), key S/R levels, chart patterns (classical, harmonic), candlestick patterns, relevant indicator readings (if visible, e.g., RSI, MACD, MAs, Volume), potential trade setups (entry, SL, TP), and overall trend/context.
AI Response Handling (Backend):
Parse the textual analysis from the AI response.
Extract/derive values for the grading table based on the analysis (e.g., pattern strength, trend alignment).
Data Storage: Store analysis text, grading data, image reference, and timestamp linked to the user ID in the database (Firestore/Supabase).
Frontend Display:
Render the detailed textual analysis clearly.
Display the grading scale as a table or a simple chart (e.g., radar chart, bar chart).
Output 1: Detailed Textual Analysis: Narrative format, using appropriate technical trading terminology.
Output 2: Trade Grading Table/Chart:
Variables: (Examples - Final list TBD)
Pattern Clarity/Strength: (Score/Grade)
Trend Alignment: (Score/Grade)
Risk/Reward Potential: (Score/Grade, if calculable)
Volume Confirmation: (Score/Grade, if visible)
Key Level Proximity: (Score/Grade)
Overall Grade: (Consolidated Score/Grade)
Presentation: Clean table or visual chart.
Usage Tracking: Increment the user's upload_count in the database upon successful analysis completion.
4.3. AI Indicator Coding Assistant
Requirement: Provide an interface for users to generate trading indicator code via AI.
Interface: Dedicated "Code Assistant" or "Indicator AI" tab/section.
Workflow:
Input Fields:
Dropdown menu for target language (MQL4, MQL5, Pine Script).
Text area for user's natural language description of the indicator logic.
Action: "Generate Code" button.
Backend Processing:
Send the language selection and user description to OpenAI API (e.g., GPT-4).
Prompt Engineering (Crucial): Use a specific system message/pretext for the AI: "You are an expert programmer specializing ONLY in MQL4, MQL5, and Pine Script for trading platforms. Given a user request and a target language, generate clean, accurate, and well-commented code for the trading indicator in the specified language. Include comments explaining the code's logic. Do not add explanatory text outside the code comments. If the request is unclear, state that, but attempt to provide the best possible code interpretation."
Frontend Display: Render the generated code in a formatted code block with syntax highlighting and a "Copy Code" button.
Usage: This feature is separate from the chart analysis upload limit. (Consider future rate limiting if needed).
4.4. Social Sharing
Requirement: Allow users to share their analysis results with one click.
Implementation:
Button: Add a "Share" button near the analysis results.
Functionality:
Generate a unique, shareable link to a non-editable, public view of the specific analysis (including text, grade, potentially the chart image - consider privacy).
Provide direct sharing buttons/links for major platforms (e.g., Twitter/X, Facebook, LinkedIn, StockTwits, TradingView Ideas - check platform APIs/sharing URL formats).
Backend: Logic to create/manage public share links and associated data views. Ensure no private user info is exposed.
4.5. Monetization & Payment Integration
Requirement: Free trial with limited uploads, followed by a one-time payment for lifetime access via Square.
Model:
Free Trial: First 10 chart analysis uploads are free for registered users.
Lifetime Access: $20 USD one-time payment for unlimited chart analysis uploads.
Implementation:
Access Control (Backend/Frontend): Before processing an upload request, check user's upload_count and account_status (e.g., 'Free', 'Paid').
Trial Enforcement: If upload_count >= 10 and account_status == 'Free', deny upload and trigger payment prompt.
Payment Prompt (Frontend): Display a modal/section explaining the limit is reached, offering lifetime access for $20, with a "Upgrade Now" / "Pay with Square" button.
Square Integration (Backend):
Use Square Checkout API or Payments API.
On payment initiation, create a Square checkout link/session with the correct amount ($20 USD), currency, and metadata (e.g., user ID).
Redirect user to Square's secure payment page.
Implement backend webhook endpoints to listen for payment.updated or similar events from Square, or handle success/cancel redirects.
Crucially: Verify successful payment notification from Square (using webhook signatures or secure checks).
Upon verified successful payment, update the user's account_status to 'Paid' (or 'Lifetime') in the database.
Granting Access: Users with account_status == 'Paid' have no upload restrictions.
5. Non-Functional Requirements
User Interface (UI):
Theme: Dark mode is mandatory.
Aesthetics: Futuristic, sleek, professional. Use clean typography, potentially subtle neon accents or data visualization-inspired elements. High contrast for readability.
Layout: Intuitive navigation (e.g., sidebar or top navbar). Clear visual hierarchy. Responsive design (desktop-first, but fully usable on tablet/mobile).
User Experience (UX):
Fast page loads and UI responsiveness.
Minimize perceived wait time for AI analysis (use loading indicators, aim for < 30-45 seconds average).
Simple, clear workflows for uploading, coding, and paying.
Performance:
Efficient backend processing for concurrent AI requests.
Optimized database queries.
Efficient image handling and storage.
Scalability:
Utilize scalable cloud infrastructure (Firebase/Supabase services, potentially serverless functions).
Design database schema for growth.
Security:
Secure API key management (OpenAI, Google, Square) via environment variables or secrets manager.
Enforce HTTPS.
Implement standard web security practices (input validation, output encoding, CSRF protection if applicable).
Rely on Google Auth and Square for core auth/payment security.
Data privacy compliance (consider GDPR/CCPA basics).
Reliability:
High application uptime.
Graceful handling of external API errors/downtime (OpenAI, Square, Google) with clear user feedback.
Robust error logging and monitoring.
6. Technical Stack (Recommendations)
Frontend: React (with Next.js) or Vue (with Nuxt.js) - Excellent for interactive UIs and ecosystem support. Tailwind CSS for styling.
Backend: Node.js (Express/NestJS) or Python (FastAPI/Flask) - Choose based on team familiarity. Serverless functions (Firebase Functions / Supabase Edge Functions) are highly recommended for scalability and cost-efficiency.
Database: Firebase Firestore (NoSQL) or Supabase (PostgreSQL) - Both offer integrated auth, storage, and real-time capabilities. Choice depends on data modeling preference.
AI Engine: OpenAI API (Latest GPT-4 Vision model for analysis, latest GPT-4 for coding).
Authentication: Firebase Authentication or Supabase Auth (integrating Google provider).
Image Storage: Firebase Cloud Storage or Supabase Storage.
Payment Processing: Square API (Checkout API likely simplest).
Deployment: Vercel (excellent for Next.js/React), Netlify, Google Cloud Run, AWS Amplify.
7. Future Considerations (Post-MVP)
Support more indicator languages (e.g., Python for freqtrade or backtrader).
Allow saving/managing past analyses in a user dashboard.
Introduce basic backtesting capabilities based on AI signals.
Develop internal community features (sharing within the platform, commenting).
Integrate real-time market data feeds (significant complexity increase).
Offer different subscription tiers with varying features or limits.
Fine-tune AI models with proprietary data or techniques (advanced).
8. Open Questions
Final decision on the Product Name?
Specific list of social media platforms for direct sharing integration?
Finalized list of variables and scoring methodology for the Trade Grading Scale?
Detailed error handling strategy for API failures (e.g., retry logic, user messages)?
Definitive choice between Firebase and Supabase?
Preferred Frontend/Backend frameworks (if any strong preference exists)?
9. Disclaimer Requirement
A clear, prominent, and unavoidable disclaimer MUST be displayed within the application (e.g., footer, analysis page). It must state that:
AI-generated analysis is for informational and educational purposes only.
It does NOT constitute financial or investment advice.
Trading involves substantial risk of loss.
Users are solely responsible for their own trading decisions.
Past performance is not indicative of future results.
