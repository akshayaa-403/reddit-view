import { useState, useCallback } from 'react';
import { RedditApiService, RedditApiError } from '../services/redditApi.ts';
import type { RedditPostData } from '../types/reddit';

/**
 * Custom hook for managing Reddit post fetching
 */
export function useRedditPost() {
  const [post, setPost] = useState<RedditPostData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const apiService = new RedditApiService();

  const fetchPost = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const fetchedPost = await apiService.fetchPost(url);
      setPost(fetchedPost);
      
      // Add to search history (avoid duplicates)
      setSearchHistory(prev => {
        const newHistory = [url, ...prev.filter(u => u !== url)];
        return newHistory.slice(0, 10); // Keep only last 10 searches
      });

    } catch (err) {
      if (err instanceof RedditApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearPost = useCallback(() => {
    setPost(null);
    setError(null);
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  return {
    post,
    loading,
    error,
    searchHistory,
    fetchPost,
    clearPost,
    clearHistory
  };
}