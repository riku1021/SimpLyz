import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

type DataType = {
	column_name: string;
	common: Record<string, any>;
	data: Record<string, any>;
};

type TableComponentProps = {
	title: string;
	data: DataType[];
	onClick: (columnName: string, type: 'qualitative' | 'quantitative') => void;
	type: 'qualitative' | 'quantitative';
};

const TableComponent: React.FC<TableComponentProps> = ({ title, data, onClick, type }) => {
	if (!data || data.length === 0) {
		return null;
	}

	const commonKeys = Object.keys(data[0]?.common || {});
	const specificKeys = Object.keys(data[0]?.data || {});

	return (
		<Card sx={{ borderRadius: '25px' }}>
			<CardContent>
				<Typography variant="h5" gutterBottom>
					{title}
				</Typography>
				<TableContainer component={Paper} sx={{ overflowX: 'auto', borderRadius: '25px' }}>
					<Table sx={{ minWidth: 1600 }}>
						<TableHead>
							<TableRow>
								<TableCell align="center" sx={{ fontWeight: 'bold' }}>カラム名</TableCell>
								{commonKeys.map((key, idx) => (
									<TableCell key={idx} align="center" sx={{ fontWeight: 'bold' }}>{key}</TableCell>
								))}
								{specificKeys.map((key, idx) => (
									<TableCell key={idx} align="center" sx={{ fontWeight: 'bold' }}>{key}</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{data.map((row, idx) => (
								<TableRow key={idx}>
									<TableCell align="center">
										<Button
											onClick={() => onClick(row.column_name, type)}
											variant="outlined"
											sx={{ width: '230px', borderRadius: '10px', textTransform: 'none' }}
										>
											{row.column_name}
										</Button>
									</TableCell>
									{commonKeys.map((key, idx2) => (
										<TableCell key={idx2} align="center">{row.common[key]}</TableCell>
									))}
									{specificKeys.map((key, idx2) => (
										<TableCell key={idx2} align="center">{row.data[key]}</TableCell>
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

export default TableComponent;
