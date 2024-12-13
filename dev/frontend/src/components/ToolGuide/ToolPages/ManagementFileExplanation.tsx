import React from 'react';
import GuideSection from '../GuideScreen';
import ManagementFileImage from '../../../assets/images/ManagementFileImage.png';

const ManagementFileExplanation: React.FC = () => {
    return (
        <GuideSection
            title="ファイル管理ページ"
            imageSrc={ManagementFileImage}
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

export default ManagementFileExplanation;
