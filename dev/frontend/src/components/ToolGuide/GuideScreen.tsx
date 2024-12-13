import React from 'react';
import { Typography, Box } from '@mui/material';

interface GuideSectionProps {
    title: string;
    description: string[];
    imageSrc: string;
}

const GuideSection: React.FC<GuideSectionProps> = ({ title, imageSrc, description }) => {
    return (
        <Box sx={{ marginBottom: 5 }}>
            <Typography
                variant="h4"
                sx={{
                    borderLeft: '8px solid',
                    borderColor: '#1976d2',
                    paddingLeft: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                }}
                gutterBottom
            >
                {title}
            </Typography>
            <Box
                sx={{
                    width: '80%',
                    margin: '0 auto',
                }}
            >
                <Box
                    component="img"
                    src={imageSrc}
                    alt={title}
                    sx={{
                        width: '100%',
                        display: 'block',
                    }}
                />
                <Typography variant="h6" component="ol" sx={{ marginTop: 3 }}>
                    {description.map((desc, index) => (
                        <li key={index} style={{ marginBottom: '40px', whiteSpace: 'pre-line' }}>
                            {desc}
                        </li>
                    ))}
                </Typography>
            </Box>
        </Box>
    );
};

export default GuideSection;
