import axios from "axios";
import { generateUUID } from "../utils/generateUuid";

// 成功時レスポンス型
interface SuccessResponse {
  StatusMessage: "Success";
  UserId?: string;
  GeminiApiKey?: string;
  case?: string;
}

// 失敗時レスポンス型
interface ErrorResponse {
  StatusMessage: "Failed";
  message: string;
}

// 共通レスポンス型
type ApiResponse = SuccessResponse | ErrorResponse;

// 共通エラーハンドリング
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response?.data) {
    const errorData = error.response.data as ErrorResponse;
    console.error("Error:", errorData);
    return (
      errorData.message || errorData.StatusMessage || "Unknown error occurred"
    );
  }
  console.error("Unexpected Error:", error);
  return "Error occurred";
};

// データベース内のユーザー情報を確認するAPI
export const checkUser = async (
  mailAddress: string
): Promise<{ case: string | undefined; message: string }> => {
  const requestData = { mail_address: mailAddress };
  try {
    const response = await axios.post<ApiResponse>(
      "http://localhost:8080/users/check/user",
      requestData
    );
    if (response.data.StatusMessage === "Success") {
      return { case: response.data.case, message: response.data.StatusMessage };
    } else {
      return { case: undefined, message: response.data.message };
    }
  } catch (error) {
    return { case: undefined, message: handleApiError(error) };
  }
};

// ユーザーを保存するAPI
export const createUser = async (
  userId: string,
  mailAddress: string,
  password: string
): Promise<string> => {
  const requestData = {
    user_id: userId,
    mail_address: mailAddress,
    password: password,
  };
  try {
    const response = await axios.post<ApiResponse>(
      "http://localhost:8080/users/create",
      requestData
    );
    if (response.data.StatusMessage === "Success") {
      return response.data.StatusMessage;
    } else {
      return response.data.message;
    }
  } catch (error) {
    return handleApiError(error);
  }
};

// 過去のユーザー情報を消し、新たにユーザーを登録するAPI
export const recreateUser = async (
  mailAddress: string,
  password: string
): Promise<string> => {
  const requestData = {
    user_id: generateUUID(),
    mail_address: mailAddress,
    password: password,
  };
  try {
    const response = await axios.post<ApiResponse>(
      "http://localhost:8080/users/recreate",
      requestData
    );
    if (response.data.StatusMessage === "Success") {
      return response.data.StatusMessage;
    } else {
      return response.data.message;
    }
  } catch (error) {
    return handleApiError(error);
  }
};

// 過去のユーザー情報を復元するAPI
export const restoreUser = async (
  mailAddress: string,
  password: string
): Promise<string> => {
  const requestData = { mail_address: mailAddress, password: password };
  try {
    const response = await axios.post<ApiResponse>(
      "http://localhost:8080/users/restoration",
      requestData
    );
    if (response.data.StatusMessage === "Success") {
      return response.data.StatusMessage;
    } else {
      return response.data.message;
    }
  } catch (error) {
    return handleApiError(error);
  }
};

// ユーザーを認証するAPI
export const loginUser = async (
  mailAddress: string,
  password: string
): Promise<{ userId: string | undefined; message: string }> => {
  const requestData = { mail_address: mailAddress, password: password };
  try {
    const response = await axios.post<ApiResponse>(
      "http://localhost:8080/users/login",
      requestData
    );
    if (response.data.StatusMessage === "Success") {
      return {
        userId: response.data.UserId || undefined,
        message: response.data.StatusMessage,
      };
    } else {
      return { userId: undefined, message: response.data.message };
    }
  } catch (error) {
    return { userId: undefined, message: handleApiError(error) };
  }
};

// ユーザーを削除するAPI
export const deleteUser = async (userId: string): Promise<string> => {
  const requestData = { user_id: userId };
  try {
    const response = await axios.post<ApiResponse>(
      "http://localhost:8080/users/delete",
      requestData
    );
    if (response.data.StatusMessage === "Success") {
      return response.data.StatusMessage;
    } else {
      return response.data.message;
    }
  } catch (error) {
    return handleApiError(error);
  }
};

// パスワードを変更するAPI
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<string> => {
  const requestData = {
    user_id: userId,
    password: currentPassword,
    new_password: newPassword,
  };
  try {
    const response = await axios.post<ApiResponse>(
      "http://localhost:8080/users/change/password",
      requestData
    );
    if (response.data.StatusMessage === "Success") {
      return response.data.StatusMessage;
    } else {
      return response.data.message;
    }
  } catch (error) {
    return handleApiError(error);
  }
};

// Gemini APIキーを保存するAPI
export const saveGeminiApiKey = async (
  userId: string,
  geminiApiKey: string
): Promise<string> => {
  const requestData = { user_id: userId, gemini_api_key: geminiApiKey };
  try {
    const response = await axios.post<ApiResponse>(
      "http://localhost:8080/users/save/api",
      requestData
    );
    if (response.data.StatusMessage === "Success") {
      return response.data.StatusMessage;
    } else {
      return response.data.message;
    }
  } catch (error) {
    return handleApiError(error);
  }
};

// Gemini APIキーを取得するAPI
export const getGeminiApiKey = async (
  userId: string
): Promise<{ geminiApiKey: string | undefined; message: string }> => {
  const requestData = { user_id: userId };
  try {
    const response = await axios.post<ApiResponse>(
      "http://localhost:8080/users/get/api",
      requestData
    );
    if (response.data.StatusMessage === "Success") {
      return {
        geminiApiKey: response.data.GeminiApiKey,
        message: response.data.StatusMessage,
      };
    } else {
      return { geminiApiKey: undefined, message: response.data.message };
    }
  } catch (error) {
    return { geminiApiKey: undefined, message: handleApiError(error) };
  }
};

// パスワードを認証するAPI
export const checkPassword = async (
  userId: string,
  password: string
): Promise<string> => {
  const requestData = { user_id: userId, password: password };
  try {
    const response = await axios.post<ApiResponse>(
      "http://localhost:8080/users/check/password",
      requestData
    );
    if (response.data.StatusMessage === "Success") {
      return response.data.StatusMessage;
    } else {
      return response.data.message;
    }
  } catch (error) {
    return handleApiError(error);
  }
};
