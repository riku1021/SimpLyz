import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import { BACKEND_URL } from '../../urlConfig';
import useAuth from '../../hooks/useAuth';
import DataTable from './DataTable';

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
	const { csvId } = useAuth();
	const [data, setData] = useState<ApiResponse>({ qualitative: [], quantitative: [] });
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [currentType, setCurrentType] = useState<'qualitative' | 'quantitative'>('qualitative');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.post<ApiResponse>(`${BACKEND_URL}/get_data_info`, {
					csv_id: csvId,
				});
				setData(response.data);
				setLoading(false);
			} catch (error) {
				console.error('データの取得に失敗しました:', error);
				setError('データの取得に失敗しました');
				setLoading(false);
			}
		};

		fetchData();
	}, [csvId]);

	const handleTypeChange = () => {
		setCurrentType((prevType) => (prevType === 'qualitative' ? 'quantitative' : 'qualitative'));
	};

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 64px)">
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 64px)">
				<Typography color="error">エラー: {error}</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ overflow: 'hidden', height: 'calc(100vh - 64px)' }}>
			{currentType === 'qualitative' ? (
				<DataTable
					title="質的データ"
					tableData={data.qualitative}
					type="qualitative"
					onTypeChange={handleTypeChange}
				/>
			) : (
				<DataTable
					title="量的データ"
					tableData={data.quantitative}
					type="quantitative"
					onTypeChange={handleTypeChange}
				/>
			)}
		</Box>
	);
};

export default DataInfo;
