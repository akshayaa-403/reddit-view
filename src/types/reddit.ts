/**
 * Represents a Reddit post's data structure
 */
export interface RedditPostData {
  id: string;
  title: string;
  selftext: string;
  selftext_html: string | null;
  author: string;
  created_utc: number;
  url: string;
  permalink: string;
  score: number;
  ups: number;
  downs: number;
  upvote_ratio: number;
  num_comments: number;
  subreddit: string;
  subreddit_subscribers: number;
  is_video: boolean;
  thumbnail: string;
  thumbnail_width: number | null;
  thumbnail_height: number | null;
  media: any | null;
  secure_media: any | null;
  link_flair_text: string | null;
  author_flair_text: string | null;
  edited: boolean | number;
  stickied: boolean;
  locked: boolean;
  crosspost_parent: string | null;
}

/**
 * Component props for PostDisplay
 */
export interface PostDisplayProps {
  post: RedditPostData;
  showFullContent?: boolean;
}

/**
 * Component props for SearchForm
 */
export interface SearchFormProps {
  onFetch: (url: string) => Promise<void>;
  isLoading: boolean;
}

/**
 * Application state
 */
export interface AppState {
  post: RedditPostData | null;
  loading: boolean;
  error: string | null;
  searchHistory: string[];
}

export interface RedditPostResponse {
  data: {
    children: RedditPostChild[];
  };
}

export interface RedditPostChild {
  kind: string;
  data: RedditPostData;
}