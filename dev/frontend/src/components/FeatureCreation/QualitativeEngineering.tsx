// components/FeatureCreation/QualitativeEngineering.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

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

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" color="textSecondary">
                質的データのエンジニアリング機能実装予定
            </Typography>
        </Box>
    );
};

export default QualitativeEngineering;
