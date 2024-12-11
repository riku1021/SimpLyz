import React, { useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    CircularProgress,
    IconButton,
    Button,
} from "@mui/material";
import {
    Refresh as RefreshIcon,
    Upload as UploadIcon
} from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";
import {
    checkPassword,
    getMailAddress,
    saveMailAddress,
    changePassword,
    saveGeminiApiKey,
    deleteUser,
    verifyPassword,
    verifyGeminiApiKey,
} from "../../databaseUtils/Users";
import {
    showSuccessAlert,
    showErrorAlert,
    showInfoAlert,
    showConfirmationAlert,
} from "../../utils/alertUtils";
import { validateEmail, validatePassword } from '../../utils/validation';

const UserInfo: React.FC = () => {
    const { userId } = useAuth();
    const [apiKeyRegistered, setApiKeyRegistered] = useState<boolean | null>(null);
    const [passwordRegistered, setPasswordRegistered] = useState<boolean | null>(null);
    const [mailAddress, setMailAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const checkRegistration = async () => {
        try {
            setLoading(true);

            const [apiKeyStatus, passwordStatus, mailResult] = await Promise.all([
                verifyGeminiApiKey(userId),
                verifyPassword(userId),
                getMailAddress(userId),
            ]);

            // Gemini APIキーの登録状況をセット
            if (apiKeyStatus.message === "Success") {
                setApiKeyRegistered(apiKeyStatus.geminiApiKeyExists || false);
            } else {
                setApiKeyRegistered(null);
            }

            // パスワードの登録状況をセット
            if (passwordStatus.message === "Success") {
                setPasswordRegistered(passwordStatus.passwordExists || false);
            } else {
                setPasswordRegistered(null);
            }

            // メールアドレスの取得結果をセット
            if (mailResult.message === "Success") {
                setMailAddress(mailResult.mailAddress || "未登録");
            } else {
                setMailAddress("確認不可");
            }
        } catch (error) {
            console.error("登録状況の確認に失敗しました:", error);
            setApiKeyRegistered(null);
            setPasswordRegistered(null);
            setMailAddress("確認不可");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        checkRegistration();
    }, []);

    const handleUpdateApiKey = async () => {
        try {
            const passwordResult = await showInfoAlert(
                "GeminiApiKeyの更新",
                "現在のパスワードを入力してください",
                "password"
            );
            if (!passwordResult.isConfirmed || !passwordResult.value) {
                return;
            }
            const password = passwordResult.value;

            const passwordCheckResult = await checkPassword(userId, password);
            if (passwordCheckResult !== "Success") {
                return showErrorAlert("エラー", "パスワードが正しくありません");
            }

            const apiKeyResult = await showInfoAlert(
                "新しいGeminiApiKeyの入力",
                "新しいGeminiApiKeyを入力してください",
                "text"
            );
            if (!apiKeyResult.isConfirmed || !apiKeyResult.value) {
                return;
            }
            const newApiKey = apiKeyResult.value;

            const saveApiKeyResult = await saveGeminiApiKey(userId, newApiKey);
            if (saveApiKeyResult === "Success") {
                showSuccessAlert("成功", "GeminiApiKeyが更新されました");
                checkRegistration();
            } else {
                showErrorAlert("エラー", saveApiKeyResult);
            }
        } catch (error) {
            console.error("GeminiApiKeyの更新に失敗しました:", error);
            showErrorAlert("エラー", "GeminiApiKeyの更新に失敗しました");
        }
    };

    const handleUpdateMailAddress = async () => {
        try {
            const passwordResult = await showInfoAlert(
                "メールアドレスの変更",
                "現在のパスワードを入力してください",
                "password"
            );
            if (!passwordResult.isConfirmed || !passwordResult.value) {
                return;
            }
            const currentPassword = passwordResult.value;

            const passwordCheckResult = await checkPassword(userId, currentPassword);
            if (passwordCheckResult !== "Success") {
                return showErrorAlert("エラー", "現在のパスワードが正しくありません");
            }

            const newMailAddressResult = await showInfoAlert(
                "メールアドレスの変更",
                "新しいメールアドレスを入力してください",
                "text"
            );
            if (!newMailAddressResult.isConfirmed || !newMailAddressResult.value) {
                return;
            }
            const newMailAddress = newMailAddressResult.value;

            if (!validateEmail(newMailAddress)) {
                return showErrorAlert(
                    "エラー",
                    "無効なメールアドレス形式です。正しいメールアドレスを入力してください。"
                );
            }

            // メールアドレスを保存
            const saveMailResult = await saveMailAddress(userId, newMailAddress);
            if (saveMailResult === "Success") {
                showSuccessAlert("成功", "メールアドレスが更新されました");
                checkRegistration();
            } else {
                showErrorAlert("エラー", saveMailResult);
            }
        } catch (error) {
            console.error("メールアドレスの更新に失敗しました:", error);
            showErrorAlert("エラー", "メールアドレスの更新に失敗しました");
        }
    };

    const handleUpdatePassword = async () => {
        try {
            const passwordResult = await showInfoAlert(
                "パスワードの変更",
                "現在のパスワードを入力してください",
                "password"
            );
            if (!passwordResult.isConfirmed || !passwordResult.value) {
                return;
            }
            const currentPassword = passwordResult.value;

            const passwordCheckResult = await checkPassword(userId, currentPassword);
            if (passwordCheckResult !== "Success") {
                return showErrorAlert("エラー", "現在のパスワードが正しくありません");
            }

            const newPasswordResult = await showInfoAlert(
                "新しいパスワードの入力",
                "新しいパスワードを入力してください（4文字以上、英字と数字を含む必要があります）",
                "text"
            );
            if (!newPasswordResult.isConfirmed || !newPasswordResult.value) {
                return;
            }
            const newPassword = newPasswordResult.value;

            if (!validatePassword(newPassword)) {
                return showErrorAlert(
                    "エラー",
                    "無効なパスワード形式です。英字と数字を含み、4文字以上である必要があります。"
                );
            }

            const changePasswordResult = await changePassword(
                userId,
                currentPassword,
                newPassword
            );
            if (changePasswordResult === "Success") {
                showSuccessAlert("成功", "パスワードが更新されました");
                checkRegistration();
            } else {
                showErrorAlert("エラー", changePasswordResult);
            }
        } catch (error) {
            console.error("パスワードの更新に失敗しました:", error);
            showErrorAlert("エラー", "パスワードの更新に失敗しました");
        }
    };

    const handleDeleteUser = async () => {
        try {
            const confirmation = await showConfirmationAlert(
                "ユーザー削除",
                "本当にこのユーザーを削除してもよろしいですか？",
                "削除",
                "キャンセル"
            );
            if (!confirmation.isConfirmed) {
                return;
            }

            const deleteResult = await deleteUser(userId);
            if (deleteResult === "Success") {
                localStorage.removeItem("userId");
                localStorage.removeItem("selectedCsvId");
                localStorage.setItem("loginStatus", "ログアウト中");
                setApiKeyRegistered(null);
                setPasswordRegistered(null);
                setMailAddress(null);
                showSuccessAlert("成功", "ユーザーが削除されました。");
                window.location.href = "/login";
            } else {
                showErrorAlert("エラー", deleteResult);
            }
        } catch (error) {
            console.error("ユーザー削除に失敗しました:", error);
            showErrorAlert("エラー", "ユーザー削除に失敗しました");
        }
    };

    const renderStatus = (isRegistered: boolean | null) => {
        if (isRegistered === null) return "確認不可";
        return isRegistered ? "登録済み" : "未登録";
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "calc(100vh - 64px)",
                overflow: "hidden",
            }}
        >
            <Card sx={{ borderRadius: "25px", boxShadow: 3, width: "600px" }}>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        ユーザー情報
                    </Typography>
                    <Divider
                        sx={{
                            width: "80%",
                            mx: "auto",
                            mt: 2,
                            mb: 2,
                            borderWidth: "1.25px",
                        }}
                    />
                    {loading ? (
                        <Box display="flex" justifyContent="center" mt={2}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{
                                    width: "90%",
                                    p: 2,
                                    mb: 2,
                                    backgroundColor: "#F9F9F9",
                                    borderRadius: "50px",
                                }}
                            >
                                <Typography variant="h6">メールアドレス</Typography>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Box
                                        sx={{
                                            backgroundColor: "#EAEAEA",
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: "50px",
                                            mr: 1,
                                        }}
                                    >
                                        <Typography variant="body1">{mailAddress}</Typography>
                                    </Box>
                                    <IconButton onClick={handleUpdateMailAddress}>
                                        <RefreshIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{
                                    width: "90%",
                                    p: 2,
                                    mb: 2,
                                    backgroundColor: "#F9F9F9",
                                    borderRadius: "50px",
                                }}
                            >
                                <Typography variant="h6">パスワード</Typography>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Box
                                        sx={{
                                            backgroundColor: "#EAEAEA",
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: "50px",
                                            mr: 1,
                                        }}
                                    >
                                        <Typography variant="body1">
                                            {renderStatus(passwordRegistered)}
                                        </Typography>
                                    </Box>
                                    <IconButton onClick={handleUpdatePassword}>
                                        {passwordRegistered ? <RefreshIcon /> : <UploadIcon />}
                                    </IconButton>
                                </Box>
                            </Box>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{
                                    width: "90%",
                                    p: 2,
                                    mb: 2,
                                    backgroundColor: "#F9F9F9",
                                    borderRadius: "50px",
                                }}
                            >
                                <Typography variant="h6">GeminiApiKey</Typography>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Box
                                        sx={{
                                            backgroundColor: "#EAEAEA",
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: "50px",
                                            mr: 1,
                                        }}
                                    >
                                        <Typography variant="body1">
                                            {renderStatus(apiKeyRegistered)}
                                        </Typography>
                                    </Box>
                                    <IconButton onClick={handleUpdateApiKey}>
                                        {apiKeyRegistered ? <RefreshIcon /> : <UploadIcon />}
                                    </IconButton>
                                </Box>
                            </Box>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleDeleteUser}
                                sx={{ mt: 1, borderRadius: "50px", width: "90%" }}
                            >
                                ログアウト
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default UserInfo;
