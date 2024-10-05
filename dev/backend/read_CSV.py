# import
import pandas as pd
import chardet
import json
from typing import List, Tuple, Any
import glob


def read_CSV(passes: List[str]) -> Tuple[int, List[List]]:
    """
    説明
    ----------
    CSVファイルを読み込む関数

    Parameter
    ----------
    passes : List[str]
        特定のフォルダ内にあるcsvファイルのすべてのpath

    Return
    ----------
    Tuple[int, List[List]]
        csvのファイル数とデータフレーム型をnumpy配列にしたものとカラムをlistに保存している。

    """

    length = len(passes)
    dfs: List[List] = [[], []]
    columns = []
    encoding = ""
    if length == 1:
        encoding = check_encoding(passes[0])
        df = pd.read_csv(passes[0], encoding=encoding)
        Numpy = df.to_numpy()
        columns = df.columns.values
        dfs[0].append(Numpy)
        dfs[1].append(columns)
    else:
        for i in range(length):
            encoding = check_encoding(passes[i])
            df = pd.read_csv(passes[i], encoding=encoding)
            Numpy = df.to_numpy()
            columns = df.columns.values
            dfs[0].append(Numpy)
            dfs[1].append(columns)

    return (length, dfs)


# エンコードのチェック
def check_encoding(filepath):
    with open(filepath, "rb") as f:
        c = f.read()
        result = chardet.detect(c)
    encoding = result["encoding"]
    if result["encoding"] == "SHIFT_JIS":
        encoding = "CP932"
    return encoding


def change_json(length: int, data: List[List], names: list[list[str]]) -> str:
    """
    説明
    ----------
    json形式へ変換する関数

    Parameter
    ----------
    None

    Return
    ----------
    str
        jsonファイルを文字列に変換したもの

    """

    json_file = {}
    json_file["length"] = length
    for i in range(length):
        length2 = len(data[i])
        for j in range(length2):
            json_file[names[i][j]] = data[i][j].tolist()

    return json.dumps(json_file, ensure_ascii=False, indent=length)


def read_folder(passes: str = "..\\uploads") -> List[str]:
    """
    説明
    ----------
    csvファイルはuploadsフォルダ内の全てを読み込んで検出する関数

    Parameter
    ----------
    passes : str
        csvファイルを保存するpath

    Return
    ----------
    List[str]

    """

    p = passes + "\\*.csv"

    return glob.glob(p)


def read():
    """
    説明
    ----------
    uploadsフォルダ内のCSVファイルを読み込む(入力はなし、出力は「[CSVファイルの内容][カラム内容]のjsonデータ」)関数

    Parameter
    ----------
    None

    Return
    ----------
    str

    """

    dfs = []
    names = [[str(1) + "つ目のデータ"], [str(1) + "つ目のカラム"]]

    length, dfs = read_CSV(read_folder())

    if length > 1:
        for i in range(length - 1):
            names[0].append(str(i) + "つ目のデータ")
            names[1].append(str(i) + "つ目のカラム")

    return change_json(length, dfs, names)
