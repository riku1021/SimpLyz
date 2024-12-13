import React from 'react';
import GuideSection from '../GuideScreen';
import DataAnalysisImage from '../../../assets/images/DataAnalysisImage.png';

const DataAnalysisExplanation: React.FC = () => {
    return (
        <GuideSection
            title="データ分析ページ"
            imageSrc={DataAnalysisImage}
            description={[
                `欠損値のあるデータをアップロードできます。
                ああああああああああああああああああああああ
                あああ`,
                `欠損値の補完方法を選択できます。
                `,
                `補完後のデータをダウンロードできます。`,
            ]}
        />
    );
};

export default DataAnalysisExplanation;
