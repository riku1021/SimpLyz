import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { fetchCsvSmallData, CsvDataType } from '../../databaseUtils/Csvs';
import FileUpload from './FileUpload';
import FileList from './FileList';

const ManagementFile: React.FC = () => {
	const [csvList, setCsvList] = useState<CsvDataType[]>([]);
	const [loadingCsvList, setLoadingCsvList] = useState<boolean>(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const fetchCsvList = async () => {
		setLoadingCsvList(true);
		try {
			const response = await fetchCsvSmallData('rootId');
			setCsvList(response.CsvData || []);
		} catch (error) {
			console.error('CSV一覧の取得に失敗しました', error);
		} finally {
			setLoadingCsvList(false);
		}
	};

	useEffect(() => {
		fetchCsvList();
	}, []);

	return (
		<Box>
			<FileUpload
				fileInputRef={fileInputRef}
				fetchCsvList={fetchCsvList}
			/>
			<FileList
				csvList={csvList}
				loadingCsvList={loadingCsvList}
				fetchCsvList={fetchCsvList}
			/>
		</Box>
	);
};

export default ManagementFile;
