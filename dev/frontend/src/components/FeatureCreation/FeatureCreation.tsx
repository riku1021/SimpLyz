import { useState } from 'react';
import { Box, Card, CardContent, Typography, IconButton, TextField, Button } from '@mui/material';
import { Cached as CachedIcon } from '@mui/icons-material';
import QuantitativeEngineering from './QuantitativeEngineering';
import QualitativeEngineering from './QualitativeEngineering';
import axios from 'axios';
import { showErrorAlert, showSuccessAlert } from '../../utils/alertUtils';
import { BACKEND_URL } from '../../urlConfig';
import useAuth from '../../hooks/useAuth';

type FormulaItem = {
	type: 'column' | 'operation' | 'number' | 'parenthesis';
	value: string | number;
};

const FeatureCreation: React.FC = () => {
	const { csvId } = useAuth();
	const [isQuantitative, setIsQuantitative] = useState<boolean>(true);
	const [formula, setFormula] = useState<FormulaItem[]>([]);
	const [newColumnName, setNewColumnName] = useState<string>('');
	const [preview, setPreview] = useState<string>('');

	const toggleDataType = () => {
		setIsQuantitative(!isQuantitative);
		setFormula([]);
		setPreview('');
	};

	const handleRemoveLastItem = () => {
		const newFormula = [...formula];
		newFormula.pop();
		setFormula(newFormula);
	};

	const handleClearAll = () => {
		setFormula([]);
		setNewColumnName('');
		setPreview('');
	};

	const validateFormula = (): boolean => {
		if (formula.length === 0 || formula[formula.length - 1].type === 'operation') {
			showErrorAlert('エラー', '最後に数値またはカラムを追加してください');
			return false;
		}

		if (formula[0].type === 'operation') {
			showErrorAlert('エラー', '数式の最初に演算子を置くことはできません');
			return false;
		}

		const openParenthesisCount = formula.filter(item => item.value === '(').length;
		const closeParenthesisCount = formula.filter(item => item.value === ')').length;

		if (openParenthesisCount !== closeParenthesisCount) {
			showErrorAlert('エラー', '括弧の数が一致していません');
			return false;
		}

		for (let i = 0; i < formula.length; i++) {
			if (formula[i].type === 'operation' && formula[i].value === 'division' && formula[i + 1]?.value === 0) {
				showErrorAlert('エラー', '0で割ることはできません');
				return false;
			}
		}

		return true;
	};

	const handleSubmit = async () => {
		const isValid = validateFormula();
		if (!isValid) return;

		if (!newColumnName) {
			showErrorAlert('エラー', '新しいカラム名を入力してください');
			return;
		}

		try {
			await axios.post(`${BACKEND_URL}/make_feature`, {
				csv_id: csvId,
				formula: formula.map(item => item.value),
				new_column_name: newColumnName,
			});
			showSuccessAlert('成功', '特徴量が作成されました').then(() => {
				handleClearAll();
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
					{/* タイトルと切替ボタン */}
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Typography variant="h5" gutterBottom>
							{isQuantitative ? '特徴量の作成（量的データ）' : '特徴量の作成（質的データ）'}
						</Typography>
						<IconButton
							onClick={toggleDataType}
							sx={{
								backgroundColor: '#1976d2',
								color: 'white',
								borderRadius: '50%',
								'&:hover': { backgroundColor: '#1565c0' },
							}}
						>
							<CachedIcon />
						</IconButton>
					</Box>

					{/* 数式のプレビュー */}
					<Box
						sx={{
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
						}}
					>
						<Typography variant={preview ? 'h5' : 'h6'} sx={{ width: '100%' }}>
							{preview || 'ここに数式のプレビューが表示されます'}
						</Typography>
					</Box>

					{/* 特徴量エンジニアリングコンポーネントの切り替え */}
					{isQuantitative ? (
						<QuantitativeEngineering
							formula={formula}
							setFormula={setFormula}
							setPreview={setPreview}
						/>
					) : (
						<QualitativeEngineering
							formula={formula}
							setFormula={setFormula}
							setPreview={setPreview}
						/>
					)}

					{/* 削除ボタン */}
					<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
						<Button
							variant="contained"
							color="error"
							onClick={handleRemoveLastItem}
							sx={{ width: '49%', borderRadius: '50px' }}
						>
							最後の項目を削除
						</Button>
						<Button
							variant="outlined"
							color="error"
							onClick={handleClearAll}
							sx={{ width: '49%', borderRadius: '50px' }}
						>
							すべての項目を削除
						</Button>
					</Box>

					{/* 新しいカラム名入力欄 */}
					<Box sx={{ mt: 2 }}>
						<TextField
							label="新しいカラム名"
							value={newColumnName}
							onChange={(e) => setNewColumnName(e.target.value)}
							fullWidth
							sx={{
								'& .MuiOutlinedInput-root': {
									borderRadius: '25px',
								},
							}}
						/>
					</Box>

					{/* 親コンポーネントに決定ボタンを配置 */}
					<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
						<Button
							variant="contained"
							color="primary"
							onClick={handleSubmit}
							sx={{ width: '100%', borderRadius: '50px' }}
						>
							決定
						</Button>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
};

export default FeatureCreation;
