import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Select, MenuItem, TextField, Card, CardContent, Grid } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { showErrorAlert, showSuccessAlert } from '../../utils/alertUtils';
import { BACKEND_URL } from '../../urlConfig';
import useAuth from '../../hooks/useAuth';

type FormulaItem = {
	type: 'column' | 'operation' | 'number' | 'parenthesis';
	value: string | number
};

const FeatureCreation = () => {
	const { csvId } = useAuth();
	const [quantitativeColumns, setQuantitativeColumns] = useState<string[]>([]);
	const [currentColumn, setCurrentColumn] = useState<string>('');
	const [currentOperation, setCurrentOperation] = useState<string>('addition');
	const [currentNumber, setCurrentNumber] = useState<number>(0);
	const [formula, setFormula] = useState<FormulaItem[]>([]);
	const [newColumnName, setNewColumnName] = useState<string>('');
	const [preview, setPreview] = useState<string>('');

	useEffect(() => {
		const fetchQuantitativeColumns = async () => {
			try {
				const response = await axios.post<{ quantitative_variables: string[] }>(`${BACKEND_URL}/get_quantitative`, {
					csv_id: csvId
				});
				setQuantitativeColumns(response.data.quantitative_variables);
				setCurrentColumn(response.data.quantitative_variables[0]);
			} catch (error) {
				console.error('Failed to fetch quantitative columns:', error);
			}
		};
		fetchQuantitativeColumns();
	}, []);

	useEffect(() => {
		const operatorMap: Record<string, string> = {
			addition: '+',
			subtraction: '-',
			multiplication: '*',
			division: '/',
		};

		const formulaPreview = formula.map(item => {
			if (item.type === 'operation') {
				return operatorMap[item.value as string];
			}
			return item.value;
		}).join(' ');

		setPreview(formulaPreview);
	}, [formula]);

	const handleAddColumn = () => {
		if (formula.length === 0 || formula[formula.length - 1].type === 'operation' || (formula[formula.length - 1].type === 'parenthesis' && formula[formula.length - 1].value === '(')) {
			setFormula([...formula, { type: 'column', value: currentColumn }]);
		} else {
			showErrorAlert('エラー', '演算子を追加してください（カラムが連続していないか確認してください）');
		}
	};

	const handleAddOperation = () => {
		if (formula.length > 0 && formula[formula.length - 1].type !== 'operation' && formula[formula.length - 1].value !== '(') {
			setFormula([...formula, { type: 'operation', value: currentOperation }]);
		} else {
			showErrorAlert('エラー', '数値またはカラムを追加してください（演算子が連続していないか確認してください）');
		}
	};

	const handleAddNumber = () => {
		if (formula.length === 0 || formula[formula.length - 1].type === 'operation' || formula[formula.length - 1].value === '(') {
			setFormula([...formula, { type: 'number', value: currentNumber }]);
		} else {
			showErrorAlert('エラー', '演算子を追加してください（数値が連続していないか確認してください）');
		}
	};

	const handleAddParenthesis = (type: 'open' | 'close') => {
		if (type === 'open') {
			const lastItem = formula[formula.length - 1];

			if (lastItem && (lastItem.type === 'column' || lastItem.type === 'number' || lastItem.value === ')')) {
				showErrorAlert('エラー', 'カラムや数値、閉じ括弧の直後に開き括弧を追加することはできません');
			} else {
				setFormula([...formula, { type: 'parenthesis', value: '(' }]);
			}
		} else if (type === 'close') {
			const lastItem = formula[formula.length - 1];
			if (!lastItem || lastItem.type === 'operation' || lastItem.value === '(') {
				showErrorAlert('エラー', '演算子の後や空の括弧に閉じ括弧は使用できません');
			} else {
				setFormula([...formula, { type: 'parenthesis', value: ')' }]);
			}
		}
	};

	const handleRemoveLastItem = () => {
		const newFormula = [...formula];
		newFormula.pop();
		setFormula(newFormula);
	};

	const handleClearAll = () => {
		setFormula([]);
		setCurrentNumber(0);
		setCurrentColumn(quantitativeColumns[0]);
		setCurrentOperation('addition');
		setPreview('');
	};

	const handleSubmit = async () => {
		const openParenthesisCount = formula.filter(item => item.value === '(').length;
		const closeParenthesisCount = formula.filter(item => item.value === ')').length;

		if (!newColumnName) {
			showErrorAlert('エラー', '新しいカラム名を入力してください');
			return;
		}

		if (formula.length === 0 || formula[formula.length - 1].type === 'operation') {
			showErrorAlert('エラー', '最後に数値またはカラムを追加してください');
			return;
		}

		if (formula[0].type === 'operation') {
			showErrorAlert('エラー', '数式の最初に演算子を置くことはできません');
			return;
		}

		if (openParenthesisCount !== closeParenthesisCount) {
			showErrorAlert('エラー', '括弧の数が一致していません');
			return;
		}

		for (let i = 0; i < formula.length; i++) {
			if (formula[i].type === 'operation' && formula[i].value === 'division' && formula[i + 1]?.value === 0) {
				showErrorAlert('エラー', '0で割ることはできません');
				return;
			}
		}

		console.log('送信する数式:', formula.map(item => item.value).join(' '));

		try {
			await axios.post(`${BACKEND_URL}/make_feature`, {
				csv_id: csvId,
				formula: formula.map(item => item.value),
				new_column_name: newColumnName
			});
			showSuccessAlert('成功', '特徴量が作成されました').then(() => {
				setFormula([]);
				setNewColumnName('');
				setCurrentNumber(0);
				setCurrentColumn(quantitativeColumns[0]);
				setCurrentOperation('addition');
				setPreview('');
			});
		} catch (error) {
			showErrorAlert('エラー', '特徴量の作成に失敗しました');
			console.error('Failed to create feature:', error);
		}
	};

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)', overflow: 'hidden' }}>
			<Card sx={{ width: 600, p: 2, borderRadius: '25px' }}>
				<CardContent>
					<Typography variant="h5" gutterBottom>特徴量の作成</Typography>
					<Box sx={{
						mt: 2,
						backgroundColor: '#EAEAEA',
						borderRadius: '25px',
						border: '1px solid #EAEAEA',
						padding: '16px 20px',
						minHeight: '30px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'flex-start',
						textAlign: 'left',
						maxHeight: '160px',
						overflowY: 'auto',
					}}>
						<Typography variant={preview ? "h5" : "h6"} sx={{ width: '100%' }}>
							{preview || 'ここに数式のプレビューが表示されます'}
						</Typography>
					</Box>
					<Grid sx={{ mt: 2 }} container spacing={2} alignItems="center">
						<Grid item xs={3} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
							<Select
								value={currentColumn}
								onChange={(e) => setCurrentColumn(e.target.value)}
								fullWidth
								sx={{ borderRadius: '50px' }}
							>
								{quantitativeColumns.map((col, idx) => (
									<MenuItem key={idx} value={col}>{col}</MenuItem>
								))}
							</Select>
							<Button
								variant="outlined"
								startIcon={<AddIcon />}
								onClick={handleAddColumn}
								sx={{ mt: 1, height: '56px', borderRadius: '50px' }}
								fullWidth
							>
								カラム追加
							</Button>
						</Grid>
						<Grid item xs={3} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
							<Select
								value={currentOperation}
								onChange={(e) => setCurrentOperation(e.target.value)}
								fullWidth
								sx={{ borderRadius: '50px' }}
							>
								<MenuItem value="addition">足し算</MenuItem>
								<MenuItem value="subtraction">引き算</MenuItem>
								<MenuItem value="multiplication">掛け算</MenuItem>
								<MenuItem value="division">割り算</MenuItem>
							</Select>
							<Button
								variant="outlined"
								startIcon={<AddIcon />}
								onClick={handleAddOperation}
								sx={{ mt: 1, height: '56px', borderRadius: '50px' }}
								fullWidth
							>
								演算追加
							</Button>
						</Grid>
						<Grid item xs={3} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
							<TextField
								type="number"
								value={currentNumber}
								onChange={(e) => setCurrentNumber(Number(e.target.value))}
								sx={{
									borderRadius: '50px',
									'& .MuiOutlinedInput-root': {
										borderRadius: '50px'
									}
								}}
								fullWidth
							/>
							<Button
								variant="outlined"
								startIcon={<AddIcon />}
								onClick={handleAddNumber}
								sx={{ mt: 1, height: '56px', borderRadius: '50px' }}
								fullWidth
							>
								数値追加
							</Button>
						</Grid>
						<Grid item xs={3} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
							<Button
								variant="outlined"
								onClick={() => handleAddParenthesis('open')}
								fullWidth
								sx={{ height: '56px', borderRadius: '50px' }}
							>
								（
							</Button>
							<Button
								variant="outlined"
								onClick={() => handleAddParenthesis('close')}
								fullWidth
								sx={{ mt: 1, height: '56px', borderRadius: '50px' }}
							>
								）
							</Button>
						</Grid>
					</Grid>
					<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<Button
							variant="contained"
							color="error"
							onClick={handleRemoveLastItem}
							sx={{ mt: 2, width: '49%', marginRight: '2%', borderRadius: '50px' }}
						>
							最後の項目を削除
						</Button>
						<Button
							variant="outlined"
							color="error"
							onClick={handleClearAll}
							sx={{ mt: 2, width: '49%', borderRadius: '50px' }}
						>
							すべての項目を削除
						</Button>
					</Box>
					<Box sx={{ mt: 2 }}>
						<TextField
							label="新しいカラム名"
							value={newColumnName}
							onChange={(e) => setNewColumnName(e.target.value)}
							fullWidth
							sx={{
								'& .MuiOutlinedInput-root': {
									borderRadius: '25px'
								}
							}}
						/>
					</Box>
					<Button
						variant="contained"
						color="primary"
						onClick={handleSubmit}
						sx={{ mt: 2, width: '100%', borderRadius: '50px' }}
					>
						決定
					</Button>
				</CardContent>
			</Card>
		</Box >
	);
};

export default FeatureCreation;
