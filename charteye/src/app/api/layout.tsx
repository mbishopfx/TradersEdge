import React from 'react';

// This is a server component for the /api route
export default function ApiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

// This is a fallback for all API routes to ensure static export works
export async function generateStaticParams() {
  // For static generation, provide essential fallbacks
  return [{}]; // Empty params for root-level layout
} 