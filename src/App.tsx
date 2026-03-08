import React, { useState } from "react";
import "./App.css";

function App() {
  const myText = "Reddit View";
  const [redditPost, setRedditPost] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  
  const handleSubmit = async () => {
    const redditUrl = `${redditPost}.json`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(redditUrl)}`;
    console.log("URL:" + redditUrl);
    
    try {
      const response = await fetch(proxyUrl);
      const data = await response.json();
      console.log("Data:", data);

      if (Array.isArray(data) && data.length >= 2) {
        const postsData = data[0].data.children[0].data;
        console.log("Posts:", postsData);
        setPosts([postsData]);
        const commentsData = data[1].data.children.map((child: any) => child.data);
        console.log("Comments:", commentsData);
        setComments(commentsData);
      } else {
        console.log("Invalid data structure:", data);
      }
    } catch (error) {
      console.log("Error fetching Reddit posts:", error);
    }
  }

  return (
    <div className="App">
      <h1>{myText}</h1>
      <p className="p">Currently Viewing: {redditPost}</p>

      <input
        type="text"
        value={redditPost}
        onChange={(e) => setRedditPost(e.target.value)}
        placeholder="Enter Reddit post URL"
        className="input"
      />
      <button className="button" onClick={handleSubmit}>
        Submit
      </button>

      {posts.length > 0 && (
        <><div className="post-card">
          <h2>{posts[0].title}</h2>
          <p>Posted by u/{posts[0].author} | Upvotes: {posts[0].score} | Comments: {posts[0].num_comments}</p>
          {posts[0].selftext && (
            <p className="post-p">{posts[0].selftext}</p>
          )}
        </div></>
      )}
      {comments.length > 0 && (
        <div>
          <h3>Comments:</h3>
          {comments.map((comment, index) => (
            <div key={index} className="comment-card">
              <p><strong>u/{comment.author}</strong> | Upvotes: {comment.score}</p>
              <p>{comment.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;