import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { showErrorAlert, showSuccessAlert } from '../../utils/alertUtils';

const MissingValueImputation = () => {
	const [quantitativeMissList, setQuantitativeMissList] = useState([]);
	const [qualitativeMissList, setQualitativeMissList] = useState([]);
	const [imputationMethods, setImputationMethods] = useState({});
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchMissingColumns = async () => {
			try {
				const response = await fetch('http://127.0.0.1:5000/get_miss_columns', {
					method: 'GET',
				});
				const data = await response.json();
				setQuantitativeMissList(data.quantitative_miss_list);
				setQualitativeMissList(data.qualitative_miss_list);
			} catch (error) {
				showErrorAlert('エラー', '欠損カラムの取得に失敗しました。');
			} finally {
				setLoading(false);
			}
		};
		fetchMissingColumns();
	}, []);

	const handleImputationMethodChange = (column, type) => (e) => {
		const newMethods = { ...imputationMethods };
		newMethods[column] = { type, method: e.target.value };
		setImputationMethods(newMethods);
	};

	const handleImpute = async () => {
		for (const col of quantitativeMissList.concat(qualitativeMissList)) {
			if (!imputationMethods[col] || !imputationMethods[col].method) {
				showErrorAlert('エラー', 'すべてのカラムに対して補完方法を指定してください');
				return;
			}
		}

		try {
			for (const column in imputationMethods) {
				const { type, method } = imputationMethods[column];
				const url = type === 'numeric' ? 'http://127.0.0.1:5000/complement/numeric' : 'http://127.0.0.1:5000/complement/categorical';
				await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						column_name: column,
						complementary_methods: method,
					}),
				});
			}

			showSuccessAlert('完了', '欠損値が補完されました').then(() => {
				navigate('/feature-creation');
			});
		} catch (error) {
			showErrorAlert('エラー', '補完処理中にエラーが発生しました。');
		}
	};

	const renderSelectOptions = (type) => {
		const methods = type === 'numeric'
			? ['平均値補完', '中央値補完', '定数値補完', '線形補完', 'スプライン補完', 'KNN補完', 'ランダムフォレスト補完']
			: ['最頻値補完', '定数値補完', 'ホットデッキ法'];

		return methods.map((method) => (
			<MenuItem key={method} value={method}>{method}</MenuItem>
		));
	};

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="100vh">
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3, gap: 3 }}>
			<div style={{ marginTop: '30px' }}></div>
			{/* 数値データの欠損値カード */}
			<Card sx={{ width: '100%', maxWidth: 800 }}>
				<CardContent>
					<Typography variant="h5" gutterBottom>数値データの欠損値</Typography>
					{quantitativeMissList.length === 0 ? (
						<Box sx={{ backgroundColor: '#EAEAEA', borderRadius: '8px', p: 2 }}>
							<Typography>欠損値のある数値データのカラムはありません。</Typography>
						</Box>
					) : (
						quantitativeMissList.map((col) => (
							<Card key={col} sx={{ marginBottom: 2 }}>
								<CardContent>
									<Typography variant="h6">{col}</Typography>
									<FormControl fullWidth sx={{ marginTop: 2 }}>
										<InputLabel>補完方法を選択</InputLabel>
										<Select
											value={imputationMethods[col]?.method || ''}
											onChange={handleImputationMethodChange(col, 'numeric')}
										>
											<MenuItem value=""><em>選択してください</em></MenuItem>
											{renderSelectOptions('numeric')}
										</Select>
									</FormControl>
								</CardContent>
							</Card>
						))
					)}
				</CardContent>
			</Card>

			{/* カテゴリカルデータの欠損値カード */}
			<Card sx={{ width: '100%', maxWidth: 800 }}>
				<CardContent>
					<Typography variant="h5" gutterBottom>カテゴリカルデータの欠損値</Typography>
					{qualitativeMissList.length === 0 ? (
						<Box sx={{ backgroundColor: '#EAEAEA', borderRadius: '8px', p: 2 }}>
							<Typography>欠損値のあるカテゴリカルデータのカラムはありません。</Typography>
						</Box>
					) : (
						qualitativeMissList.map((col) => (
							<Card key={col} sx={{ marginBottom: 2 }}>
								<CardContent>
									<Typography variant="h6">{col}</Typography>
									<FormControl fullWidth sx={{ marginTop: 2 }}>
										<InputLabel>補完方法を選択</InputLabel>
										<Select
											value={imputationMethods[col]?.method || ''}
											onChange={handleImputationMethodChange(col, 'categorical')}
										>
											<MenuItem value=""><em>選択してください</em></MenuItem>
											{renderSelectOptions('categorical')}
										</Select>
									</FormControl>
								</CardContent>
							</Card>
						))
					)}
				</CardContent>
			</Card>
			<Box sx={{ width: '100%', maxWidth: 800 }}>
				<Button variant="contained" color="primary" onClick={handleImpute} sx={{ marginTop: 2, width: '100%' }}>
					決定
				</Button>
			</Box>
		</Box>
	);
}

export default MissingValueImputation;
