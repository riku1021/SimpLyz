import { Box } from '@mui/material';
import ManagementFileExplanation from './ManagementFileExplanation';
import MissingValueImputationExplanation from './MissingValueImputationExplanation';

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
            <MissingValueImputationExplanation />
        </Box>
    );
};

export default ToolGuide;
