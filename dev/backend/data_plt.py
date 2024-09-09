#import
import pandas as pd
# import chardet
import codecs
import json
import os
import glob
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg') 

import base64
#import
import seaborn as sns
import numpy as np
import pandas as pd
import io

import json

# データ型情報を読み込む関数
def load_dtype(df, filename):
    try:
        with open(filename, 'r') as f:
            dtypes = json.load(f)
        for col, dtype in dtypes.items():
            if dtype == 'object':
                df[col] = df[col].astype(str)
            elif dtype == 'int64':
                df[col] = df[col].astype(int)
    except:
        pass

def get_df():
    df = pd.read_csv('./uploads/demo.csv')
    load_dtype(df, './uploads/dtypes.json')
    return df

#量的変数のカラムを返す
def read_quantitative():
    passes=read_folder()
    quantitative_variables=[]
    l={}
    print(passes)
    encoding=check_encoding(passes[0])
    df=pd.read_csv(passes[0], encoding=encoding)
    df = get_df()
    columns=df.columns.values
    # apply関数で自作関数を適用
    is_numeric_col = df.apply(is_numeric)
    for i in range(len(is_numeric_col)):
        if is_numeric_col.iloc[i]==True:
            quantitative_variables.append(columns[i])
    # print(quantitative_variables)
    l['quantitative_variables']=quantitative_variables
    return quantitative_variables

#質的変数のカラムを返す
def read_qualitative():
    passes=read_folder()
    qualitative_variables=[]
    # list={}
    encoding=check_encoding(passes[0])
    df=pd.read_csv(passes[0], encoding=encoding)
    df = get_df()
    columns=df.columns.values
    # apply関数で自作関数を適用
    is_numeric_col = df.apply(is_numeric)
    for i in range(len(is_numeric_col)):
        if is_numeric_col.iloc[i]==False:
            qualitative_variables.append(columns[i])
    # list['qualitative_variables']=qualitative_variables
    return qualitative_variables

#uploads内のフォルダを読み込み
def read_folder(passes='.\\uploads'):
    p=passes+'\\*.csv'
    return glob.glob(p)

#エンコードのチェック
# def check_encoding(filepath):
#     with open(filepath, 'rb') as f:
#         c = f.read()
#         result = chardet.detect(c)
#     encoding=result['encoding']
#     if result['encoding'] == 'SHIFT_JIS':
#         encoding = 'CP932'
#     return encoding
def check_encoding(filepath):
    encodings = ['utf-8', 'iso-8859-1', 'cp1252', 'cp932']
    for encoding in encodings:
        try:
            with codecs.open(filepath, 'r', encoding=encoding) as f:
                f.read()
            return encoding
        except (UnicodeDecodeError, FileNotFoundError):
            continue
    return None

#df内の各カラムのデータが数字かどうか
def is_numeric(column):
    return all(isinstance(x, (int, float)) for x in column)

#散布図をプロットする関数
def plot_scatter(jsons):
    plt.clf()
    variable1=""
    variable2=""
    target_variable=None
    fit_reg=0
    order=1
    list_columns={'variable1':variable1,'variable2':variable2,'target':target_variable,'fit_reg':fit_reg,"order":order}
    for k, v in jsons.items():  # キー／値の組を列挙
        print(f'{k}: {v}')
        if k in list_columns:
            list_columns[k]=v
    passes=read_folder()
    encoding=check_encoding(passes[0])
    df=pd.read_csv(passes[0], encoding=encoding)
    df = get_df()
    print(df)
    if list_columns['target']=='None':
        print("regplot")
        sns_plot = sns.regplot(x=list_columns['variable1'], y=list_columns['variable2'], data=df,fit_reg=list_columns['fit_reg'],order=int(list_columns['order']))
    else:
        sns_plot = sns.lmplot(x=list_columns['variable1'], y=list_columns['variable2'], hue=list_columns['target'], data=df,fit_reg=list_columns['fit_reg'],order=int(list_columns['order']))
    
    buf = io.BytesIO()
    plt.savefig(buf,format="png")
    buf.seek(0)
    plot_url = base64.b64encode(buf.getvalue()).decode()
    # figure = sns_plot
    # with io.BytesIO() as output:
    #     plt.savefig(output,format="PNG")
    #     image_data = output.getvalue()#バイナリ取得
    return plot_url


#ヒストグラムをプロットする関数
def plot_hist(jsons):
    plt.clf()
    variable=""
    target_variable=None
    list_columns={'variable':variable,'target':target_variable}
    for k, v in jsons.items():  # キー／値の組を列挙
        print(f'{k}: {v}')
        if k in list_columns:
            list_columns[k]=v
    passes=read_folder()
    encoding=check_encoding(passes[0])
    df=pd.read_csv(passes[0], encoding=encoding)
    df = get_df()
    print(df)
    if list_columns['target']=='None':
        hist_plot = sns.histplot(x=list_columns['variable'],data=df)
    else:
        hist_plot = sns.histplot(x=list_columns['variable'], hue=list_columns['target'], data=df)
    
    buf = io.BytesIO()
    plt.savefig(buf,format="png")
    buf.seek(0)
    plot_url = base64.b64encode(buf.getvalue()).decode()
    # with io.BytesIO() as output:
    #     print(output)
        # plt.savefig(output,format="PNG")
        # image_data = output.getvalue()#バイナリ取得
    return plot_url

# 箱ひげ図のプロット
def plot_box(jsons):
    # 初期化
    plt.clf()
    x = jsons['variable1']
    y = jsons['variable2']
    # csvの読み込み
    passes=read_folder()
    encoding=check_encoding(passes[0])
    df=pd.read_csv(passes[0], encoding=encoding)
    df = get_df()
    # プロット
    box_plot = sns.boxenplot(x=x, y=y, data=df)
    # バイナリデータにエンコード
    buf = io.BytesIO()
    plt.savefig(buf,format="png")
    buf.seek(0)
    plot_url = base64.b64encode(buf.getvalue()).decode()
    return plot_url