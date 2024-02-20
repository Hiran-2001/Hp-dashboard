// src/App.js

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import "./App.css"
function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Simulating a login check
    const checkLogin = async () => {
      try {
        const response = await fetch('/api/check-login'); // Adjust the endpoint accordingly
        const data = await response.json();
        setLoggedIn(data.isLoggedIn);
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    // Load initial data when the component mounts
    checkLogin();
  }, []);

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          {/* <Route
            path="/"
            element={
              loggedIn ? (
                <div>
                  <Dashboard/>
                </div>
              ) : (
                <Login setLoggedIn={setLoggedIn} />
              )
            }
          /> */}
          <Route path="/" element={loggedIn ? <Dashboard isLoggedIn={loggedIn} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
