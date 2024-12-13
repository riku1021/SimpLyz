import React from 'react';
import GuideSection from '../GuideScreen';
import ColumnDetailImage from '../../../assets/images/ColumnDetailImage.png';

const ColumnDetailExplanation: React.FC = () => {
    return (
        <GuideSection
            title="カラム詳細ページ"
            imageSrc={ColumnDetailImage}
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

export default ColumnDetailExplanation;
