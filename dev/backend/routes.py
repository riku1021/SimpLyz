import json
import os
import shutil
from typing import Any, Dict, List

import google.generativeai as GEMINI
from data_plt import (
    plot_box,
    read_quantitative,
    read_qualitative,
    plot_scatter,
    plot_hist,
)
from data_utils import (
    change_umeric_to_categorical,
    feature_value_analysis,
    get_data_info,
    get_miss_columns,
    impute_categorical,
    impute_numeric,
    make_feature_value,
    make_pie,
)
from dotenv import load_dotenv
from flask import jsonify, request
from read_CSV import read

# 環境変数を読み込む
load_dotenv()

# APIキーを設定
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI.configure(api_key=GEMINI_API_KEY)

# データアップロード先の定義
UPLOAD_PATH = "./uploads"


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

        # csvファイルの保存
        file_path = os.path.join(UPLOAD_PATH, "demo.csv")
        file.save(file_path)

        empty_json = {}

        # データの型を管理するjsonファイルの作成
        with open("dtypes.json", "w") as json_file:
            json.dump(empty_json, json_file)

        return jsonify({"message": f"File {file.filename} uploaded successfully"}), 200

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

        quantitative_list = read_quantitative()

        return jsonify({"quantitative_variables": quantitative_list}), 200

    @app.route("/get_qualitative", methods=["GET"])
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

        qualitative_list = read_qualitative()

        return jsonify({"qualitative_variables": qualitative_list})

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

        data = request.get_json()
        image_data = plot_scatter(data)

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

        data = request.get_json()
        image_data = plot_hist(data)

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

        data = request.get_json()
        image_data = plot_box(data)

        return jsonify({"image_data": image_data})

    # データの基本情報の取得
    @app.route("/get_data_info", methods=["GET"])
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

        send_data = get_data_info()

        return jsonify(send_data)

    @app.route("/get_miss_columns", methods=["GET"])
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

        send_data = get_miss_columns()

        return jsonify(send_data)

    @app.route("/change_numeric_to_categorical", methods=["POST"])
    def change_to_categorical():
        """
        説明
        ----------
        カテゴリカルデータへ変換するapi

        Request
        ----------
        Dict[str, str]

        Response
        ----------
        send_data : dict[str, list]
            欠損値があるカラムの情報

        """

        data: Dict[str, str] = request.get_json()

        change_umeric_to_categorical(data)

        return jsonify({"message": "change successfully"})

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
        data: Dict[str, str] = request.get_json()

        image_data = make_pie(data)

        return jsonify({"image_data": image_data})

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

        message = data.get("message")
        if not message:
            return jsonify({"reply": "メッセージが空です。"}), 400
        try:
            reply = model.generate_content(message)
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

        data: Dict[str, Any] = request.get_json()

        print(data)

        make_feature_value(data)

        return jsonify({"message": "make successfully"})

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

        data: Dict[str, str] = request.get_json()

        image_data = feature_value_analysis(data)

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

        data: Dict[str, str] = request.get_json()

        column = data["column_name"]
        methods = data["complementary_methods"]

        impute_numeric(column, methods)

        return jsonify({"message": "complement numeric successfully"})

    @app.route("/complement/categorical", methods=["POST"])
    def complement_categorical():
        """
        説明
        ----------
        カテゴリカルデータの欠損値の補完をするapi

        Request
        ----------
        Dict[str, str]

        Response
        ----------
        send_data : dict[str, str]
            補完が完了したことを伝えるメッセージ

        """

        data: Dict[str, str] = request.get_json()

        column = data["column_name"]
        methods = data["complementary_methods"]

        impute_categorical(column, methods)

        return jsonify({"message": "complement categorical successfully"})

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

        model = GEMINI.GenerativeModel("gemini-1.5-flash")
        data: Dict[str, str] = request.get_json()

        image_data = data["image_data"]
        cookie_picture = {"mime_type": "image/png", "data": image_data}

        prompt = "この写真について教えて(日本語で)\n"
        response = model.generate_content(
            contents=[prompt, cookie_picture],
            generation_config=GEMINI.types.GenerationConfig(
                candidate_count=1, temperature=1.0
            ),
        )

        return jsonify({"text": response.text})
