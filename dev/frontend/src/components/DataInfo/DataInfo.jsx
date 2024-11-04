import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Grid, Button } from '@mui/material';
import TableComponent from './TableComponent';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DataInfo = () => {
	const [data, setData] = useState({ qualitative: [], quantitative: [] });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get('http://127.0.0.1:5000/get_data_info');
				setData(response.data);
				setLoading(false);
			} catch (error) {
				console.error('データの取得に失敗しました:', error);
				setError('データの取得に失敗しました');
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="100vh">
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="100vh">
				<Typography color="error">エラー: {error}</Typography>
			</Box>
		);
	}

	const handleClick = (columnName, type) => {
		navigate(`/data-info/${columnName}/${type}`);
	};

	const handleNext = () => {
		navigate('/miss-input');
	};

	return (
		<Box p={3}>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<TableComponent title="質的データ" data={data.qualitative} onClick={handleClick} type="qualitative" />
				</Grid>
				<Grid item xs={12}>
					<TableComponent title="量的データ" data={data.quantitative} onClick={handleClick} type="quantitative" />
				</Grid>
				<Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
					<Button variant="contained" color="primary" onClick={handleNext} sx={{ mt: 2, width: '200px' }}>
						次へ
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
}

export default DataInfo;
