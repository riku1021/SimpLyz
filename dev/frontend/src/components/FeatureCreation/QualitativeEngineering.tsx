import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    SelectChangeEvent,
    Button,
    IconButton,
    TextField,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { BACKEND_URL } from '../../urlConfig';
import useAuth from '../../hooks/useAuth';
import { showErrorAlert } from '../../utils/alertUtils';

type FormulaItem =
    | { type: 'column'; value: string }
    | { type: 'operation'; value: string }
    | { type: 'number'; value: number }
    | { type: 'string'; value: string }
    | { type: 'parenthesis'; value: '(' | ')' }
    | { type: 'logicalOperation'; value: 'and' | 'or' };

type QualitativeEngineeringProps = {
    formula: FormulaItem[];
    setFormula: (formula: FormulaItem[]) => void;
    setPreview: (preview: string) => void;
};

const QualitativeEngineering: React.FC<QualitativeEngineeringProps> = ({ formula, setFormula, setPreview }) => {
    const { csvId } = useAuth();

    const [qualitativeData, setQualitativeData] = useState<Record<string, string[]>>({});
    const [quantitativeColumns, setQuantitativeColumns] = useState<string[]>([]);
    const [selectedColumn, setSelectedColumn] = useState<string>('');
    const [selectedOperation, setSelectedOperation] = useState<string>('==');
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [currentColumn, setCurrentColumn] = useState<string>('');
    const [currentNumber, setCurrentNumber] = useState<number>(0);

    // 質的データとユニークな値を取得
    const fetchQualitativeData = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/get_qualitative_with_values`, {
                csv_id: csvId,
            });
            const data = response.data.qualitative_variables;
            setQualitativeData(data);
            const firstColumn = Object.keys(data)[0];
            const firstValue = data[firstColumn][0];
            setSelectedColumn(firstColumn);
            setSelectedValue(firstValue);
        } catch (error) {
            console.error("Error fetching qualitative data:", error);
        }
    };

    // 量的データカラムを取得
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

    useEffect(() => {
        fetchQualitativeData();
        fetchQuantitativeColumns();
    }, [csvId]);

    const handleColumnChange = (event: SelectChangeEvent<string>) => {
        const column = event.target.value;
        setSelectedColumn(column);
        const firstValue = qualitativeData[column][0];
        setSelectedValue(firstValue);
    };

    const handleOperationChange = (event: SelectChangeEvent<string>) => {
        setSelectedOperation(event.target.value);
    };

    const handleValueChange = (event: SelectChangeEvent<string>) => {
        setSelectedValue(event.target.value);
    };

    const updatePreview = (newFormula: FormulaItem[]) => {
        const preview = newFormula.map(item => item.value.toString()).join(' ');
        setPreview(preview);
    };

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

    // 追加前のバリデーションを行う関数
    const validateAddition = (newItem: FormulaItem): boolean => {
        if (formula.length === 0) {
            if (newItem.type === 'logicalOperation') {
                showErrorAlert('追加エラー', '論理演算子は式の最初に追加できません。');
                return false;
            }
            if (newItem.type === 'parenthesis' && newItem.value === ')') {
                showErrorAlert('追加エラー', '閉じ括弧 ")" は式の最初に追加できません。');
                return false;
            }
            return true;
        }

        const lastItem = formula[formula.length - 1];

        const isLastItemExpression = ['column', 'operation', 'number', 'string', 'parenthesis'].includes(lastItem.type) && !(lastItem.type === 'parenthesis' && lastItem.value === '(');
        const isNewItemExpression = ['column', 'operation', 'number', 'string'].includes(newItem.type) || (newItem.type === 'parenthesis' && newItem.value === '(');

        if (isLastItemExpression && isNewItemExpression) {
            showErrorAlert('追加エラー', '式の後に式を追加することはできません。');
            return false;
        }

        const isLastItemLogical = lastItem.type === 'logicalOperation';
        const isNewItemLogical = newItem.type === 'logicalOperation';

        if (isLastItemLogical && isNewItemLogical) {
            showErrorAlert('追加エラー', '論理演算子の後に論理演算子を追加することはできません。');
            return false;
        }

        if (newItem.type === 'parenthesis' && newItem.value === '(') {
            if (isLastItemExpression) {
                showErrorAlert('追加エラー', '式の後に "(" を追加することはできません。');
                return false;
            }
            return true;
        }

        if (newItem.type === 'parenthesis' && newItem.value === ')') {
            if (lastItem.type === 'parenthesis' && lastItem.value === '(') {
                showErrorAlert('追加エラー', '"(" の後に ")" を追加することはできません。');
                return false;
            }
            const currentOpenParentheses = calculateOpenParentheses(formula);
            if (currentOpenParentheses <= 0) {
                showErrorAlert('追加エラー', '閉じ括弧 ")" を追加するための開き括弧 "(" がありません。');
                return false;
            }
            if (!isLastItemExpression && !(lastItem.type === 'parenthesis' && lastItem.value === ')')) {
                showErrorAlert('追加エラー', '閉じ括弧 ")" の前には式または閉じ括弧 ")" が必要です。');
                return false;
            }
            return true;
        }

        return true;
    };

    const handleAddQualitativeFormula = async () => {
        const newItems: FormulaItem[] = [
            { type: 'column', value: selectedColumn },
            { type: 'operation', value: selectedOperation },
            { type: 'string', value: selectedValue },
        ];
        for (const item of newItems) {
            if (!validateAddition(item)) {
                return;
            }
        }

        const newFormula: FormulaItem[] = [
            ...formula,
            ...newItems,
        ];
        setFormula(newFormula);
        updatePreview(newFormula);
    };

    const handleAddQuantitativeFormula = async () => {
        const newItems: FormulaItem[] = [
            { type: 'column', value: currentColumn },
            { type: 'operation', value: selectedOperation },
            { type: 'number', value: currentNumber },
        ];

        for (const item of newItems) {
            if (!validateAddition(item)) {
                return;
            }
        }

        const newFormula: FormulaItem[] = [
            ...formula,
            ...newItems,
        ];
        setFormula(newFormula);
        updatePreview(newFormula);
    };

    const formControlStyles = {
        flex: 1,
    };

    const selectStyles = {
        fontSize: "20px",
        borderRadius: "50px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        "& .MuiSelect-icon": {
            fontSize: "20px",
        },
        "& .MuiSelect-select": {
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            padding: "10px 14px",
        },
    };

    const inputPropsStyles = {
        padding: "10px 14px",
    };

    const handleAddLogicalOperation = async (op: 'and' | 'or') => {
        const newItem: FormulaItem = { type: 'logicalOperation', value: op };
        if (!validateAddition(newItem)) {
            return;
        }

        const newFormula: FormulaItem[] = [
            ...formula,
            newItem,
        ];
        setFormula(newFormula);
        updatePreview(newFormula);
    };

    const handleAddParenthesis = async (paren: '(' | ')') => {
        const newItem: FormulaItem = { type: 'parenthesis', value: paren };
        if (!validateAddition(newItem)) {
            return;
        }

        const newFormula: FormulaItem[] = [
            ...formula,
            newItem,
        ];

        setFormula(newFormula);
        updatePreview(newFormula);
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Box
                sx={{
                    backgroundColor: '#F2F2F2',
                    borderRadius: '20px',
                    padding: 1,
                    mt: 1,
                    mb: 1,
                }}
            >
                {/* 質的データを用いた式作成 */}
                <Box
                    sx={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '50px',
                        padding: 2,
                        mt: 1,
                        mb: 1,
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {/* 質的データのカラム選択 */}
                        <FormControl variant="outlined" sx={formControlStyles}>
                            <InputLabel id="column-select-label">質的カラムを選択</InputLabel>
                            <Select
                                labelId="column-select-label"
                                value={selectedColumn}
                                onChange={handleColumnChange}
                                label="質的カラムを選択"
                                sx={selectStyles}
                                inputProps={{
                                    sx: inputPropsStyles,
                                }}
                            >
                                {Object.keys(qualitativeData).map((column) => (
                                    <MenuItem key={column} value={column}>
                                        {column}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* 演算子選択 */}
                        <FormControl variant="outlined" sx={{ width: '70px' }}>
                            <InputLabel id="operation-select-label">演算子</InputLabel>
                            <Select
                                labelId="operation-select-label"
                                value={selectedOperation}
                                onChange={handleOperationChange}
                                label="演算子"
                                sx={selectStyles}
                                inputProps={{
                                    sx: inputPropsStyles,
                                }}
                            >
                                {['==', '!='].map((op) => (
                                    <MenuItem key={op} value={op}>
                                        {op}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* ユニークな値選択 */}
                        <FormControl variant="outlined" sx={formControlStyles}>
                            <InputLabel id="value-select-label">値を選択</InputLabel>
                            <Select
                                labelId="value-select-label"
                                value={selectedValue}
                                onChange={handleValueChange}
                                label="値を選択"
                                sx={selectStyles}
                                inputProps={{
                                    sx: inputPropsStyles,
                                }}
                            >
                                {qualitativeData[selectedColumn]?.map((value) => (
                                    <MenuItem key={value} value={value}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <IconButton
                            sx={{
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                backgroundColor: '#1976d2',
                                color: 'white',
                                borderRadius: '50%',
                                '&:hover': { backgroundColor: '#1565c0' },
                            }}
                            onClick={handleAddQualitativeFormula}
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Box>

                {/* 量的データを用いた式作成 */}
                <Box
                    sx={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '50px',
                        padding: 2,
                        mt: 1,
                        mb: 1,
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {/* 量的データのカラム選択 */}
                        <FormControl variant="outlined" sx={formControlStyles}>
                            <InputLabel id="quantitative-column-label">量的カラムを選択</InputLabel>
                            <Select
                                labelId="quantitative-column-label"
                                value={currentColumn}
                                onChange={(event) => setCurrentColumn(event.target.value)}
                                label="量的カラムを選択"
                                sx={selectStyles}
                                inputProps={{
                                    sx: inputPropsStyles,
                                }}
                            >
                                {quantitativeColumns.map((column) => (
                                    <MenuItem key={column} value={column}>
                                        {column}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* 演算子選択 */}
                        <FormControl variant="outlined" sx={{ width: '70px' }}>
                            <InputLabel id="operation-select-label">演算子</InputLabel>
                            <Select
                                labelId="operation-select-label"
                                value={selectedOperation}
                                onChange={handleOperationChange}
                                label="演算子"
                                sx={selectStyles}
                                inputProps={{
                                    sx: inputPropsStyles,
                                }}
                            >
                                {['==', '!=', '<', '>', '<=', '>='].map((op) => (
                                    <MenuItem key={op} value={op}>
                                        {op}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* 数値の入力 */}
                        <TextField
                            type="number"
                            label="数値を入力"
                            variant="outlined"
                            value={currentNumber}
                            onChange={(event) => setCurrentNumber(Number(event.target.value))}
                            sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '50px',
                                    '& fieldset': {
                                        borderRadius: '50px',
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    fontSize: '20px',
                                    padding: '10px 14px',
                                },
                            }}
                        />

                        <IconButton
                            sx={{
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                backgroundColor: '#1976d2',
                                color: 'white',
                                borderRadius: '50%',
                                '&:hover': { backgroundColor: '#1565c0' },
                            }}
                            onClick={handleAddQuantitativeFormula}
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Box>

                {/* 論理演算子および括弧の追加 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', gap: 1 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ flex: 1, borderRadius: '50px', backgroundColor: 'white', fontWeight: 'bold' }}
                        onClick={() => handleAddLogicalOperation('and')}
                    >
                        and
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ flex: 1, borderRadius: '50px', backgroundColor: 'white', fontWeight: 'bold' }}
                        onClick={() => handleAddLogicalOperation('or')}
                    >
                        or
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ flex: 1, borderRadius: '50px', backgroundColor: 'white', fontWeight: 'bold' }}
                        onClick={() => handleAddParenthesis('(')}
                    >
                        (
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ flex: 1, borderRadius: '50px', backgroundColor: 'white', fontWeight: 'bold' }}
                        onClick={() => handleAddParenthesis(')')}
                    >
                        )
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default QualitativeEngineering;
