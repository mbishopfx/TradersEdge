// This is a server component
import React from 'react';

export default function ViewLayout({ children }: { children: React.ReactNode }) {
  return children;
}

// This function is required for static site generation with dynamic routes
export async function generateStaticParams() {
  // Since we don't know all possible IDs at build time,
  // we'll return an empty array and handle missing routes at runtime
  // or we could fetch some popular/featured analyses to pre-generate
  return [
    { id: 'placeholder' }
  ];
} 