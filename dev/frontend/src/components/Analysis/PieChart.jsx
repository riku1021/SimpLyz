import { useEffect, useState } from 'react';

function PieChart({ setImage }) {
	const [variable, setVariable] = useState('');
	const [variableList, setVariableList] = useState([]);

	useEffect(() => {
		const fetchVariable = async () => {
			const response = await fetch('http://127.0.0.1:5000/get_qualitative', {
				method: 'GET'
			});
			const data = await response.json();
			setVariableList(data['qualitative_variables']);
			setVariable(data['qualitative_variables'][0]);
		};

		fetchVariable();
	}, []);

	useEffect(() => {
		const fetchImage = async () => {
			const sentData = {
				'column_name': variable
			};
			const response = await fetch('http://127.0.0.1:5000/get_pie', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(sentData),
			});
			const data = await response.json();
			setImage(data.image_data);
		};

		if (variable !== '') {
			fetchImage();
		}
	}, [variable, setImage]);

	const changeVariable = (e) => {
		setVariable(e.target.value);
	};

	return (
		<div>
			<div className='config-wrapper'>
				<div className='config-name-wrapper'>
					<p>Variable</p>
				</div>
				<div className='config-value-wrapper'>
					<select value={variable} onChange={changeVariable}>
						{variableList.map((value, idx) => (
							<option key={idx} value={value}>{value}</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
}

export default PieChart;
