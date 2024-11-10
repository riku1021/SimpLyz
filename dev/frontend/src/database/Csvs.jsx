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
        </div>
    )
}

export default Csvs
