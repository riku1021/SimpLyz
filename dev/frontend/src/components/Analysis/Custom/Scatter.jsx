import { useEffect, useState } from 'react';
import axios from 'axios';
import './Scatter.css';

function Scatter({ setImage }) {
	const [variable1, setVariable1] = useState('');
	const [variable2, setVariable2] = useState('');
	const [target, setTarget] = useState('');
	const [reg, setReg] = useState(false);
	const [dimension, setDimension] = useState(1);
	const [variableList, setVariableList] = useState(['1', '2', '3']);
	const [targetList, setTargetList] = useState(['t1', 't2', 't3']);

	useEffect(() => {
		const fetchVariable = async () => {
			try {
				const response = await axios.post('http://127.0.0.1:5000/get_quantitative', { a: 0 });
				const data = response.data;
				setVariableList(data.quantitative_variables);
				setVariable1(data.quantitative_variables[0]);
				setVariable2(data.quantitative_variables[1]);
				console.log(data.quantitative_variables);
			} catch (error) {
				console.error('Error fetching quantitative variables:', error);
			}
		};

		const fetchTarget = async () => {
			try {
				const response = await axios.get('http://127.0.0.1:5000/get_qualitative');
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

	useEffect(() => {
		const fetchImage = async () => {
			const sentData = {
				variable1: variable1,
				variable2: variable2,
				target: target,
				fit_reg: reg,
				order: dimension
			};
			try {
				const response = await axios.post('http://127.0.0.1:5000/scatter', sentData);
				const data = response.data;
				setImage(data.image_data);
				console.log(data);
			} catch (error) {
				console.error('Error fetching scatter image:', error);
			}
		};

		if (variable1 !== '' && variable2 !== '' && target !== '') {
			fetchImage();
		}

	}, [variable1, variable2, target, reg, dimension, setImage]);

	const changeVariable1 = (e) => setVariable1(e.target.value);
	const changeVariable2 = (e) => setVariable2(e.target.value);
	const changeTarget = (e) => setTarget(e.target.value);
	const changeReg = (e) => {
		const newRegValue = e.target.value === "true";
		setReg(newRegValue);
		if (newRegValue) setDimension(1);
	};
	const changeDimension = (e) => setDimension(parseInt(e.target.value, 10));

	return (
		<div>
			<div className='config-wrapper'>
				<div className='config-name-wrapper'>
					<p>vertical</p>
				</div>
				<div className='config-value-wrapper'>
					<select value={variable1} onChange={changeVariable1}>
						{variableList && variableList.map((value, idx) => {
							if (value !== variable2) {
								return (<option key={idx} value={value}>{value}</option>);
							}
							return null;
						})}
					</select>
				</div>
			</div>
			<div className='config-wrapper'>
				<div className='config-name-wrapper'>
					<p>horizontal</p>
				</div>
				<div className='config-value-wrapper'>
					<select value={variable2} onChange={changeVariable2}>
						{variableList && variableList.map((value, idx) => {
							if (value !== variable1) {
								return (<option key={idx} value={value}>{value}</option>);
							}
							return null;
						})}
					</select>
				</div>
			</div>
			<div className='config-wrapper'>
				<div className='config-name-wrapper'>
					<p>target</p>
				</div>
				<div className='config-value-wrapper'>
					<select value={target} onChange={changeTarget}>
						{targetList && targetList.map((value, idx) => (
							<option key={idx} value={value}>{value}</option>
						))}
					</select>
				</div>
			</div>
			<div className='config-wrapper'>
				<div className='config-name-wrapper'>
					<p>regression</p>
				</div>
				<div className='config-value-wrapper'>
					<select value={reg} onChange={changeReg}>
						<option value="false">false</option>
						<option value="true">true</option>
					</select>
				</div>
			</div>
			{reg && (
				<div className='config-wrapper'>
					<div className='config-name-wrapper'>
						<p>dimension</p>
					</div>
					<div className='config-value-wrapper'>
						<select value={dimension} onChange={changeDimension}>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
						</select>
					</div>
				</div>
			)}
		</div>
	);
}

export default Scatter;
