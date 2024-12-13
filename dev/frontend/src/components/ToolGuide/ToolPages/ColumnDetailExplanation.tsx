import React from 'react';
import GuideSection from '../GuideScreen';
import ColumnDetailImage from '../../../assets/images/ColumnDetailImage.png';

const ColumnDetailExplanation: React.FC = () => {
    return (
        <GuideSection
            title="カラム詳細ページ"
            imageSrc={ColumnDetailImage}
            description={[
                `【特徴量重要度表示欄】  
                このエリアでは、選択したカラムに関連する特徴量の重要度が視覚的に示されています。グラフは横棒グラフ形式で、上位20個までの特徴量がリストアップされます。  
                - 棒の長さ: 特徴量の重要度を示し、値が大きいほどモデルに与える影響が強いことを意味します。  
                - ラベル: 各特徴量の名前が縦軸に表示されます。例えば、"petal_width" や "sepal_length" などが含まれます。  
                この情報を基に、どのカラムが選択したカラムに対して重要な役割を果たしているかを直感的に把握することができます。初心者にとっても、データの特徴を理解するための出発点となります。`,

                `【戻るボタン】  
                このボタンをクリックすると、前の画面に戻ることができます。分析結果を確認した後、別のカラムの詳細を見たい場合などに便利です。
                初心者でも操作が迷わないよう、シンプルな設計になっています。`,
            ]}
        />
    );
};

export default ColumnDetailExplanation;
