import React from 'react';
import GuideSection from '../GuideScreen';
import FeatureCreationQualitativeImage from '../../../assets/images/FeatureCreationQualitativeImage.png';

const FeatureCreationQualitativeExplanation: React.FC = () => {
    return (
        <GuideSection
            title="特徴量作成ページ（質的データ）"
            imageSrc={FeatureCreationQualitativeImage}
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

export default FeatureCreationQualitativeExplanation;
