import { useState } from "react";
import axios from "axios";

// 型定義
export interface CsvDataType {
  csv_id: string;
  file_name: string;
  data_size: number;
  data_columns: number;
  data_rows: number;
  last_accessed_date: string;
}

// 共通エラーハンドリング
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response?.data) {
    console.error("Error:", error.response.data);
    return error.response.data.StatusMessage || "Unknown error occurred";
  }
  console.error("Unexpected Error:", error);
  return "Error occurred";
};

// CSVファイルの簡易情報取得API
export const fetchCsvSmallData = async (
  userId: string
): Promise<{ StatusMessage: string; CsvData: CsvDataType[] }> => {
  const requestData = { user_id: userId };
  try {
    const response = await axios.post(
      "http://localhost:8080/csvs/get",
      requestData
    );
    console.log("Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("データ取得に失敗しました");
  }
};

// 削除したCSVファイルの情報を取得するAPI
export const fetchDeletedCsvFiles = async (
  userId: string
): Promise<{ StatusMessage: string; DeleteFiles: CsvDataType[] }> => {
  const requestData = { user_id: userId };
  try {
    const response = await axios.post(
      "http://localhost:8080/csvs/get/deletefiles",
      requestData
    );
    console.log("Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("データ取得に失敗しました");
  }
};

// CSVファイル削除API
export const deleteCsvFile = async (csvId: string): Promise<string> => {
  const requestData = { csv_id: csvId };
  try {
    const response = await axios.post(
      "http://localhost:8080/csvs/delete",
      requestData
    );
    console.log("Success:", response.data);
    return response.data.StatusMessage;
  } catch (error) {
    return handleApiError(error);
  }
};

// CSVファイル復元API
export const restoreCsvFile = async (csvId: string): Promise<string> => {
  const requestData = { csv_id: csvId };
  try {
    const response = await axios.post(
      "http://localhost:8080/csvs/restoration",
      requestData
    );
    console.log("Success:", response.data);
    return response.data.StatusMessage;
  } catch (error) {
    return handleApiError(error);
  }
};

// CSVファイルを完全に削除するAPI
export const deleteCsvFilePermanently = async (csvId: string): Promise<string> => {
  const requestData = { csv_id: csvId };
  try {
    const response = await axios.post(
      "http://localhost:8080/csvs/delete/permanently",
      requestData
    );
    console.log("Success:", response.data);
    return response.data.StatusMessage;
  } catch (error) {
    return handleApiError(error);
  }
};

// フォームデータのハンドリングを共通化
export const useForm = <T extends object>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const resetForm = () => setFormData(initialState);

  return { formData, handleChange, resetForm };
};
