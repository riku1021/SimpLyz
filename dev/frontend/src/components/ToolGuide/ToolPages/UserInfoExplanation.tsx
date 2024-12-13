import React from 'react';
import GuideSection from '../GuideScreen';
import UserInfoImage from '../../../assets/images/UserInfoImage.png';

const UserInfoExplanation: React.FC = () => {
    return (
        <GuideSection
            title="ユーザー情報ページ"
            imageSrc={UserInfoImage}
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

export default UserInfoExplanation;
