import base64
import io
import json
import os
import shutil
from typing import Any, Dict, List

import google.generativeai as GEMINI
import pandas as pd
import requests
from data_plt import (
    plot_box,
    plot_hist,
    plot_scatter,
    read_qualitative,
    read_quantitative,
)
from data_utils import (
    change_umeric_to_categorical,
    extraction_df,
    feature_value_analysis,
    get_data_info,
    get_miss_columns,
    impute_categorical,
    impute_numeric,
    make_feature_value,
    make_pie,
    set_dtypes,
)
from dotenv import load_dotenv
from flask import jsonify, request
from flask.wrappers import Response
from read_CSV import read
from src.backend.chats import save_chat
from src.backend.csvs import get_csv, update_csv

# 環境変数を読み込む
load_dotenv()

# データアップロード先の定義
UPLOAD_PATH = "./uploads"

GO_API_URL = "http://localhost:8080"


def setup_routes(app):
    # テスト
    @app.route("/", methods=["GET"])
    def index():
        return {"message": True}

    @app.route("/upload", methods=["POST"])
    def upload_csv():
        """
        説明
        ----------
        csvをアップロードするapi

        Request
        ----------
        ImmutableMultiDict([('file', <FileStorage: 'DA_04.csv' ('text/csv')>)])

        Response
        ----------
        {"message": f"File {file.filename} uploaded successfully"}

        """

        if not os.path.exists(UPLOAD_PATH):
            os.makedirs(UPLOAD_PATH)

        if "file" not in request.files:
            return jsonify({"error": "No file part"}), 400

        if request.files["file"].filename == "":
            return jsonify({"error": "No selected file"}), 400

        file = request.files["file"]

        # user_idとcsv_idを取得する
        data = request.form.get("jsonData")
        json_data = json.loads(data)
        user_id = json_data["user_id"]
        csv_id = json_data["csv_id"]

        # CSVデータを直接読み込み
        csv_data = file.read().decode("utf-8")  # バイトデータを文字列に変換
        df = pd.read_csv(
            io.StringIO(csv_data),
            na_values=["null", ""],  # ここでnullや空文字をNaNとして認識
            keep_default_na=True,  # デフォルトのNaN認識を保持
        )  # データフレームに変換

        dtypes = {col: str(dtype) for col, dtype in df.dtypes.items()}

        files = {
            "csv_file": ("data.csv", csv_data.encode("utf-8"), "text/csv"),
            "json_file": (
                "data.json",
                json.dumps(dtypes).encode("utf-8"),
                "application/json",
            ),
        }

        # csvを保存する際の情報を取得
        form_data = extraction_df(
            df=df, filename=file.filename, user_id=user_id, csv_id=csv_id
        )

        proxies = {"http": None, "https": None}  # 大学で行うときはここを有効に
        response = requests.post(
            f"{GO_API_URL}/upload_csv",
            files=files,
            data=form_data,
            proxies=proxies,
        )

        if response.status_code == 200:
            return (
                jsonify({"message": f"File {file.filename} uploaded successfully"}),
                200,
            )
        else:
            try:
                # レスポンスからJSONデータを取得し、エラーメッセージを表示
                error_response = response.json()
                error_message = error_response.get("error", "Unknown error occurred")
                print(f"エラーが発生しました: {error_message}")
            except ValueError:
                # JSONでない場合のエラーメッセージを表示
                print(f"エラーレスポンス: {response.text}")
            return jsonify({"error": "Failed to upload data to Go API"}), 500

    # 今後不要になる
    @app.route("/clear-uploads", methods=["POST"])
    def clear_uploads():
        """
        説明
        ----------
        アップロードされているcsvを消すapi

        Request
        ----------
        None

        Response
        ----------
        {"message": "Uploads directory cleared"}

        """

        # csvファイルの削除
        if os.path.exists(UPLOAD_PATH):
            shutil.rmtree(UPLOAD_PATH)
        os.makedirs(UPLOAD_PATH)

        # 空の辞書を作成
        empty_json = {}

        # データの型を管理するjsonファイルの初期化
        with open("dtypes.json", "w") as file:
            json.dump(empty_json, file)

        return jsonify({"message": "Uploads directory cleared"}), 200

    # 今後不要になる
    @app.route("/get-uploaded-file", methods=["GET"])
    def get_uploaded_file():
        """
        説明
        ----------
        現在アップロードされているCSVファイル名を取得するapi

        Request
        ----------
        None

        Response
        ----------
        {"fileName": ファイル名（またはNone）}
        """

        # UPLOAD_PATHディレクトリに存在する最初のCSVファイルを取得
        if os.path.exists(UPLOAD_PATH):
            files = [f for f in os.listdir(UPLOAD_PATH) if f.endswith(".csv")]
            if files:
                return jsonify({"fileName": files[0]}), 200

        # ファイルが存在しない場合はNoneを返す
        return jsonify({"fileName": None}), 200

    @app.route("/get_quantitative", methods=["POST"])
    def get_quantitative():
        """
        説明
        ----------
        量的変数のカラムをリストで取得するapi

        Request
        ----------
        None

        Response
        ----------
        quantitative_list : List[str]
            量的変数のカラム名がリストとして管理している。

        """

        # csv取得
        json_data = request.get_json()
        csv_id = json_data["csv_id"]
        data = get_csv(csv_id=csv_id)

        if type(data) == dict:
            return data  # もし辞書型の場合はエラー

        df, dtypes = data

        # dfの型適応
        df = set_dtypes(df=df, dtypes=dtypes)

        quantitative_list = read_quantitative(df=df)

        return jsonify({"quantitative_variables": quantitative_list}), 200

    @app.route("/get_qualitative", methods=["POST"])
    def get_qualitative():
        """
        説明
        ----------
        質的変数のカラムをリストで取得するapi

        Request
        ----------
        None

        Response
        ----------
        qualitative_list : List[str]
            質的変数のカラム名がリストとして管理している。

        """

        # csv取得
        json_data = request.get_json()
        csv_id = json_data["csv_id"]
        data = get_csv(csv_id=csv_id)

        if type(data) == dict:
            return data  # もし辞書型の場合はエラー

        df, dtypes = data

        # dfの型適応
        df = set_dtypes(df=df, dtypes=dtypes)

        qualitative_list = read_qualitative(df=df)

        return jsonify({"qualitative_variables": qualitative_list})
    
    @app.route("/get_qualitative_with_values", methods=["POST"])
    def get_qualitative_with_values():
        """
        質的変数のカラムとそのユニークな値を辞書型で取得するapi

        Request
        ----------
        JSON形式:
        - csv_id: str

        Response
        ----------
        qualitative_dict: Dict[str, List[str]]
            質的変数のカラム名とそのユニークな値の辞書。
        """
        # リクエストデータの取得
        json_data = request.get_json()
        csv_id = json_data["csv_id"]

        # CSVデータの取得
        data = get_csv(csv_id=csv_id)
        if isinstance(data, dict):
            return data  # エラーの場合はそのまま返す

        df, dtypes = data

        # 型適応
        df = set_dtypes(df=df, dtypes=dtypes)

        # 質的変数の取得
        qualitative_columns = read_qualitative(df=df)

        # 質的変数とユニーク値の辞書作成
        qualitative_dict = {
            col: df[col].dropna().unique().tolist()
            for col in qualitative_columns
        }

        return jsonify({"qualitative_variables": qualitative_dict})

    @app.route("/scatter", methods=["POST"])
    def make_scatter():
        """
        説明
        ----------
        散布図を提供するapi

        Request
        ----------
        Dict[str, Any]

        Response
        ----------
        image_data : str
            画像データをBase64エンコードされたバイト列をUTF-8でエンコーディングした文字列

        """

        # csv取得
        json_data = request.get_json()
        csv_id = json_data["csv_id"]
        data = get_csv(csv_id=csv_id)

        if type(data) == dict:
            return data  # もし辞書型の場合はエラー

        df, dtypes = data

        # dfの型適応
        df = set_dtypes(df=df, dtypes=dtypes)

        image_data = plot_scatter(json_data, df)

        return jsonify({"image_data": image_data})

    @app.route("/hist", methods=["POST"])
    def make_hist():
        """
        説明
        ----------
        ヒストグラムを提供するapi

        Request
        ----------
        Dict[str, Any]

        Response
        ----------
        image_data : str
            画像データをBase64エンコードされたバイト列をUTF-8でエンコーディングした文字列

        """

        # csv取得
        json_data = request.get_json()
        csv_id = json_data["csv_id"]
        data = get_csv(csv_id=csv_id)

        if type(data) == dict:
            return data  # もし辞書型の場合はエラー

        df, dtypes = data

        # dfの型適応
        df = set_dtypes(df=df, dtypes=dtypes)

        image_data = plot_hist(json_data, df)

        return jsonify({"image_data": image_data})

    @app.route("/box", methods=["POST"])
    def make_box():
        """
        説明
        ----------
        箱ひげ図を提供するapi

        Request
        ----------
        Dict[str, Any]

        Response
        ----------
        image_data : str
            画像データをBase64エンコードされたバイト列をUTF-8でエンコーディングした文字列

        """

        # csv取得
        json_data = request.get_json()
        csv_id = json_data["csv_id"]
        data = get_csv(csv_id=csv_id)

        if type(data) == dict:
            return data  # もし辞書型の場合はエラー

        df, dtypes = data

        # dfの型適応
        df = set_dtypes(df=df, dtypes=dtypes)

        image_data = plot_box(json_data, df)

        return jsonify({"image_data": image_data})

    # データの基本情報の取得
    @app.route("/get_data_info", methods=["POST"])
    def get_data():
        """
        説明
        ----------
        データの基本情報を取得するapi

        Request
        ----------
        None

        Response
        ----------
        send_data : str
            各カラムの基本情報

        """

        # csv取得
        json_data = request.get_json()
        csv_id = json_data["csv_id"]
        data = get_csv(csv_id=csv_id)

        if type(data[0]) == Response:
            return data  # もし辞書型の場合はエラー

        df, dtypes = data

        # dfの型適応
        df = set_dtypes(df=df, dtypes=dtypes)

        send_data = get_data_info(df=df)

        return jsonify(send_data)

    @app.route("/get_miss_columns", methods=["POST"])
    def get_miss():
        """
        説明
        ----------
        欠損値があるカラムを取得するapi

        Request
        ----------
        None

        Response
        ----------
        send_data : dict[str, list]
            欠損値があるカラムの情報

        """

        # csv取得
        json_data = request.get_json()
        csv_id = json_data["csv_id"]
        data = get_csv(csv_id=csv_id)

        if type(data) == dict:
            return data  # もし辞書型の場合はエラー

        df, dtypes = data

        # dfの型適応
        df = set_dtypes(df=df, dtypes=dtypes)

        send_data = get_miss_columns(df=df)

        return jsonify(send_data)

    @app.route("/change_numeric_to_categorical", methods=["POST"])
    def change_to_categorical():
        """
        説明
        ----------
        質的データへ変換するapi

        Request
        ----------
        Dict[str, str]

        Response
        ----------
        send_data : dict[str, list]
            欠損値があるカラムの情報

        """

        # csv取得
        json_data = request.get_json()
        csv_id = json_data["csv_id"]
        data = get_csv(csv_id=csv_id)

        if type(data) == dict:
            return data  # もし辞書型の場合はエラー

        df, dtypes = data

        # dfの型適応
        df = set_dtypes(df=df, dtypes=dtypes)

        df = change_umeric_to_categorical(json_data, df)

        # csvファイルを更新
        message = update_csv(csv_id=csv_id, df=df)

        return message

    @app.route("/get_pie", methods=["POST"])
    def get_pie():
        """
        説明
        ----------
        円グラフを取得するapi

        Request
        ----------
        Dict[str, str]

        Response
        ----------
        send_data : dict[str, str]
            バイナリデータ

        """

        # csv取得
        json_data = request.get_json()
        csv_id = json_data["csv_id"]
        data = get_csv(csv_id=csv_id)

        if type(data) == dict:
            return data  # もし辞書型の場合はエラー

        df, dtypes = data

        # dfの型適応
        df = set_dtypes(df=df, dtypes=dtypes)

        image_data = make_pie(json_data, df)

        return jsonify({"image_data": image_data})

    # 今後不要になる
    @app.route("/read-csv", methods=["GET"])
    def read_csv():
        """
        説明
        ----------
        CSVファイルを読み込むapi

        Request
        ----------
        None

        Response
        ----------
        send_data : dict[str, str]
            読み込んだことを教えるもの

        """

        read()

        return jsonify({"message": "read csv"}), 200

    @app.route("/api/chat", methods=["POST"])
    def chat():
        """
        説明
        ----------
        チャット機能のapi

        Request
        ----------
        Dict[str, List[Dict[str, str]]]

        Response
        ----------
        send_data : str
            回答文章

        """

        model = GEMINI.GenerativeModel("gemini-pro")

        data: Dict[str, List[Dict[str, str]]] = request.get_json()

        user_id = data.get("user_id")
        
        proxies = {"http": None, "https": None}  # 大学で行うときはここを有効に
        response = requests.post(
            f"{GO_API_URL}/users/get/api",
            json={"user_id": user_id},
            proxies=proxies,
        )

        response = response.json()

        GEMINI_API_KEY = response.get("GeminiApiKey")
        GEMINI.configure(api_key=GEMINI_API_KEY)
        
        message = data.get("message")
        user_message = data.get("user_message")
        room_id = data.get("room_id")
        post_id = data.get("post_id")
        if not message:
            return jsonify({"reply": "メッセージが空です。"}), 400
        try:
            reply = model.generate_content(message)
            # databaseに保存
            user_response = save_chat(
                room_id=room_id, user_chat=True, message=user_message, post_id=post_id
            )
            print(user_response)
            bot_response = save_chat(
                room_id=room_id,
                user_chat=False,
                message=reply.text,
                post_id=post_id + 1,
            )
            print(bot_response)
            return jsonify({"reply": reply.text})
        except Exception as e:
            return jsonify({"reply": f"エラーが発生しました: {str(e)}"}), 500

    @app.route("/make_feature", methods=["POST"])
    def make_feature():
        """
        説明
        ----------
        特徴量作成のapi

        Request
        ----------
        Dict[str, Any]

        Response
        ----------
        send_data : dict[str, str]
            新しい特徴量が作成されたことを教えるメッセージ

        """

        # csv取得
        json_data = request.get_json()
        csv_id = json_data["csv_id"]
        data = get_csv(csv_id=csv_id)

        if type(data) == dict:
            return data  # もし辞書型の場合はエラー

        df, dtypes = data

        # dfの型適応
        df = set_dtypes(df=df, dtypes=dtypes)

        df = make_feature_value(json_data, df=df)

        # postgresqlに保存
        message = update_csv(csv_id=csv_id, df=df)

        return message

    @app.route("/feature_analysis", methods=["POST"])
    def feature_analysis():
        """
        説明
        ----------
        特定の特徴量についての分析するapi

        Request
        ----------
        Dict[str, str]

        Response
        ----------
        send_data : dict[str, str]
            ランダムフォレストで特徴量を分析する

        """

        # csv取得
        json_data = request.get_json()
        csv_id = json_data["csv_id"]
        data = get_csv(csv_id=csv_id)

        if type(data) == dict:
            return data  # もし辞書型の場合はエラー

        df, dtypes = data

        # dfの型適応
        df = set_dtypes(df=df, dtypes=dtypes)

        # data: Dict[str, str] = request.get_json()

        image_data = feature_value_analysis(json_data, df)

        return jsonify({"image_data": image_data})

    @app.route("/complement/numeric", methods=["POST"])
    def complement_numeric():
        """
        説明
        ----------
        数値データの欠損値の補完をするapi

        Request
        ----------
        Dict[str, str]

        Response
        ----------
        send_data : dict[str, str]
            補完が完了したことを伝えるメッセージ

        """

        # csv取得
        json_data = request.get_json()
        csv_id = json_data["csv_id"]
        data = get_csv(csv_id=csv_id)

        if type(data) == dict:
            return data  # もし辞書型の場合はエラー

        df, dtypes = data

        # dfの型適応
        df = set_dtypes(df=df, dtypes=dtypes)

        column = json_data["column_name"]
        methods = json_data["complementary_methods"]

        df = impute_numeric(column, methods, df)

        # postgresqlに保存
        message = update_csv(csv_id=csv_id, df=df)

        return message

    @app.route("/complement/categorical", methods=["POST"])
    def complement_categorical():
        """
        説明
        ----------
        質的データの欠損値の補完をするapi

        Request
        ----------
        Dict[str, str]

        Response
        ----------
        send_data : dict[str, str]
            補完が完了したことを伝えるメッセージ

        """

        # csv取得
        json_data = request.get_json()
        csv_id = json_data["csv_id"]
        data = get_csv(csv_id=csv_id)

        if type(data) == dict:
            return data  # もし辞書型の場合はエラー

        df, dtypes = data

        # dfの型適応
        df = set_dtypes(df=df, dtypes=dtypes)

        # data: Dict[str, str] = request.get_json()

        column = json_data["column_name"]
        methods = json_data["complementary_methods"]

        df = impute_categorical(column, methods, df)

        # postgresqlに保存
        message = update_csv(csv_id=csv_id, df=df)

        return message

    @app.route("/gemini/image", methods=["POST"])
    def gemini_image():
        """
        説明
        ----------
        geminiの画像分析をするapi

        Request
        ----------
        Dict[str, str]

        Response
        ----------
        send_data : dict[str, str]
            画像解析結果の回答

        """

        try:
            model = GEMINI.GenerativeModel("gemini-1.5-flash")
            data: Dict[str, str] = request.get_json()

            user_id = data.get("user_id")

            proxies = {"http": None, "https": None}  # 大学で行うときはここを有効に
            response = requests.post(
                f"{GO_API_URL}/users/get/api",
                json={"user_id": user_id},
                proxies=proxies,
            )

            response = response.json()

            GEMINI_API_KEY = response.get("GeminiApiKey")
            GEMINI.configure(api_key=GEMINI_API_KEY)

            image_data = data["image_data"]
            room_id = data["room_id"]
            cookie_picture = {"mime_type": "image/png", "data": image_data}

            prompt = """
            このグラフから読み取れることを詳細に解説してください。\n
            ※日本語で表示してください。また、マークダウン装飾を付けるようにしてください。\n
            Let's first understand the problem and devise a plan to solve the problem.
            Then, let's carry out the plan and solve the problem step by step.
            """
            response = model.generate_content(
                contents=[prompt, cookie_picture],
                generation_config=GEMINI.types.GenerationConfig(
                    candidate_count=1, temperature=1.0
                ),
            )

            # データベースに保存
            response_database = save_chat(
                room_id=room_id, user_chat=False, message=response.text, post_id=0
            )

            print(response_database)

            return jsonify({"text": response.text}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
