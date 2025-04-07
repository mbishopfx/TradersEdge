'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lightbulb, TrendingUp, BarChart3, PieChart, RefreshCw, AlertCircle } from 'lucide-react';

interface NewsHeadline {
  id: string;
  text: string;
  source: string;
  timestamp: string;
}

interface NewsAnalysis {
  id: string;
  category: 'market-impact' | 'sector-analysis' | 'trend-prediction' | 'summary';
  title: string;
  content: string;
  timestamp: string;
}

// For animation effects
interface AnimationState {
  headlineIndex: number;
  isTransitioning: boolean;
}

export default function LiveNewsPage() {
  // State management
  const [headlines, setHeadlines] = useState<NewsHeadline[]>([]);
  const [analyses, setAnalyses] = useState<NewsAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [animation, setAnimation] = useState<AnimationState>({
    headlineIndex: 0,
    isTransitioning: false
  });
  const [activeTab, setActiveTab] = useState('summary');

  // Function to fetch news data
  const fetchNewsData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    setError(null);
    
    try {
      // Add cache-busting query parameter for fresh results
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/live-news?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if we got valid data
      if (!data.headlines || !Array.isArray(data.headlines)) {
        console.warn('Invalid headlines data format:', data.headlines);
        // Don't update state if data is invalid on refresh to keep existing data
        if (!isRefresh) {
          setHeadlines([]);
        }
      } else {
        setHeadlines(data.headlines);
      }
      
      if (!data.analyses || !Array.isArray(data.analyses)) {
        console.warn('Invalid analyses data format:', data.analyses);
        if (!isRefresh) {
          setAnalyses([]);
        }
      } else {
        setAnalyses(data.analyses);
      }
      
      if (data.lastUpdated) {
        setLastUpdated(data.lastUpdated);
      }
      
      // Reset animation to start
      if (!isRefresh) {
        setAnimation({
          headlineIndex: 0,
          isTransitioning: false
        });
      }
      
      // If there was an error message from the API
      if (data.error) {
        console.warn('API reported error:', data.error);
        setError(data.error.message || 'An error occurred while fetching news data');
      }
      
      // Reset retry count on successful fetch
      setRetryCount(0);
    } catch (err) {
      console.error('Error fetching news data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch news data');
      
      // Increment retry count
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchNewsData();
    
    // Auto refresh every 5 minutes
    const refreshInterval = setInterval(() => {
      fetchNewsData(true);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [fetchNewsData]);

  // Auto-retry if initial load fails (with exponential backoff)
  useEffect(() => {
    if (error && headlines.length === 0 && retryCount < 3) {
      const backoffDelay = Math.min(2000 * Math.pow(2, retryCount), 30000);
      console.log(`Retrying in ${backoffDelay/1000} seconds (attempt ${retryCount + 1})`);
      
      const retryTimer = setTimeout(() => {
        fetchNewsData();
      }, backoffDelay);
      
      return () => clearTimeout(retryTimer);
    }
  }, [error, headlines.length, retryCount, fetchNewsData]);

  // Animate headlines
  useEffect(() => {
    if (headlines.length === 0 || isLoading) return;
    
    const cycleHeadlines = setInterval(() => {
      setAnimation(prev => ({
        ...prev,
        isTransitioning: true
      }));
      
      setTimeout(() => {
        setAnimation(prev => ({
          headlineIndex: (prev.headlineIndex + 1) % headlines.length,
          isTransitioning: false
        }));
      }, 500); // Transition duration
    }, 5000); // Time each headline is shown
    
    return () => clearInterval(cycleHeadlines);
  }, [headlines, isLoading]);

  // Format time to relative format (e.g., "2 minutes ago")
  const formatRelativeTime = (timestamp: string) => {
    if (!timestamp) return 'Unknown time';
    
    try {
      const now = new Date();
      const time = new Date(timestamp);
      const diffMs = now.getTime() - time.getTime();
      const diffSec = Math.round(diffMs / 1000);
      const diffMin = Math.round(diffSec / 60);
      const diffHr = Math.round(diffMin / 60);
      
      if (diffSec < 60) return 'Just now';
      if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
      if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
      
      return time.toLocaleDateString();
    } catch (err) {
      console.error('Error formatting time:', err);
      return 'Unknown time';
    }
  };

  // Get analysis by category
  const getAnalysisByCategory = (category: string) => {
    return analyses.find(a => a.category === category) || null;
  };

  // Handle refresh button click
  const handleRefresh = () => {
    fetchNewsData(true);
  };

  // Determine if we have data to show
  const hasData = headlines.length > 0 || analyses.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Live Financial News</h1>
          <p className="text-sm text-gray-400">
            Real-time financial news and AI-powered market analysis
          </p>
        </div>
        <button 
          onClick={handleRefresh} 
          disabled={isRefreshing || isLoading}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${isRefreshing || isLoading ? 'bg-gray-600 text-gray-300' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-100 px-4 py-3 rounded-md mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
          <div>
            {error}
            {headlines.length > 0 && ' - Showing previously loaded data'}
          </div>
        </div>
      )}
      
      {lastUpdated && hasData && (
        <p className="text-sm text-gray-400 mb-6">
          Last updated: {formatRelativeTime(lastUpdated)}
        </p>
      )}
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* News Headline Feed */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-md border border-gray-700 h-full">
            <div className="px-4 py-3 border-b border-gray-700">
              <div className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-blue-400" />
                <h2 className="text-lg font-medium">Latest Headlines</h2>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Market-moving news as it happens
              </p>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {isLoading && headlines.length === 0 ? (
                  // Loading skeletons
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse"></div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="h-3 w-20 bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-3 w-16 bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))
                ) : headlines.length > 0 ? (
                  <div className="relative min-h-[300px]">
                    <div 
                      className={`transition-opacity duration-500 ${animation.isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                    >
                      <div className="border-l-4 border-blue-500 pl-4 py-2 mb-6">
                        <h3 className="text-xl font-semibold">
                          {headlines[animation.headlineIndex]?.text || 'Loading headline...'}
                        </h3>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-400">
                            {headlines[animation.headlineIndex]?.source || 'Financial News'}
                          </span>
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                            {headlines[animation.headlineIndex]?.timestamp 
                              ? formatRelativeTime(headlines[animation.headlineIndex].timestamp)
                              : 'Recent'
                            }
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-4 mt-8">
                        <h4 className="text-sm font-medium text-gray-400">Other Recent Headlines</h4>
                        {headlines
                          .filter((_, i) => i !== animation.headlineIndex)
                          .slice(0, 5)
                          .map(headline => (
                            <div key={headline.id} className="border-l-2 border-gray-600 pl-4 py-1">
                              <p className="text-sm">{headline.text}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No headlines available</p>
                    <button 
                      onClick={handleRefresh} 
                      className="mt-4 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md"
                      disabled={isRefreshing}
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* AI Analysis */}
        <div>
          <div className="bg-gray-800 rounded-md border border-gray-700 h-full">
            <div className="px-4 py-3 border-b border-gray-700">
              <div className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" /> 
                <h2 className="text-lg font-medium">AI Market Analysis</h2>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Insights generated from latest news
              </p>
            </div>
            <div className="p-4">
              {isLoading && analyses.length === 0 ? (
                <div className="space-y-6">
                  <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-16 w-full bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-16 w-full bg-gray-700 rounded animate-pulse"></div>
                </div>
              ) : analyses.length > 0 ? (
                <div>
                  <div className="flex border-b border-gray-700">
                    <button 
                      className={`px-3 py-2 text-sm font-medium ${activeTab === 'summary' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                      onClick={() => setActiveTab('summary')}
                    >
                      Summary
                    </button>
                    <button 
                      className={`px-3 py-2 text-sm font-medium ${activeTab === 'market-impact' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                      onClick={() => setActiveTab('market-impact')}
                    >
                      Impact
                    </button>
                    <button 
                      className={`px-3 py-2 text-sm font-medium ${activeTab === 'sector-analysis' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                      onClick={() => setActiveTab('sector-analysis')}
                    >
                      Sectors
                    </button>
                    <button 
                      className={`px-3 py-2 text-sm font-medium ${activeTab === 'trend-prediction' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                      onClick={() => setActiveTab('trend-prediction')}
                    >
                      Trends
                    </button>
                  </div>
                  
                  <div className="py-4">
                    {activeTab === 'summary' && getAnalysisByCategory('summary') ? (
                      <div>
                        <h3 className="font-semibold flex items-center mb-2">
                          <BarChart3 className="mr-2 h-4 w-4 text-yellow-400" />
                          {getAnalysisByCategory('summary')?.title}
                        </h3>
                        <p>{getAnalysisByCategory('summary')?.content}</p>
                      </div>
                    ) : activeTab === 'summary' ? (
                      <p className="text-gray-400">No summary available</p>
                    ) : null}
                    
                    {activeTab === 'market-impact' && getAnalysisByCategory('market-impact') ? (
                      <div>
                        <h3 className="font-semibold flex items-center mb-2">
                          <TrendingUp className="mr-2 h-4 w-4 text-blue-400" />
                          {getAnalysisByCategory('market-impact')?.title}
                        </h3>
                        <p>{getAnalysisByCategory('market-impact')?.content}</p>
                      </div>
                    ) : activeTab === 'market-impact' ? (
                      <p className="text-gray-400">No market impact analysis available</p>
                    ) : null}
                    
                    {activeTab === 'sector-analysis' && getAnalysisByCategory('sector-analysis') ? (
                      <div>
                        <h3 className="font-semibold flex items-center mb-2">
                          <PieChart className="mr-2 h-4 w-4 text-purple-400" />
                          {getAnalysisByCategory('sector-analysis')?.title}
                        </h3>
                        <p>{getAnalysisByCategory('sector-analysis')?.content}</p>
                      </div>
                    ) : activeTab === 'sector-analysis' ? (
                      <p className="text-gray-400">No sector analysis available</p>
                    ) : null}
                    
                    {activeTab === 'trend-prediction' && getAnalysisByCategory('trend-prediction') ? (
                      <div>
                        <h3 className="font-semibold flex items-center mb-2">
                          <BarChart3 className="mr-2 h-4 w-4 text-green-400" />
                          {getAnalysisByCategory('trend-prediction')?.title}
                        </h3>
                        <p>{getAnalysisByCategory('trend-prediction')?.content}</p>
                      </div>
                    ) : activeTab === 'trend-prediction' ? (
                      <p className="text-gray-400">No trend prediction available</p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No analysis available</p>
                  <button 
                    onClick={handleRefresh} 
                    className="mt-4 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md"
                    disabled={isRefreshing}
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
            <div className="px-4 py-2 border-t border-gray-700 text-xs text-gray-500">
              {analyses.length > 0 && getAnalysisByCategory('summary')?.timestamp && (
                <p>Analysis time: {formatRelativeTime(getAnalysisByCategory('summary')?.timestamp || '')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 