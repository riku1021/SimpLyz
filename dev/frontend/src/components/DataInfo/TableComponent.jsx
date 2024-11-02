import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

function TableComponent({ title, data, onClick, type }) {
	if (data.length === 0) {
		return null;
	}

	const commonKeys = Object.keys(data[0].common);
	const specificKeys = Object.keys(data[0].data);

	return (
		<Card>
			<CardContent>
				<Typography variant="h5" gutterBottom>
					{title}
				</Typography>
				<TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
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
											sx={{ width: '230px' }}
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
}

export default TableComponent;
