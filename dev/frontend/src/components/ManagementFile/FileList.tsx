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
  Box,
} from "@mui/material";
import {
  DeleteOutline as DeleteIcon,
  InsertDriveFile as InsertDriveFileIcon,
  RestorePage as RestorePageIcon,
} from "@mui/icons-material";
import {
  showConfirmationAlert,
  showSuccessAlert,
  showErrorAlert,
} from "../../utils/alertUtils";
import {
  deleteCsvFile,
  deleteCsvFilePermanently,
  restoreCsvFile,
  CsvDataType,
} from "../../databaseUtils/Csvs";

interface FileListProps {
  activeCsvList: CsvDataType[];
  deleteCsvList: CsvDataType[];
  loadingCsvList: boolean;
  fetchCsvList: () => Promise<void>;
}

const FileList: React.FC<FileListProps> = ({
  activeCsvList,
  deleteCsvList,
  loadingCsvList,
  fetchCsvList,
}) => {
  const [selectedCsvId, setSelectedCsvId] = useState<string | null>(() => {
    return localStorage.getItem("selectedCsvId");
  });
  const [isTrashMode, setIsTrashMode] = useState(false);

  const handleSelect = (csvId: string) => {
    setSelectedCsvId(csvId);
    localStorage.setItem("selectedCsvId", csvId);
  };

  const handleDelete = (csvId: string) => {
    let trashTitle;
    if (!isTrashMode) {
      trashTitle = "このCSVファイルを削除しますか？";
    } else {
      trashTitle = "このCSVファイルを完全に削除しますか？";
    }
    showConfirmationAlert("削除確認", trashTitle, "はい", "いいえ").then(
      async (result) => {
        if (result.isConfirmed) {
          try {
            if (!isTrashMode) {
              const message = await deleteCsvFile(csvId);
              showSuccessAlert("削除成功", message);
            } else {
              const message = await deleteCsvFilePermanently(csvId);
              showSuccessAlert("完全削除成功", message);
            }
            fetchCsvList();
            if (selectedCsvId === csvId) {
              setSelectedCsvId(null);
              localStorage.removeItem("selectedCsvId");
            }
          } catch (error) {
            showErrorAlert("削除失敗", "CSVファイルの削除に失敗しました。");
            console.log(error);
          }
        }
      }
    );
  };

  const handleRestore = async (
    csvId: string,
    fileName: string,
    fetchCsvList: () => Promise<void>
  ) => {
    showConfirmationAlert(
      "復元確認",
      `このCSVファイル「${fileName}」を復元しますか？`,
      "はい",
      "いいえ"
    ).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const message = await restoreCsvFile(csvId);
          showSuccessAlert("復元成功", message);
          fetchCsvList();
        } catch (error) {
          showErrorAlert("復元失敗", "CSVファイルの復元に失敗しました。");
          console.error(error);
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

  const displayList = isTrashMode ? deleteCsvList : activeCsvList;
  const title = isTrashMode ? "ゴミ箱一覧" : "ファイル一覧";

  return (
    <Card sx={{ p: 1, m: 5, borderRadius: "25px" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
          <Button
            variant="contained"
            startIcon={isTrashMode ? <InsertDriveFileIcon /> : <DeleteIcon />}
            color={isTrashMode ? "primary" : "error"}
            sx={{
              borderRadius: "50px",
              padding: "8px 16px",
              fontWeight: "bold",
            }}
            onClick={() => setIsTrashMode((prev) => !prev)}
          >
            {isTrashMode ? "ファイル一覧" : "ゴミ箱"}
          </Button>
        </Box>
        {loadingCsvList ? (
          <Typography>データを読み込んでいます...</Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 800, borderRadius: "25px" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F4F4F4" }}>
                  {isTrashMode && (
                    <TableCell
                      align="center"
                      sx={{ fontWeight: "bold", fontSize: "18px" }}
                    ></TableCell>
                  )}
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
                {displayList.length > 0 ? (
                  displayList.map((csv, index) => (
                    <TableRow key={index}>
                      {isTrashMode && (
                        <TableCell align="center">
                          <IconButton
                            onClick={() =>
                              handleRestore(
                                csv.csv_id,
                                csv.file_name.replace(/\.csv$/, ""),
                                fetchCsvList
                              )
                            }
                          >
                            <RestorePageIcon sx={{ fontSize: "30px" }} />
                          </IconButton>
                        </TableCell>
                      )}
                      <TableCell align="center">
                        {isTrashMode ? (
                          <Typography
                            sx={{ fontWeight: "bold", fontSize: "18px" }}
                          >
                            {csv.file_name.replace(/\.csv$/, "")}
                          </Typography>
                        ) : (
                          <Button
                            variant={
                              selectedCsvId === csv.csv_id
                                ? "contained"
                                : "outlined"
                            }
                            onClick={() => handleSelect(csv.csv_id)}
                            sx={{
                              borderRadius: "10px",
                              fontWeight: "bold",
                              minWidth: "200px",
                            }}
                          >
                            {csv.file_name.replace(/\.csv$/, "")}
                          </Button>
                        )}
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
                      {isTrashMode
                        ? "ゴミ箱は空です。"
                        : "CSVファイルはアップロードされていません。"}
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
