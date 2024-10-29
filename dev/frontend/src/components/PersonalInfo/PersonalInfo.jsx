import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Box, Card, CardContent, Typography,
    IconButton, InputAdornment, Dialog, DialogTitle,
    DialogContent, DialogActions
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Swal from 'sweetalert2';

const PersonalInfo = () => {
    // APIキー管理用の状態
    const [apiKey, setApiKey] = useState('');
    const [isKeySaved, setIsKeySaved] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);

    // パスワード管理用の状態
    const [isPasswordSaved, setIsPasswordSaved] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [action, setAction] = useState('register');

    // 初回レンダリングでAPIキーとパスワードの存在を確認
    useEffect(() => {
        const storedApiKey = localStorage.getItem('geminiApiKey');
        if (storedApiKey) {
            setApiKey(storedApiKey);
            setIsKeySaved(true);
        }

        const storedPassword = localStorage.getItem('userPassword');
        setIsPasswordSaved(Boolean(storedPassword));
    }, []);

    // APIキーを保存する関数
    const handleSaveApiKey = () => {
        if (!apiKey) {
            Swal.fire({
                icon: 'error',
                title: 'エラー',
                text: 'APIキーを入力してください',
                confirmButtonColor: '#1976d2',
                showCloseButton: true,
            });
            return;
        }

        Swal.fire({
            title: `「${apiKey}」でAPIキーを登録します。よろしいですか？`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'はい',
            cancelButtonText: 'いいえ',
            confirmButtonColor: '#1976d2',
            showCloseButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.setItem('geminiApiKey', apiKey);
                setIsKeySaved(true);
                Swal.fire({
                    icon: 'success',
                    title: '保存完了',
                    text: 'APIキーが保存されました。',
                    confirmButtonColor: '#1976d2',
                    showCloseButton: true,
                });
            }
        });
    };

    // APIキーを削除する関数
    const handleDeleteApiKey = () => {
        Swal.fire({
            title: 'APIキーを削除しますか？',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'はい',
            cancelButtonText: 'いいえ',
            confirmButtonColor: '#1976d2',
            showCloseButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('geminiApiKey');
                setApiKey('');
                setIsKeySaved(false);
                setShowApiKey(false);
                Swal.fire({
                    icon: 'success',
                    title: '削除完了',
                    text: 'APIキーが削除されました。',
                    confirmButtonColor: '#1976d2',
                    showCloseButton: true,
                });
            }
        });
    };

    // パスワード入力モーダルを開く関数
    const handleOpenPasswordModal = (currentAction) => {
        setAction(currentAction);
        if (currentAction === 'modify') {
            Swal.fire({
                title: '現在のパスワードを<br>入力してください',
                input: 'password',
                showCancelButton: true,
                inputAttributes: {
                    autocapitalize: 'off',
                },
                confirmButtonColor: '#1976d2',
                showCloseButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    const enteredPassword = result.value;
                    const storedPassword = localStorage.getItem('userPassword');
                    if (storedPassword && enteredPassword === storedPassword) {
                        setShowPasswordModal(true);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: '認証エラー',
                            text: '現在のパスワードが正しくありません。',
                            confirmButtonColor: '#1976d2',
                            showCloseButton: true,
                        });
                    }
                }
            });
        } else {
            setShowPasswordModal(true);
        }
    };

    // パスワード入力モーダルを閉じる関数
    const handleClosePasswordModal = () => {
        setShowPasswordModal(false);
    };

    // パスワードを保存する関数
    const handleSavePassword = () => {
        if (!passwordInput) {
            Swal.fire({
                icon: 'error',
                title: 'エラー',
                text: 'パスワードを入力してください',
                confirmButtonColor: '#1976d2',
                showCloseButton: true,
            });
            return;
        }

        localStorage.setItem('userPassword', passwordInput);
        setIsPasswordSaved(true);
        setShowPasswordModal(false);
        Swal.fire({
            icon: 'success',
            title: '保存完了',
            text: `パスワードが${action === 'modify' ? '修正' : '登録'}されました。`,
            confirmButtonColor: '#1976d2',
            showCloseButton: true,
        });
    };

    // パスワード表示/非表示の切り替え
    const handleToggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    // APIキー表示/非表示の切り替え関数
    const handleToggleShowApiKey = () => {
        if (!isPasswordSaved) {
            Swal.fire({
                icon: 'info',
                title: 'パスワードを登録してください',
                confirmButtonColor: '#1976d2',
                showCloseButton: true,
            });
            return;
        }

        if (!showApiKey) {
            Swal.fire({
                title: 'パスワードを入力してください',
                input: 'password',
                showCancelButton: true,
                inputAttributes: {
                    autocapitalize: 'off',
                },
                confirmButtonColor: '#1976d2',
                showCloseButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    const enteredPassword = result.value;
                    const storedPassword = localStorage.getItem('userPassword');
                    if (storedPassword && enteredPassword === storedPassword) {
                        setShowApiKey(true);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: '認証エラー',
                            text: 'パスワードが正しくありません。',
                            confirmButtonColor: '#1976d2',
                            showCloseButton: true,
                        });
                    }
                }
            });
        } else {
            setShowApiKey(false);
        }
    };

    // API及びパスワード初期化ハンドラー
    const handleReset = () => {
        Swal.fire({
            title: 'APIキーとパスワードを初期化しますがよろしいですか？',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: 'キャンセル',
            confirmButtonColor: '#1976d2',
            showCloseButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('geminiApiKey');
                localStorage.removeItem('userPassword');
                setApiKey('');
                setIsKeySaved(false);
                setShowApiKey(false);
                setIsPasswordSaved(false);
                setShowPasswordModal(false);
                Swal.fire({
                    icon: 'success',
                    title: '初期化完了',
                    text: 'APIキーとパスワードが初期化されました。',
                    confirmButtonColor: '#1976d2',
                    showCloseButton: true,
                });
            }
        });
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Box>
                {/* APIキー管理カード */}
                <Card sx={{ width: 400, p: 2 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            GEMINI APIキー管理
                        </Typography>
                        <TextField
                            label="APIキー"
                            variant="outlined"
                            fullWidth
                            type={showApiKey ? 'text' : 'password'}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            sx={{ mb: 2 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleToggleShowApiKey} edge="end">
                                            {showApiKey ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveApiKey}
                                sx={{ flexGrow: 1, mr: 1 }}
                            >
                                {isKeySaved ? 'APIキーを更新' : 'APIキーを保存'}
                            </Button>
                            {isKeySaved && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleDeleteApiKey}
                                    sx={{ flexGrow: 1 }}
                                >
                                    APIキーを削除
                                </Button>
                            )}
                        </Box>
                    </CardContent>
                </Card>

                {/* パスワード管理カード */}
                <Card sx={{ width: 400, p: 2, mt: 4 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            パスワード管理
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{
                                backgroundColor: '#EAEAEA',
                                borderRadius: '8px',
                                padding: '4px 16px',
                                flexGrow: 1,
                                marginRight: '16px'
                            }}>
                                <Typography variant="h6">
                                    {isPasswordSaved ? '登録済み' : '未登録'}
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleOpenPasswordModal(isPasswordSaved ? 'modify' : 'register')}
                            >
                                {isPasswordSaved ? '修正' : '登録'}
                            </Button>
                        </Box>
                        <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            onClick={handleReset}
                        >
                            初期化
                        </Button>
                    </CardContent>
                </Card>

                {/* パスワード入力モーダル */}
                <Dialog open={showPasswordModal} onClose={handleClosePasswordModal}>
                    <DialogTitle>{action === 'modify' ? 'パスワード修正' : 'パスワード登録'}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="パスワード"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            variant="outlined"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleToggleShowPassword} edge="end">
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClosePasswordModal}>キャンセル</Button>
                        <Button onClick={handleSavePassword} variant="contained" color="primary">
                            保存
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default PersonalInfo;
