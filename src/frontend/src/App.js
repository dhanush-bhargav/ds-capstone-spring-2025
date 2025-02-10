// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
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
    Divider,
    TextField
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ReactInputEmoji from 'react-input-emoji';
import { topicsData } from './topicsData'; // Import the topics data


function App() {
    const [topics, setTopics] = useState(topicsData); // Use the imported data
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const [awaitingYesNo, setAwaitingYesNo] = useState(false);
    const [lastQuestion, setLastQuestion] = useState('');

    // --- Placeholder Backend Interaction (Replace with actual API calls) ---
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
        setLastQuestion(text);
        setAwaitingYesNo(true);
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

        // Simulate GPT response (remove when connecting to real backend)
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
    }, [selectedTopic]);

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

    const handleAttachmentClick = () => {
        alert("Attachment functionality not implemented yet.");
    };

    const handleSendOrChange = (text) => {
        setNewMessage(text);
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Box className="app-container" sx={{ display: 'flex', height: '100vh' }}>
            {/* Left Sidebar: Topic Selection */}
            <Box className="topic-list" sx={{ width: 650, borderRight: 1, borderColor: 'divider', overflowY: 'auto' }}>
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
                            {/* Wrap Chips in a Box with wrapping */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {selectedTopic.preMadeQuestions.map((question, index) => (
                                    <Chip
                                        key={index}
                                        label={question}
                                        onClick={() => sendMessage(question)}
                                        variant="outlined"
                                        sx={{ whiteSpace: 'normal' }} // Allow wrapping
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
                    <Avatar>U</Avatar>
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
                            <Avatar sx={{ mr: 1 }}>{message.sender === 'user' ? 'U' : 'G'}</Avatar>
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
                    <ReactInputEmoji
                        value={newMessage}
                        onChange={handleSendOrChange}
                        cleanOnEnter
                        onEnter={sendMessage}
                        placeholder="Type a message"
                        disabled={awaitingYesNo}
                    />
                    <IconButton color="primary" onClick={handleAttachmentClick} disabled={awaitingYesNo}>
                        <AttachFileIcon />
                    </IconButton>
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

export default App;