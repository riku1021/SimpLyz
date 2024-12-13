import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import {
    Description as DescriptionIcon,
    Info as InfoIcon,
    Addchart as AddchartIcon,
    AccountTree as AccountTreeIcon,
    Create as CreateIcon,
    QueryStats as QueryStatsIcon,
    AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';

import ManagementFileExplanation from './ToolPages/ManagementFileExplanation';
import DataInfoExplanation from './ToolPages/DataInfoExplanation';
import ColumnDetailExplanation from './ToolPages/ColumnDetailExplanation';
import MissingValueImputationExplanation from './ToolPages/MissingValueImputationExplanation';
import FeatureCreationQuantitativeExplanation from './ToolPages/FeatureCreationQuantitativeExplanation';
import FeatureCreationQualitativeExplanation from './ToolPages/FeatureCreationQualitativeExplanation';
import DataAnalysisExplanation from './ToolPages/DataAnalysisExplanation';
import UserInfoExplanation from './ToolPages/UserInfoExplanation';

const ToolGuide: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<string>('ManagementFile');

    const renderComponent = () => {
        switch (activeComponent) {
            case 'ManagementFile':
                return <ManagementFileExplanation />;
            case 'DataInfo':
                return <DataInfoExplanation />;
            case 'ColumnDetail':
                return <ColumnDetailExplanation />;
            case 'MissingValueImputation':
                return <MissingValueImputationExplanation />;
            case 'FeatureCreationQuantitative':
                return <FeatureCreationQuantitativeExplanation />;
            case 'FeatureCreationQualitative':
                return <FeatureCreationQualitativeExplanation />;
            case 'DataAnalysis':
                return <DataAnalysisExplanation />;
            case 'UserInfo':
                return <UserInfoExplanation />;
            default:
                return null;
        }
    };

    const buttonConfig = [
        { id: 'ManagementFile', label: 'ファイル管理', icon: <DescriptionIcon /> },
        { id: 'DataInfo', label: 'データ情報', icon: <InfoIcon /> },
        { id: 'ColumnDetail', label: 'カラム詳細', icon: <AddchartIcon /> },
        { id: 'MissingValueImputation', label: '欠損値補完', icon: <AccountTreeIcon /> },
        { id: 'FeatureCreationQuantitative', label: '特徴量作成（量的データ）', icon: <CreateIcon /> },
        { id: 'FeatureCreationQualitative', label: '特徴量作成（質的データ）', icon: <CreateIcon /> },
        { id: 'DataAnalysis', label: 'データ分析', icon: <QueryStatsIcon /> },
        { id: 'UserInfo', label: 'ユーザー情報', icon: <AccountCircleIcon /> },
    ];

    return (
        <Box
            sx={{
                width: '80%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f9f9f9',
                margin: '0 auto',
                p: 3,
                gap: 2,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    mb: 3,
                }}
            >
                {buttonConfig.map(({ id, label, icon }) => (
                    <Button
                        key={id}
                        variant={activeComponent === id ? 'contained' : 'outlined'}
                        startIcon={icon}
                        onClick={() => setActiveComponent(id)}
                        sx={{
                            borderRadius: '50px',
                            fontWeight: 'bold',
                            ...(activeComponent !== id && {
                                borderWidth: '3px',
                                borderColor: '#1976d2',
                            }),
                        }}
                    >
                        {label}
                    </Button>
                ))}
            </Box>
            {renderComponent()}
        </Box>
    );
};

export default ToolGuide;
