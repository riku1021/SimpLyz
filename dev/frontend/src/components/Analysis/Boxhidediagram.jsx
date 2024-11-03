import { useEffect, useState } from 'react';

function Boxhidediagram({ setImage }) {
	const [variable1, setVariable1] = useState('');
	const [variable2, setVariable2] = useState('');
	const [variableList1, setVariable1List] = useState(['1', '2', '3']);
	const [variableList2, setVariable2List] = useState(['1', '2', '3']);

	useEffect(() => {
		const fetchVariable = async () => {
			const response = await fetch('http://127.0.0.1:5000/get_quantitative', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ 'a': 0 }),
			});
			const data = await response.json()
			setVariable2List(data['quantitative_variables'])
			setVariable2(data['quantitative_variables'][0])
			console.log(data['quantitative_variables']);
		};
		const fetchTarget = async () => {
			const response = await fetch('http://127.0.0.1:5000/get_qualitative', {
				method: 'GET'
			})
			const data = await response.json()
			setVariable1List(data['qualitative_variables'])
			setVariable1(data['qualitative_variables'][0])
			console.log(data)
		}
		fetchTarget();
		fetchVariable();
	}, []);

	useEffect(() => {
		const fetchImage = async () => {
			const sentData = {
				'variable1': variable1,
				'variable2': variable2
			}
			const response = await fetch('http://127.0.0.1:5000/box', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(sentData),
			});
			const data = await response.json();
			setImage(data.image_data);
			console.log(data)
		};
		if (variable1 !== '' && variable2 !== '') {
			fetchImage();
		}

	}, [variable1, variable2, setImage]);

	const changeVariable1 = (e) => {
		setVariable1(e.target.value);
	};

	const changeVariable2 = (e) => {
		setVariable2(e.target.value);
	};
	return (
		<div>
			<div className='config-wrapper'>
				<div className='config-name-wrapper'>
					<p>variable 1</p>
				</div>
				<div className='config-value-wrapper'>
					<select value={variable1} onChange={changeVariable1} >
						{variableList1 && variableList1.map((value, idx) => {
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
					<p>variable 2</p>
				</div>
				<div className='config-value-wrapper'>
					<select value={variable2} onChange={changeVariable2} >
						{variableList2 && variableList2.map((value, idx) => {
							if (value !== variable1) {
								return (<option key={idx} value={value}>{value}</option>);
							}
							return null;
						})}
					</select>
				</div>
			</div>
		</div>
	)
}

export default Boxhidediagram;
