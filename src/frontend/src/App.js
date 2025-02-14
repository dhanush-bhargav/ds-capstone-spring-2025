// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './components/ChatPage';
import LoginPage from './components/LoginPage';
import './App.css';
import axios from "axios";


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userID, setUserID] = useState('')
    const [topics, setTopics] = useState([])
    const API_BASE_URL = 'http://localhost:5000'; // Replace with your backend URL


    const handleLogin = async (userName, userID) => {
        setIsLoggedIn(true);
        setUsername(userName)
        setUserID(userID)
        const response = await axios.get(`${API_BASE_URL}/get_topics`)
        setTopics(response.data)
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={isLoggedIn ? <Navigate to="/chat" /> : <LoginPage onLogin={handleLogin} />} />
                <Route path="/chat" element={isLoggedIn ? <ChatPage username={username} userID={userID} topics={topics} onLogout={handleLogout}/> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;