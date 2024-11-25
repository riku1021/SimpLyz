import React, { useState, FormEvent } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    Divider,
    Link
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { validateEmail, validatePassword } from '../../utils/validation';

interface CommonUserFormProps {
    title: string;
    buttonText: string;
    redirectText: string;
    onRedirect: () => void;
    onSubmit: (mail: string, password: string) => Promise<void>;
}

const CommonUserForm: React.FC<CommonUserFormProps> = ({
    title,
    buttonText,
    redirectText,
    onRedirect,
    onSubmit
}) => {
    const [formData, setFormData] = useState({ mail_address: '', password: '' });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
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
            await onSubmit(formData.mail_address, formData.password);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 64px)',
                overflow: 'hidden',
            }}
        >
            <Card sx={{ borderRadius: '25px', boxShadow: 3, width: '600px' }}>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        {title}
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
                                    borderRadius: '25px',
                                },
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
                                    borderRadius: '25px',
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            edge="end"
                                            sx={{ p: 2 }}
                                        >
                                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
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
                            {buttonText}
                        </Button>
                    </Box>
                    <Box mt={2} textAlign="right">
                        <Link
                            onClick={onRedirect}
                            underline="none"
                            variant="body2"
                            color="primary"
                            sx={{ cursor: 'pointer' }}
                        >
                            {redirectText}
                        </Link>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CommonUserForm;
