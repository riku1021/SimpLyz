import React from 'react';
import GuideSection from '../GuideScreen';
import MissingValueImputationImage from '../../../assets/images/MissingValueImputationImage.png';

const MissingValueImputationExplanation: React.FC = () => {
    return (
        <GuideSection
            title="欠損値補完ページ"
            imageSrc={MissingValueImputationImage}
            description={[
                `【数値データの欠損値補完】
                ここでは数値データの欠損値を他の値で補完することができます。
                欠損値の補完は以下の方法から任意に選択することができます。
                ・平均値補完
                ○欠損値がある列の他の値の平均を計算し、その平均値で欠損値を埋める方法
                ・中央値補完
                ○欠損値がある列の他の値の中央値を計算し、その中央値で欠損値を埋める方法
                ・定数値補完
                ○欠損値を「0」で埋める方法
                ・線形補完
                ○直前と直後のデータポイントを基に、線形な変化を仮定して欠損値を埋める方法
                ・スプライン補完
                ○データの曲線的な変化を補完する手法
                ・KNN補完
                ○欠損していないデータから最も距離が近いK個のデータポイントを見つけ、欠損値を埋める方法
                ・ランダムフォレスト補完
                ○ランダムフォレストアルゴリズムを使って欠損値を予測することで補完する方法`,
                `【質的データの欠損値補完】
                ここでは質的データの欠損値を他の値で補完することができます。
                欠損値の保管は以下の方法から任意に選択することができます。
                ・最頻値補完
                ○欠損値がある列の最も頻繁に出現する値を使って欠損値を埋める方法
                ・定数地補完
                ○欠損値を「Unknown」で埋める方法
                ・ホットデッキ法
                ○欠損値を持つデータポイントに対して、欠損していないデータポイントの中からランダムに似たケースを選び、その値で欠損値を補完する方法
                `,
            ]}
        />
    );
};

export default MissingValueImputationExplanation;
