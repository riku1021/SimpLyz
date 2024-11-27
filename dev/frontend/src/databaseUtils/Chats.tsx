import axios from "axios";

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
  type: string,
  vertical: string,
  horizontal: string,
  regression: string,
  dimension: string
): Promise<{ StatusMessage: string; chats: ChatDataType[] }> => {
  const requestData = {
    csv_id: csvId,
    type: type,
    vertical: vertical,
    horizontal: horizontal,
    regression: regression,
    dimension: dimension,
  };
  try {
    const response = await axios.post(
      "http://localhost:8080/chats/get/chat",
      requestData
    );
    console.log("Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("データ取得に失敗しました");
  }
};
