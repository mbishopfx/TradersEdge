'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface PremiumUpgradePromptProps {
  onClose?: () => void;
  uploadCount?: number;
}

const DEFAULT_FREE_TRIAL_LIMIT = 10;

export default function PremiumUpgradePrompt({
  onClose,
  uploadCount = 0
}: PremiumUpgradePromptProps) {
  const remainingUploads = Math.max(0, DEFAULT_FREE_TRIAL_LIMIT - uploadCount);
  const hasReachedLimit = remainingUploads === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel rounded-lg p-6 max-w-md mx-auto"
    >
      <div className="flex items-center justify-center">
        <SparklesIcon className="h-8 w-8 text-blue-400 mr-2" />
        <h2 className="text-xl font-bold text-white">
          {hasReachedLimit
            ? 'Free Trial Limit Reached'
            : `${remainingUploads} Free Analyses Remaining`}
        </h2>
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-300">
          {hasReachedLimit
            ? 'You have used all your free trial analyses. Upgrade to ChartEye Premium for unlimited access.'
            : `You have ${remainingUploads} free chart analyses remaining. Upgrade now to get unlimited access.`}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <h3 className="text-sm font-medium text-gray-400">Premium Benefits:</h3>
        <ul className="space-y-2">
          {[
            'Unlimited AI chart analyses',
            'Advanced pattern recognition',
            'Portfolio analysis with detailed insights',
            'Economic news impact assessments',
            'All future premium features included'
          ].map((benefit, index) => (
            <li key={index} className="flex items-start text-sm">
              <CheckCircleIcon className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <Link href="/upgrade" className="btn-primary flex-1 text-center">
          Upgrade Now
        </Link>
        {!hasReachedLimit && onClose && (
          <button onClick={onClose} className="btn-secondary flex-1">
            Continue Free Trial
          </button>
        )}
      </div>

      <div className="mt-4 text-center text-xs text-gray-400">
        One-time payment of $20 for lifetime access. No subscription.
      </div>
    </motion.div>
  );
} 