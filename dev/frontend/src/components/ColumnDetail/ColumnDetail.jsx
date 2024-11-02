import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, CircularProgress, Button, Card, CardContent } from '@mui/material';
import { showErrorAlert, showSuccessAlert } from '../../utils/alertUtils';

const ColumnDetail = () => {
    const { columnName, type } = useParams();
    const [category, setCategory] = useState('no');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchImage = async () => {
            const response = await fetch('http://127.0.0.1:5000/feature_analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ column_name: columnName }),
            });
            const data = await response.json();
            setImage(data.image_data);
            setLoading(false);
            console.log(data.image_data);
        };

        fetchImage();
    }, [columnName]);

    const handleChange = (event) => {
        setCategory(event.target.value);
    };

    const handleSubmit = async () => {
        if (category === 'yes') {
            const response = await fetch('http://127.0.0.1:5000/change_numeric_to_categorical', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ column_name: columnName }),
            });
            if (response.ok) {
                showSuccessAlert('成功', 'カテゴリカルデータに変更しました');
            } else {
                showErrorAlert('エラー', '変更に失敗しました');
            }
        }
        navigate('/data-info');
    };

    const handleBack = () => {
        navigate('/data-info');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <div style={{ marginTop: '64px' }}></div>
            <Box p={3} display="flex" justifyContent="center" alignItems="center">
                <Card>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>{columnName} の詳細</Typography>
                        {type === 'quantitative' && (
                            <>
                                <Typography variant="h6">カテゴリカルデータに変更しますか？</Typography>
                                <RadioGroup value={category} onChange={handleChange}>
                                    <FormControlLabel value="yes" control={<Radio />} label="はい" />
                                    <FormControlLabel value="no" control={<Radio />} label="いいえ" />
                                </RadioGroup>
                                <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '16px' }}>
                                    決定
                                </Button>
                            </>
                        )}
                        <Box mt={3}>
                            <Typography variant="h6">特徴量分析結果</Typography>
                            <img
                                src={`data:image/png;base64,${image}`}
                                alt="分析結果"
                                style={{ width: '1000px', height: '900px', objectFit: 'contain' }}
                            />
                        </Box>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleBack}
                            sx={{ marginTop: '16px', width: '100%' }}
                        >
                            戻る
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
}

export default ColumnDetail;
