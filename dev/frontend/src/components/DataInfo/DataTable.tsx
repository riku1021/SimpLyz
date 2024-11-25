
import React from 'react';
import {
	Box,
	Typography,
	Card,
	CardContent,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	IconButton,
} from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import { useNavigate } from 'react-router-dom';

type DataType = {
	column_name: string;
	common: Record<string, any>;
	data: Record<string, any>;
};

type DataTableProps = {
	title: string;
	tableData: DataType[];
	type: 'qualitative' | 'quantitative';
	onTypeChange: () => void;
};

const DataTable: React.FC<DataTableProps> = ({ title, tableData, type, onTypeChange }) => {
	const navigate = useNavigate();

	if (!tableData || tableData.length === 0) {
		return null;
	}

	const commonKeys = Object.keys(tableData[0]?.common || {});
	const specificKeys = Object.keys(tableData[0]?.data || {});

	return (
		<Card sx={{ maxHeight: 'calc(100vh - 105px)', overflowY: 'auto', borderRadius: '25px', m: 3 }}>
			<CardContent>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Typography variant="h5" gutterBottom>
						{title}
					</Typography>
					<IconButton
						onClick={onTypeChange}
						sx={{
							backgroundColor: '#1976d2',
							color: 'white',
							borderRadius: '50%',
							'&:hover': {
								backgroundColor: '#1565c0',
							},
						}}
					>
						<CachedIcon />
					</IconButton>
				</Box>
				<TableContainer component={Paper} sx={{ overflowX: 'auto', borderRadius: '25px', maxHeight: 'calc(100vh - 200px)' }}>
					<Table sx={{ minWidth: 1500 }}>
						<TableHead>
							<TableRow>
								<TableCell
									align="center"
									sx={{
										fontWeight: 'bold',
										position: 'sticky',
										top: 0,
										backgroundColor: '#F4F4F4',
										zIndex: 1,
									}}
								>
									カラム名
								</TableCell>
								{commonKeys.map((key, idx) => (
									<TableCell
										key={idx}
										align="center"
										sx={{
											fontWeight: 'bold',
											position: 'sticky',
											top: 0,
											backgroundColor: '#F4F4F4',
											zIndex: 1,
										}}
									>
										{key}
									</TableCell>
								))}
								{specificKeys.map((key, idx) => (
									<TableCell
										key={idx}
										align="center"
										sx={{
											fontWeight: 'bold',
											position: 'sticky',
											top: 0,
											backgroundColor: '#F4F4F4',
											zIndex: 1,
										}}
									>
										{key}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{tableData.map((row, idx) => (
								<TableRow key={idx}>
									<TableCell align="center">
										<Button
											onClick={() => navigate(`/data-info/${row.column_name}/${type}`)}
											variant="outlined"
											sx={{ width: '180px', borderRadius: '10px', textTransform: 'none' }}
										>
											{row.column_name}
										</Button>
									</TableCell>
									{commonKeys.map((key, idx2) => (
										<TableCell key={idx2} align="center">
											{row.common[key]}
										</TableCell>
									))}
									{specificKeys.map((key, idx2) => (
										<TableCell key={idx2} align="center">
											{row.data[key]}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</CardContent>
		</Card>
	);
};

export default DataTable;
