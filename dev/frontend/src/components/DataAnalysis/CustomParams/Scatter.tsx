import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, FormControl, InputLabel, MenuItem, Select, Grid, Typography, SelectChangeEvent } from '@mui/material';
import { BACKEND_URL } from '../../../urlConfig';

type ScatterProps = {
    setImage: (image: string) => void;
};

const Scatter: React.FC<ScatterProps> = ({ setImage }) => {
    const [variable1, setVariable1] = useState<string>('');
    const [variable2, setVariable2] = useState<string>('');
    const [target, setTarget] = useState<string>('');
    const [reg, setReg] = useState<boolean>(false);
    const [dimension, setDimension] = useState<number>(1);
    const [variableList, setVariableList] = useState<string[]>(['1', '2', '3']);
    const [targetList, setTargetList] = useState<string[]>(['t1', 't2', 't3']);

    useEffect(() => {
        const fetchVariable = async () => {
            try {
                const response = await axios.post(`${BACKEND_URL}/get_quantitative`, { a: 0 });
                const data = response.data;
                setVariableList(data.quantitative_variables);
                setVariable1(data.quantitative_variables[0]);
                setVariable2(data.quantitative_variables[1]);
            } catch (error) {
                console.error('Error fetching quantitative variables:', error);
            }
        };

        const fetchTarget = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/get_qualitative`);
                const data = response.data;
                const targets = [...data.qualitative_variables, 'None'];
                setTarget('None');
                setTargetList(targets);
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
                variable1,
                variable2,
                target,
                fit_reg: reg,
                order: dimension
            };
            try {
                const response = await axios.post(`${BACKEND_URL}/scatter`, sentData);
                const data = response.data;
                setImage(data.image_data);
            } catch (error) {
                console.error('Error fetching scatter image:', error);
            }
        };

        if (variable1 && variable2 && target) {
            fetchImage();
        }
    }, [variable1, variable2, target, reg, dimension, setImage]);

    const changeVariable1 = (e: SelectChangeEvent<string>) => setVariable1(e.target.value as string);
    const changeVariable2 = (e: SelectChangeEvent<string>) => setVariable2(e.target.value as string);
    const changeTarget = (e: SelectChangeEvent<string>) => setTarget(e.target.value as string);
    const changeReg = (e: SelectChangeEvent<string>) => {
        const newRegValue = e.target.value === "true";
        setReg(newRegValue);
        if (newRegValue) setDimension(1);
    };
    const changeDimension = (e: SelectChangeEvent<string>) => setDimension(parseInt(e.target.value, 10));

    const formControlStyles = {
        width: '100%',
        maxWidth: '280px',
        margin: '0 auto',
    };

    const selectStyles = {
        fontSize: '20px',
        borderRadius: '50px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        '& .MuiSelect-icon': {
            fontSize: '24px',
        },
        '& .MuiSelect-select': {
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
        },
    };

    const inputPropsStyles = {
        padding: '10px 20px',
    };

    return (
        <Grid container spacing={3} sx={{ marginTop: 1, padding: 2, justifyContent: 'center' }}>
            <Grid item>
                <Card variant="outlined" sx={{ borderRadius: '50px', padding: 2, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', width: '300px' }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ marginBottom: 2 }} gutterBottom>
                            Parameters
                        </Typography>
                        <Grid container direction="column" spacing={2}>
                            <Grid item>
                                <FormControl variant="outlined" sx={formControlStyles}>
                                    <InputLabel>Vertical</InputLabel>
                                    <Select
                                        value={variable1}
                                        onChange={changeVariable1}
                                        label="Vertical"
                                        sx={selectStyles}
                                        inputProps={{
                                            sx: inputPropsStyles,
                                        }}
                                    >
                                        {variableList.map((value, idx) => (
                                            value !== variable2 && <MenuItem key={idx} value={value}>{value}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl variant="outlined" sx={formControlStyles}>
                                    <InputLabel>Horizontal</InputLabel>
                                    <Select
                                        value={variable2}
                                        onChange={changeVariable2}
                                        label="Horizontal"
                                        sx={selectStyles}
                                        inputProps={{
                                            sx: inputPropsStyles,
                                        }}
                                    >
                                        {variableList.map((value, idx) => (
                                            value !== variable1 && <MenuItem key={idx} value={value}>{value}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl variant="outlined" sx={formControlStyles}>
                                    <InputLabel>Target</InputLabel>
                                    <Select
                                        value={target}
                                        onChange={changeTarget}
                                        label="Target"
                                        sx={selectStyles}
                                        inputProps={{
                                            sx: inputPropsStyles,
                                        }}
                                    >
                                        {targetList.map((value, idx) => (
                                            <MenuItem key={idx} value={value}>{value}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl variant="outlined" sx={formControlStyles}>
                                    <InputLabel>Regression</InputLabel>
                                    <Select
                                        value={reg.toString()}
                                        onChange={changeReg}
                                        label="Regression"
                                        sx={selectStyles}
                                        inputProps={{
                                            sx: inputPropsStyles,
                                        }}
                                    >
                                        <MenuItem value="false">false</MenuItem>
                                        <MenuItem value="true">true</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {reg && (
                                <Grid item>
                                    <FormControl variant="outlined" sx={formControlStyles}>
                                        <InputLabel>Dimension</InputLabel>
                                        <Select
                                            value={dimension.toString()}
                                            onChange={changeDimension}
                                            label="Dimension"
                                            sx={selectStyles}
                                            inputProps={{
                                                sx: inputPropsStyles,
                                            }}
                                        >
                                            <MenuItem value="1">1</MenuItem>
                                            <MenuItem value="2">2</MenuItem>
                                            <MenuItem value="3">3</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

export default Scatter;
