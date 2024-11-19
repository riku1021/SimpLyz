import { useState, useEffect } from 'react';
import {
    TextField, Button, Box, Card, CardContent, Typography,
    IconButton, InputAdornment, Dialog, DialogTitle,
    DialogContent, DialogActions
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    showErrorAlert,
    showInfoAlert,
    showSuccessAlert,
    showConfirmationAlert
} from '../../utils/alertUtils';
import useAuth from '../../hooks/useAuth';

const UserInfo = () => {
    useAuth();
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
            showErrorAlert('エラー', 'APIキーを入力してください');
            return;
        }

        showConfirmationAlert(
            `「${apiKey}」でAPIキーを登録します。よろしいですか？`,
            '',
            'はい',
            'いいえ'
        ).then((result) => {
            if (result.isConfirmed) {
                localStorage.setItem('geminiApiKey', apiKey);
                setIsKeySaved(true);
                showSuccessAlert('保存完了', 'APIキーが保存されました。');
            }
        });
    };

    // APIキーを削除する関数
    const handleDeleteApiKey = () => {
        showConfirmationAlert('APIキーを削除しますか？', '', 'はい', 'いいえ')
            .then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('geminiApiKey');
                    setApiKey('');
                    setIsKeySaved(false);
                    setShowApiKey(false);
                    showSuccessAlert('削除完了', 'APIキーが削除されました。');
                }
            });
    };

    // パスワード入力モーダルを開く関数
    const handleOpenPasswordModal = (currentAction: string) => {
        setAction(currentAction);
        if (currentAction === 'modify') {
            showInfoAlert('現在のパスワードを<br>入力してください', '')
                .then((result) => {
                    if (result.isConfirmed) {
                        const enteredPassword = result.value;
                        const storedPassword = localStorage.getItem('userPassword');
                        if (storedPassword && enteredPassword === storedPassword) {
                            setShowPasswordModal(true);
                        } else {
                            showErrorAlert('認証エラー', '現在のパスワードが正しくありません。');
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
            showErrorAlert('エラー', 'パスワードを入力してください');
            return;
        }

        localStorage.setItem('userPassword', passwordInput);
        setIsPasswordSaved(true);
        setShowPasswordModal(false);
        showSuccessAlert('保存完了', `パスワードが${action === 'modify' ? '修正' : '登録'}されました。`);
    };

    // パスワード表示/非表示の切り替え
    const handleToggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    // APIキー表示/非表示の切り替え関数
    const handleToggleShowApiKey = () => {
        if (!isPasswordSaved) {
            showErrorAlert('パスワードを登録してください', 'まだ、パスワードが登録されていません。');
            return;
        }

        if (!showApiKey) {
            showInfoAlert('パスワードを入力してください', '')
                .then((result) => {
                    if (result.isConfirmed) {
                        const enteredPassword = result.value;
                        const storedPassword = localStorage.getItem('userPassword');
                        if (storedPassword && enteredPassword === storedPassword) {
                            setShowApiKey(true);
                        } else {
                            showErrorAlert('認証エラー', 'パスワードが正しくありません。');
                        }
                    }
                });
        } else {
            setShowApiKey(false);
        }
    };

    // API及びパスワード初期化ハンドラー
    const handleReset = () => {
        showConfirmationAlert('APIキーとパスワードを初期化しますがよろしいですか？', '', 'OK', 'キャンセル')
            .then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('geminiApiKey');
                    localStorage.removeItem('userPassword');
                    setApiKey('');
                    setIsKeySaved(false);
                    setShowApiKey(false);
                    setIsPasswordSaved(false);
                    setShowPasswordModal(false);
                    showSuccessAlert('初期化完了', 'APIキーとパスワードが初期化されました。');
                }
            });
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
            <Box>
                {/* APIキー管理カード */}
                <Card sx={{ width: 400, p: 2, m: 2, borderRadius: '25px' }}>
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
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '50px'
                                }
                            }}
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
                                sx={{ flexGrow: 1, mr: 1, borderRadius: '50px' }}
                            >
                                {isKeySaved ? 'APIキーを更新' : 'APIキーを保存'}
                            </Button>
                            {isKeySaved && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleDeleteApiKey}
                                    sx={{ flexGrow: 1, borderRadius: '50px' }}
                                >
                                    APIキーを削除
                                </Button>
                            )}
                        </Box>
                    </CardContent>
                </Card>

                {/* パスワード管理カード */}
                <Card sx={{ width: 400, p: 2, m: 2, borderRadius: '25px' }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            パスワード管理
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{
                                backgroundColor: '#EAEAEA',
                                padding: '4px 16px',
                                flexGrow: 1,
                                marginRight: '16px',
                                borderRadius: '25px'
                            }}>
                                <Typography variant="h6">
                                    {isPasswordSaved ? '登録済み' : '未登録'}
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleOpenPasswordModal(isPasswordSaved ? 'modify' : 'register')}
                                sx={{ borderRadius: '50px' }}
                            >
                                {isPasswordSaved ? '修正' : '登録'}
                            </Button>
                        </Box>
                        <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            onClick={handleReset}
                            sx={{ borderRadius: '50px' }}
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
                        <Button onClick={handleClosePasswordModal} sx={{ borderRadius: '50px' }}>キャンセル</Button>
                        <Button onClick={handleSavePassword} variant="contained" color="primary" sx={{ borderRadius: '50px' }}>
                            保存
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default UserInfo;
