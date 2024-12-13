import React from 'react';
import GuideSection from '../GuideScreen';
import UserInfoImage from '../../../assets/images/UserInfoImage.png';

const UserInfoExplanation: React.FC = () => {
    return (
        <GuideSection
            title="ユーザー情報ページ"
            imageSrc={UserInfoImage}
            description={[
                `【メールアドレス・パスワード変更】
                ここではメールアドレスとパスワードを変更することができます。
                変更には現在のパスワードが必要になります。`,
                `【GeminiAPIキーの設定】
                ここではGeminiのAPIキーを設定することができます。
                GeminiのAPIキーを設定することで「データ分析」ページで生成AIがデータ分析の補助をしてくれます。
                APIキーの設定にもパスワードが必要になります。
                `,
                `【ログアウトボタン】
                ここではログアウトをすることができます。`,
            ]}
        />
    );
};

export default UserInfoExplanation;
