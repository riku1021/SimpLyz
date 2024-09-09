import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Box, Button, Typography, Paper, Card, CardContent } from '@mui/material';

const UploadCSV = () => {
    const [messages, setMessages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // 確認モーダルを表示する関数
    const showDeleteConfirmModal = () => {
        return Swal.fire({
            title: '元のCSVファイルを削除しますか？',
            showCancelButton: true,
            confirmButtonText: 'はい',
            cancelButtonText: 'いいえ',
        });
    };

    // アップロードディレクトリをクリアする非同期関数
    const clearUploads = async () => {
        try {
            await axios.post('http://localhost:5000/clear-uploads');
        } catch (error) {
            console.error('Failed to clear uploads directory:', error);
        }
    };

    useEffect(() => {
        const confirmAndClearUploads = async () => {
            const result = await showDeleteConfirmModal();
            if (result.isConfirmed) {
                await clearUploads();
            }
        };
        confirmAndClearUploads();
    }, []);

    // ファイルが選択された時の処理
    const handleFiles = (files) => {
        const newFileNames = [];
        Array.from(files).forEach((file) => {
            newFileNames.push(file.name);
        });
        setSelectedFile(files[0]);
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
            title: `${file.name}をアップロードしますか？`,
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
        if (selectedFile) {
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
            <Card sx={{ width: 600, p: 2 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        CSVファイルをアップロード
                    </Typography>
                    <Paper
                        onClick={() => fileInputRef.current.click()}
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        sx={{
                            border: '2px dashed #ccc',
                            p: 4,
                            textAlign: 'center',
                            mb: 4,
                            cursor: 'pointer',
                        }}
                    >
                        ここをタッチまたはCSVファイルをドラッグアンドドロップ
                    </Paper>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <Button variant="contained" color="primary" onClick={handleNext} sx={{ mt: 2, width: '100%' }}>
                        次へ
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default UploadCSV;
