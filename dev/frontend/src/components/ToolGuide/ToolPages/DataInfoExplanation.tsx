import React from 'react';
import GuideSection from '../GuideScreen';
import DataInfoImage from '../../../assets/images/DataInfoImage.png';

const DataInfoExplanation: React.FC = () => {
    return (
        <GuideSection
            title="データ情報ページ"
            imageSrc={DataInfoImage}
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

export default DataInfoExplanation;
