import React from 'react';
import GuideSection from '../GuideScreen';
import DataAnalysisImage from '../../../assets/images/DataAnalysisImage.png';

const DataAnalysisExplanation: React.FC = () => {
    return (
        <GuideSection
            title="データ分析ページ"
            imageSrc={DataAnalysisImage}
            description={[
                `【データの可視化の種類】
                ここではデータの可視化の種類を選択することができます。
                データの可視化は全部で4つあり、「散布図」「ヒストグラム」「箱ひげ図」「円グラフ」から任意に選択し、画面に表示することができます。`,
                `【データ可視化時のパラメーター】
                ここではデータの可視化時のパラメーターを選択することができます。
                パラメーターの種類や数はデータの可視化の種類によって変化します。
                `,
                `【マルチモーダル機能】
                ここではボタンを押すことで、可視化したデータを生成AIに読み込ますことができます。`,
                `【生成AIとの対話機能】
                ③でボタンを押すことで、生成AIにメッセージを送ることできるようになります。
                ここにメッセージを記述し、右の「送る」ボタンを押すことで生成AIに質問することができます。`,
                `【生成結果】
                ここでは③・④での生成AIの回答が表示されます。
                `
            ]}
        />
    );
};

export default DataAnalysisExplanation;
