// Chart Analysis
export interface ChartAnalysis {
  id?: string;
  userId: string;
  imageUrl: string;
  analysis: string;
  grading: {
    patternClarity: number;
    trendAlignment: number;
    riskReward: number;
    volumeConfirmation: number;
    keyLevelProximity: number;
    overallGrade: number;
  };
  createdAt: string;
  updatedAt?: string;
}

// User Profile
export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  accountStatus: 'Free' | 'Premium';
  uploadCount: number;
  createdAt: string;
  updatedAt: string;
}

// Indicator Code
export interface IndicatorCode {
  id?: string;
  userId: string;
  name: string;
  description: string;
  code: string;
  language: string;
  platform: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Shared Analysis
export interface SharedAnalysis {
  id?: string;
  userId: string;
  analysisId: string;
  platform: string;
  shareUrl: string;
  createdAt: string;
} 