import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
	Box,
	Typography,
	CircularProgress,
	Button,
	Card,
	CardContent,
	Grid,
	IconButton,
} from '@mui/material';
import { PublishedWithChanges } from '@mui/icons-material';
import { showErrorAlert, showSuccessAlert, showConfirmationAlert } from '../../utils/alertUtils';
import { BACKEND_URL } from '../../urlConfig';

const ColumnDetail: React.FC = () => {
	const { columnName, type } = useParams<Record<string, string | undefined>>();
	const [image, setImage] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchImage = async () => {
			try {
				const response = await axios.post(`${BACKEND_URL}/feature_analysis`, {
					column_name: columnName,
				});
				setImage(response.data.image_data);
				setLoading(false);
				console.log(response.data.image_data);
			} catch (error) {
				console.error('画像の取得に失敗しました:', error);
				showErrorAlert('エラー', '画像の取得に失敗しました');
				setLoading(false);
			}
		};

		fetchImage();
	}, [columnName]);

	const handleTypeChange = async () => {
		const result = await showConfirmationAlert(
			'データタイプ変更の確認',
			`${columnName} を質的データに変換しますか？`,
			'はい',
			'キャンセル'
		);

		if (result.isConfirmed) {
			try {
				const response = await axios.post(`${BACKEND_URL}/change_numeric_to_categorical`, {
					column_name: columnName,
				});
				if (response.status === 200) {
					showSuccessAlert('成功', '質的データに変更しました');
					navigate('/data-info');
				}
			} catch (error) {
				console.error('変更に失敗しました:', error);
				showErrorAlert('エラー', '変更に失敗しました');
			}
		}
	};

	const handleBack = () => {
		navigate('/data-info');
	};

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="100vh">
				<CircularProgress />
			</Box>
		);
	}

	return (
		<div style={{ minHeight: 'calc(100vh - 64px)', overflow: 'hidden' }}>
			<Box p={3}>
				<Grid container justifyContent="center">
					{/* 特徴量分析結果カード */}
					<Card sx={{ borderRadius: '25px', height: '100%' }}>
						<CardContent>
							<Box display="flex" alignItems="center" justifyContent="space-between">
								<Typography variant="h4" gutterBottom>
									{columnName} の特徴量分析結果
								</Typography>
								{/* データタイプ変更ボタン */}
								{type === 'quantitative' && (
									<IconButton
										onClick={handleTypeChange}
										sx={{
											backgroundColor: '#1976d2',
											color: 'white',
											borderRadius: '50%',
											marginLeft: '10px',
											'&:hover': {
												backgroundColor: '#1565c0',
											},
										}}
									>
										<PublishedWithChanges />
									</IconButton>
								)}
							</Box>
							<Box display="flex" justifyContent="center" alignItems="center">
								<img
									src={`data:image/png;base64,${image}`}
									alt="分析結果"
									style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
								/>
							</Box>
							{/* 戻るボタン */}
							<Box mt={3} display="flex" justifyContent="center">
								<Button
									variant="contained"
									color="primary"
									onClick={handleBack}
									sx={{ borderRadius: '50px', width: '100%' }}
								>
									戻る
								</Button>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Box>
		</div>
	);
};

export default ColumnDetail;
