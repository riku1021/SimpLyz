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
    TextField
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { BACKEND_URL } from '../../urlConfig';
import useAuth from '../../hooks/useAuth';

type FormulaItem = {
    type: 'column' | 'operation' | 'number' | 'parenthesis';
    value: string | number;
};

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

            setFormula([{ type: 'column', value: firstValue }]);
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

    // ドロップダウンの変更ハンドラー
    const handleColumnChange = (event: SelectChangeEvent<string>) => {
        const column = event.target.value;
        setSelectedColumn(column);
        const firstValue = qualitativeData[column][0];
        setSelectedValue(firstValue);
        setFormula([{ type: 'column', value: firstValue }]);
    };

    const handleOperationChange = (event: SelectChangeEvent<string>) => {
        const operation = event.target.value;
        setSelectedOperation(operation);
        setFormula([...formula, { type: 'operation', value: operation }]);
    };

    const handleValueChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        setSelectedValue(value);
        setFormula([...formula, { type: 'column', value }]);
    };

    // カスタムスタイルの定義
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
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Box>

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
                        {/* 量的データのカラム表示 */}
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
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Box>

                {/* 論理演算子 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', gap: 3 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ flex: 1, borderRadius: '50px', backgroundColor: 'white', fontWeight: 'bold' }}
                    >
                        and
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{ flex: 1, borderRadius: '50px', backgroundColor: 'white', fontWeight: 'bold' }}
                    >
                        or
                    </Button>
                </Box>
            </Box>
        </Box >
    );
};

export default QualitativeEngineering;
