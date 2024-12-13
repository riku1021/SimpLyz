import React from 'react';
import GuideSection from '../GuideScreen';
import DataInfoImage from '../../../assets/images/DataInfoImage.png';

const DataInfoExplanation: React.FC = () => {
    return (
        <GuideSection
            title="データ情報ページ"
            imageSrc={DataInfoImage}
            description={[
                `【カラム詳細確認ボタン】  
                左側に表示されている各カラム名のボタンをクリックすると、そのカラムに関連する特徴量分析結果を確認できます。たとえば、「Gender」のボタンを押すと、性別に関連したデータの特徴量分析が表示されます。この機能は、量的データと質的データのどちらにも対応しています。`,

                `【基本統計量一覧（共通情報）】  
                質的データと量的データの両方に共通する基本情報がこの一覧に含まれます。以下の項目が表示されます：  
                - データ型: カラムのデータ型（例: "object", "float64"）を示します。  
                - ユニークな値の数: 各カラムに存在する異なる値の総数を表示します。  
                - 欠損値の割合および数: データの欠損状況を確認でき、データ補完が必要かどうかを判断するのに役立ちます。
                
                【質的データ特有の情報】   
                - エントロピー: データの多様性を示し、値が高いほど情報量が多いことを表します。  
                - 最頻値および最頻値の割合: 最も頻繁に出現する値と、その割合を表示します。この情報は、データの偏りを理解するのに役立ちます。
                
                【量的データ特有の情報】
                - 中央値: データの中央値を示します。  
                - 平均値、最小値、最大値: データの範囲や中心傾向を把握するための指標です。  
                - 標準偏差: データのばらつき具合を示します。  
                - 尖度および歪度: データの分布形状を理解するための指標です。尖度は分布の鋭さを、歪度は分布の左右非対称性を表します。  
                - 第1四分位数、第3四分位数: データの分布をさらに詳細に把握するための指標です。`,

                `【表示するデータ型のページを変更ボタン】  
                画面右上にあるボタンを使用すると、「質的データ」から「量的データ」へ、またはその逆にページを切り替えることができます。これにより、異なるデータ型の情報を効率的に確認でき、全体のデータ特性を把握する際に非常に便利です。`,
            ]}
        />
    );
};

export default DataInfoExplanation;
