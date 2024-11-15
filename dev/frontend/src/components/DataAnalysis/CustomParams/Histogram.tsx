import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, FormControl, InputLabel, MenuItem, Select, Grid, Typography, SelectChangeEvent } from '@mui/material';
import { BACKEND_URL } from '../../../urlConfig';

type HistogramProps = {
	setImage: (image: string) => void;
};

const Histogram = ({ setImage }: HistogramProps) => {
	const [variable, setVariable] = useState<string>('');
	const [target, setTarget] = useState<string>('');
	const [variableList, setVariableList] = useState<string[]>(['1', '2', '3']);
	const [targetList, setTargetList] = useState<string[]>(['t1', 't2', 't3']);

	// 定量変数を取得
	useEffect(() => {
		const fetchVariable = async () => {
			try {
				const response = await axios.post(`${BACKEND_URL}/get_quantitative`, { a: 0 });
				const data = response.data;
				setVariableList(data.quantitative_variables);
				setVariable(data.quantitative_variables[0]);
				console.log(data.quantitative_variables);
			} catch (error) {
				console.error('Error fetching quantitative variables:', error);
			}
		};

		// 定性変数を取得
		const fetchTarget = async () => {
			try {
				const response = await axios.get(`${BACKEND_URL}/get_qualitative`);
				const data = response.data;
				const targets = [...data.qualitative_variables, 'None'];
				setTarget('None');
				setTargetList(targets);
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
			const sentData = {
				variable,
				target,
			};
			try {
				const response = await axios.post(`${BACKEND_URL}/hist`, sentData);
				const data = response.data;
				setImage(data.image_data);
				console.log(data);
			} catch (error) {
				console.error('Error fetching histogram image:', error);
			}
		};

		if (variable && target) {
			fetchImage();
		}
	}, [variable, target, setImage]);

	const changeVariable = (e: SelectChangeEvent<string>) => setVariable(e.target.value);
	const changeTarget = (e: SelectChangeEvent<string>) => setTarget(e.target.value);

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
							<Grid item>
								<FormControl variant="outlined" sx={formControlStyles}>
									<InputLabel>Target</InputLabel>
									<Select
										value={target}
										onChange={changeTarget}
										label="Target"
										sx={selectStyles}
										inputProps={{
											sx: inputPropsStyles,
										}}
									>
										{targetList.map((value, idx) => (
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

export default Histogram;
