import base64
import io
from typing import Any, Dict, List, Optional, Tuple

import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from pandas import DataFrame, Series

matplotlib.use("Agg")
import json

from scipy import interpolate
from sklearn.experimental import enable_iterative_imputer # type: ignore
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.impute import IterativeImputer, KNNImputer
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    mean_absolute_error,
    mean_squared_error,
    precision_score,
    r2_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder


def format_value(value):
    if isinstance(value, float):
        if abs(value) >= 10:
            return int(value)
        return round(value, 3)
    return value


def convert_to_serializable(obj):
    if isinstance(obj, (np.integer, np.floating)):
        return format_value(obj.item())
    elif isinstance(obj, (np.ndarray, pd.Series)):
        return obj.tolist()
    elif pd.isna(obj):
        return None
    return obj


def get_df() -> DataFrame:
    """
    説明
    ----------
    データフレームを取得する関数

    Parameter
    ----------
    None

    Return
    ----------
    df : DataFrame
        csvファイルをデータフレームとして保存したもの

    """

    df = pd.read_csv("./uploads/demo.csv")
    load_dtype(df, "./uploads/dtypes.json")

    return df


def entropy(series):
    value_counts = series.value_counts(normalize=True)
    return -(value_counts * np.log2(value_counts)).sum()


# データの詳細情報の取得
def get_data_info() -> Dict[str, List]:
    df = get_df()
    qualitative_list = []
    quantitative_list = []

    for col in df.columns:
        common_info = {
            "データ型": str(df[col].dtype),
            "ユニークな値の数": convert_to_serializable(df[col].nunique()),
            "欠損値の数": convert_to_serializable(df[col].isnull().sum()),
            "欠損値の割合": format_value(
                convert_to_serializable(df[col].isnull().sum() / len(df))
            ),
        }

        if df[col].dtype == "int64" or df[col].dtype == "float64":
            quantitative_info = {
                "平均値": format_value(convert_to_serializable(df[col].mean())),
                "中央値": format_value(convert_to_serializable(df[col].median())),
                "標準偏差": format_value(convert_to_serializable(df[col].std())),
                "最小値": format_value(convert_to_serializable(df[col].min())),
                "最大値": format_value(convert_to_serializable(df[col].max())),
                "第1四分位数": format_value(
                    convert_to_serializable(df[col].quantile(0.25))
                ),
                "第3四分位数": format_value(
                    convert_to_serializable(df[col].quantile(0.75))
                ),
                "歪度": format_value(convert_to_serializable(df[col].skew())),
                "尖度": format_value(convert_to_serializable(df[col].kurtosis())),
                "変動係数": format_value(
                    convert_to_serializable(
                        df[col].std() / df[col].mean()
                        if df[col].mean() != 0
                        else np.nan
                    )
                ),
            }
            quantitative_list.append(
                {"column_name": col, "common": common_info, "data": quantitative_info}
            )
        else:
            qualitative_info = {
                "最頻値": convert_to_serializable(
                    df[col].mode().iloc[0] if not df[col].mode().empty else np.nan
                ),
                "最頻値の出現回数": convert_to_serializable(
                    df[col].value_counts().iloc[0]
                    if not df[col].value_counts().empty
                    else np.nan
                ),
                "最頻値の割合": format_value(
                    convert_to_serializable(
                        df[col].value_counts().iloc[0] / len(df)
                        if not df[col].value_counts().empty
                        else np.nan
                    )
                ),
                "カテゴリ数": convert_to_serializable(df[col].nunique()),
                "エントロピー": format_value(convert_to_serializable(entropy(df[col]))),
            }
            qualitative_list.append(
                {"column_name": col, "common": common_info, "data": qualitative_info}
            )

    send_data = {"qualitative": qualitative_list, "quantitative": quantitative_list}

    return send_data


def get_miss_columns() -> Dict[str, List]:
    """
    説明
    ----------
    欠損値があるカラムを取得する関数

    Parameter
    ----------
    None

    Return
    ----------
    Dict[str, List]
        量的変数と質的変数がkeyでvalueがそれぞれのカラム名をリストとして保存したもの

    """

    df = get_df()

    quantitative_miss_list = []
    qualitative_miss_list = []

    # 欠損値があるカラムについて調べ、量的か質的かで各リストに入れる
    for col in df.columns:
        if col == "JobRole":
            print(col, df["JobRole"][3], type(df[col][3]))
        if df[col].isnull().any():
            if df[col].dtype == "int64" or df[col].dtype == "float64":
                quantitative_miss_list.append(col)
            else:
                qualitative_miss_list.append(col)

    send_data = {
        "quantitative_miss_list": quantitative_miss_list,
        "qualitative_miss_list": qualitative_miss_list,
    }

    return send_data


