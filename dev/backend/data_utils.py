import base64
import io
import os
import uuid
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
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.experimental import enable_iterative_imputer  # type: ignore
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

Divide_By_Zero = False


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
    json_path = "./uploads/dtypes.json"
    if os.path.exists(json_path):
        load_dtype(df, json_path)

    return df


def entropy(series):
    value_counts = series.value_counts(normalize=True)
    return -(value_counts * np.log2(value_counts)).sum()


def get_data_info(df: DataFrame) -> Dict[str, List]:
    """データの詳細情報を取得する関数

    Args:
        df (DataFrame): データフレーム

    Returns:
        Dict[str, List]: 量的変数のカラム名と質的変数のカラム名をリストで管理している
    """

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


def get_miss_columns(df: DataFrame) -> Dict[str, List]:
    """
    説明
    ----------
    欠損値があるカラムを取得する関数

    Parameter
    ----------
    df: DataFrame

    Return
    ----------
    Dict[str, List]
        量的変数と質的変数がkeyでvalueがそれぞれのカラム名をリストとして保存したもの

    """

    # df = get_df()

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


def change_umeric_to_categorical(data: Dict[str, str], df: DataFrame) -> None:
    """
    説明
    ----------
    数値データから質的データへ変換する関数

    Parameter
    ----------
    data : Dict[str, str]
        データフレーム

    Return
    ----------
    None

    """

    column = data["column_name"]

    # df = get_df()

    df[column] = df[column].astype(str)

    # save_dtype(df, "./uploads/dtypes.json")

    # df.to_csv("./uploads/demo.csv", index=False)

    return df


def make_pie(data: Dict[str, Any], df: DataFrame) -> str:
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

    # df = get_df()

    value_counts = df[column].value_counts()[::-1]
    percentages = (value_counts / len(df) * 100)[::-1]

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

    # バイナリデータにエンコード
    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    plot_url = base64.b64encode(buf.getvalue()).decode()

    return plot_url


def calculate_quantitative(formula_list: List, row: Series) -> int:
    """
    説明
    ----------
    quantitativeに対応する計算を行う関数

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

    # 0除算があるかどうか
    global Divide_By_Zero

    # 式を構築
    befor_item = ""
    converted_expression = ""
    for item in formula_list:
        if item in ["+", "-", "*", "/", "%", "(", ")"]:  # 演算子の場合
            converted_expression += item
        elif item in row:  # カラム名の場合
            if befor_item == "/" and row[item] == 0:  # 0除算が起こるの場合
                Divide_By_Zero = True
                return None
            converted_expression += str(row[item])
        else:  # それ以外はそのまま追加
            if befor_item == "/" and item == 0:  # 0除算が起こるの場合
                Divide_By_Zero = True
                return None
            converted_expression += str(item)
        befor_item = item

    # 計算式を評価
    result = eval(converted_expression)

    return result


def calculate_qualitative(formula_list: List, row: Series) -> bool:
    """
    qualitativeに対応する計算を行う関数

    Parameters
    ----------
    formula_list : List
        条件式を構成するリスト
    row : Series
        データフレームの行を表すシリーズ型

    Returns
    ----------
    bool
        条件式の評価結果（True/False）
    """

    # 条件式を構築
    converted_expression = ""
    for i, item in enumerate(formula_list):
        if item in ["==", "!=", "<", ">", "<=", ">="]:
            # 左側（カラム名）と右側（値）の確認
            left = formula_list[i - 1]  # "=="の左側
            right = formula_list[i + 1]  # "=="の右側

            # 左側はカラム名であるべき
            if left not in row:
                raise ValueError(f"'{left}' is not a valid column name in the data.")

            # データ型に基づく処理
            left_value = row[left]
            if isinstance(left_value, (int, float)) and not isinstance(
                right, (int, float)
            ):
                raise TypeError(
                    f"Expected numeric value on the right side of '==' for column '{left}', got '{right}'"
                )
            if isinstance(left_value, str) and not isinstance(right, str):
                raise TypeError(
                    f"Expected string value on the right side of '==' for column '{left}', got '{right}'"
                )

        if item in ["==", "!=", "<", ">", "<=", ">=", "and", "or", "(", ")"]:
            converted_expression += f" {item} "
        elif item in row:
            converted_expression += (
                f"'{row[item]}'" if isinstance(row[item], str) else str(row[item])
            )
        else:
            converted_expression += f"'{item}'" if isinstance(item, str) else str(item)

    # 条件式を評価
    result = eval(converted_expression)
    return "True" if result else "False"


def make_feature_value(data: Dict[str, Any], df: DataFrame) -> None:
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
    DataFrame

    """

    # 0除算があるかどうか
    global Divide_By_Zero

    Divide_By_Zero = False

    formula_list = data["formula"]
    new_column_name = data["new_column_name"]
    feature_type = data["feature_type"]  # quantitative or qualitative

    if feature_type == "quantitative":
        df[new_column_name] = df.apply(
            lambda row: calculate_quantitative(formula_list, row), axis=1
        )
    else:
        df[new_column_name] = df.apply(
            lambda row: calculate_qualitative(formula_list, row), axis=1
        )

    return df, Divide_By_Zero


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

    plt.figure(figsize=(7, 5.5))
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


