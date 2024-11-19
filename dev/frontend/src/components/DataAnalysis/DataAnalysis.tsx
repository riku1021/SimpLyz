import { useState } from 'react';

import CustomParams from './CustomParams/CustomParams';
import DataVisualization from './DataVisualization/DataVisualization';
import AnalysisChat from './AnalysisChat/AnalysisChat';

const DataAnalysis: React.FC = () => {
    const [selectChart, setSelectChart] = useState<string>('scatter');
    const [image, setImage] = useState<string>('');

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            <div style={{ flex: 2.3 }}>
                <div style={{ width: '100%', height: '100%' }}>
                    <CustomParams
                        setSelectChart={setSelectChart}
                        selectedChart={selectChart}
                        setImage={setImage}
                    />
                </div>
            </div>
            <div style={{ flex: 5 }}>
                <div style={{ backgroundColor: 'white', width: '100%', height: '100%' }}>
                    <DataVisualization image={image} />
                </div>
            </div>
            <div style={{ flex: 2.7 }}>
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <AnalysisChat image={image} />
                </div>
            </div>
        </div>
    );
};

export default DataAnalysis;
