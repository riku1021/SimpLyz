import os
import shutil
from flask import request, jsonify, send_file
from data_plt import *
from data_utils import get_data_info, get_miss_columns, \
    change_umeric_to_categorical, make_pie, make_feature_value, \
    feature_value_analysis, impute_numeric, impute_categorical

from read_CSV import read

from flask_cors import CORS
import google.generativeai as GEMINI

from dotenv import load_dotenv
import json

# 環境変数を読み込む
load_dotenv()

# APIキーを設定
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI.configure(api_key=GEMINI_API_KEY)

# データアップロード先の定義
UPLOAD_PATH = './uploads'


def setup_routes(app):
    # テスト
    @app.route('/', methods=['GET'])
    def index():
        return {'message': True}

    @app.route('/upload', methods=['POST'])
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

        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400

        if request.files.filename == '':
            return jsonify({"error": "No selected file"}), 400

        file = request.files['file']

        # csvファイルの保存
        file_path = os.path.join(UPLOAD_PATH, file.filename)
        file.save(file_path)

        empty_json = {}

        # データの型を管理するjsonファイルの作成
        with open('dtypes.json', 'w') as json_file:
            json.dump(empty_json, json_file)

        return jsonify(
            {"message": f"File {file.filename} uploaded successfully"}), 200

    @app.route('/clear-uploads', methods=['POST'])
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
        with open('dtypes.json', 'w') as file:
            json.dump(empty_json, file)

        return jsonify({"message": "Uploads directory cleared"}), 200

    @app.route('/get_quantitative', methods=['POST'])
    def get_quantitative():
        """
        説明
        ----------
        質的変数のカラムをリストで取得するapi

        Request
        ----------
        None

        Response
        ----------
        quantitative_list : List[str]
            量的変数のカラム名がリストとして管理している。

        """

        quantitative_list = read_quantitative()

        return jsonify({'quantitative_variables': quantitative_list}), 200

    # 量的変数のカラムをリストで取得
    @app.route('/get_qualitative', methods=['GET'])
    def get_qualitative():
        qualitative_list = read_qualitative()
        return jsonify({'qualitative_variables': qualitative_list})

    # 散布図
    @app.route('/scatter', methods=['POST'])
    def make_scatter():
        data = request.get_json()
        print('data', data)
        image_data = plot_scatter(data)
        return jsonify({'image_data': image_data})

    # ヒストグラム
    @app.route('/hist', methods=['POST'])
    def make_hist():
        data = request.get_json()
        print('data', data)
        image_data = plot_hist(data)
        return jsonify({'image_data': image_data})

    # 箱ひげ図
    @app.route('/box', methods=['POST'])
    def make_box():
        data = request.get_json()
        print('data', data)
        image_data = plot_box(data)
        return jsonify({'image_data': image_data})

    # データの基本情報の取得
    @app.route('/get_data_info', methods=['GET'])
    def get_data():
        send_data = get_data_info()
        return jsonify(send_data)

    # 欠損値があるカラムを取得
    @app.route('/get_miss_columns', methods=['GET'])
    def get_miss():
        send_data = get_miss_columns()
        return jsonify(send_data)

    # カテゴリカルデータへ変換
    @app.route('/change_numeric_to_categorical', methods=['POST'])
    def change_to_categorical():
        data = request.get_json()
        change_umeric_to_categorical(data)
        return jsonify({'message': 'change successfully'})

    # 円グラフの取得
    @app.route('/get_pie', methods=['POST'])
    def get_pie():
        data = request.get_json()
        image_data = make_pie(data)
        return jsonify({'image_data': image_data})

    # CSVファイルの読み込み
    @app.route('/read-csv', methods=['GET'])
    def read_csv():
        read()
        return jsonify({"message": "read csv"}), 200

    # チャット機能
    @app.route('/api/chat', methods=['POST'])
    def chat():
        model = GEMINI.GenerativeModel('gemini-pro')
        data = request.json
        message = data.get('message')
        if not message:
            return jsonify({'reply': 'メッセージが空です。'}), 400
        try:
            reply = model.generate_content(message)
            return jsonify({'reply': reply.text})
        except Exception as e:
            return jsonify({'reply': f'エラーが発生しました: {str(e)}'}), 500

    # 特徴量の作成
    @app.route('/make_feature', methods=['POST'])
    def make_feature():
        data = request.get_json()
        make_feature_value(data)
        return jsonify({'message': 'make successfully'})

    # 特定の特徴量についての分析
    @app.route('/feature_analysis', methods=['POST'])
    def feature_analysis():
        data = request.get_json()
        image_data = feature_value_analysis(data)
        return jsonify({'image_data': image_data})

    # 数値データの欠損値の補完
    @app.route('/complement/numeric', methods=['POST'])
    def complement_numeric():
        data = request.get_json()
        column = data['column_name']
        methods = data['complementary_methods']
        impute_numeric(column, methods)
        return jsonify({'message': 'complement numeric successfully'})

    # カテゴリカルデータの欠損値の補完
    @app.route('/complement/categorical', methods=['POST'])
    def complement_categorical():
        data = request.get_json()
        column = data['column_name']
        methods = data['complementary_methods']
        impute_categorical(column, methods)
        return jsonify({'message': 'complement categorical successfully'})

    # geminiの画像分析
    @app.route('/gemini/image', methods=['POST'])
    def gemini_image():
        model = GEMINI.GenerativeModel('gemini-1.5-flash')
        data = request.get_json()
        image_data = data['image_data']
        cookie_picture = {
            'mime_type': 'image/png',
            'data': image_data
        }
        prompt = 'この写真について教えて(日本語で)\n'
        response = model.generate_content(
            contents=[prompt, cookie_picture],
            generation_config=GEMINI.types.GenerationConfig(
                candidate_count=1,
                temperature=1.0
            )
        )
        return jsonify({'text': response.text})

    # # geminiの分析
    # @app.route('/gemini/text', methods=['POST'])
    # def gemini_text():
    #     data = request.get_json()
    #     message = data['message']
    #     response = model.generate_content(
    #         contents=message,
    #         generation_config=GEMINI.types.GenerationConfig(
    #             candidate_count=1,
    #             temperature=1.0
    #         )
    #     )
    #     return jsonify({'text': response.text})
