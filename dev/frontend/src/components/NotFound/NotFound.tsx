import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <Box
            sx={{
                height: 'calc(100vh - 64px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
            }}
        >
            <Typography variant="h1" sx={{ fontSize: '8rem', fontWeight: 'bold', color: '#595959' }}>
                <span style={{ color: '#1976d2' }}>4</span>0<span style={{ color: '#1976d2' }}>4</span>
            </Typography>
            <Typography variant="h3" sx={{ color: '#595959' }}>
                Not Found
            </Typography>
            <Typography variant="h6" sx={{ color: '#595959', p: 5 }}>
                このページはすでに削除されているか、URLが間違っている可能性があります。
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleBackToHome}
                sx={{
                    padding: '5px 10px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderRadius: '50px',
                }}
            >
                ホームに戻る
            </Button>
        </Box>
    );
};

export default NotFound;
