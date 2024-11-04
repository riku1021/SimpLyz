import { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, IconButton, Box, Button, Typography, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const AnalysisChat = ({ image }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isChartAnalysisMode, setIsChartAnalysisMode] = useState(true);
    const [loading, setLoading] = useState(false);
    const [analyzeMessage, setAnalyzeMessage] = useState(null);

    useEffect(() => {
        setIsChartAnalysisMode(true);
        setMessages([]);
        setAnalyzeMessage(null);
    }, [image]);

    const getCombinedMessages = (messages) => {
        return messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
    };

    const getLastTenMessages = (messages) => {
        return messages.slice(-10);
    };

    const sendMessage = async () => {
        if (input.trim() === '' || loading) return;

        const newMessage = { sender: 'user', text: input };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInput('');
        setLoading(true);

        try {
            const lastTenMessages = getLastTenMessages([...messages, newMessage]);
            const combinedMessages = analyzeMessage
                ? getCombinedMessages([analyzeMessage, ...lastTenMessages])
                : getCombinedMessages(lastTenMessages);

            const response = await axios.post('http://localhost:5000/api/chat', { message: combinedMessages });

            const botMessage = { sender: 'bot', text: response.data.reply };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        }

        setLoading(false);
    };

    const analyzeImage = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/gemini/image', { image_data: image });
            const botMessage = { sender: 'bot', text: response.data.text };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
            setAnalyzeMessage(botMessage);
            setIsChartAnalysisMode(false);
        } catch (error) {
            console.error('Error analyzing image:', error);
        }
        setLoading(false);
    };

    return (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {loading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    maxHeight: 'calc(100vh - 200px)',
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end'
                }}
            >
                {messages.map((msg, index) => (
                    <Box
                        key={index}
                        sx={{
                            maxWidth: '80%',
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            bgcolor: msg.sender === 'user' ? '#1976d2' : '#ffffff',
                            color: msg.sender === 'user' ? '#ffffff' : '#404040',
                            borderRadius: '16px',
                            m: 1,
                            p: '8px 12px',
                            boxShadow: 1,
                            wordBreak: 'break-word',
                            width: 'fit-content',
                            display: 'flex',
                            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        }}
                    >
                        <Typography variant="body2">{msg.text}</Typography>
                    </Box>
                ))}
            </Box>
            {isChartAnalysisMode ? (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        display: 'flex',
                        alignItems: 'center',
                        margin: 2,
                        borderRadius: '50px',
                    }}
                >
                    <Button
                        fullWidth
                        onClick={analyzeImage}
                        sx={{
                            color: loading ? '#9e9e9e' : '#fff',
                            bgcolor: loading ? '#e0e0e0' : '#1976d2',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            borderRadius: '50px',
                            padding: '5px 7px 5px 20px',
                            margin: 1,
                            borderTop: '1px solid #ddd',
                            boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.1)',
                            cursor: loading ? 'default' : 'pointer',
                            '&:hover': {
                                bgcolor: loading ? '#e0e0e0' : '#1565c0',
                            },
                        }}
                        disabled={loading}
                    >
                        画像を解析
                    </Button>
                </Box>
            ) : (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: '#fff',
                        padding: '5px 7px 5px 20px',
                        margin: 2,
                        borderTop: '1px solid #ddd',
                        boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.1)',
                        borderRadius: '50px',
                    }}
                >
                    <TextField
                        multiline
                        fullWidth
                        variant="standard"
                        placeholder="メッセージを入力してください"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        InputProps={{
                            disableUnderline: true,
                            overflow: 'auto',
                        }}
                        sx={{
                            mr: 1,
                            '& .MuiInputBase-input': {
                                maxHeight: '6em',
                                overflowY: 'auto',
                            },
                        }}
                        inputProps={{
                            maxRows: 3,
                        }}
                    />
                    <IconButton
                        onClick={sendMessage}
                        sx={{
                            bgcolor: loading ? '#e0e0e0' : '#1976d2',
                            color: loading ? '#9e9e9e' : '#fff',
                            cursor: loading ? 'default' : 'pointer',
                            '&:hover': {
                                bgcolor: loading ? '#e0e0e0' : '#1565c0',
                            },
                        }}
                        disabled={loading}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

export default AnalysisChat;
