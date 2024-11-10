import { useState } from 'react';
import axios from 'axios';

function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            var r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

const Users = () => {
    // ユーザーを保存するAPI
    const [formData, setFormData] = useState({
        user_id: generateUUID(),
        mail_address: '',
        password: '',
    });
    const [saveDataSuccess, setSaveDataSuccess] = useState("");

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/users/create', formData);
            console.log('Success:', response.data);
            setSaveDataSuccess(response.data.StatusMessage);
            setFormData({ user_id: generateUUID(), mail_address: '', password: '' });
        } catch (err) {
            console.error('Error:', err.response.data);
            setSaveDataSuccess(err.response.data.StatusMessage);
        }
    };

    // ユーザーを認証するAPI
    const [loginData, setLoginData] = useState({
        mail_address: "",
        password: "",
    });
    const [loginUserId, setLoginUserId] = useState("");
    const [loginResult, setLoginResult] = useState("");

    const handleLoginDataChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/users/login', loginData);
            console.log('Success:', response.data);
            setLoginResult(response.data.StatusMessage);
            setLoginUserId(response.data.UserId);
            setLoginData({ mail_address: '', password: '' });
        } catch (err) {
            console.error('Error:', err.response.data);
            setLoginResult(err.response.data.StatusMessage);
        }
    }

    // パスワードを変更するAPI
    const [newPassword, setNewPassword] = useState({
        user_id: "",
        password: "",
        new_password: "",
    });
    const [newPasswordResult, setNewPasswordResult] = useState("");

    const handleNewPasswordDataChange = (e) => {
        setNewPassword({
            ...newPassword,
            [e.target.name]: e.target.value
        });
    }

    const handleNewPasswordSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/users/change/password', newPassword);
            console.log('Success:', response.data);
            setNewPasswordResult(response.data.StatusMessage);
            setNewPassword({
                user_id: "",
                password: "",
                new_password: "",
            });
        } catch (err) {
            console.error('Error:', err.response.data);
            setNewPasswordResult(err.response.data.StatusMessage);
        }
    }

    // GeminiApiKeyを保存するAPI
    const [geminiApiKey, setGeminiApiKey] = useState({
        user_id: "",
        gemini_api_key: "",
    });
    const [geminiApiKeyResult, setGeminiApiKeyResult] = useState("");

    const handleGeminiApiKeyDataChange = (e) => {
        setGeminiApiKey({
            ...geminiApiKey,
            [e.target.name]: e.target.value
        });
    }

    const handleGeminiApiKeySubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/users/save/api', geminiApiKey);
            console.log('Success:', response.data);
            setGeminiApiKeyResult(response.data.StatusMessage);
            setGeminiApiKey({
                user_id: "",
                gemini_api_key: "",
            });
        } catch (err) {
            console.error('Error:', err.response.data);
            setGeminiApiKeyResult(err.response.data.StatusMessage);
        }
    }

    // Passwordを認証するAPI
    const [checkPassword, setCheckPassword] = useState({
        user_id: "",
        password: "",
    });
    const [checkPasswordResult, setCheckPasswordResult] = useState("");

    const handleCheckPasswordDataChange = (e) => {
        setCheckPassword({
            ...checkPassword,
            [e.target.name]: e.target.value
        });
    }

    const handleCheckPasswordSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/users/check/password', checkPassword);
            console.log('Success:', response.data);
            setCheckPasswordResult(response.data.StatusMessage);
            setCheckPassword({
                user_id: "",
                password: "",
            });
        } catch (err) {
            console.error('Error:', err.response.data);
            setCheckPasswordResult(err.response.data.StatusMessage);
        }
    }

    // GeminiApiKeyを取得するAPI
    const [getApiKey, setGetApiKey] = useState({
        user_id: "",
    });
    const [getApiKeyResult, setGetApiKeyResult] = useState("");

    const handleGetApiKeyDataChange = (e) => {
        setGetApiKey({
            ...getApiKey,
            [e.target.name]: e.target.value
        });
    }

    const handleGetApiKeySubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/users/get/api', getApiKey);
            console.log('Success:', response.data);
            setGetApiKeyResult(response.data.StatusMessage);
            setGetApiKey({
                user_id: "",
            });
        } catch (err) {
            console.error('Error:', err.response.data);
            setGetApiKeyResult(err.response.data.StatusMessage);
        }
    }

    // ユーザーを削除するAPI
    const [deleteUser, setDeleteUser] = useState({
        user_id: "",
    });
    const [deleteUserResult, setDeleteUserResult] = useState("");

    const handleDeleteUserDataChange = (e) => {
        setDeleteUser({
            ...deleteUser,
            [e.target.name]: e.target.value
        });
    }

    const handleDeleteUserSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/users/delete', deleteUser);
            console.log('Success:', response.data);
            setDeleteUserResult(response.data.StatusMessage);
            setDeleteUser({
                user_id: "",
            });
        } catch (err) {
            console.error('Error:', err.response.data);
            setDeleteUserResult(err.response.data.StatusMessage);
        }
    }

    // データベース内のユーザー情報を確認するAPI
    const [checkUser, setCheckUser] = useState({
        mail_address: "",
    });
    const [checkUserResult, setCheckUserResult] = useState("");

    const handleCheckUserDataChange = (e) => {
        setCheckUser({
            ...checkUser,
            [e.target.name]: e.target.value
        });
    }

    const handleCheckUserSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/uesrs/check/user', checkUser);
            console.log('Success:', response.data);
            setCheckUserResult(response.data.StatusMessage);
            setCheckUser({
                mail_address: "",
            });
        } catch (err) {
            console.error('Error:', err.response.data);
            setCheckUserResult(err.response.data.StatusMessage);
        }
    }

    // 過去のユーザー情報を消し、新たにユーザーを登録するAPI
    const [reCreateUser, setReCreateUser] = useState({
        user_id: generateUUID(),
        mail_address: "",
        password: ""
    });
    const [reCreateUserResult, setReCreateUserResult] = useState("");

    const handleReCreateUserDataChange = (e) => {
        setReCreateUser({
            ...reCreateUser,
            [e.target.name]: e.target.value
        });
    }

    const handleReCreateUserSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/users/recreate', reCreateUser);
            console.log('Success:', response.data);
            setReCreateUserResult(response.data.StatusMessage);
            setReCreateUser({
                user_id: generateUUID(),
                mail_address: "",
                password: "",
            });
        } catch (err) {
            console.error('Error:', err.response.data);
            setReCreateUserResult(err.response.data.StatusMessage);
        }
    }

    // 過去のユーザー情報を復元するAPI
    const [restorationUser, setRestorationUser] = useState({
        mail_address: "",
        password: ""
    });
    const [restorationUserResult, setRestorationUserResult] = useState("");

    const handleRestorationUserDataChange = (e) => {
        setRestorationUser({
            ...restorationUser,
            [e.target.name]: e.target.value
        });
    }

    const handleRestorationUserSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/users/restoration', restorationUser);
            console.log('Success:', response.data);
            setRestorationUserResult(response.data.StatusMessage);
            setRestorationUser({
                mail_address: "",
                password: "",
            });
        } catch (err) {
            console.error('Error:', err.response.data);
            setRestorationUserResult(err.response.data.StatusMessage);
        }
    }

    return (
        <div>
            <h1>users</h1>
            <div>
                <h2>ユーザーを保存するAPI</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="mail_address"
                            value={formData.mail_address}
                            onChange={handleFormChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleFormChange}
                            required
                        />
                    </div>
                    <button type="submit">Register</button>
                    <div>
                        result: {saveDataSuccess}
                    </div>
                </form>
            </div>

            <div>
                <h2>ユーザーを認証するAPI</h2>
                <form onSubmit={handleLoginSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="mail_address"
                            value={loginData.mail_address}
                            onChange={handleLoginDataChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={loginData.password}
                            onChange={handleLoginDataChange}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                    <div>
                        result: {loginResult}
                    </div>
                    <div>
                        userId: {loginUserId}
                    </div>
                </form>
            </div>

            <div>
                <h2>Passwordを変更するAPI</h2>
                <form onSubmit={handleNewPasswordSubmit}>
                    <div>
                        <label>UserId:</label>
                        <input
                            type="text"
                            name="user_id"
                            value={newPassword.user_id}
                            onChange={handleNewPasswordDataChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={newPassword.password}
                            onChange={handleNewPasswordDataChange}
                            required
                        />
                    </div>
                    <div>
                        <label>NewPassword:</label>
                        <input
                            type="password"
                            name="new_password"
                            value={newPassword.newPassword}
                            onChange={handleNewPasswordDataChange}
                            required
                        />
                    </div>
                    <button type="submit">Change Password</button>
                    <div>
                        result: {newPasswordResult}
                    </div>
                </form>
            </div>

            <div>
                <h2>GeminiApiKeyを保存するAPI</h2>
                <form onSubmit={handleGeminiApiKeySubmit}>
                    <div>
                        <label>UserId:</label>
                        <input
                            type="text"
                            name="user_id"
                            value={geminiApiKey.user_id}
                            onChange={handleGeminiApiKeyDataChange}
                            required
                        />
                    </div>
                    <div>
                        <label>GeminiApiKey:</label>
                        <input
                            type="password"
                            name="gemini_api_key"
                            value={geminiApiKey.gemini_api_key}
                            onChange={handleGeminiApiKeyDataChange}
                            required
                        />
                    </div>
                    <button type="submit">Save APIKEY</button>
                    <div>
                        result: {geminiApiKeyResult}
                    </div>
                </form>
            </div>

            <div>
                <h2>Passwordを認証するAPI</h2>
                <form onSubmit={handleCheckPasswordSubmit}>
                    <div>
                        <label>UserId:</label>
                        <input
                            type="text"
                            name="user_id"
                            value={checkPassword.user_id}
                            onChange={handleCheckPasswordDataChange}
                            required
                        />
                    </div>
                    <div>
                        <label>password:</label>
                        <input
                            type="password"
                            name="password"
                            value={checkPassword.password}
                            onChange={handleCheckPasswordDataChange}
                            required
                        />
                    </div>
                    <button type="submit">Check Password</button>
                    <div>
                        result: {checkPasswordResult}
                    </div>
                </form>
            </div>

            <div>
                <h2>GeminiApiKeyを取得するAPI</h2>
                <form onSubmit={handleGetApiKeySubmit}>
                    <div>
                        <label>UserId:</label>
                        <input
                            type="text"
                            name="user_id"
                            value={getApiKey.user_id}
                            onChange={handleGetApiKeyDataChange}
                            required
                        />
                    </div>
                    <button type="submit">Get APIKEY</button>
                    <div>
                        result: {getApiKeyResult}
                    </div>
                </form>
            </div>

            <div>
                <h2>ユーザーを削除するAPI</h2>
                <form onSubmit={handleDeleteUserSubmit}>
                    <div>
                        <label>UserId:</label>
                        <input
                            type="text"
                            name="user_id"
                            value={deleteUser.user_id}
                            onChange={handleDeleteUserDataChange}
                            required
                        />
                    </div>
                    <button type="submit">Delete User</button>
                    <div>
                        result: {deleteUserResult}
                    </div>
                </form>
            </div>

            <div>
                <h2>データベース内のユーザー情報を確認するAPI</h2>
                <form onSubmit={handleCheckUserSubmit}>
                    <div>
                        <label>MailAddress:</label>
                        <input
                            type="text"
                            name="mail_address"
                            value={checkUser.mail_address}
                            onChange={handleCheckUserDataChange}
                            required
                        />
                    </div>
                    <button type="submit">Check User</button>
                    <div>
                        result: {checkUserResult}
                    </div>
                </form>
            </div>

            <div>
                <h2>過去のユーザー情報を消し、新たにユーザーを登録するAPI</h2>
                <form onSubmit={handleReCreateUserSubmit}>
                    <div>
                        <label>MailAddress:</label>
                        <input
                            type="text"
                            name="mail_address"
                            value={reCreateUser.mail_address}
                            onChange={handleReCreateUserDataChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={reCreateUser.password}
                            onChange={handleReCreateUserDataChange}
                            required
                        />
                    </div>
                    <button type="submit">ReMake User</button>
                    <div>
                        result: {reCreateUserResult}
                    </div>
                </form>
            </div>

            <div>
                <h2>過去のユーザー情報を消し、新たにユーザーを登録するAPI</h2>
                <form onSubmit={handleReCreateUserSubmit}>
                    <div>
                        <label>MailAddress:</label>
                        <input
                            type="text"
                            name="mail_address"
                            value={reCreateUser.mail_address}
                            onChange={handleReCreateUserDataChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={reCreateUser.password}
                            onChange={handleReCreateUserDataChange}
                            required
                        />
                    </div>
                    <button type="submit">ReMake User</button>
                    <div>
                        result: {reCreateUserResult}
                    </div>
                </form>
            </div>

            <div>
                <h2>過去のユーザー情報を復元するapi</h2>
                <form onSubmit={handleRestorationUserSubmit}>
                    <div>
                        <label>MailAddress:</label>
                        <input
                            type="text"
                            name="mail_address"
                            value={restorationUser.mail_address}
                            onChange={handleRestorationUserDataChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={restorationUser.password}
                            onChange={handleRestorationUserDataChange}
                            required
                        />
                    </div>
                    <button type="submit">restoration User</button>
                    <div>
                        result: {restorationUserResult}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Users
