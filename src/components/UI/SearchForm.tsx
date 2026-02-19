import React, { useState, type FormEvent } from 'react';
import type { SearchFormProps } from '../../types/reddit';
import './SearchForm.css';

/**
 * SearchForm component for entering Reddit URLs
 */
const SearchForm: React.FC<SearchFormProps> = ({ onFetch, isLoading }) => {
  const [url, setUrl] = useState<string>('');
  const [touched, setTouched] = useState<boolean>(false);

  // URL validation
  const isValidUrl = (input: string): boolean => {
    const pattern = /^https?:\/\/(www\.)?(old\.|new\.)?reddit\.com\/r\/[^/]+\/comments\/[^/]+\//;
    return pattern.test(input);
  };

  const isValid = isValidUrl(url);
  const showError = touched && !isValid && url.length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid || isLoading) return;
    
    await onFetch(url);
    setUrl(''); // Clear input after successful fetch
    setTouched(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const handlePasteExample = () => {
    setUrl('https://www.reddit.com/r/typescript/comments/1bshvi6/typescript_5_announcement/');
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-group">
          <input
            type="url"
            value={url}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter Reddit post URL"
            className={`search-input ${showError ? 'invalid' : ''}`}
            disabled={isLoading}
            aria-label="Reddit post URL"
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Fetching...
              </>
            ) : (
              'Fetch Post'
            )}
          </button>
        </div>
        
        {showError && (
          <p className="error-message">
            Please enter a valid Reddit post URL
          </p>
        )}
        
        <button 
          type="button" 
          onClick={handlePasteExample}
          className="example-button"
          disabled={isLoading}
        >
          📋 Use Example URL
        </button>
      </form>
    </div>
  );
};

export default SearchForm;