def change_umeric_to_categorical(data: Dict[str, str]) -> None:
    """
    説明
    ----------
    数値データからカテゴリカルデータへ変換する関数

    Parameter
    ----------
    data : Dict[str, str]
        データフレーム

    Return
    ----------
    None

    """

    column = data["column_name"]

    df = get_df()

    df[column] = df[column].astype(str)

    save_dtype(df, "./uploads/dtypes.json")

    df.to_csv("./uploads/demo.csv", index=False)


def make_pie(data) -> str:
    """
    説明
    ----------
    円グラフの可視化をする関数

    Parameter
    ----------
    data : Dict[str, str]
        データフレーム

    Return
    ----------
    str

    """

    # 初期化
    plt.clf()

    column = data["column_name"]

    df = get_df()

    value_counts = df[column].value_counts()
    percentages = value_counts / len(df) * 100

    colors = sns.color_palette("pastel", n_colors=len(value_counts))

    # グラフの作成
    fig, (ax1, ax2) = plt.subplots(1, 2, gridspec_kw={"width_ratios": [3, 1]})

    # 円グラフの描画
    ax1.pie(
        value_counts.values, labels=value_counts.index, colors=colors, startangle=90
    )
    ax1.axis("equal")  # 円を真円に

    # パーセンテージの表示
    ax2.axis("off")
    for i, (index, percentage) in enumerate(percentages.items()):
        ax2.text(
            0,
            1 - i * 0.1,
            f"{index}: {percentage:.1f}%",
            fontsize=10,
            verticalalignment="top",
        )

    # タイトルの表示
    title = f"Distribution of {column}"
    fig.suptitle(title, fontsize=16)

    # バイナリデータにエンコード
    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    plot_url = base64.b64encode(buf.getvalue()).decode()

    return plot_url


def calculate(formula_list: List, row: Series) -> int:
    """
    説明
    ----------
    計算を行う関数

    Parameter
    ----------
    formula_list : List
        計算式を保管しているリスト
    row : Series
        シリーズ型

    Return
    ----------
    int

    """

    operator_map = {
        "addition": "+",
        "subtraction": "-",
        "multiplication": "*",
        "division": "/",
        "(": "(",
        ")": ")",
    }

    # 式を構築するために、演算子リストの要素を対応する記号に変換
    converted_expression = ""
    for item in formula_list:
        if item in operator_map:
            # 演算子の場合は記号に置き換え
            converted_expression += operator_map[item]
        elif item in row:
            # カラム名の場合は行の値を使用
            converted_expression += str(row[item])
        else:
            # それ以外はそのまま追加
            converted_expression += str(item)

    # 計算式を評価
    result = eval(converted_expression)

    return result


def make_feature_value(data: Dict[str, Any]) -> None:
    """
    説明
    ----------
    特徴量の作成する関数

    Parameter
    ----------
    data : Dict[str, Any]
        データフレーム

    Return
    ----------
    None

    """

    df = get_df()

    formula_list = data["formula"]
    new_column_name = data["new_column_name"]

    df[new_column_name] = df.apply(lambda row: calculate(formula_list, row), axis=1)

    df.to_csv("./uploads/demo.csv", index=False)


def prepare_data(
    df: DataFrame, target_column: str, exclude_columns: Optional[List[str]] = None
) -> Tuple[DataFrame, Series]:
    """
    説明
    ----------
    特徴量分析に必要な関数

    Parameter
    ----------
    df : DataFrame
        データフレーム
    target_column : str
        目的変数のカラム名
    exclude_columns : Optional[List[str]]
        特徴量分析に使用しないカラムのリスト

    Return
    ----------
    str
        分析結果のバイナリデータ

    """

    if exclude_columns is None:
        exclude_columns = []

    # 目的変数に欠損値があるか確認
    if df[target_column].isnull().any():
        df = df.dropna(subset=[target_column])

    columns_to_drop = [target_column] + exclude_columns
    X = df.drop(columns_to_drop, axis=1)
    y = df[target_column]

    for column in X.select_dtypes(include=["object", "category"]).columns:
        le = LabelEncoder()
        X[column] = le.fit_transform(X[column].astype(str))

    return X, y


def calculate_feature_importance(model, X: DataFrame) -> DataFrame:
    """
    説明
    ----------
    特徴量のカラムを取り出す

    Parameter
    ----------
    model
        ランダムフォレストのモデル
    X : DataFrame
        データフレーム

    Return
    ----------
    DataFrame
        特徴量を保存したデータフレーム

    """

    importances = model.feature_importances_
    feature_importance = pd.DataFrame({"feature": X.columns, "importance": importances})
    feature_importance = feature_importance.sort_values(
        "importance", ascending=False
    ).reset_index(drop=True)

    return feature_importance


