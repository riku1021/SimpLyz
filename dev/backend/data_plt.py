# import
import base64

# import chardet
import codecs
import glob
import io
import json
from typing import Any, Dict, List

import matplotlib
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from pandas import DataFrame

matplotlib.use("Agg")


# データ型情報を読み込む関数
def load_dtype(df, json_path) -> DataFrame:
    """
    説明
    ----------
    各カラムの型について保存してあるjsonファイルをデータフレームに適用する関数

    Parameter
    ----------
    df : DataFrame
        プロジェクト内で使用するデータフレーム
    json_path : str
        jsonのpath

    Return
    ----------
    DataFrame

    """

    try:
        with open(json_path, "r") as f:
            dtypes = json.load(f)
        for col, dtype in dtypes.items():
            if dtype == "object":
                df[col] = df[col].astype(str)
            elif dtype == "int64":
                df[col] = df[col].astype(int)
    except FileNotFoundError as e:
        print(f"Error: The file {json_path} was not found. Details: {e}")

    return df


def get_df() -> DataFrame:
    """
    説明
    ----------
    アップロードしたcsvファイルをデータフレームとして読み込み渡す関数

    Parameter
    ----------
    None

    Return
    ----------
    DataFrame

    """

    df = pd.read_csv("./uploads/demo.csv")
    df = load_dtype(df, "./uploads/dtypes.json")

    return df


def read_quantitative() -> List[str]:
    """
    説明
    ----------
    量的変数のカラムを返す関数

    Parameter
    ----------
    None

    Return
    ----------
    List[str]

    """

    quantitative_variables = []
    df = get_df()
    columns = df.columns.values
    # apply関数で自作関数を適用
    is_numeric_col = df.apply(is_numeric)
    for i in range(len(is_numeric_col)):
        is_num = is_numeric_col.iloc[i]
        if is_num:  # データが数値の時
            quantitative_variables.append(columns[i])

    return quantitative_variables


def read_qualitative() -> List[str]:
    """
    説明
    ----------
    質的変数のカラムを返す

    Parameter
    ----------
    None

    Return
    ----------
    List[str]

    """

    passes = read_folder()
    qualitative_variables = []
    encoding = check_encoding(passes[0])
    df = get_df()
    columns = df.columns.values
    # apply関数で自作関数を適用
    is_numeric_col = df.apply(is_numeric)
    for i in range(len(is_numeric_col)):
        is_num = is_numeric_col.iloc[i]
        if not is_num:
            qualitative_variables.append(columns[i])

    return qualitative_variables


# uploads内のフォルダを読み込み
def read_folder(passes=".\\uploads"):
    p = passes + "\\*.csv"
    return glob.glob(p)


# エンコードのチェック
# def check_encoding(filepath):
#     with open(filepath, 'rb') as f:
#         c = f.read()
#         result = chardet.detect(c)
#     encoding=result['encoding']
#     if result['encoding'] == 'SHIFT_JIS':
#         encoding = 'CP932'
#     return encoding
def check_encoding(filepath):
    encodings = ["utf-8", "iso-8859-1", "cp1252", "cp932"]
    for encoding in encodings:
        try:
            with codecs.open(filepath, "r", encoding=encoding) as f:
                f.read()
            return encoding
        except (UnicodeDecodeError, FileNotFoundError):
            continue
    return None


# df内の各カラムのデータが数字かどうか
def is_numeric(column):
    return all(isinstance(x, (int, float)) for x in column)


def plot_scatter(jsons: Dict[str, Any]) -> str:
    """
    説明
    ----------
    散布図をプロットし文字列にエンコーディングする関数

    Request
    ----------
    Dict[str, Any]

    Response
    ----------
    plot_url : str
        画像データをBase64エンコードされたバイト列をUTF-8でエンコーディングした文字列

    """

    plt.clf()
    variable1 = ""
    variable2 = ""
    target_variable = None
    fit_reg = 0
    order = 1
    list_columns = {
        "variable1": variable1,
        "variable2": variable2,
        "target": target_variable,
        "fit_reg": fit_reg,
        "order": order,
    }
    for k, v in jsons.items():  # キー／値の組を列挙
        if k in list_columns:
            list_columns[k] = v

    df = get_df()

    if list_columns["target"] == "None":
        sns_plot = sns.regplot(
            x=list_columns["variable1"],
            y=list_columns["variable2"],
            data=df,
            fit_reg=list_columns["fit_reg"],
            order=list_columns["order"],
        )
    else:
        sns_plot = sns.lmplot(
            x=list_columns["variable1"],
            y=list_columns["variable2"],
            hue=list_columns["target"],
            data=df,
            fit_reg=list_columns["fit_reg"],
            order=list_columns["order"],
        )

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    plot_url = base64.b64encode(buf.getvalue()).decode()

    return plot_url


def plot_hist(jsons: Dict[str, Any]) -> str:
    """
    説明
    ----------
    ヒストグラムをプロットし文字列にエンコーディングする関数

    Request
    ----------
    Dict[str, Any]

    Response
    ----------
    plot_url : str
        画像データをBase64エンコードされたバイト列をUTF-8でエンコーディングした文字列

    """

    plt.clf()
    variable = ""
    target_variable = None
    list_columns = {"variable": variable, "target": target_variable}

    for k, v in jsons.items():  # キー／値の組を列挙
        if k in list_columns:
            list_columns[k] = v

    df = get_df()

    if list_columns["target"] == "None":
        hist_plot = sns.histplot(x=list_columns["variable"], data=df)
    else:
        hist_plot = sns.histplot(
            x=list_columns["variable"], hue=list_columns["target"], data=df
        )

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    plot_url = base64.b64encode(buf.getvalue()).decode()

    return plot_url


def plot_box(jsons: Dict[str, Any]) -> str:
    """
    説明
    ----------
    箱ひげ図をプロットし文字列にエンコーディングする関数

    Request
    ----------
    Dict[str, Any]

    Response
    ----------
    plot_url : str
        画像データをBase64エンコードされたバイト列をUTF-8でエンコーディングした文字列

    """

    # 初期化
    plt.clf()
    x = jsons["variable1"]
    y = jsons["variable2"]
    df = get_df()
    # プロット
    box_plot = sns.boxenplot(x=x, y=y, data=df)
    # バイナリデータにエンコード
    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    plot_url = base64.b64encode(buf.getvalue()).decode()

    return plot_url
