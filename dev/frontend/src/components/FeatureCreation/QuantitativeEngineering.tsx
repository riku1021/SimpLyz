import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Select,
    MenuItem,
    TextField,
    IconButton,
    FormControl,
    InputLabel,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import { showConfirmationAlert, showErrorAlert } from '../../utils/alertUtils';
import { BACKEND_URL } from '../../urlConfig';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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
    const [currentOperation, setCurrentOperation] = useState<string>('+');
    const [currentNumber, setCurrentNumber] = useState<number>(0);
    const [quantitativeMissColumns, setQuantitativeMissColumns] = useState<string[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuantitativeColumns = async () => {
            try {
                const response = await axios.post<{ quantitative_variables: string[] }>(`${BACKEND_URL}/get_quantitative`, {
                    csv_id: csvId
                });
                setQuantitativeColumns(response.data.quantitative_variables);
                if (response.data.quantitative_variables.length > 0) {
                    setCurrentColumn(response.data.quantitative_variables[0]);
                }
            } catch (error) {
                console.error('Failed to fetch quantitative columns:', error);
                showErrorAlert('データ取得エラー', '量的カラムの取得に失敗しました。');
            }
        };
        
        const fetchMissColumns = async () => {
            try {
                const response = await axios.post(`${BACKEND_URL}/get_miss_columns`, {
                    csv_id: csvId
                });
                if (response.data.quantitative_miss_list.length > 0) {
                    setQuantitativeMissColumns(response.data.quantitative_miss_list);
                }
            } catch (error) {
                console.error('Failed to fetch miss columns:', error);
                showErrorAlert('データ取得エラー', '欠損値カラムの取得に失敗しました。');
            }
        }
        fetchQuantitativeColumns();
        fetchMissColumns();
    }, [csvId]);

    useEffect(() => {
        const formulaPreview = formula.map(item => item.value).join(' ');
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

    // 追加前のバリデーションを行う関数
    const validateAddition = (newItem: FormulaItem): boolean => {
        if (formula.length === 0) {
            if (newItem.type === 'operation') {
                showErrorAlert('追加エラー', '演算子は式の最初に追加できません。');
                return false;
            }
            if (newItem.type === 'parenthesis' && newItem.value === ')') {
                showErrorAlert('追加エラー', '閉じ括弧 ")" は式の最初に追加できません。');
                return false;
            }
            return true;
        }

        const lastItem = formula[formula.length - 1];

        if (lastItem.type === 'operation' && newItem.type === 'operation') {
            showErrorAlert('追加エラー', '演算子を連続して追加することはできません。');
            return false;
        }

        const isLastItemExpression = ['column', 'number', 'parenthesis'].includes(lastItem.type) && !(lastItem.type === 'parenthesis' && lastItem.value === '(');
        const isNewItemExpression = ['column', 'number'].includes(newItem.type) || (newItem.type === 'parenthesis' && newItem.value === '(');

        if (isLastItemExpression && isNewItemExpression) {
            showErrorAlert('追加エラー', '式の後に式を追加することはできません。演算子を追加してください。');
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
            if (!(lastItem.type === 'column' || lastItem.type === 'number' || (lastItem.type === 'parenthesis' && lastItem.value === ')'))) {
                showErrorAlert('追加エラー', '閉じ括弧 ")" の前には式または閉じ括弧 ")" が必要です。');
                return false;
            }
            return true;
        }

        return true;
    };

    const handleAddColumn = () => {
        const newItem: FormulaItem = { type: 'column', value: currentColumn };
        if (!validateAddition(newItem)) {
            return;
        }
        setFormula([...formula, newItem]);
    };

    const handleAddOperation = () => {
        const newItem: FormulaItem = { type: 'operation', value: currentOperation };
        if (!validateAddition(newItem)) {
            return;
        }
        setFormula([...formula, newItem]);
    };

    const handleAddNumber = () => {
        const newItem: FormulaItem = { type: 'number', value: currentNumber };
        if (!validateAddition(newItem)) {
            return;
        }
        setFormula([...formula, newItem]);
    };

    const handleAddParenthesis = (paren: '(' | ')') => {
        const newItem: FormulaItem = { type: 'parenthesis', value: paren };
        if (!validateAddition(newItem)) {
            return;
        }
        setFormula([...formula, newItem]);
    };

    const handleOpenModal = (column: string) => {
        console.log(column);
        showConfirmationAlert("欠損値確認", "データに欠損値がある為、選択できません。欠損値を補完するページに遷移しますか？", "はい", "いいえ").then(
            (result) => {
                if (result.isConfirmed) {
                    navigate("/miss-input")
                }
            }
        )
    }

    const selectStyles = {
        fontSize: "20px",
        borderRadius: "50px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        "& .MuiSelect-icon": {
            fontSize: "20px",
        },
        "& .MuiSelect-select": {
            padding: "10px 14px",
        },
    };

    const inputPropsStyles = {
        padding: "10px 14px",
    };

    const buttonStyles = {
        width: '40px',
        height: '40px',
        display: 'flex',
        backgroundColor: '#1976d2',
        color: 'white',
        borderRadius: '50%',
        '&:hover': { backgroundColor: '#1565c0' },
    };

    const sectionBoxStyles = {
        flex: '1',
        backgroundColor: '#FFFFFF',
        borderRadius: '50px',
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        overflow: 'hidden',
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Box
                sx={{
                    backgroundColor: '#EAEAEA',
                    borderRadius: '20px',
                    padding: 2,
                    mt: 1,
                    mb: 1,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        justifyContent: 'space-between',
                    }}
                >
                    {/* 量的カラムの選択と追加ボタン */}
                    {quantitativeColumns.length > 1 ? (
                        <Box sx={sectionBoxStyles}>
                            <FormControl variant="outlined" sx={{ flex: 1 }}>
                                <InputLabel id="quantitative-column-label">量的カラムを選択</InputLabel>
                                <Select
                                    labelId="quantitative-column-label"
                                    value={currentColumn}
                                    onChange={(event) => {
                                        const selectedValue = event.target.value;
                                        if (quantitativeMissColumns.includes(selectedValue)) {
                                            event.preventDefault(); // 無効な項目が選ばれた場合、選択を防ぐ
                                            handleOpenModal(selectedValue); // モーダルを開く処理
                                        } else {
                                            setCurrentColumn(selectedValue); // 有効な項目は状態を変更
                                        }
                                    }}
                                    label="量的カラムを選択"
                                    sx={selectStyles}
                                    inputProps={{
                                        sx: inputPropsStyles,
                                    }}
                                >
                                    {quantitativeColumns.map((column) => (
                                        <MenuItem
                                            key={column}
                                            value={column}
                                            sx={{
                                                color: quantitativeMissColumns.includes(column) ? 'red' : 'black', // 条件で文字色を設定
                                                opacity: quantitativeMissColumns.includes(column) ? '0.5' : '1'
                                            }}
                                        >
                                            {column}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <IconButton
                                sx={buttonStyles}
                                onClick={handleAddColumn}
                            >
                                <AddIcon />
                            </IconButton>
                        </Box>
                    ) : (
                        <></>
                    )}
                    

                    {/* 演算子の選択と追加ボタン */}
                    <Box sx={sectionBoxStyles}>
                        <FormControl variant="outlined" sx={{ flex: 1 }}>
                            <InputLabel id="quantitative-operation-select-label">演算子</InputLabel>
                            <Select
                                labelId="quantitative-operation-select-label"
                                value={currentOperation}
                                onChange={(event) => setCurrentOperation(event.target.value)}
                                label="演算子"
                                sx={selectStyles}
                                inputProps={{
                                    sx: inputPropsStyles,
                                }}
                            >
                                {['+', '-', '*', '/', '%'].map((op) => (
                                    <MenuItem key={op} value={op}>
                                        {op}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <IconButton
                            sx={buttonStyles}
                            onClick={handleAddOperation}
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>

                    {/* 数値の入力と追加ボタン */}
                    <Box sx={sectionBoxStyles}>
                        <TextField
                            type="number"
                            label="数値を入力"
                            variant="outlined"
                            value={currentNumber}
                            onChange={(event) => setCurrentNumber(Number(event.target.value))}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '20px',
                                    '& fieldset': {
                                        borderRadius: '20px',
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    fontSize: '20px',
                                    padding: '10px 14px',
                                },
                            }}
                        />
                        <IconButton
                            sx={buttonStyles}
                            onClick={handleAddNumber}
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Box>

                {/* 括弧の追加ボタン */}
                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ flex: '1 1 auto', borderRadius: '50px', backgroundColor: 'white', fontWeight: 'bold' }}
                        onClick={() => handleAddParenthesis('(')}
                    >
                        (
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ flex: '1 1 auto', borderRadius: '50px', backgroundColor: 'white', fontWeight: 'bold' }}
                        onClick={() => handleAddParenthesis(')')}
                    >
                        )
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default QuantitativeEngineering;
