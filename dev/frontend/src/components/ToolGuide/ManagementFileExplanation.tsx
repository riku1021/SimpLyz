import React from 'react';
import GuideSection from './GuideScreen';
import MissingValueImputationExplanationImage from '../../assets/images/MissingValueImputationExplanation.png';

const ManagementFileExplanation: React.FC = () => {
    return (
        <GuideSection
            title="欠損値補完ページ"
            imageSrc={MissingValueImputationExplanationImage}
            description={[
                '欠損値のあるデータをアップロードできます。ああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ',
                'AIを用いた欠損値の補完方法を選択できます。',
                '補完後のデータをダウンロードできます。',
            ]}
        />
    );
};

export default ManagementFileExplanation;