def plot_feature_importance(feature_importance: DataFrame, top_n: int = 20) -> str:
    """
    説明
    ----------
    特徴量の重量度を表にし、バイナリデータとして返す関数

    Parameter
    ----------
    feature_importance : DataFrame
        データフレーム
    top_n : int
        上位いくつまで表に表示するか

    Return
    ----------
    str
        分析結果のバイナリデータ

    """

    # 初期化
    plt.clf()

    plt.figure(figsize=(12, 8))
    top_n = min(top_n, len(feature_importance))
    sns.barplot(x="importance", y="feature", data=feature_importance.head(top_n))
    plt.title(f"Top {top_n} Feature Importance")
    plt.xlabel("Importance")
    plt.ylabel("Feature")

    # バイナリデータにエンコード
    buf = io.BytesIO()
    plt.savefig(buf, format="png", dpi=100, bbox_inches="tight")
    buf.seek(0)
    plot_url = base64.b64encode(buf.getvalue()).decode()

    return plot_url


def evaluate_classification_model(
    X: DataFrame, y: Series, test_size: float = 0.2, random_state: int = 42
) -> str:
    """
    説明
    ----------
    分類モデルの処理とその結果を返す関数

    Parameter
    ----------
    X : DataFrame
        データフレーム
    y : Series
        目的変数のデータ
    test_size : float
        テストサイズ
    random_state : int
        乱数

    Return
    ----------
    str
        分析結果のバイナリデータ

    """

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )

    model = RandomForestClassifier(random_state=random_state)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average="weighted")
    recall = recall_score(y_test, y_pred, average="weighted")
    f1 = f1_score(y_test, y_pred, average="weighted")

    print("分類モデルの評価結果:")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1-score: {f1:.4f}")

    cm = confusion_matrix(y_test, y_pred)

    # 特徴量の重要度を計算して表示
    feature_importance = calculate_feature_importance(model, X)
    print("\n特徴量の重要度:")
    print(feature_importance)
    plot_url = plot_feature_importance(feature_importance)

    return plot_url


def evaluate_regression_model(
    X: DataFrame, y: Series, test_size: float = 0.2, random_state: int = 42
) -> str:
    """
    説明
    ----------
    回帰モデルの処理とその結果を返す関数

    Parameter
    ----------
    X : DataFrame
        データフレーム
    y : Series
        目的変数のデータ
    test_size : float
        テストサイズ
    random_state : int
        乱数

    Return
    ----------
    str
        分析結果のバイナリデータ

    """

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )

    model = RandomForestRegressor(random_state=random_state)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print("回帰モデルの評価結果:")
    print(f"Mean Squared Error: {mse:.4f}")
    print(f"Root Mean Squared Error: {rmse:.4f}")
    print(f"Mean Absolute Error: {mae:.4f}")
    print(f"R-squared: {r2:.4f}")

    # 特徴量の重要度を計算して表示
    feature_importance = calculate_feature_importance(model, X)
    print("\n特徴量の重要度:")
    print(feature_importance)
    plot_url = plot_feature_importance(feature_importance)

    return plot_url


def feature_value_analysis(data: Dict[str, str]) -> str:
    """
    説明
    ----------
    特定の特徴量についての分析する関数

    Parameter
    ----------
    data : Dict[str, Any]
        データフレーム

    Return
    ----------
    str
        分析結果のバイナリデータ

    """

    df = get_df()

    column_name = data["column_name"]
    exclude_columns: List[str] = []  # 使わないカラムを指定

    X, y = prepare_data(df, column_name, exclude_columns)

    if df[column_name].dtype == "int64" or df[column_name].dtype == "float64":
        plot_url = evaluate_regression_model(X, y)
    else:
        plot_url = evaluate_classification_model(X, y)

    return plot_url


