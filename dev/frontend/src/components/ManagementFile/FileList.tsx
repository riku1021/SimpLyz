import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import {
  showConfirmationAlert,
  showSuccessAlert,
  showErrorAlert,
} from "../../utils/alertUtils";
import { deleteCsvFile, CsvDataType } from "../../databaseUtils/Csvs";

interface FileListProps {
  csvList: CsvDataType[];
  loadingCsvList: boolean;
  fetchCsvList: () => Promise<void>;
}

const FileList: React.FC<FileListProps> = ({
  csvList,
  loadingCsvList,
  fetchCsvList,
}) => {
  const [selectedCsvId, setSelectedCsvId] = useState<string | null>(() => {
    return localStorage.getItem("selectedCsvId");
  });

  const handleSelect = (csvId: string) => {
    setSelectedCsvId(csvId);
    localStorage.setItem("selectedCsvId", csvId);
  };

  const handleDelete = (csvId: string) => {
    showConfirmationAlert(
      "削除確認",
      "このCSVファイルを削除しますか？",
      "はい",
      "いいえ"
    ).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const message = await deleteCsvFile(csvId);
          showSuccessAlert("削除成功", message);
          fetchCsvList();
          if (selectedCsvId === csvId) {
            setSelectedCsvId(null);
            localStorage.removeItem("selectedCsvId");
          }
        } catch (error) {
          console.error(error);
          showErrorAlert("削除失敗", "CSVファイルの削除に失敗しました。");
        }
      }
    });
  };

  const formatDataSize = (size: number): string => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    for (let i = 0; i < units.length; i++) {
      if (size < 1024 || i === units.length - 1) {
        return `${size.toFixed(1)} ${units[i]}`;
      }
      size /= 1024;
    }
    return `${size.toFixed(1)} B`;
  };

  return (
    <Card sx={{ p: 1, m: 5, borderRadius: "25px" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          ファイル一覧
        </Typography>
        {loadingCsvList ? (
          <Typography>データを読み込んでいます...</Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 800, borderRadius: "25px" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", fontSize: "18px" }}
                  >
                    ファイル名
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", fontSize: "18px" }}
                  >
                    データサイズ
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", fontSize: "18px" }}
                  >
                    列数
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", fontSize: "18px" }}
                  >
                    行数
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", fontSize: "18px" }}
                  >
                    最終更新日
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: "bold", fontSize: "18px" }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {csvList.length > 0 ? (
                  csvList.map((csv, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        <Button
                          variant={
                            selectedCsvId === csv.csv_id
                              ? "contained"
                              : "outlined"
                          }
                          onClick={() => handleSelect(csv.csv_id)}
                          sx={{ borderRadius: "10px", fontWeight: "bold" }}
                        >
                          {csv.file_name.replace(/\.csv$/, "")}
                        </Button>
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "18px" }}>
                        {formatDataSize(csv.data_size)}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "18px" }}>
                        {csv.data_columns}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "18px" }}>
                        {csv.data_rows}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "18px" }}>
                        {new Date(csv.last_accessed_date).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDelete(csv.csv_id)}>
                          <DeleteIcon sx={{ fontSize: "30px" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ fontSize: "20px" }}
                    >
                      CSVファイルはアップロードされていません。
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default FileList;
