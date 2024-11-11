import { useState, useRef } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Card, CardContent } from '@mui/material';
import { showConfirmationAlert, showErrorAlert, showSuccessAlert } from '../../utils/alertUtils';
import { apiUrl } from '../../urlConfig';

const ManageCSV = () => {
	const [messages, setMessages] = useState([]);
	const fileInputRef = useRef(null);

	// ファイルが選択された時の処理
	const handleFiles = (files) => {
		const file = files[0];
		if (file.name.endsWith('.csv')) {
			showConfirmModal(file);
		} else {
			showErrorAlert('エラー', 'CSVファイルのみアップロード可能です');
		}
	};

	// ファイルをアップロードする非同期関数
	const uploadFile = async (file, newMessages) => {
		const formData = new FormData();
		formData.append('file', file);
		try {
			const response = await axios.post(`${apiUrl}/upload`, formData);
			newMessages.push(response.data.message);
			showSuccessAlert('アップロード完了', response.data.message);
		} catch (error) {
			newMessages.push(`ファイル ${file.name} のアップロードに失敗しました。`);
			showErrorAlert('エラー', `ファイル ${file.name} のアップロードに失敗しました。`);
			console.log(`missing upload: ${error}`);
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

	return (
		<Box sx={{ p: 4 }}>
			<Card sx={{ p: 1, borderRadius: '25px' }} >
				<CardContent>
					<Typography variant="h5" gutterBottom>
						ファイルアップロード
					</Typography>
					<Paper
						onClick={() => fileInputRef.current.click()}
						onDrop={handleDrop}
						onDragOver={(e) => e.preventDefault()}
						sx={{
							border: '1.5px dashed #ccc',
							boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.2)',
							p: 4,
							textAlign: 'center',
							borderRadius: '25px',
							cursor: 'pointer',
							fontSize: '20px'
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
		</Box>
	);
};

export default ManageCSV;
