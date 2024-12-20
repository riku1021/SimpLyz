import axios from "axios";
import { DATABASE_URL } from "../urlConfig"

// 型定義
export interface ChatDataType {
  chat_id: string;
  room_id: string;
  message: string;
  user_chat: boolean;
  post_id: number;
}

// チャットを取得するAPI
export const fetchGetChats = async (
  csvId: string,
  visualization_type: string,
  vertical: string,
  horizontal: string,
  target: string,
  regression: string,
  dimension: string
): Promise<{ StatusMessage: string; chats: ChatDataType[] }> => {
  const requestData = {
    csv_id: csvId,
    visualization_type: visualization_type,
    vertical: vertical,
    horizontal: horizontal,
    target: target,
    regression: regression,
    dimension: dimension,
  };
  try {
    const response = await axios.post(
      `${DATABASE_URL}chats/get/chat`,
      requestData
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("データ取得に失敗しました");
  }
};

// roomテーブルにroom_idを保存するAPI
export const createRoomId = async (
  roomId: string,
  csvId: string,
  visualization_type: string,
  vertical: string,
  horizontal: string,
  target: string,
  regression: string,
  dimension: string
): Promise<{ StatusMessage: string }> => {
  const requestData = {
    room_id: roomId,
    csv_id: csvId,
    visualization_type: visualization_type,
    vertical: vertical,
    horizontal: horizontal,
    target: target,
    regression: regression,
    dimension: dimension,
  };
  try {
    const response = await axios.post(
      `${DATABASE_URL}chats/save/room_id`,
      requestData
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("データ取得に失敗しました");
  }
};

// chatをリセットするAPI
export const resetChat = async (
  roomId: string
): Promise<{ StatusMessage: string }> => {
  const requestData = {
    room_id: roomId,
  };
  try {
    const response = await axios.post(
      `${DATABASE_URL}chats/reset/chat`,
      requestData
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("チャットをリセットできませんでした");
  }
};
