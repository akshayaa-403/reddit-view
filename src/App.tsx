//www.reddit.com/r/webdev/comments/r9wjz8/how_would_i_go_about_using_json_data_to_make/

import React from 'react';
import { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [link, setLink] = useState('');
  const [postData, setPostData] = useState(null);
  
const handleSubmit = () => {
  const redditUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(link + '.json');
  
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
      Reddit Page View
      <br></br>
      <input 
      value={link} 
      onChange={(e) => setLink(e.target.value)} 
      type="text" 
      placeholder="Enter Reddit URL" />
      <button onClick={handleSubmit}>Search</button>
      <p>You typed: {link}</p>
    </div>
  );
}

export default App;