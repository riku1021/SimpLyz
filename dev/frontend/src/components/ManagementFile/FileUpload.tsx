import React from 'react';
import { Card, CardContent, Paper, Typography } from '@mui/material';
import { showConfirmationAlert, showErrorAlert, showSuccessAlert } from '../../utils/alertUtils';
import { generateUUID } from '../../utils/generateUuid';
import axios from 'axios';
import { BACKEND_URL } from '../../urlConfig';
import useAuth from '../../hooks/useAuth';

interface FileUploadProps {
    fileInputRef: React.RefObject<HTMLInputElement>;
    fetchCsvList: () => Promise<void>;
}

const FileUpload: React.FC<FileUploadProps> = ({ fileInputRef, fetchCsvList }) => {
    const { userId } = useAuth();
    const handleFiles = (files: FileList) => {
        const file = files[0];
        if (file.name.endsWith('.csv')) {
            showConfirmModal(file);
        } else {
            showErrorAlert('エラー', 'CSVファイルのみアップロード可能です');
        }
    };

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append(
            'jsonData',
            JSON.stringify({
                user_id: userId,
                csv_id: generateUUID(),
            })
        );

        try {
            const response = await axios.post(`${BACKEND_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            showSuccessAlert('アップロード完了', response.data.message);
            fetchCsvList();
        } catch (error) {
            showErrorAlert('エラー', `ファイル ${file.name} のアップロードに失敗しました。`);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFiles(files);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFiles(files);
        }
    };

    const showConfirmModal = (file: File) => {
        showConfirmationAlert(
            `${file.name}を<br>アップロードしますか？`,
            '',
            'はい',
            'いいえ'
        ).then((result) => {
            if (result.isConfirmed) {
                uploadFile(file);
            }
        });
    };

    return (
        <Card sx={{ p: 1, m: 5, borderRadius: '25px' }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    ファイルアップロード
                </Typography>
                <Paper
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    sx={{
                        boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.2)',
                        p: 4,
                        textAlign: 'center',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontSize: '20px',
                    }}
                >
                    'ここをタッチ または CSVファイルをドラッグアンドドロップ'
                </Paper>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </CardContent>
        </Card>
    );
};

export default FileUpload;
