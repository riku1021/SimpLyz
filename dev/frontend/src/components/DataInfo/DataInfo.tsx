import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Grid } from '@mui/material';
import TableComponent from './TableComponent';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../urlConfig';

type DataType = {
	column_name: string;
	common: Record<string, any>;
	data: Record<string, any>;
};

type ApiResponse = {
	qualitative: DataType[];
	quantitative: DataType[];
};

const DataInfo: React.FC = () => {
	const [data, setData] = useState<ApiResponse>({ qualitative: [], quantitative: [] });
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get<ApiResponse>(`${BACKEND_URL}/get_data_info`);
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

	const handleClick = (columnName: string, type: 'qualitative' | 'quantitative') => {
		navigate(`/data-info/${columnName}/${type}`);
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
			</Grid>
		</Box>
	);
};

export default DataInfo;
