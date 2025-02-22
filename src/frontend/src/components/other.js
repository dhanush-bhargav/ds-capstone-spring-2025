// // src/components/ChatPage.js
// import React, { useState, useEffect, useRef } from 'react';
// import {
//     List,
//     ListItem,
//     IconButton,
//     Box,
//     Typography,
//     Select,
//     MenuItem,
//     InputLabel,
//     FormControl,
//     Avatar,
//     Chip,
//     Button,
//     TextField,
//     Divider
// } from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';
// import { topicsData } from '../topicsData';
// import axios from 'axios';

// function ChatPage({ username, onLogout }) {
//     const [topics, setTopics] = useState(topicsData);
//     const [selectedTopic, setSelectedTopic] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState('');
//     const messagesEndRef = useRef(null);
//     const [awaitingYesNo, setAwaitingYesNo] = useState(false);
//     const [lastQuestion, setLastQuestion] = useState('');
//     const [chatInitialized, setChatInitialized] = useState(false);

//     const API_BASE_URL = 'http://localhost:5000'; // Replace with your backend URL

//     // --- Backend Interaction ---

//     const initializeChat = async (question, stance) => {
//         try {
//             const response = await axios.post(`${API_BASE_URL}/initialize`, {
//                 central_question: question,
//                 stance: stance,
//                 user_id: username,
//             });
//             console.log('This is the response', response)
//             setMessages([...messages, { id: Date.now(), text: question, sender: 'user' }, { id: Date.now() + 1, text: response.data, sender: 'gpt' }]);
//             setChatInitialized(true);
//         } catch (error) {
//             console.error("Error initializing chat:", error);
//             alert("Failed to initialize chat. Please try again.");
//         }
//     };

//     const sendChatMessage = async (text) => {
//         try {
//             const response = await axios.post(`${API_BASE_URL}/chat`, {
//                 message: text,
//                 user_id: username,
//             });
//             const newMessageObj = {
//                 id: Date.now(),
//                 text: text,
//                 sender: 'user',
//             };
//             setMessages(prev => [...prev, newMessageObj]);
//             setMessages(prevMessages => [...prevMessages, { id: Date.now() + 1, text: response.data, sender: 'gpt' }]);
//             setNewMessage('');
//         } catch (error) {
//             console.error("Error sending message:", error);
//             alert("Failed to send message. Please try again.");
//         }
//     };


//     const sendMessage = async (text = newMessage) => {
//         if (!chatInitialized) {
//             if (selectedTopic.preMadeQuestions.includes(text)) {
//                 setLastQuestion(text);
//                 setAwaitingYesNo(true);
//             }
//              else {
//             alert("Select the question.")
//           }
//             return;
//         }
//         if (!text.trim() || !selectedTopic) return;

//         await sendChatMessage(text);

//     };

//     const handleYesNo = async (response) => {
//       setAwaitingYesNo(false);
//       await initializeChat(lastQuestion, response);
//     };


//     // --- useEffect Hooks ---
//     useEffect(() => {
//         if (topics.length > 0) {
//             setSelectedTopic(topics[0]);
//         }
//     }, [topics]);

//     useEffect(() => {
//         const initialize = async () => {
//             if (selectedTopic) {
//                 setChatInitialized(false);
//                 setMessages([]);
//                 setAwaitingYesNo(false);
//                 setLastQuestion('');
//             }
//         }
//         initialize();
//     }, [selectedTopic]);

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     // --- Event Handlers ---
//     const handleTopicSelect = (event) => {
//         const topicId = event.target.value;
//         const selected = topics.find(topic => topic.id === topicId);
//         setSelectedTopic(selected);
//     };



