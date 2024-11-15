import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, FormControl, InputLabel, MenuItem, Select, Grid, Typography, SelectChangeEvent } from '@mui/material';
import { BACKEND_URL } from '../../../urlConfig';

type PieChartProps = {
	setImage: (image: string) => void;
};

const PieChart = ({ setImage }: PieChartProps) => {
	const [variable, setVariable] = useState<string>('');
	const [variableList, setVariableList] = useState<string[]>([]);

	// 定性変数を取得
	useEffect(() => {
		const fetchVariable = async () => {
			try {
				const response = await axios.get(`${BACKEND_URL}/get_qualitative`);
				const data = response.data;
				setVariableList(data.qualitative_variables);
				setVariable(data.qualitative_variables[0]);
				console.log(data.qualitative_variables);
			} catch (error) {
				console.error('Error fetching qualitative variables:', error);
			}
		};

		fetchVariable();
	}, []);

	// 画像データを取得
	useEffect(() => {
		const fetchImage = async () => {
			const sentData = { column_name: variable };
			try {
				const response = await axios.post(`${BACKEND_URL}/get_pie`, sentData);
				const data = response.data;
				setImage(data.image_data);
				console.log(data);
			} catch (error) {
				console.error('Error fetching pie chart image:', error);
			}
		};

		if (variable) {
			fetchImage();
		}
	}, [variable, setImage]);

	const changeVariable = (e: SelectChangeEvent<string>) => setVariable(e.target.value);

	const formControlStyles = {
		width: '100%',
		maxWidth: '280px',
		margin: '0 auto',
	};

	const selectStyles = {
		fontSize: '20px',
		borderRadius: '50px',
		boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
		'& .MuiSelect-icon': {
			fontSize: '24px',
		},
		'& .MuiSelect-select': {
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
		},
	};

	const inputPropsStyles = {
		padding: '10px 20px',
	};

	return (
		<Grid container spacing={3} sx={{ marginTop: 1, padding: 2, justifyContent: 'center' }}>
			<Grid item>
				<Card variant="outlined" sx={{ borderRadius: '50px', padding: 2, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', width: '300px' }}>
					<CardContent>
						<Typography variant="h5" sx={{ marginBottom: 2 }} gutterBottom>
							Parameters
						</Typography>
						<Grid container direction="column" spacing={2}>
							<Grid item>
								<FormControl variant="outlined" sx={formControlStyles}>
									<InputLabel>Variable</InputLabel>
									<Select
										value={variable}
										onChange={changeVariable}
										label="Variable"
										sx={selectStyles}
										inputProps={{
											sx: inputPropsStyles,
										}}
									>
										{variableList.map((value, idx) => (
											<MenuItem key={idx} value={value}>{value}</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
};

export default PieChart;
