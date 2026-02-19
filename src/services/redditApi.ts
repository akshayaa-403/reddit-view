import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type { 
  RedditPostResponse, 
  RedditPostData
} from '../types/reddit.js';

/**
 * Type for Reddit API error responses
 */
type RedditErrorResponse = unknown;

/**
 * Custom error class for Reddit API errors
 */
export class RedditApiError extends Error {
  statusCode?: number;
  redditError?: unknown;

  constructor(
    message: string,
    statusCode?: number,
    redditError?: unknown
  ) {
    super(message);
    this.name = 'RedditApiError';
    this.statusCode = statusCode;
    this.redditError = redditError;
  }
}

/**
 * Service class for interacting with Reddit API
 */
export class RedditApiService {
  private axiosInstance: AxiosInstance;
  
  constructor() {
    // Create axios instance with default configuration
    this.axiosInstance = axios.create({
      timeout: 10000, // 10 seconds timeout
      headers: {
        'User-Agent': 'RedditViewer/1.0 (https://your-app.com)', // Required by Reddit API
        'Accept': 'application/json'
      }
    });
    
    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      response => response,
      this.handleApiError
    );
  }
  
  /**
   * Handles API errors uniformly
   */
  private handleApiError(error: AxiosError): Promise<never> {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const statusCode = error.response.status;
      const data = error.response.data as RedditErrorResponse;
      
      if (statusCode === 404) {
        throw new RedditApiError(
          'Post not found. Please check the URL.',
          statusCode,
          data
        );
      } else if (statusCode === 403) {
        throw new RedditApiError(
          'Access forbidden. The post might be private or removed.',
          statusCode,
          data
        );
      } else if (statusCode === 429) {
        throw new RedditApiError(
          'Too many requests. Please wait a moment and try again.',
          statusCode,
          data
        );
      } else {
        throw new RedditApiError(
          `Reddit API error: ${error.message}`,
          statusCode,
          data
        );
      }
    } else if (error.request) {
      // The request was made but no response was received
      throw new RedditApiError(
        'No response from Reddit. Please check your internet connection.'
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new RedditApiError(`Request error: ${error.message}`);
    }
  }
  
  /**
   * Extracts the JSON URL from a Reddit post URL
   */
  private getJsonUrl(redditUrl: string): string {
    // Remove trailing slash if present
    const cleanUrl = redditUrl.replace(/\/$/, '');
    
    // Add .json extension
    return `${cleanUrl}.json`;
  }
  
  /**
   * Validates if a string looks like a Reddit URL
   */
  private isValidRedditUrl(url: string): boolean {
    const redditUrlPattern = /^https?:\/\/(www\.)?(old\.|new\.)?reddit\.com\/r\/[^/]+\/comments\/[^/]+\//;
    return redditUrlPattern.test(url);
  }
  
  /**
   * Fetches a Reddit post by URL
   */
  async fetchPost(url: string): Promise<RedditPostData> {
    // Validate URL
    if (!this.isValidRedditUrl(url)) {
      throw new RedditApiError(
        'Invalid Reddit URL. Please enter a valid Reddit post URL.'
      );
    }
    
    try {
      const jsonUrl = this.getJsonUrl(url);
      console.log(`Fetching: ${jsonUrl}`); // Useful for debugging
      
      const response = await this.axiosInstance.get<RedditPostResponse[]>(jsonUrl);
      
      // Extract post data from response
      // Index 0 contains the post listing
      const postListing = response.data[0];
      
      if (!postListing.data.children || postListing.data.children.length === 0) {
        throw new RedditApiError('No post data found in response');
      }
      
      // Get the first child (the post itself)
      const postChild = postListing.data.children[0];
      
      if (postChild.kind !== 't3') {
        throw new RedditApiError('Unexpected response format from Reddit');
      }
      
      return postChild.data;
      
    } catch (error) {
      if (error instanceof RedditApiError) {
        throw error;
      }
      // Wrap unknown errors
      throw new RedditApiError(`Failed to fetch post: ${(error as Error).message}`);
    }
  }
  
  /**
   * Fetches multiple Reddit posts (if needed for future features)
   */
  async fetchMultiplePosts(urls: string[]): Promise<RedditPostData[]> {
    const promises = urls.map(url => this.fetchPost(url));
    return Promise.all(promises);
  }
}