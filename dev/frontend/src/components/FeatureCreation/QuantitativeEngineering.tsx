import React, { useState, useEffect } from 'react';
import { Box, Button, Select, MenuItem, TextField, Grid } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import { showErrorAlert } from '../../utils/alertUtils';
import { BACKEND_URL } from '../../urlConfig';
import useAuth from '../../hooks/useAuth';

type FormulaItem =
    | { type: 'column'; value: string }
    | { type: 'operation'; value: string }
    | { type: 'number'; value: number }
    | { type: 'string'; value: string }
    | { type: 'parenthesis'; value: '(' | ')' }
    | { type: 'logicalOperation'; value: 'and' | 'or' };

type QuantitativeEngineeringProps = {
    formula: FormulaItem[];
    setFormula: (formula: FormulaItem[]) => void;
    setPreview: (preview: string) => void;
};

const QuantitativeEngineering: React.FC<QuantitativeEngineeringProps> = ({ formula, setFormula, setPreview }) => {
    const { csvId } = useAuth();
    const [quantitativeColumns, setQuantitativeColumns] = useState<string[]>([]);
    const [currentColumn, setCurrentColumn] = useState<string>('');
    const [currentOperation, setCurrentOperation] = useState<string>('addition');
    const [currentNumber, setCurrentNumber] = useState<number>(0);

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
    }, [csvId]);

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
    }, [formula, setPreview]);

    // 括弧の開閉数を計算する関数
    const calculateOpenParentheses = (formula: FormulaItem[]): number => {
        let count = 0;
        for (const item of formula) {
            if (item.type === 'parenthesis') {
                if (item.value === '(') {
                    count += 1;
                } else if (item.value === ')') {
                    count -= 1;
                }
            }
        }
        return count;
    };

    const handleAddColumn = () => {
        const lastItem = formula[formula.length - 1];
        if (
            formula.length === 0 ||
            lastItem.type === 'operation' ||
            (lastItem.type === 'parenthesis' && lastItem.value === '(')
        ) {
            setFormula([...formula, { type: 'column', value: currentColumn }]);
        } else {
            showErrorAlert('追加エラー', '演算子を追加してください（カラムが連続していないか確認してください）');
        }
    };

    const handleAddOperation = () => {
        const lastItem = formula[formula.length - 1];
        if (
            formula.length > 0 &&
            lastItem.type !== 'operation' &&
            !(lastItem.type === 'parenthesis' && lastItem.value === '(')
        ) {
            setFormula([...formula, { type: 'operation', value: currentOperation }]);
        } else {
            showErrorAlert('追加エラー', '数値またはカラムを追加してください（演算子が連続していないか確認してください）');
        }
    };

    const handleAddNumber = () => {
        const lastItem = formula[formula.length - 1];
        if (
            formula.length === 0 ||
            lastItem.type === 'operation' ||
            (lastItem.type === 'parenthesis' && lastItem.value === '(')
        ) {
            setFormula([...formula, { type: 'number', value: currentNumber }]);
        } else {
            showErrorAlert('追加エラー', '演算子を追加してください（数値が連続していないか確認してください）');
        }
    };

    const handleAddParenthesis = (type: 'open' | 'close') => {
        if (type === 'open') {
            const lastItem = formula[formula.length - 1];

            if (lastItem && (lastItem.type === 'column' || lastItem.type === 'number' || lastItem.value === ')')) {
                showErrorAlert('追加エラー', 'カラムや数値、閉じ括弧の直後に開き括弧を追加することはできません');
            } else {
                setFormula([...formula, { type: 'parenthesis', value: '(' }]);
            }
        } else if (type === 'close') {
            const lastItem = formula[formula.length - 1];
            const openParentheses = calculateOpenParentheses(formula);

            if (lastItem.type === 'parenthesis' && lastItem.value === ')') {
                showErrorAlert('追加エラー', '閉じ括弧 ")" は式の最初に追加できません。');
                return false;
            }

            if (openParentheses <= 0) {
                showErrorAlert('追加エラー', '閉じ括弧 ")" を追加するための開き括弧 "(" がありません');
                return;
            }

            if (!lastItem || lastItem.type === 'operation' || lastItem.value === '(') {
                showErrorAlert('追加エラー', '演算子の後や空の括弧に閉じ括弧は使用できません');
            } else {
                setFormula([...formula, { type: 'parenthesis', value: ')' }]);
            }
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Grid container spacing={2} alignItems="center">
                {/* カラム追加 */}
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

                {/* 演算追加 */}
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

                {/* 数値追加 */}
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

                {/* 括弧追加 */}
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
        </Box>
    );
};

export default QuantitativeEngineering;
