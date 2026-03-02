//www.reddit.com/r/webdev/comments/r9wjz8/how_would_i_go_about_using_json_data_to_make/

import React from 'react';
import { useState } from 'react';
//import logo from './logo.svg';
//import './App.css';

function App() {
  const [link, setLink] = useState('');
  const [postData, setPostData] = useState<{ title: string; body: string } | null>(null);
  
const handleSubmit = () => {
  const redditUrl = 'https://jsonplaceholder.typicode.com/posts/1';
  
  fetch(redditUrl)
    .then(response => response.json())
    .then(data => {
      console.log('Reddit data:', data);
      setPostData(data);
    })
    .catch(error => {
      console.log('Error:', error);
    });
};

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Reddit Page View</h1>
      <br></br>
      <input 
      value={link} 
      onChange={(e) => setLink(e.target.value)} 
      type="text" 
      placeholder="Enter Reddit URL" />
      <button onClick={handleSubmit}>Search</button>
      <p>You typed: {link}</p>
      {postData && (
        <div>
          <h2>{postData.title}</h2>
          <p>{postData.body}</p>
        </div>
)}
    </div>
  );
}

export default App;