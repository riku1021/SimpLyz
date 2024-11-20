import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, FormControl, InputLabel, MenuItem, Select, Grid, Typography, SelectChangeEvent } from '@mui/material';
import { BACKEND_URL } from '../../../urlConfig';
import useAuth from '../../../hooks/useAuth';

type BoxhidediagramProps = {
	setImage: (image: string) => void;
};

const Boxhidediagram: React.FC<BoxhidediagramProps> = ({ setImage }) => {
	const { csvId } = useAuth();
	const [variable1, setVariable1] = useState<string>('');
	const [variable2, setVariable2] = useState<string>('');
	const [variableList1, setVariableList1] = useState<string[]>(['1', '2', '3']);
	const [variableList2, setVariableList2] = useState<string[]>(['1', '2', '3']);

	// 定量変数と定性変数の取得
	useEffect(() => {
		const fetchVariable = async () => {
			try {
				const response = await axios.post(`${BACKEND_URL}/get_quantitative`, {
					csv_id: csvId,
					a: 0
				});
				const data = response.data;
				setVariableList2(data.quantitative_variables);
				setVariable2(data.quantitative_variables[0]);
				console.log(data.quantitative_variables);
			} catch (error) {
				console.error('Error fetching quantitative variables:', error);
			}
		};

		const fetchTarget = async () => {
			try {
				const response = await axios.post(`${BACKEND_URL}/get_qualitative`, {
					csv_id: csvId
				});
				const data = response.data;
				setVariableList1(data.qualitative_variables);
				setVariable1(data.qualitative_variables[0]);
				console.log(data);
			} catch (error) {
				console.error('Error fetching qualitative variables:', error);
			}
		};

		fetchTarget();
		fetchVariable();
	}, []);

	// 画像データを取得
	useEffect(() => {
		const fetchImage = async () => {
			try {
				const response = await axios.post(`${BACKEND_URL}/box`, {
					variable1,
					variable2,
					csv_id: csvId,
				});
				const data = response.data;
				setImage(data.image_data);
				console.log(data);
			} catch (error) {
				console.error('Error fetching box diagram image:', error);
			}
		};

		if (variable1 && variable2) {
			fetchImage();
		}
	}, [variable1, variable2, setImage]);

	const changeVariable1 = (e: SelectChangeEvent<string>) => setVariable1(e.target.value);
	const changeVariable2 = (e: SelectChangeEvent<string>) => setVariable2(e.target.value);

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
									<InputLabel>Vertical</InputLabel>
									<Select
										value={variable1}
										onChange={changeVariable1}
										label="Vertical"
										sx={selectStyles}
										inputProps={{
											sx: inputPropsStyles,
										}}
									>
										{variableList1.map((value, idx) => (
											value !== variable2 && <MenuItem key={idx} value={value}>{value}</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item>
								<FormControl variant="outlined" sx={formControlStyles}>
									<InputLabel>Horizontal</InputLabel>
									<Select
										value={variable2}
										onChange={changeVariable2}
										label="Horizontal"
										sx={selectStyles}
										inputProps={{
											sx: inputPropsStyles,
										}}
									>
										{variableList2.map((value, idx) => (
											value !== variable1 && <MenuItem key={idx} value={value}>{value}</MenuItem>
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

export default Boxhidediagram;