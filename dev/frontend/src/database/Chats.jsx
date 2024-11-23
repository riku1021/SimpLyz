import React, { useState } from 'react'
import axios from 'axios';

const Chats = () => {
    // roomテーブルにroom_idを保存するAPI
    const [saveRoomId, setSaveRoomId] = useState({
        room_id: "test_id",
        csv_id: "30db5adb-8cca-4dcd-bc37-d43cddc9d25b",
        visualization_type: 'scatter',
        vertical: "test",
        horizontal: "",
        target: "",
        regression: "",
    });
    const [saveRoomIdResult, setSaveRoomIdResult] = useState("");

    const handleClickSaveRoomId = async () => {
        try {
            const response = await axios.post('http://localhost:8080/chats/save/room_id', saveRoomId);
            console.log('Success:', response.data);
            setSaveRoomIdResult(response.data.StatusMessage);
        } catch (err) {
            console.error('Error:', err.response.data);
            setSaveRoomIdResult(err.response.data.StatusMessage);
        }
    };

    // chatを保存するAPI
    const [saveChat, setSaveChat] = useState({
        room_id: "test_id",
        chat_id: "test_id2",
        user_chat: false,
        message: "test2あああ",
        post_id: 1,
    });
    const [saveChatResult, setSaveChatResult] = useState("");

    const handleClickSaveChat = async () => {
        try {
            const response = await axios.post('http://localhost:8080/chats/save/chat', saveChat);
            console.log('Success:', response.data);
            setSaveChatResult(response.data.StatusMessage);
        } catch (err) {
            console.error('Error:', err.response.data);
            setSaveChatResult(err.response.data.StatusMessage);
        }
    };

    // chatを取得するAPI
    const [getChats, setGetChats] = useState({
        csv_id: "30db5adb-8cca-4dcd-bc37-d43cddc9d25b",
        visualization_type: 'scatter',
        vertical: "test",
        horizontal: "",
        target: "",
        regression: "",
    });
    const [getChatsResult, setGetChatsResult] = useState("");

    const handleClickGetChats = async () => {
        try {
            const response = await axios.post('http://localhost:8080/chats/get/chat', getChats);
            console.log('Success:', response.data);
            setGetChatsResult(response.data.StatusMessage);
        } catch (err) {
            console.error('Error:', err.response.data);
            setGetChatsResult(err.response.data.StatusMessage);
        }
    };

    // chatをリセットするAPI
    const [resetChat, setResetChat] = useState({
        room_id: "test_id",
    });
    const [resetChatResult, setResetChatResult] = useState("");

    const handleClickResetChat = async () => {
        try {
            const response = await axios.post('http://localhost:8080/chats/reset/chat', resetChat);
            console.log('Success:', response.data);
            setResetChatResult(response.data.StatusMessage);
        } catch (err) {
            console.error('Error:', err.response.data);
            setResetChatResult(err.response.data.StatusMessage);
        }
    };

    return (
    <div>
        <h1>chats</h1>
        <div>
            <h2>roomテーブルにroom_idを保存するAPI</h2>
            <button onClick={handleClickSaveRoomId}>save room id</button>
            <div>
                result: {saveRoomIdResult}
            </div>
        </div>

        <div>
            <h2>chatを保存するAPI</h2>
            <button onClick={handleClickSaveChat}>save chat</button>
            <div>
                result: {saveChatResult}
            </div>
        </div>

        <div>
            <h2>chatを取得するAPI</h2>
            <button onClick={handleClickGetChats}>get chat</button>
            <div>
                result: {getChatsResult}
            </div>
        </div>

        <div>
            <h2>chatをリセットするAPI</h2>
            <button onClick={handleClickResetChat}>get chat</button>
            <div>
                result: {resetChatResult}
            </div>
        </div>
    </div>
  )
}

export default Chats
