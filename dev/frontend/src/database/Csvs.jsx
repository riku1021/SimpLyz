import { useState } from 'react';
import axios from 'axios';

const Csvs = () => {
    // CSVファイルの簡易情報を取得するAPI
    const [csvGetSmallData, setCsvGetSmallData] = useState({
        user_id: "",
    });
    const [csvGetSmallDataResult, setCsvGetSmallDataResult] = useState("");

    const handleCsvGetSmallDataDataChange = (e) => {
        setCsvGetSmallData({
            ...csvGetSmallData,
            [e.target.name]: e.target.value
        });
    }

    const handleCsvGetSmallDataSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/csvs/get', csvGetSmallData);
            console.log('Success:', response.data);
            setCsvGetSmallDataResult(response.data.StatusMessage);
            setCsvGetSmallData({
                user_id: "",
            });
        } catch (err) {
            console.error('Error:', err.response.data);
            setCsvGetSmallDataResult(err.response.data.StatusMessage);
        }
    }

    // CSVファイルを削除するAPI
    const [deleteCsv, setDeleteCsv] = useState({
        csv_id: "",
    });
    const [delteCsvResult, setDeleteCsvResult] = useState("");

    const handleDeleteCsvDataChange = (e) => {
        setDeleteCsv({
            ...deleteCsv,
            [e.target.name]: e.target.value
        });
    }

    const handleDeleteCsvSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/csvs/delete', deleteCsv);
            console.log('Success:', response.data);
            setDeleteCsvResult(response.data.StatusMessage);
            setDeleteCsv({
                csv_id: "",
            });
        } catch (err) {
            console.error('Error:', err.response.data);
            setDeleteCsvResult(err.response.data.StatusMessage);
        }
    }

    // CSVファイルを復元するAPI
    const [restorationCsv, setRestorationCsv] = useState({
        csv_id: "",
    });
    const [restorationCsvResult, setRestorationCsvResult] = useState("");

    const handleRestorationCsvDataChange = (e) => {
        setRestorationCsv({
            ...restorationCsv,
            [e.target.name]: e.target.value
        });
    }

    const handleRestorationCsvSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/csvs/restoration', restorationCsv);
            console.log('Success:', response.data);
            setRestorationCsvResult(response.data.StatusMessage);
            setRestorationCsv({
                csv_id: "",
            });
        } catch (err) {
            console.error('Error:', err.response.data);
            setRestorationCsvResult(err.response.data.StatusMessage);
        }
    }

    // 削除したCSVファイルの情報を取得するAPI
    const [getDeleteFile, setGetDeleteFile] = useState({
        user_id: "340ba42a-e900-4411-bb1c-ad848392aec8",
    });

    const [getDeleteFileResult, setGetDeleteFileResult] = useState("");

    const handleClickGetDeleteFile = async () => {
        try {
            const response = await axios.post('http://localhost:8080/csvs/get/deletefiles', getDeleteFile);
            console.log('Success:', response.data);
            setGetDeleteFileResult(response.data.StatusMessage);
        } catch (err) {
            console.error('Error:', err.response.data);
            setGetDeleteFileResult(err.response.data.StatusMessage);
        }
    };

    // CSVファイルを完全に削除するAPI
    const [deletePermanently, setDeletePermanently] = useState({
        csv_id: "c4e38368-0a99-4f56-9917-2ddb64d3fb55",
    });

    const [deletePermanentlyResult, setDeletePermanentlyResult] = useState("");

    const handleClickDeletePermanently = async () => {
        try {
            const response = await axios.post('http://localhost:8080/csvs/delete/permanently', deletePermanently);
            console.log('Success:', response.data);
            setDeletePermanentlyResult(response.data.StatusMessage);
        } catch (err) {
            console.error('Error:', err.response.data);
            setDeletePermanentlyResult(err.response.data.StatusMessage);
        }
    };

    return (
        <div>
            <h1>csvs</h1>
            <div>
                <h2>CSVファイルの簡易情報を取得するAPI</h2>
                <form onSubmit={handleCsvGetSmallDataSubmit}>
                    <div>
                        <label>UserId:</label>
                        <input
                            type="text"
                            name="user_id"
                            value={csvGetSmallData.user_id}
                            onChange={handleCsvGetSmallDataDataChange}
                            required
                        />
                    </div>
                    <button type="submit">Get Csv Data</button>
                    <div>
                        result: {csvGetSmallDataResult}
                    </div>
                </form>
            </div>

            <div>
                <h2>CSVファイルを削除するAPI</h2>
                <form onSubmit={handleDeleteCsvSubmit}>
                    <div>
                        <label>CsvId:</label>
                        <input
                            type="text"
                            name="csv_id"
                            value={deleteCsv.csv_id}
                            onChange={handleDeleteCsvDataChange}
                            required
                        />
                    </div>
                    <button type="submit">Delete Csv Data</button>
                    <div>
                        result: {delteCsvResult}
                    </div>
                </form>
            </div>

            <div>
                <h2>CSVファイルを復元するAPI</h2>
                <form onSubmit={handleRestorationCsvSubmit}>
                    <div>
                        <label>CsvId:</label>
                        <input
                            type="text"
                            name="csv_id"
                            value={restorationCsv.csv_id}
                            onChange={handleRestorationCsvDataChange}
                            required
                        />
                    </div>
                    <button type="submit">Restoration Csv Data</button>
                    <div>
                        result: {restorationCsvResult}
                    </div>
                </form>
            </div>
            <div>
                <h2>削除したCSVファイルの情報を取得するAPI</h2>
                <button onClick={handleClickGetDeleteFile}>get delete csv</button>
                <div>
                    result: {getDeleteFileResult}
                </div>
            </div>
            <div>
                <h2>CSVファイルを完全に削除するAPI</h2>
                <button onClick={handleClickDeletePermanently}>delete permanently csv</button>
                <div>
                    result: {deletePermanentlyResult}
                </div>
            </div>
        </div>
    )
}

export default Csvs
