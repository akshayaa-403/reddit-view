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
      <h1 style={{ textAlign: "center" }}>{myText}</h1>
      <p style={{ textAlign: "center" }}>Currently Viewing: {redditPost}</p>
      <input
        type="text"
        value={redditPost}
        onChange={(e) => setRedditPost(e.target.value)}
        placeholder="Enter Reddit post URL"
        style={{ display: 'block', margin: '0 auto', width: '300px' }}
      />
      <button style={{ display: 'block', margin: '0 auto', marginTop: '10px' }} onClick={handleSubmit}>Submit</button>
      {posts.length > 0 && (
        <><div className="post-card">
          <h2>{posts[0].title}</h2>
          <p>Posted by u/{posts[0].author} | Score: {posts[0].score} | Comments: {posts[0].num_comments}</p>
          {posts[0].selftext && (
            <p style={{ whiteSpace: 'pre-wrap' }}>{posts[0].selftext}</p>
          )}
        </div><div className="comments-card">
            <h3>Comments:</h3>
            {comments.map((comment, index) => (
              <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                <p>u/{comment.author}: {comment.body}</p>
              </div>
            ))}
          </div></>
      )}
    </div>
  );
}

export default App;