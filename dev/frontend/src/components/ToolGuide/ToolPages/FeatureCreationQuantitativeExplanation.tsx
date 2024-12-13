import React from 'react';
import GuideSection from '../GuideScreen';
import FeatureCreationQuantitativeImage from '../../../assets/images/FeatureCreationQuantitativeImage.png';

const FeatureCreationQuantitativeExplanation: React.FC = () => {
    return (
        <GuideSection
            title="特徴量作成ページ（量的データ）"
            imageSrc={FeatureCreationQuantitativeImage}
            description={[
                `【式のプレビュー欄】  
                ここには、現在作成中の式が表示されます。この欄は、操作したボタン（量的カラム、演算子、数値など）に応じてリアルタイムで更新されます。初心者の方は、このプレビューを確認しながら進めることで、式の内容を間違えずに作成することができます。
                例えば、「体重 / (身長 * 身長)」のようなBMI計算式が完成した際には、この欄に最終的な式が表示されます。`,

                `【式を作成する入力エリア】  
                量的カラム、演算子（+, -, *, /, %）、数値、そして括弧を使って、独自の式を作成するためのエリアです。選択できるカラムは、アップロードしたデータに基づいており、クリックするだけで式に追加されます。  
                注意点として、式のルールに従わない操作（例：演算子の直後に別の演算子を追加するなど）はエラーとして扱われ、追加することができません。このような設計により、誤った式を作成するリスクが軽減されます。`,

                `【削除ボタン】  
                作成中の式から項目を削除したり、式全体をリセットするためのボタンです。「最後の項目を削除」ボタンは直近で追加した内容を1つだけ削除します。一方、「すべての項目を削除」ボタンは、現在の式全体をクリアします。誤って不要な項目を追加した場合でも簡単に修正できますので、初心者の方でも安心して操作が可能です。`,

                `【新しいカラム名の入力欄】  
                ここでは、作成した特徴量の名前を設定できます。例えば、「BMI」や「体重比率」など、後から見てもわかりやすい名前を付けることを推奨します。名前を付けることで、複数の特徴量を作成した際にも管理が容易になります。`,

                `【カラム作成ボタン】  
                作成した式が完成したら、このボタンをクリックして特徴量を確定します。注意点として、不適切な式（例：0で割るなどのエラーが含まれる場合）はカラムを作成することができません。その場合、エラーメッセージが表示されるため、式を確認して修正しましょう。`,

                `【質的データの特徴量作成ページ遷移ボタン】  
                このボタンを押すと、質的データ（カテゴリカル型データ）用の特徴量作成ページへ移動します。異なるデータ型に応じた特徴量作成を効率よく切り替えられるよう設計されています。`,
            ]}
        />
    );
};

export default FeatureCreationQuantitativeExplanation;
