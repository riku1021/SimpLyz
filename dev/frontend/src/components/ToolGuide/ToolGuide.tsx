import { Box } from '@mui/material';
import ManagementFileExplanation from './ToolPages/ManagementFileExplanation';
import DataInfoExplanation from './ToolPages/DataInfoExplanation';
import ColumnDetailExplanation from './ToolPages/ColumnDetailExplanation';
import MissingValueImputationExplanation from './ToolPages/MissingValueImputationExplanation';
import FeatureCreationExplanation from './ToolPages/FeatureCreationExplanation';
import DataAnalysisExplanation from './ToolPages/DataAnalysisExplanation';
import UserInfoExplanation from './ToolPages/UserInfoExplanation';

const ToolGuide: React.FC = () => {
    return (
        <Box
            sx={{
                width: '60%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f9f9f9',
                margin: '0 auto',
                p: 3,
                gap: 20
            }}
        >
            <ManagementFileExplanation />
            <DataInfoExplanation />
            <ColumnDetailExplanation />
            <MissingValueImputationExplanation />
            <FeatureCreationExplanation />
            <DataAnalysisExplanation />
            <UserInfoExplanation />
        </Box>
    );
};

export default ToolGuide;
