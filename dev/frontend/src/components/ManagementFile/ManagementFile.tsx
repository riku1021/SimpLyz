import React, { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { fetchCsvSmallData, fetchDeletedCsvFiles, CsvDataType } from "../../databaseUtils/Csvs";
import FileUpload from "./FileUpload";
import FileList from "./FileList";
import useAuth from "../../hooks/useAuth";

const ManagementFile: React.FC = () => {
  const { userId } = useAuth();
  const [activeCsvList, setActiveCsvList] = useState<CsvDataType[]>([]);
  const [deleteCsvList, setDeleteCsvList] = useState<CsvDataType[]>([]);
  const [loadingCsvList, setLoadingCsvList] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchCsvList = async () => {
    setLoadingCsvList(true);
    try {
      if (userId) {
        const activeCsvResponse = await fetchCsvSmallData(userId);
        const deleteCsvResponse = await fetchDeletedCsvFiles(userId);
        console.log(`DeleteData: ${activeCsvResponse.CsvData}`);
        setActiveCsvList(activeCsvResponse.CsvData || []);
        setDeleteCsvList(deleteCsvResponse.DeleteFiles || []);
      }
    } catch (error) {
      console.error("CSV一覧の取得に失敗しました", error);
    } finally {
      setLoadingCsvList(false);
    }
  };

  useEffect(() => {
    fetchCsvList();
  }, []);

  return (
    <Box>
      <FileUpload fileInputRef={fileInputRef} fetchCsvList={fetchCsvList} />
      <FileList
        activeCsvList={activeCsvList}
        deleteCsvList={deleteCsvList}
        loadingCsvList={loadingCsvList}
        fetchCsvList={fetchCsvList}
      />
    </Box>
  );
};

export default ManagementFile;
