//LoginPage.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function LoginPage({ onLogin }) {  // Receive onLogin prop
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Add error state

    const navigate = useNavigate(); // Hook for navigation


    const handleLogin = async () => { // Make this async
        setError(null); // Clear previous errors
        try {
            await onLogin(username, password); // Await the onLogin call
        } catch (err) {
            setError(err.message || 'Login failed'); // Set the error message
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
             {error && ( // Display error message if there is an error
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}
            <Button variant="contained" color="primary" onClick={handleLogin}>
                Login
            </Button>
        </Box>
    );
}

export default LoginPage;