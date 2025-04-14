'use client';

import React, { Suspense } from 'react';
import type { ReactElement } from 'react';
import UpgradeContent from './UpgradeContent';

export default function UpgradePage(): ReactElement {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-500">Loading upgrade page...</p>
        </div>
      </div>
    }>
      <UpgradeContent />
    </Suspense>
  );
} 