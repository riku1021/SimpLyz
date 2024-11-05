import { useState, useEffect, useCallback } from 'react';
import { CardContent, Box, CircularProgress } from '@mui/material';

function DataVisualization({ image }) {
    const [isPortrait, setIsPortrait] = useState(false);

    const checkImageAspectRatio = useCallback(() => {
        const img = new Image();
        img.src = `data:image/png;base64,${image}`;
        img.onload = () => {
            setIsPortrait(img.height > img.width);
        };
    }, [image]);

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
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}
            </CardContent>
        </Box>
    );
}

export default DataVisualization;
