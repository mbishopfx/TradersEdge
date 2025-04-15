import React from 'react';

// This ensures the route layout is treated as a server component
export default function AnalysisPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

// Generate static params for the [id] route
export async function generateStaticParams() {
  // Provide at least one placeholder parameter for static generation
  return [{ id: 'placeholder' }];
} 