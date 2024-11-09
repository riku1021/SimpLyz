import React, { useState } from 'react';
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
        </div>
    )
}

export default Users
