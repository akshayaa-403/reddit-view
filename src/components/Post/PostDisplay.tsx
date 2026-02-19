import React, { useState } from 'react';
import type { PostDisplayProps } from '../../types/reddit';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';
import './PostDisplay.css';

/**
 * PostDisplay component for showing Reddit post details
 */
const PostDisplay: React.FC<PostDisplayProps> = ({ post, showFullContent = false }) => {
  const [expanded, setExpanded] = useState(showFullContent);
  
  const createdDate = fromUnixTime(post.created_utc);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });
  
  const upvotePercentage = Math.round(post.upvote_ratio * 100);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Check if post has text content
  const hasContent = post.selftext && post.selftext.trim().length > 0;
  
  // Determine content to display
  const displayContent = expanded 
    ? post.selftext 
    : post.selftext.substring(0, 300) + (post.selftext.length > 300 ? '...' : '');

  return (
    <article className="post-container">
      {/* Header */}
      <header className="post-header">
        <h1 className="post-title">{post.title}</h1>
        
        <div className="post-meta">
          <span className="post-subreddit">
            r/{post.subreddit}
          </span>
          
          <span className="post-author">
            Posted by u/{post.author} {timeAgo}
          </span>
          
          {post.link_flair_text && (
            <span className="post-flair">
              {post.link_flair_text}
            </span>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="post-content">
        {hasContent ? (
          <div className="post-text">
            <p className={expanded ? '' : 'post-text-preview'}>
              {displayContent}
            </p>
            {post.selftext.length > 300 && (
              <button 
                onClick={toggleExpanded}
                className="expand-button"
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        ) : (
          <div className="post-link">
            <p>This is a link post:</p>
            <a 
              href={post.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="external-link"
            >
              {post.url}
            </a>
          </div>
        )}
        
        {/* Thumbnail if exists */}
        {post.thumbnail && post.thumbnail.startsWith('http') && (
          <div className="post-thumbnail">
            <img 
              src={post.thumbnail} 
              alt="Post thumbnail" 
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <footer className="post-footer">
        <div className="post-stats">
          <div className="stat">
            <span className="stat-icon">⬆️</span>
            <span className="stat-value">{post.score.toLocaleString()}</span>
            <span className="stat-label">points</span>
          </div>
          
          <div className="stat">
            <span className="stat-icon">💬</span>
            <span className="stat-value">{post.num_comments.toLocaleString()}</span>
            <span className="stat-label">comments</span>
          </div>
          
          <div className="stat">
            <span className="stat-icon">📊</span>
            <span className="stat-value">{upvotePercentage}%</span>
            <span className="stat-label">upvoted</span>
          </div>
        </div>

        <div className="post-actions">
          <a 
            href={`https://reddit.com${post.permalink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="action-button"
          >
            View on Reddit
          </a>
        </div>
      </footer>
    </article>
  );
};

export default PostDisplay;