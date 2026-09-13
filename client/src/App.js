import React, { useState } from 'react';
import Board from './components/Board';
import AuthForm from './components/AuthForm';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('syncboard_token'));

  const handleLogout = () => {
    localStorage.removeItem('syncboard_token');
    setToken(null);
  };

  if (!token) {
    return <div className="App"><AuthForm onAuthSuccess={(t) => setToken(t)} /></div>;
  }

  return (
    <div className="App">
      <Board token={token} onLogout={handleLogout} />
    </div>
  );
}

export default App;