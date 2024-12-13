import React from 'react';
import GuideSection from '../GuideScreen';
import MissingValueImputationExplanationImage from '../../../assets/images/MissingValueImputationExplanation.png';

const FeatureCreationExplanation: React.FC = () => {
    return (
        <GuideSection
            title="特徴量作成ページ"
            imageSrc={MissingValueImputationExplanationImage}
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

export default FeatureCreationExplanation;
