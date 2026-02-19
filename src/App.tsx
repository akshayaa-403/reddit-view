import { useRedditPost } from './hooks/useRedditPost';
import SearchForm from './components/UI/SearchForm';
import PostDisplay from './components/Post/PostDisplay';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorMessage from './components/UI/ErrorMessage';
import SearchHistory from './components/UI/SearchHistory';
import './App.css';

function App() {
  const { 
    post, 
    loading, 
    error, 
    searchHistory,
    fetchPost, 
    clearPost, 
    clearHistory 
  } = useRedditPost();

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <span className="reddit-logo">📱</span>
          Reddit Post Viewer
        </h1>
        <p className="app-subtitle">
          Enter any Reddit post URL to view its details
        </p>
      </header>

      <main className="app-main">
        <SearchForm onFetch={fetchPost} isLoading={loading} />
        
        {loading && <LoadingSpinner />}
        
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={() => post && fetchPost(searchHistory[0])}
          />
        )}
        
        {post && !loading && !error && (
          <div className="post-section">
            <button onClick={clearPost} className="new-search-button">
              ← New Search
            </button>
            <PostDisplay post={post} />
          </div>
        )}
        
        {!post && !loading && searchHistory.length > 0 && (
          <SearchHistory 
            history={searchHistory}
            onSelect={fetchPost}
            onClear={clearHistory}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>
          Built with React, TypeScript, and Vite
        </p>
      </footer>
    </div>
  );
}

export default App;