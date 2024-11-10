import React, { useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, IconButton, InputAdornment, Divider, Link } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { showErrorAlert, showSuccessAlert } from '../../utils/alertUtils';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const UserForm = () => {
    useAuth();
    const [formData, setFormData] = useState({
        mail_address: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isRegist, setIsRegist] = useState(true);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;

    const validateEmail = (email) => emailRegex.test(email);
    const validatePassword = (password) => passwordRegex.test(password);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let valid = true;

        if (!validateEmail(formData.mail_address)) {
            setEmailError('有効なメールアドレスを入力してください');
            valid = false;
        }
        if (!validatePassword(formData.password)) {
            setPasswordError('アルファベットと数字を含む4文字以上のパスワードを入力してください');
            valid = false;
        }

        if (valid) {
            try {
                let response;
                let userId;
                if (isRegist) {
                    // 新規登録
                    const dataToSend = { ...formData, user_id: generateUUID() };
                    response = await axios.post('http://localhost:8080/users/create', dataToSend);
                    userId = dataToSend.user_id;
                    showSuccessAlert(response.data.StatusMessage || "新規登録が成功しました");
                } else {
                    // ログイン
                    response = await axios.post('http://localhost:8080/users/login', formData);
                    userId = response.data.user_id;
                    showSuccessAlert(response.data.StatusMessage || "ログインが成功しました");
                }
                // ローカルストレージにログイン情報を保存
                localStorage.setItem('loginStatus', 'ログイン中');
                localStorage.setItem('userId', userId);
                setFormData({ mail_address: '', password: '' });
                navigate('/manage-csv');
            } catch (err) {
                console.error('Error:', err.response?.data);
                const errorStatus = err.response?.data?.StatusMessage || "エラーが発生しました";
                const errorMessage = err.response?.data?.message;
                showErrorAlert(errorStatus, errorMessage);
            }
        } else {
            showErrorAlert("Faild", "入力エラーがあります。確認してください。");
        }
    };

    const handleSignupRedirect = () => {
        setIsRegist(!isRegist);
        setEmailError('');
        setPasswordError('');
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            <Card sx={{ borderRadius: '25px', boxShadow: 3, width: '600px' }}>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        {isRegist ? '新規登録' : 'ログイン'}
                    </Typography>
                    <Divider sx={{ width: '80%', mx: 'auto', mt: 2, mb: 2, borderWidth: '1.25px' }} />
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <TextField
                            label="メールアドレス"
                            variant="outlined"
                            fullWidth
                            name="mail_address"
                            value={formData.mail_address}
                            onChange={(e) => {
                                handleInputChange(e);
                                setEmailError('');
                            }}
                            onBlur={() => {
                                if (!validateEmail(formData.mail_address)) {
                                    setEmailError('有効なメールアドレスを入力してください');
                                }
                            }}
                            error={Boolean(emailError)}
                            helperText={emailError || ' '}
                            sx={{
                                width: '90%',
                                m: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '25px'
                                }
                            }}
                            required
                        />
                        <TextField
                            label="パスワード"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            fullWidth
                            name="password"
                            value={formData.password}
                            onChange={(e) => {
                                handleInputChange(e);
                                setPasswordError('');
                            }}
                            onBlur={() => {
                                if (!validatePassword(formData.password)) {
                                    setPasswordError('アルファベットと数字を含む4文字以上のパスワードを入力してください');
                                }
                            }}
                            error={Boolean(passwordError)}
                            helperText={passwordError || ' '}
                            sx={{
                                width: '90%',
                                m: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '25px'
                                }
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            edge="end"
                                            sx={{ p: 2 }}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            required
                        />
                    </Box>
                    <Box mt={1} textAlign="center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={!formData.mail_address || !formData.password}
                            sx={{ width: '90%', borderRadius: '50px' }}
                        >
                            {isRegist ? '新規登録' : 'ログイン'}
                        </Button>
                    </Box>
                    <Box mt={2} textAlign="right">
                        <Link onClick={handleSignupRedirect} underline="none" variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                            {isRegist ? 'ログインはこちら' : '新規登録はこちら'}
                        </Link>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default UserForm;
