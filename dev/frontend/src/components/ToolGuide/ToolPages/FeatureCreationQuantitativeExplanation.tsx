import React from 'react';
import GuideSection from '../GuideScreen';
import FeatureCreationQuantitativeImage from '../../../assets/images/FeatureCreationQuantitativeImage.png';

const FeatureCreationQuantitativeExplanation: React.FC = () => {
    return (
        <GuideSection
            title="特徴量作成ページ（量的データ）"
            imageSrc={FeatureCreationQuantitativeImage}
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

export default FeatureCreationQuantitativeExplanation;
