import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Typography, Paper, Card, CardContent, Stack } from '@mui/material';
import { showConfirmationAlert, showErrorAlert, showSuccessAlert } from '../../utils/alertUtils';
import { apiUrl } from '../../urlConfig';

const ManageCSV = () => {
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
			const response = await axios.post(`${apiUrl}/upload`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			newMessages.push(response.data.message);
			showSuccessAlert('アップロード完了', response.data.message);
			setUploadedFileName(file.name);
		} catch (error) {
			newMessages.push(`ファイル ${file.name} のアップロードに失敗しました。`);
			showErrorAlert('エラー', `ファイル ${file.name} のアップロードに失敗しました。`);
			console.log(`missing upload: ${error}`);
		}
		setMessages([...messages, ...newMessages]);
	};

	// 削除確認モーダルを表示する関数
	const showDeleteConfirmModal = () => {
		return showConfirmationAlert(
			'アップロードされたCSVファイルを削除しますか？',
			'',
			'はい',
			'いいえ'
		);
	};

	// ファイル削除の処理
	const deleteFile = async () => {
		try {
			await axios.post('http://localhost:5000/clear-uploads');
			setUploadedFileName(null);
			showSuccessAlert('削除完了', 'ファイルが削除されました');
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
		showConfirmationAlert(
			`${file.name}を<br>アップロードしますか？`,
			'',
			'はい',
			'いいえ'
		).then((result) => {
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
			showErrorAlert('エラー', 'CSVファイルをアップロードしてください');
		}
	};

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
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

export default ManageCSV;
