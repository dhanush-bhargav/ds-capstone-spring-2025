// src/components/LoginPage.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from "axios";

function LoginPage({ onLogin }) {  // Receive onLogin prop
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook for navigation
    const API_BASE_URL = 'http://localhost:5000'; // Replace with your backend URL


    const handleLogin = async () => {
        // VERY BASIC "authentication" - replace with real logic
        if (userID && password) {
            try {
                const response = await axios.post(`${API_BASE_URL}/login`,
                    {
                        "user_id": userID,
                        "password": password
                    })
                if (response.data['success']){
                    onLogin(response.data['user_name'], userID); // Call the onLogin prop
                    navigate('/chat');   // Navigate to /chat
                }
                else {
                    alert(response.data['message'])
                }
            }
            catch{
                alert("Authentication Server Error: Please try again.")
            }
        } else {
            alert('Please enter a User ID and password.');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: 'lightgray',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            <TextField
                label="User ID"
                variant="outlined"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
                sx={{ mb: 2, width: '300px' }}
            />
            <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2, width: '300px' }}
            />
            <Button variant="contained" color="primary" onClick={handleLogin}>
                Login
            </Button>
        </Box>
    );
}

export default LoginPage;