import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Box, Button, Typography, Paper, Card, CardContent, Stack } from '@mui/material';

const UploadCSV = () => {
    const [messages, setMessages] = useState([]);
    const [uploadedFileName, setUploadedFileName] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // サーバーから既存のファイル名を取得する関数
    const fetchUploadedFileName = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get-uploaded-file');
            setUploadedFileName(response.data.fileName);
        } catch (error) {
            console.error('Failed to fetch uploaded file name:', error);
        }
    };

    useEffect(() => {
        fetchUploadedFileName();
    }, []);

    // ファイルが選択された時の処理
    const handleFiles = (files) => {
        showConfirmModal(files[0]);
    };

    // ファイルをアップロードする非同期関数
    const uploadFile = async (file, newMessages) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            newMessages.push(response.data.message);
            Swal.fire({
                icon: 'success',
                title: 'アップロード完了',
                text: response.data.message,
            });
            setUploadedFileName(file.name);
        } catch (error) {
            newMessages.push(`ファイル ${file.name} のアップロードに失敗しました。`);
            Swal.fire({
                icon: 'error',
                title: 'エラー',
                text: `ファイル ${file.name} のアップロードに失敗しました。`,
            });
        }
        setMessages([...messages, ...newMessages]);
    };

    // 削除確認モーダルを表示する関数
    const showDeleteConfirmModal = () => {
        return Swal.fire({
            icon: 'warning',
            title: 'アップロードされたCSVファイルを削除しますか？',
            showCancelButton: true,
            confirmButtonText: 'はい',
            cancelButtonText: 'いいえ',
        });
    };

    // ファイル削除の処理
    const deleteFile = async () => {
        try {
            await axios.post('http://localhost:5000/clear-uploads');
            setUploadedFileName(null);
            Swal.fire({
                icon: 'success',
                title: '削除完了',
                text: 'ファイルが削除されました',
            });
        } catch (error) {
            console.error('Failed to delete file:', error);
        }
    };

    // 削除ボタンのクリック時の処理
    const handleDeleteClick = async () => {
        const result = await showDeleteConfirmModal();
        if (result.isConfirmed) {
            deleteFile();
        }
    };

    // ファイルドロップイベントの処理
    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFiles(files);
        }
    };

    // ファイル選択時の処理
    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleFiles(files);
        }
    };

    // 確認モーダルを表示する処理
    const showConfirmModal = (file) => {
        Swal.fire({
            title: `${file.name}を<br>アップロードしますか？`,
            showCancelButton: true,
            confirmButtonText: 'はい',
            cancelButtonText: 'いいえ',
        }).then((result) => {
            if (result.isConfirmed) {
                const newMessages = [];
                uploadFile(file, newMessages);
            }
        });
    };

    // "次へ"ボタンのクリック処理
    const handleNext = () => {
        if (uploadedFileName) {
            navigate('/data-info');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'エラー',
                text: 'CSVファイルをアップロードしてください',
            });
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card sx={{ width: 600, p: 1, mb: 1 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        CSVファイル管理
                    </Typography>
                    <Paper
                        onClick={() => !uploadedFileName && fileInputRef.current.click()}
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        sx={{
                            border: '1.5px solid #ccc',
                            p: 4,
                            textAlign: 'center',
                            mb: 2,
                            mt: 2,
                            cursor: uploadedFileName ? 'default' : 'pointer',
                        }}
                    >
                        {uploadedFileName ? (
                            <Typography variant="h4">{uploadedFileName}</Typography>
                        ) : (
                            'ここをタッチまたはCSVファイルをドラッグアンドドロップ'
                        )}
                    </Paper>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    {uploadedFileName && (
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleNext} fullWidth>
                                次へ
                            </Button>
                            <Button variant="outlined" color="error" onClick={handleDeleteClick} fullWidth>
                                削除
                            </Button>
                        </Stack>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default UploadCSV;
