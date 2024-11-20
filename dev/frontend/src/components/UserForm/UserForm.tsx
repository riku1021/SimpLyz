import React, { useState, FormEvent } from "react";
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
  Link,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { showErrorAlert, showSuccessAlert } from "../../utils/alertUtils";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../../utils/validation";
import { createUser, loginUser } from "../../databaseUtils/Users";
import { generateUUID } from "../../utils/generateUuid";

interface FormData {
  mail_address: string;
  password: string;
}

const UserForm: React.FC = () => {
  useAuth();
  const [formData, setFormData] = useState<FormData>({
    mail_address: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isRegist, setIsRegist] = useState<boolean>(true);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let valid = true;
    if (!validateEmail(formData.mail_address)) {
      setEmailError("有効なメールアドレスを入力してください");
      valid = false;
    }
    if (!validatePassword(formData.password)) {
      setPasswordError(
        "アルファベットと数字を含む4文字以上のパスワードを入力してください"
      );
      valid = false;
    }
    if (valid) {
      try {
        let userId: string | undefined;
        if (isRegist) {
          userId = generateUUID();
          const statusMessage = await createUser(
            userId,
            formData.mail_address,
            formData.password
          );
          showSuccessAlert(statusMessage || "新規登録が成功しました", "");
        } else {
          const loginResult = await loginUser(
            formData.mail_address,
            formData.password
          );
          userId = loginResult.userId;
          showSuccessAlert(loginResult.message || "ログインが成功しました", "");
        }
        if (userId) {
          localStorage.setItem("loginStatus", "ログイン中");
          localStorage.setItem("userId", userId);
          setFormData({ mail_address: "", password: "" });
          navigate("/management-file");
        } else {
          showErrorAlert(
            "エラーが発生しました",
            "ユーザーIDが取得できませんでした"
          );
        }
      } catch (err: any) {
        console.error("Error:", err);
        showErrorAlert(
          "エラーが発生しました",
          err.message || "詳細不明のエラーです"
        );
      }
    } else {
      showErrorAlert("入力エラー", "入力エラーがあります。確認してください。");
    }
  };

  const handleSignupRedirect = () => {
    setIsRegist(!isRegist);
    setEmailError("");
    setPasswordError("");
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
            {isRegist ? "新規登録" : "ログイン"}
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
          <Box display="flex" flexDirection="column" alignItems="center">
            <TextField
              label="メールアドレス"
              variant="outlined"
              fullWidth
              name="mail_address"
              value={formData.mail_address}
              onChange={(e) => {
                handleInputChange(e);
                setEmailError("");
              }}
              onBlur={() => {
                if (!validateEmail(formData.mail_address)) {
                  setEmailError("有効なメールアドレスを入力してください");
                }
              }}
              error={Boolean(emailError)}
              helperText={emailError || " "}
              sx={{
                width: "90%",
                m: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                },
              }}
              required
            />
            <TextField
              label="パスワード"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              name="password"
              value={formData.password}
              onChange={(e) => {
                handleInputChange(e);
                setPasswordError("");
              }}
              onBlur={() => {
                if (!validatePassword(formData.password)) {
                  setPasswordError(
                    "アルファベットと数字を含む4文字以上のパスワードを入力してください"
                  );
                }
              }}
              error={Boolean(passwordError)}
              helperText={passwordError || " "}
              sx={{
                width: "90%",
                m: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
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
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
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
              sx={{ width: "90%", borderRadius: "50px" }}
            >
              {isRegist ? "新規登録" : "ログイン"}
            </Button>
          </Box>
          <Box mt={2} textAlign="right">
            <Link
              onClick={handleSignupRedirect}
              underline="none"
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer" }}
            >
              {isRegist ? "ログインはこちら" : "新規登録はこちら"}
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserForm;
