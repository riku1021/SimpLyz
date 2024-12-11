import axios from "axios";
import { generateUUID } from "../utils/generateUuid";
import { DATABASE_URL } from "../urlConfig"

// 成功時レスポンス型
interface SuccessResponse {
  StatusMessage: "Success";
  UserId?: string;
  GeminiApiKey?: string;
  MailAddress?: string;
  geminiApiKeyExists?: boolean;
  passwordExists?: boolean;
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
      `${DATABASE_URL}users/check/user`,
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
      `${DATABASE_URL}users/create`,
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
      `${DATABASE_URL}users/recreate`,
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
): Promise<{ userId: string | undefined; message: string }> => {
  const requestData = { mail_address: mailAddress, password: password };
  try {
    const response = await axios.post<ApiResponse>(
      `${DATABASE_URL}users/restoration`,
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

// ユーザーを認証するAPI
export const loginUser = async (
  mailAddress: string,
  password: string
): Promise<{ userId: string | undefined; message: string }> => {
  const requestData = { mail_address: mailAddress, password: password };
  try {
    const response = await axios.post<ApiResponse>(
      `${DATABASE_URL}users/login`,
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
export const deleteUser = async (userId: string | null): Promise<string> => {
  const requestData = { user_id: userId };
  try {
    const response = await axios.post<ApiResponse>(
      `${DATABASE_URL}users/delete`,
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

// MailAddressを取得するAPI
export const getMailAddress = async (
  userId: string | null
): Promise<{ mailAddress: string | undefined; message: string }> => {
  const requestData = { user_id: userId };
  try {
    const response = await axios.post<ApiResponse>(
      `${DATABASE_URL}users/get/mailaddress`,
      requestData
    );
    if (response.data.StatusMessage === "Success") {
      return {
        mailAddress: response.data.MailAddress,
        message: response.data.StatusMessage,
      };
    } else {
      return { mailAddress: undefined, message: response.data.message };
    }
  } catch (error) {
    return { mailAddress: undefined, message: handleApiError(error) };
  }
};

// メールアドレスを保存するAPI
export const saveMailAddress = async (
  userId: string | null,
  mailAddress: string
): Promise<string> => {
  const requestData = { user_id: userId, mail_address: mailAddress };
  try {
    const response = await axios.post<ApiResponse>(
      `${DATABASE_URL}users/save/mailaddress`,
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
  userId: string | null,
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
      `${DATABASE_URL}users/change/password`,
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

// Gemini APIキーの存在確認API
export const verifyGeminiApiKey = async (
  userId: string | null
): Promise<{ geminiApiKeyExists: boolean | undefined; message: string }> => {
  const requestData = { user_id: userId };
  try {
    const response = await axios.post<ApiResponse>(
      `${DATABASE_URL}users/verify/api`,
      requestData
    );
    if (response.data.StatusMessage === "Success") {
      return { geminiApiKeyExists: response.data.geminiApiKeyExists, message: response.data.StatusMessage };
    } else {
      return { geminiApiKeyExists: undefined, message: response.data.message };
    }
  } catch (error) {
    return { geminiApiKeyExists: undefined, message: handleApiError(error) };
  }
};

// パスワードの存在確認API
export const verifyPassword = async (
  userId: string | null
): Promise<{ passwordExists: boolean | undefined; message: string }> => {
  const requestData = { user_id: userId };
  try {
    const response = await axios.post<ApiResponse>(
      `${DATABASE_URL}users/verify/password`,
      requestData
    );
    if (response.data.StatusMessage === "Success") {
      return { passwordExists: response.data.passwordExists, message: response.data.StatusMessage };
    } else {
      return { passwordExists: undefined, message: response.data.message };
    }
  } catch (error) {
    return { passwordExists: undefined, message: handleApiError(error) };
  }
};

// Gemini APIキーを保存するAPI
export const saveGeminiApiKey = async (
  userId: string | null,
  geminiApiKey: string
): Promise<string> => {
  const requestData = { user_id: userId, gemini_api_key: geminiApiKey };
  try {
    const response = await axios.post<ApiResponse>(
      `${DATABASE_URL}users/save/api`,
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
      `${DATABASE_URL}users/get/api`,
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
  userId: string | null,
  password: string
): Promise<string> => {
  const requestData = { user_id: userId, password: password };
  try {
    const response = await axios.post<ApiResponse>(
      `${DATABASE_URL}users/check/password`,
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
