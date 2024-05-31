import './App.css';
import React, { useState } from 'react';
import Content from './components/Content';
import Nav from './components/Nav';

function App() {
  const [showContent, setShowContent] = useState(false);
  const [key, setKey] = useState(0); // add a key to force re-render

  return (
    <>
      <Nav setShowContent={setShowContent} setKey={setKey}/>
      {showContent && <Content key={key} />}
    </>
  );
}

export default App;
