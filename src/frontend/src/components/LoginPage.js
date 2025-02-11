// src/components/LoginPage.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function LoginPage({ onLogin }) {  // Receive onLogin prop
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    const handleLogin = () => {
        // VERY BASIC "authentication" - replace with real logic
        if (username && password) {
            onLogin(username); // Call the onLogin prop
            navigate('/chat');   // Navigate to /chat
        } else {
            alert('Please enter a username and password.');
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
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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