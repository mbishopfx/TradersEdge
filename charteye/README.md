# ChartEye - AI Trading Chart Analyst

ChartEye is an advanced AI-driven web application for analyzing trading charts, generating technical indicators, and sharing insights with the trading community.

## Features

- AI-powered chart analysis with objective grading
- Custom indicator code generation (MQL4, MQL5, Pine Script)
- Social sharing capabilities
- Google Authentication
- Modern, futuristic dark theme UI

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Firebase (Authentication, Firestore, Storage)
- OpenAI API
- Square Payment Integration
- Framer Motion for animations

## Prerequisites

- Node.js 18+ and npm
- Firebase project
- OpenAI API key
- Square account (for payments)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/charteye.git
cd charteye
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Square Configuration
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_LOCATION_ID=your_square_location_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable React components
├── contexts/           # React contexts (auth, etc.)
├── lib/                # Utility functions and configurations
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This application is for informational and educational purposes only. It does not constitute financial or investment advice. Trading involves substantial risk of loss. Users are solely responsible for their own trading decisions. Past performance is not indicative of future results.