def feature_value_analysis(data: Dict[str, str], df: DataFrame) -> str:
    """
    説明
    ----------
    特定の特徴量についての分析する関数

    Parameter
    ----------
    data : Dict[str, Any]
        frontendからの情報
    df : DataFrame
        データフレーム

    Return
    ----------
    str
        分析結果のバイナリデータ

    """

    # df = get_df()

    column_name = data["column_name"]
    exclude_columns: List[str] = []  # 使わないカラムを指定

    X, y = prepare_data(df, column_name, exclude_columns)

    if df[column_name].dtype == "int64" or df[column_name].dtype == "float64":
        plot_url = evaluate_regression_model(X, y)
    else:
        plot_url = evaluate_classification_model(X, y)

    return plot_url


def impute_numeric(column: str, method: str, df_imputed: DataFrame) -> None:
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

    # df_imputed = get_df()

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

        elif method == "ランダムフォレスト補完":
            # 14. ランダムフォレスト補完
            imputer = IterativeImputer(
                estimator=RandomForestRegressor(), random_state=0
            )
            df_imputed[column] = imputer.fit_transform(df_imputed[[column]])
    else:
        print(f"警告: カラム '{column}' は数値型ではありません。補完は行われません。")

    # df_imputed.to_csv("./uploads/demo.csv", index=False)
    return df_imputed


def impute_categorical(column: str, method: str, df_imputed: DataFrame):
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

    # df_imputed = get_df()

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

    # df_imputed.to_csv("./uploads/demo.csv", index=False)
    return df_imputed


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


def set_dtypes(df: DataFrame, dtypes: Dict[str, str]) -> DataFrame:
    """データフレームの型を適応する関数

    Args:
        df (DataFrame): データフレーム
        dtypes (Dict[str, str]): 各カラムの型情報を記載している辞書

    Returns:
        DataFrame: 型適応後のデータフレーム
    """

    for col, dtype in dtypes.items():
        if dtype == "object":
            df[col] = df[col].astype(str)
            df[col] = df[col].replace("nan", np.nan)
        elif dtype == "int64":
            df[col] = df[col].astype(int)

    return df


def extraction_df(
    df: DataFrame, filename: str, user_id: str, csv_id: str
) -> Dict[str, any]:
    """
    説明
    ----------
    dfの情報を取得する関数


    Parameter
    ----------
    df : DataFrame
        データフレーム
    filename : str
        データフレームの型情報を保存しているファイルのpath

    Return
    ----------
    Dict[str, any]

    """

    # 仮にcsv_idとuser_idを生成している
    # csv_id = str(uuid.uuid4())
    # user_id = str(uuid.uuid4())

    # メモリ上で一時的にCSVを作成
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False)
    data_size = len(csv_buffer.getvalue().encode("utf-8"))

    data_columns = len(df.columns)
    data_rows = len(df)

    form_data = {
        "csv_id": csv_id,
        "user_id": user_id,
        "file_name": filename,
        "data_size": data_size,
        "data_columns": data_columns,
        "data_rows": data_rows,
    }

    return form_data


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
