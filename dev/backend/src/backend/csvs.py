import base64
import io
import json
from typing import Dict, Tuple, Union

import pandas as pd
import requests
from flask import jsonify
from pandas import DataFrame

GO_API_URL = "http://localhost:8080"


def get_csv(csv_id: str) -> Union[Tuple[DataFrame, Dict[str, str]], Dict[str, str]]:
    """csvをデータベースから取得する関数

    Args:
        csv_id (str): csvの固有id

    Returns:
        Union[Tuple[DataFrame, Dict[str, str]], Dict[str, str]]: DataFrameもしくはエラーを返す
    """

    try:
        # GoサーバーからCSVデータを取得
        proxies = {"http": None, "https": None}  # 大学で行うときはここを有効に
        response = requests.get(f"{GO_API_URL}/get_csv/{csv_id}", proxies=proxies)

        # レスポンスの内容とステータスコードを表示
        print("Response Status Code:", response.status_code)
        if response.status_code == 200:
            response_data = response.json()  # JSONデータを取得
            try:
                # filesキーからCSVデータを取得
                csv_files = response_data.get("file", [])
                # バイナリデータを取得
                csv_content = csv_files.get("csv_file")
                json_content = csv_files.get("json_file")
                if csv_content and json_content:
                    # バイナリデータをDataFrameに変換
                    decoded_csv_content = base64.b64decode(csv_content).decode("utf-8")
                    decoded_json_content = base64.b64decode(json_content).decode(
                        "utf-8"
                    )
                    df = pd.read_csv(io.StringIO(decoded_csv_content))
                    dtypes = json.loads(decoded_json_content)

                return df, dtypes

            except Exception as parse_error:
                print("Error parsing CSV data:", str(parse_error))
                return (
                    jsonify(
                        {"error": "Error parsing CSV data", "details": str(parse_error)}
                    ),
                    500,
                )

        else:
            error_message = response.text
            print("Error from Go server:", error_message)
            return (
                jsonify(
                    {"error": "Failed to fetch CSV file", "details": error_message}
                ),
                response.status_code,
            )

    except requests.exceptions.RequestException as e:
        print("Request Error:", str(e))
        return jsonify({"error": "Request failed", "details": str(e)}), 500
    except Exception as e:
        print("Unexpected Error:", str(e))
        return jsonify({"error": "Unexpected error", "details": str(e)}), 500


def update_csv(csv_id: str, df: DataFrame) -> Dict[str, str]:
    """csvをアップデートする関数

    Args:
        df (DataFrame): アップロードするデータフレーム

    Returns:
        Dict[str, str]: goからのメッセージ
    """

    # データフレームをCSV文字列に変換
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False)
    data_size = len(csv_buffer.getvalue().encode("utf-8"))

    data_columns = len(df.columns)
    data_rows = len(df)

    dtypes = {col: str(dtype) for col, dtype in df.dtypes.items()}

    files = {
        "csv_file": ("data.csv", csv_buffer.getvalue().encode("utf-8"), "text/csv"),
        "json_file": (
            "data.json",
            json.dumps(dtypes).encode("utf-8"),
            "application/json",
        ),
    }

    json_data = {
        "csv_id": csv_id,
        "data_size": data_size,
        "data_columns": data_columns,
        "data_rows": data_rows,
    }

    # print(json_data)

    proxies = {"http": None, "https": None}  # 大学で行うときはここを有効に
    response = requests.post(
        f"{GO_API_URL}/csvs/update",
        files=files,
        data=json_data,
        proxies=proxies,
    )

    print(response.status_code)

    if response.status_code == 200:
        json_response = response.json()
        print(json_response)
        return (
            jsonify(
                {
                    "message": f"File {json_response.get('file_name', 'not name')} update successfully"
                }
            ),
            200,
        )
    else:
        try:
            # レスポンスからJSONデータを取得し、エラーメッセージを表示
            error_response = response.json()
            error_message = error_response.get("error", "Unknown error occurred")
            message = error_response.get("message", "Unkown message")
            print(f"エラーが発生しました: {error_message}")
            print(f"メッセージ: {message}")
            return jsonify({"error": f"{error_message}"}), 500
        except ValueError:
            # JSONでない場合のエラーメッセージを表示
            print(f"エラーレスポンス: {response.text}")
        return jsonify({"error": "Failed to upload data to Go API"}), 500
