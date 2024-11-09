import {
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	Drawer,
	List,
	ListItemButton,
	ListItemText,
	Box,
	ListItemIcon
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InfoIcon from '@mui/icons-material/Info';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import TableChartIcon from '@mui/icons-material/TableChart';
import CreateIcon from '@mui/icons-material/Create';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonTrigger from './ButtonTrigger/ButtonTrigger';

const Header = ({ children }) => {
	const navigate = useNavigate();
	const [drawerOpen, setDrawerOpen] = useState(false);

	const toggleDrawer = () => {
		setDrawerOpen((prev) => !prev);
	};

	const handleNavigate = (path) => {
		navigate(path);
		setDrawerOpen(false);
	};

	return (
		<Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
			<AppBar position="static" sx={{ zIndex: 1300, flexShrink: 0 }}>
				<Toolbar>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ marginRight: '5px' }}
						onClick={toggleDrawer}
					>
						<ButtonTrigger drawerOpen={drawerOpen} />
					</IconButton>
					<Typography variant="h5" sx={{ fontFamily: 'sans-serif', fontWeight: 'bold', flexGrow: 1 }}>
						SimpLyz
					</Typography>

					{/* ヘッダー右側のメニューアイテム */}
					<Box
						sx={{
							display: { xs: 'none', sm: 'flex' },
							gap: 2
						}}
					>
						<Box
							onClick={() => handleNavigate('/manage-csv')}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								cursor: 'pointer',
								padding: '10px',
								'&:hover': {
									backgroundColor: 'rgba(0, 0, 0, 0.1)'
								}
							}}
						>
							<UploadFileIcon fontSize="medium" />
							<Typography variant="caption" fontWeight="bold">ファイル管理</Typography>
						</Box>
						<Box
							onClick={() => handleNavigate('/data-info')}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								cursor: 'pointer',
								padding: '10px',

								'&:hover': {
									backgroundColor: 'rgba(0, 0, 0, 0.1)'
								}
							}}
						>
							<InfoIcon fontSize="medium" />
							<Typography variant="caption" fontWeight="bold">データ情報</Typography>
						</Box>
						<Box
							onClick={() => handleNavigate('/miss-input')}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								cursor: 'pointer',
								padding: '10px',

								'&:hover': {
									backgroundColor: 'rgba(0, 0, 0, 0.1)'
								}
							}}
						>
							<TableChartIcon fontSize="medium" />
							<Typography variant="caption" fontWeight="bold">欠損値補完</Typography>
						</Box>
						<Box
							onClick={() => handleNavigate('/feature-creation')}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								cursor: 'pointer',
								padding: '10px',

								'&:hover': {
									backgroundColor: 'rgba(0, 0, 0, 0.1)'
								}
							}}
						>
							<CreateIcon fontSize="medium" />
							<Typography variant="caption" fontWeight="bold">特徴量作成</Typography>
						</Box>
						<Box
							onClick={() => handleNavigate('/data-analysis')}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								cursor: 'pointer',
								padding: '10px',

								'&:hover': {
									backgroundColor: 'rgba(0, 0, 0, 0.1)'
								}
							}}
						>
							<QueryStatsIcon fontSize="medium" />
							<Typography variant="caption" fontWeight="bold">データ分析</Typography>
						</Box>
					</Box>
				</Toolbar>
			</AppBar>

			{/* ドロワーメニュー */}
			<Drawer
				anchor='left'
				open={drawerOpen}
				onClose={toggleDrawer}
				PaperProps={{ sx: { width: 250 } }}
			>
				<Box
					sx={{
						backgroundColor: 'primary.main',
						color: 'white',
						display: 'flex',
						alignItems: 'center',
						padding: '10px'
					}}
				>
					<Typography variant="h6" sx={{ flexGrow: 1 }}>
						メニュー
					</Typography>
					<IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
						<CloseIcon />
					</IconButton>
				</Box>
				<Box sx={{ width: 250, paddingRight: '20px' }}>
					<List>
						<ListItemButton onClick={() => handleNavigate('/manage-csv')}>
							<ListItemIcon>
								<UploadFileIcon />
							</ListItemIcon>
							<ListItemText primary="ファイル管理" primaryTypographyProps={{ fontWeight: 'bold' }} />
						</ListItemButton>
						<ListItemButton onClick={() => handleNavigate('/data-info')}>
							<ListItemIcon>
								<InfoIcon />
							</ListItemIcon>
							<ListItemText primary="データ情報" primaryTypographyProps={{ fontWeight: 'bold' }} />
						</ListItemButton>
						<ListItemButton onClick={() => handleNavigate('/miss-input')}>
							<ListItemIcon>
								<TableChartIcon />
							</ListItemIcon>
							<ListItemText primary="欠損値補完" primaryTypographyProps={{ fontWeight: 'bold' }} />
						</ListItemButton>
						<ListItemButton onClick={() => handleNavigate('/feature-creation')}>
							<ListItemIcon>
								<CreateIcon />
							</ListItemIcon>
							<ListItemText primary="特徴量作成" primaryTypographyProps={{ fontWeight: 'bold' }} />
						</ListItemButton>
						<ListItemButton onClick={() => handleNavigate('/data-analysis')}>
							<ListItemIcon>
								<QueryStatsIcon />
							</ListItemIcon>
							<ListItemText primary="データ分析" primaryTypographyProps={{ fontWeight: 'bold' }} />
						</ListItemButton>
					</List>
				</Box>
			</Drawer>

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					overflowY: 'auto',
				}}
			>
				{children}
			</Box>
		</Box>
	);
};

export default Header;
