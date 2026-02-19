import React from 'react';
import './SearchHistory.css';

interface SearchHistoryProps {
  history: string[];
  onSelect: (url: string) => void;
  onClear: () => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ 
  history, 
  onSelect, 
  onClear 
}) => {
  if (history.length === 0) return null;

  return (
    <div className="history-container">
      <div className="history-header">
        <h4 className="history-title">Recent Searches</h4>
        <button onClick={onClear} className="clear-history">
          Clear All
        </button>
      </div>
      
      <ul className="history-list">
        {history.map((url, index) => (
          <li key={`${url}-${index}`} className="history-item">
            <button 
              onClick={() => onSelect(url)}
              className="history-link"
            >
              <span className="history-icon">🔄</span>
              <span className="history-url">{url}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory;