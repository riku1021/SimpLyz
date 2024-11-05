import { useState, useEffect, useCallback } from 'react';
import { CardContent, Box } from '@mui/material';

function DataVisualization({ image }) {
    const [isPortrait, setIsPortrait] = useState(false);

    // useCallbackを使ってcheckImageAspectRatioをメモ化
    const checkImageAspectRatio = useCallback(() => {
        const img = new Image();
        img.src = `data:image/png;base64,${image}`;
        img.onload = () => {
            setIsPortrait(img.height > img.width);
        };
    }, [image]);

    // 画像が変更されたときにアスペクト比をチェック
    useEffect(() => {
        if (image) {
            checkImageAspectRatio();
        }
    }, [image, checkImageAspectRatio]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)', width: '100%' }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, width: '100%' }}>
                {image ? (
                    <img
                        src={`data:image/png;base64,${image}`}
                        alt="Seaborn Plot"
                        style={{
                            width: isPortrait ? 'auto' : '100%',
                            height: isPortrait ? '100%' : 'auto'
                        }}
                    />
                ) : (
                    <Box sx={{ textAlign: 'center', padding: 2 }}>No image available</Box>
                )}
            </CardContent>
        </Box>
    );
}

export default DataVisualization;
