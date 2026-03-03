import React, { useState } from "react";
//import "./App.css";

function App() {
  const myText = "Reddit View";
  const [redditPost, setRedditPost] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  
  const handleSubmit = async () => {
    const redditUrl = `${redditPost}.json`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(redditUrl)}`;
    console.log("URL:" + redditUrl);
    
    try {
      const response = await fetch(proxyUrl);
      const data = await response.json();
      console.log("Data:", data);

      if (Array.isArray(data) && data.length >=2) {
        const postsData = data[0].data.children[0].data;
        console.log("Posts:", postsData);
        setPosts([postsData]);
      } else {
        console.log("Invalid data structure:", data);
      }
    } catch (error) {
      console.log("Error fetching Reddit posts:", error);
    }
  }

  return (
    <div className="App">
      <center>
      <h1>{myText}</h1>
      <p>Currently Viewing: r/{redditPost}</p>
      
      <input
        type="text"
        value={redditPost}
        onChange={(e) => setRedditPost(e.target.value)}
        placeholder="Enter subreddit name"
      />
      
      <button onClick={handleSubmit}>Submit</button>
      </center>
    </div>
  );
}

export default App;