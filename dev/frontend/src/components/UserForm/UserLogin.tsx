import React from 'react';
import CommonUserForm from './CommonUserForm';
import { loginUser } from '../../databaseUtils/Users';
import { useNavigate } from 'react-router-dom';
import { showSuccessAlert, showErrorAlert } from '../../utils/alertUtils';
import useAuth from '../../hooks/useAuth';

const UserLogin: React.FC = () => {
    useAuth();
    const navigate = useNavigate();

    const handleLogin = async (mail: string, password: string) => {
        try {
            const result = await loginUser(mail, password);
            if (result.userId) {
                localStorage.setItem('loginStatus', 'ログイン中');
                localStorage.setItem('userId', result.userId);
                showSuccessAlert('ログインが成功しました', '');
                navigate('/management-file');
            } else {
                showErrorAlert('ログインに失敗しました', '');
            }
        } catch (err: any) {
            showErrorAlert('ログインに失敗しました', err.message || '詳細不明のエラーです');
        }
    };

    const redirectToSignup = () => {
        navigate('/signup');
    };

    return (
        <CommonUserForm
            title="ログイン"
            buttonText="ログイン"
            redirectText="新規登録はこちら"
            onRedirect={redirectToSignup}
            onSubmit={handleLogin}
        />
    );
};

export default UserLogin;