def impute_numeric(column: str, method: str = "mean") -> None:
    """
    説明
    ----------
    数値変数の補完する関数

    Parameter
    ----------
    column : str
        カラム名
    method : str
        補完の方法について

    Return
    ----------
    None

    """

    df_imputed = get_df()

    # 指定されたカラムが数値型かどうかをチェック
    if np.issubdtype(df_imputed[column].dtype, np.number):
        if method == "平均値補完":
            # 1. 平均値補完
            df_imputed[column] = df_imputed[column].fillna(df_imputed[column].mean())

        elif method == "中央値補完":
            # 2. 中央値補完
            df_imputed[column] = df_imputed[column].fillna(df_imputed[column].median())

        elif method == "定数値補完":
            # 4. 定数値補完 (ここでは0を使用)
            df_imputed[column] = df_imputed[column].fillna(0)

        # elif method == 'ffill':
        #     # 5. 前方補完 (Forward Fill)
        #     df_imputed[column] = df_imputed[column].fillna(method='ffill')

        # elif method == 'bfill':
        #     # 6. 後方補完 (Backward Fill)
        #     df_imputed[column] = df_imputed[column].fillna(method='bfill')

        elif method == "線形補完":
            # 7. 線形補完
            df_imputed[column] = df_imputed[column].interpolate(method="linear")

        elif method == "スプライン補完":
            # 8. スプライン補間
            mask = df_imputed[column].notnull()
            x = np.where(mask)[0]
            y = df_imputed.loc[mask, column]
            if len(x) > 3:  # スプライン補間には少なくとも4点が必要
                f = interpolate.interp1d(x, y, kind="cubic", fill_value="extrapolate")
                df_imputed.loc[:, column] = f(np.arange(len(df_imputed)))

        elif method == "KNN補完":
            # 12. KNN (K-Nearest Neighbors) 補完
            imputer = KNNImputer(n_neighbors=5)
            df_imputed[column] = imputer.fit_transform(df_imputed[[column]])

        # elif method == 'mice':
        #     # 13. MICE (Multivariate Imputation by Chained Equations)
        #     imputer = IterativeImputer(random_state=0)
        #     df_imputed[column] = imputer.fit_transform(df_imputed[[column]])

        elif method == "random_forest":
            # 14. ランダムフォレスト補完
            imputer = IterativeImputer(
                estimator=RandomForestRegressor(), random_state=0
            )
            df_imputed[column] = imputer.fit_transform(df_imputed[[column]])
    else:
        print(f"警告: カラム '{column}' は数値型ではありません。補完は行われません。")

    df_imputed.to_csv("./uploads/demo.csv", index=False)


def impute_categorical(column: str, method: str = "mode"):
    """
    説明
    ----------
    カテゴリカル変数の補完する関数

    Parameter
    ----------
    column : str
        カラム名
    method : str
        補完の方法について

    Return
    ----------
    None

    """

    df_imputed = get_df()

    # 指定されたカラムがカテゴリカル型または文字列型かどうかをチェック
    if (
        df_imputed[column].dtype == "object"
        or df_imputed[column].dtype.name == "category"
    ):
        if method == "最頻値補完":
            # 3. 最頻値補完
            df_imputed[column] = df_imputed[column].fillna(
                df_imputed[column].mode().iloc[0]
            )

        elif method == "定数値補完":
            # 4. 定数値補完 (ここでは'Unknown'を使用)
            df_imputed[column] = df_imputed[column].fillna("Unknown")

        # elif method == 'ffill':
        #     # 5. 前方補完 (Forward Fill)
        #     df_imputed[column] = df_imputed[column].fillna(method='ffill')

        # elif method == 'bfill':
        #     # 6. 後方補完 (Backward Fill)
        #     df_imputed[column] = df_imputed[column].fillna(method='bfill')

        elif method == "ホットデッキ法":
            # 17. ホットデッキ法
            null_mask = df_imputed[column].isnull()
            non_null_values = df_imputed.loc[~null_mask, column]
            df_imputed.loc[null_mask, column] = np.random.choice(
                non_null_values, size=null_mask.sum()
            )
    else:
        print(
            f"警告: カラム '{column}' はカテゴリカル型または文字列型ではありません。補完は行われません。"
        )

    df_imputed.to_csv("./uploads/demo.csv", index=False)


def save_dtype(df: DataFrame, filename: str) -> None:
    """
    説明
    ----------
    データ型情報を保存する関数

    Parameter
    ----------
    df : DataFrame
        データフレーム
    filename : str
        データフレームの型情報を保存しているファイルのpath

    Return
    ----------
    None

    """

    dtypes = {col: str(dtype) for col, dtype in df.dtypes.items()}

    with open(filename, "w") as f:
        json.dump(dtypes, f)


def load_dtype(df: DataFrame, filename: str) -> None:
    """
    説明
    ----------
    データ型情報を読み込む関数

    Parameter
    ----------
    df : DataFrame
        データフレーム
    filename : str
        データフレームの型情報を保存しているファイルのpath

    Return
    ----------
    None

    """

    with open(filename, "r") as f:
        dtypes = json.load(f)
    for col, dtype in dtypes.items():
        if dtype == "object":
            df[col] = df[col].astype(str)
            df[col] = df[col].replace("nan", np.nan)
        elif dtype == "int64":
            df[col] = df[col].astype(int)


if __name__ == "__main__":
    df = pd.read_csv("./uploads/demo.csv")
    column = "Attrition"
    print(df[column].dtype)
    df[column] = df[column].astype(str)
    print(df[column].dtype)
    # データ型情報を保存
    save_dtype(df, "./uploads/dtypes.json")
    df.to_csv("./uploads/demo3.csv", index=False)
    df = pd.read_csv("./uploads/demo3.csv")
    # 型情報を再適用
    load_dtype(df, "./uploads/dtypes.json")
    print(df[column].dtype)
