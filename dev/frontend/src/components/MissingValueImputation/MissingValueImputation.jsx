import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Typography, CircularProgress } from '@mui/material';
import { showErrorAlert, showSuccessAlert } from '../../utils/alertUtils';
import axios from 'axios';
import { apiUrl } from '../../urlConfig';

const MissingValueImputation = () => {
	const [quantitativeMissList, setQuantitativeMissList] = useState([]);
	const [qualitativeMissList, setQualitativeMissList] = useState([]);
	const [imputationMethods, setImputationMethods] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchMissingColumns = async () => {
			try {
				const response = await axios.get(`${apiUrl}/get_miss_columns`);
				setQuantitativeMissList(response.data.quantitative_miss_list);
				setQualitativeMissList(response.data.qualitative_miss_list);
			} catch (error) {
				showErrorAlert('エラー', '欠損カラムの取得に失敗しました。');
				console.log(`missing obtain missing columns: ${error}`);
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
		try {
			for (const column in imputationMethods) {
				const { type, method } = imputationMethods[column];
				const url = type === 'numeric'
					? `${apiUrl}/complement/numeric`
					: `${apiUrl}/complement/categorical`;

				await axios.post(url, {
					column_name: column,
					complementary_methods: method,
				});
			}
			showSuccessAlert('完了', '欠損値が補完されました');
		} catch (error) {
			showErrorAlert('エラー', '補完処理中にエラーが発生しました。');
			console.log(`missing imputation: ${error}`);
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
			<Box display="flex" justifyContent="center" alignItems="center" height="100vh" sx={{ mt: 2, mb: 2 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)', gap: 3, overflow: 'hidden', p: 3 }}>
			<Card sx={{ width: '100%', maxWidth: 800, borderRadius: '25px' }}>
				<CardContent>
					<Typography variant="h5" gutterBottom>数値データの欠損値</Typography>
					{quantitativeMissList.length === 0 ? (
						<Box sx={{ backgroundColor: '#EAEAEA', borderRadius: '50px', p: 2 }}>
							<Typography>欠損値のある数値データのカラムはありません。</Typography>
						</Box>
					) : (
						quantitativeMissList.map((col) => (
							<Card key={col} sx={{ marginBottom: 2, borderRadius: '25px' }}>
								<CardContent sx={{ borderRadius: '50px' }}>
									<Typography variant="h6">{col}</Typography>
									<FormControl fullWidth sx={{ marginTop: 2 }}>
										<InputLabel sx={{ backgroundColor: 'white', padding: '0 4px', borderRadius: '5px' }}>補完方法を選択</InputLabel>
										<Select
											value={imputationMethods[col]?.method || ''}
											onChange={handleImputationMethodChange(col, 'numeric')}
											MenuProps={{
												PaperProps: {
													sx: {
														borderRadius: '10px',
													}
												}
											}}
											sx={{ borderRadius: '25px' }}
										>
											<MenuItem value=""><em>選択してください</em></MenuItem>
											{renderSelectOptions('numeric')}
										</Select>
									</FormControl>
								</CardContent>
							</Card>
						))
					)}
					<Box sx={{ height: 40 }} />
					<Typography variant="h5" gutterBottom>カテゴリカルデータの欠損値</Typography>
					{qualitativeMissList.length === 0 ? (
						<Box sx={{ backgroundColor: '#EAEAEA', borderRadius: '50px', p: 2 }}>
							<Typography>欠損値のあるカテゴリカルデータのカラムはありません。</Typography>
						</Box>
					) : (
						qualitativeMissList.map((col) => (
							<Card key={col} sx={{ marginBottom: 2, borderRadius: '25px' }}>
								<CardContent>
									<Typography variant="h6">{col}</Typography>
									<FormControl fullWidth sx={{ marginTop: 2 }}>
										<InputLabel sx={{ backgroundColor: 'white', padding: '0 4px', borderRadius: '5px' }}>補完方法を選択</InputLabel>
										<Select
											value={imputationMethods[col]?.method || ''}
											onChange={handleImputationMethodChange(col, 'categorical')}
											MenuProps={{
												PaperProps: {
													sx: {
														borderRadius: '10px',
													}
												}
											}}
											sx={{ borderRadius: '25px' }}
										>
											<MenuItem value=""><em>選択してください</em></MenuItem>
											{renderSelectOptions('categorical')}
										</Select>
									</FormControl>
								</CardContent>
							</Card>
						))
					)}
					{(quantitativeMissList.length > 0 || qualitativeMissList.length > 0) && (
						<Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
							<Button variant="contained" color="primary" onClick={handleImpute} sx={{ borderRadius: '50px', width: '100%' }}>
								決定
							</Button>
						</Box>
					)}
				</CardContent>
			</Card>
		</Box>
	);
}

export default MissingValueImputation;
