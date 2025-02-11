// src/components/ChatPage.js
import React, { useState, useEffect, useRef } from 'react';
import {
    List,
    ListItem,
    IconButton,
    Box,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Avatar,
    Chip,
    Button,
    TextField,
    Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { topicsData } from '../topicsData'; // Import topics

function ChatPage({username, onLogout}) {
    const [topics, setTopics] = useState(topicsData);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const [awaitingYesNo, setAwaitingYesNo] = useState(false);
    const [lastQuestion, setLastQuestion] = useState('');

    // --- Placeholder Backend Interaction ---
    const fetchMessages = async () => {
        if (!selectedTopic) return;
        // Placeholder removed
    };


    const sendMessage = async (text = newMessage) => {
        if (!text.trim() || !selectedTopic) return;

        const newMessageObj = {
            id: Date.now(),
            topicId: selectedTopic.id,
            text: text,
            sender: 'user',
        };
        setMessages([...messages, newMessageObj]);
        setNewMessage('');

        // Only ask for Yes/No if a pre-made question was selected
        if (selectedTopic.preMadeQuestions.includes(text)) {
            setLastQuestion(text);
            setAwaitingYesNo(true);
        } else {
             // Simulate immediate GPT response for custom questions
            setTimeout(() => {
                const gptResponse = {
                    id: Date.now() + 1,
                    topicId: selectedTopic.id,
                    text: `This is a placeholder GPT response for: ${text}`,
                    sender: 'gpt',
                };
                setMessages(prevMessages => [...prevMessages, gptResponse]);
            }, 1000);
        }
    };


    const handleYesNo = (response) => {
        setAwaitingYesNo(false);

        const yesNoMessage = {
            id: Date.now(),
            topicId: selectedTopic.id,
            text: response,
            sender: 'user',
        };
        setMessages(prevMessages => [...prevMessages, yesNoMessage]);

        // Simulate GPT response (remove for real backend)
        setTimeout(() => {
            const gptResponse = {
                id: Date.now() + 1,
                topicId: selectedTopic.id,
                text: `This is a placeholder GPT response for: ${lastQuestion}. You answered ${response}.`,
                sender: 'gpt',
            };
            setMessages(prevMessages => [...prevMessages, gptResponse]);
        }, 1000);
    };


    // --- useEffect Hooks ---
    useEffect(() => {
        if (topics.length > 0) {
            setSelectedTopic(topics[0]);
        }
    }, [topics]);

    useEffect(() => {
        if (selectedTopic) {
            fetchMessages();
        } else {
            setMessages([]);
        }
    }, [selectedTopic, fetchMessages]); // Add fetchMessages here

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // --- Event Handlers ---
    const handleTopicSelect = (event) => {
        const topicId = event.target.value;
        const selected = topics.find(topic => topic.id === topicId);
        setSelectedTopic(selected);
        setMessages([]);
        setAwaitingYesNo(false);

    };


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Box className="app-container" sx={{ display: 'flex', height: '100vh' }}>
            {/* Left Sidebar: Topic Selection */}
            <Box className="topic-list" sx={{ width: 350, borderRight: 1, borderColor: 'divider', overflowY: 'auto' }}>
                <List>
                    <ListItem>
                        <FormControl fullWidth>
                            <InputLabel id="topic-select-label">Select Topic</InputLabel>
                            <Select
                                labelId="topic-select-label"
                                id="topic-select"
                                value={selectedTopic ? selectedTopic.id : ''}
                                label="Select Topic"
                                onChange={handleTopicSelect}
                                sx={{ maxWidth: '300px' }}
                            >
                                {topics.map((topic) => (
                                    <MenuItem key={topic.id} value={topic.id}>{topic.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </ListItem>
                    {/* Pre-made Questions */}
                    {selectedTopic && (
                        <ListItem>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {selectedTopic.preMadeQuestions.map((question, index) => (
                                    <Chip
                                        key={index}
                                        label={question}
                                        onClick={() => sendMessage(question)}
                                        variant="outlined"
                                        sx={{ whiteSpace: 'normal' }}
                                    />
                                ))}
                            </Box>
                        </ListItem>
                    )}
                </List>
            </Box>

            {/* Right Side: Chat Window */}
            <Box className="chat-window" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h5">
                        {selectedTopic ? `Chat about ${selectedTopic.name}` : 'Select a topic to chat'}
                    </Typography>
                    {/* Editable Username */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap:2 }}>
                    <Button variant='outlined' color='error' onClick={onLogout}>
                        Logout
                    </Button>
                        <Avatar sx={{ mr: 1 }}>{username ? username.charAt(0).toUpperCase() : 'U'}</Avatar>
                        <TextField
                            value={username}
                            onChange={(e)=> {}}
                            placeholder="Enter Username"
                            variant="standard" // Or outlined/filled, as you prefer
                            size="small"
                            sx={{ width: '120px' }} // Adjust width as needed
                            disabled={true}
                        />
                    </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {/* Message Display Area */}
                <Box className="message-area" sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                    {messages.map((message) => (
                        <Box
                            key={message.id}
                            className={`message ${message.sender === 'user' ? 'sent' : 'received'}`}
                            sx={{
                                p: 1,
                                mb: 1,
                                borderRadius: 2,
                                bgcolor: message.sender === 'user' ? 'primary.light' : 'grey.200',
                                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '70%',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <Avatar sx={{ mr: 1 }}>{message.sender === 'user' ? (username ? username.charAt(0).toUpperCase() : 'U') : 'G'}</Avatar>
                            <Typography variant="body1">{message.text}</Typography>
                        </Box>
                    ))}
                    <div ref={messagesEndRef} />
                </Box>

                {/* Yes/No Buttons (Conditional Rendering) */}
                {awaitingYesNo && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Please answer Yes or No:</Typography>
                        <Button variant="contained" color="success" onClick={() => handleYesNo('yes')} sx={{ mr: 1 }}>Yes</Button>
                        <Button variant="contained" color="error" onClick={() => handleYesNo('no')}>No</Button>
                    </Box>
                )}

                {/* Message Input Area */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                        label="Type your message..."
                        variant="outlined"
                        fullWidth
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => { if (e.key === 'Enter' && !awaitingYesNo) { sendMessage(); } }}
                        disabled={awaitingYesNo}
                    />
                    <IconButton
                        color="primary"
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || !selectedTopic || awaitingYesNo}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}

export default ChatPage;