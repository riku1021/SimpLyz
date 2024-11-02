import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Select, MenuItem, TextField, Card, CardContent, Grid } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { showErrorAlert, showSuccessAlert } from '../../utils/alertUtils';

const FeatureCreation = () => {
    const [quantitativeColumns, setQuantitativeColumns] = useState([]);
    const [currentColumn, setCurrentColumn] = useState('');
    const [currentOperation, setCurrentOperation] = useState('addition');
    const [currentNumber, setCurrentNumber] = useState(0);
    const [formula, setFormula] = useState([]);
    const [newColumnName, setNewColumnName] = useState('');
    const [preview, setPreview] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuantitativeColumns = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:5000/get_quantitative');
                setQuantitativeColumns(response.data.quantitative_variables);
                setCurrentColumn(response.data.quantitative_variables[0]);
            } catch (error) {
                console.error('Failed to fetch quantitative columns:', error);
            }
        };
        fetchQuantitativeColumns();
    }, []);

    useEffect(() => {
        const operatorMap = {
            addition: '+',
            subtraction: '-',
            multiplication: '*',
            division: '/',
        };

        const formulaPreview = formula.map(item => {
            if (item.type === 'operation') {
                return operatorMap[item.value];
            }
            if (item.type === 'parenthesis') {
                return item.value;
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

    const handleAddParenthesis = (type) => {
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
            await axios.post('http://127.0.0.1:5000/make_feature', {
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

    const handleNext = () => {
        navigate('/analysis');
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card sx={{ width: 600, p: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>特徴量の作成</Typography>
                    <Box sx={{
                        mt: 2,
                        backgroundColor: '#EAEAEA',
                        borderRadius: '8px',
                        border: '1px solid #EAEAEA',
                        padding: '16px',
                        minHeight: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        textAlign: 'left'
                    }}>
                        <Typography variant="h5" sx={{ width: '100%' }}>
                            {preview || 'ここに数式のプレビューが表示されます'}
                        </Typography>
                    </Box>
                    <Grid sx={{ mt: 2 }} container spacing={2} alignItems="center">
                        <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <Select
                                value={currentColumn}
                                onChange={(e) => setCurrentColumn(e.target.value)}
                                fullWidth
                            >
                                {quantitativeColumns.map((col, idx) => (
                                    <MenuItem key={idx} value={col}>{col}</MenuItem>
                                ))}
                            </Select>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={handleAddColumn}
                                sx={{ mt: 1, height: '56px' }}
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
                                sx={{ mt: 1, height: '56px' }}
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
                                fullWidth
                            />
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={handleAddNumber}
                                sx={{ mt: 1, height: '56px' }}
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
                                sx={{ height: '56px' }}
                            >
                                （
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => handleAddParenthesis('close')}
                                fullWidth
                                sx={{ mt: 1, height: '56px' }}
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
                            sx={{ mt: 2, width: '49%', marginRight: '2%' }}
                        >
                            最後の項目を削除
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleClearAll}
                            sx={{ mt: 2, width: '49%' }}
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
                        />
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ mt: 2, width: '100%' }}
                    >
                        決定
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleNext}
                        sx={{ mt: 2, width: '100%' }}
                    >
                        次へ
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default FeatureCreation;
