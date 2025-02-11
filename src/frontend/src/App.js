// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './components/ChatPage';
import LoginPage from './components/LoginPage';
import './App.css';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');


    const handleLogin = (user) => {
        setIsLoggedIn(true);
        setUsername(user)
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={isLoggedIn ? <Navigate to="/chat" /> : <LoginPage onLogin={handleLogin} />} />
                <Route path="/chat" element={isLoggedIn ? <ChatPage username={username} onLogout={handleLogout}/> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;