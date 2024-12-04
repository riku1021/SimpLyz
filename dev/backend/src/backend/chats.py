import uuid
from typing import Dict

import requests
from flask import jsonify

GO_API_URL = "http://localhost:8080"


def save_chat(
    room_id: str, user_chat: bool, message: str, post_id: int
) -> Dict[str, str]:
    """chatをdatabaseに保存する関数

    Args:
        room_id (str): room_id
        user_chat (bool): チャットがユーザーの物かどうか
        message (str): チャット内容
        post_id (_type_): チャットの順番

    Returns:
        Dict[str, str]: ステータメッセージ
    """

    chat_id = str(uuid.uuid4())
    json_data = {
        "chat_id": chat_id,
        "room_id": room_id,
        "message": message,
        "post_id": post_id,
        "user_chat": user_chat,
    }
    try:
        # chatを保存
        proxies = {"http": None, "https": None}  # 大学で行うときはここを有効に
        response = requests.post(
            f"{GO_API_URL}/chats/save/chat", json=json_data, proxies=proxies
        )

        print("Response Status Code:", response.status_code)
        if response.status_code == 200:
            return (
                jsonify({"message": "chat uploaded successfully"}),
                200,
            )
        else:
            return (
                jsonify({"message": "chat uploaded failed"}),
                500,
            )
    except Exception as e:
        print("error:", str(e))
        return jsonify({"error": "Failed to upload data to Go API"}), 500