//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     return (
//         <Box className="app-container" sx={{ display: 'flex', height: '100vh' }}>
//             {/* Left Sidebar: Topic Selection */}
//             <Box className="topic-list" sx={{ width: 350, borderRight: 1, borderColor: 'divider', overflowY: 'auto' }}>
//                 <List>
//                     <ListItem>
//                         <FormControl fullWidth>
//                             <InputLabel id="topic-select-label">Select Topic</InputLabel>
//                             <Select
//                                 labelId="topic-select-label"
//                                 id="topic-select"
//                                 value={selectedTopic ? selectedTopic.id : ''}
//                                 label="Select Topic"
//                                 onChange={handleTopicSelect}
//                                 sx={{ maxWidth: '300px' }}
//                             >
//                                 {topics.map((topic) => (
//                                     <MenuItem key={topic.id} value={topic.id}>{topic.name}</MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                     </ListItem>
//                     {/* Pre-made Questions */}
//                     {selectedTopic && (
//                         <ListItem>
//                             {/* Use a Box with flexDirection: 'column' */}
//                             <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
//                                 {selectedTopic.preMadeQuestions.map((question, index) => (
//                                     // Use a div with onClick and styling
//                                     <Box
//                                         key={index}
//                                         onClick={() => sendMessage(question)} // Corrected line
//                                         sx={{
//                                             padding: '8px 12px',
//                                             marginBottom: '8px',
//                                             borderRadius: '4px',
//                                             border: '1px solid #ccc',
//                                             cursor: 'pointer',
//                                             '&:hover': {
//                                                 backgroundColor: '#f0f0f0',
//                                             },
//                                             width: '100%',
//                                             textAlign: 'left',
//                                             wordWrap: 'break-word'
//                                         }}
//                                     >
//                                         <Typography variant="body1">{question}</Typography>
//                                     </Box>
//                                 ))}
//                             </Box>
//                         </ListItem>
//                     )}
//                 </List>
//             </Box>

//             {/* Right Side: Chat Window */}
//             <Box className="chat-window" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
//                     <Typography variant="h5">
//                         {selectedTopic ? `Chat about ${selectedTopic.name}` : 'Select a topic to chat'}
//                     </Typography>
//                     {/* Editable Username */}
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                         <Button variant='outlined' color='error' onClick={onLogout}>
//                             Logout
//                         </Button>
//                         <Avatar sx={{ mr: 1 }}>{username ? username.charAt(0).toUpperCase() : 'U'}</Avatar>
//                         <TextField
//                             value={username}
//                             onChange={() => { }}
//                             placeholder="Enter Username"
//                             variant="standard"
//                             size="small"
//                             sx={{ width: '120px' }}
//                             disabled={true}
//                         />
//                     </Box>
//                 </Box>
//                 <Divider sx={{ mb: 2 }} />

//                 {/* Message Display Area */}
//                 <Box className="message-area" sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
//                     {messages.map((message) => (
//                         <Box
//                             key={message.id}
//                             className={`message ${message.sender === 'user' ? 'sent' : 'received'}`}
//                             sx={{
//                                 p: 1,
//                                 mb: 1,
//                                 borderRadius: 2,
//                                 bgcolor: message.sender === 'user' ? 'primary.light' : 'grey.200',
//                                 alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
//                                 maxWidth: '70%',
//                                 display: 'flex',
//                                 alignItems: 'center'
//                             }}
//                         >
//                             <Avatar sx={{ mr: 1 }}>{message.sender === 'user' ? (username ? username.charAt(0).toUpperCase() : 'U') : 'G'}</Avatar>
//                             <Typography variant="body1">{message.text}</Typography>
//                         </Box>
//                     ))}
//                     <div ref={messagesEndRef} />
//                 </Box>

//                 {/* Yes/No Buttons (Conditional Rendering) */}
//                 {awaitingYesNo && (
//                     <Box sx={{ mb: 2 }}>
//                         <Typography variant="subtitle1">Please answer Yes or No:</Typography>
//                         <Button variant="contained" color="success" onClick={() => handleYesNo('yes')} sx={{ mr: 1 }}>Yes</Button>
//                         <Button variant="contained" color="error" onClick={() => handleYesNo('no')}>No</Button>
//                     </Box>
//                 )}

//                 {/* Message Input Area */}
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <TextField
//                         label="Type your message..."
//                         variant="outlined"
//                         fullWidth
//                         value={newMessage}
//                         onChange={(e) => setNewMessage(e.target.value)}
//                         onKeyPress={(e) => { if (e.key === 'Enter' && !awaitingYesNo) { sendMessage(); } }}
//                         disabled={!chatInitialized}
//                     />
//                     <IconButton
//                         color="primary"
//                         onClick={() => sendMessage(newMessage)} // Pass newMessage here
//                         disabled={!chatInitialized}
//                     >
//                         <SendIcon />
//                     </IconButton>
//                 </Box>
//             </Box>
//         </Box>
//     );
// }

// export default ChatPage;