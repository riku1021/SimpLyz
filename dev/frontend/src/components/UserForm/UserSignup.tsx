import React from 'react';
import CommonUserForm from './CommonUserForm';
import { createUser, checkUser, recreateUser, restoreUser } from '../../databaseUtils/Users';
import { showSuccessAlert, showErrorAlert, showConfirmationAlert } from '../../utils/alertUtils';
import { generateUUID } from '../../utils/generateUuid';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const UserSignup: React.FC = () => {
    useAuth();
    const navigate = useNavigate();

    const handleSignup = async (mail: string, password: string) => {
        try {
            // ユーザーの状態を確認
            const { case: userCase, message } = await checkUser(mail);

            if (userCase === 'possible') {
                // 新規登録
                const userId = generateUUID();
                const statusMessage = await createUser(userId, mail, password);
                showSuccessAlert(statusMessage || '新規登録が成功しました', '');
                localStorage.setItem('loginStatus', 'ログイン中');
                localStorage.setItem('userId', userId);
                navigate('/management-file');
            } else if (userCase === 'impossible') {
                // ログインを促す
                showErrorAlert('登録できません', 'すでに登録済みのメールアドレスです。ログインしてください。');
                navigate('/login');
            } else if (userCase === 'restoration') {
                // 選択肢を提示
                const userChoice = await showConfirmationAlert(
                    '選択してください',
                    '過去のユーザー情報を消して新たに登録する場合は「再登録」を、復元する場合は「復元」を選択してください。',
                    '再登録',
                    '復元'
                );

                if (userChoice) {
                    // 再登録
                    const statusMessage = await recreateUser(mail, password);
                    showSuccessAlert(statusMessage || '再登録が成功しました', '');
                    localStorage.setItem('loginStatus', 'ログイン中');
                    navigate('/management-file');
                } else {
                    // 復元
                    const statusMessage = await restoreUser(mail, password);
                    showSuccessAlert(statusMessage || '復元が成功しました', '');
                    localStorage.setItem('loginStatus', 'ログイン中');
                    navigate('/management-file');
                }
            } else {
                showErrorAlert('エラー', message || '不明なエラーが発生しました。');
            }
        } catch (err: any) {
            showErrorAlert('エラーが発生しました', err.message || '詳細不明のエラーです');
        }
    };

    const redirectToLogin = () => {
        navigate('/login');
    };

    return (
        <CommonUserForm
            title="新規登録"
            buttonText="新規登録"
            redirectText="ログインはこちら"
            onRedirect={redirectToLogin}
            onSubmit={handleSignup}
        />
    );
};

export default UserSignup;
