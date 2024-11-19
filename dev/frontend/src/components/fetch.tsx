import { useEffect, useState } from "react";


const Fetch: React.FC = () => {
	const [message, setMessage] = useState<string>('');
	useEffect(() => {
		// Flaskからデータを取得し、messageに格納
		const fetchMessage = async () => {
			try {
				const response = await fetch('http://127.0.0.1:5000/', {
					method: 'GET'
				});
				const result = await response.json();
				setMessage(String(result.message));
			} catch (e) {
				console.error('Error fetching data:', e);
			}
		};
		fetchMessage();
	}, []);

	return (
		<div>
			{message}
		</div>
	);
}

export default Fetch;
