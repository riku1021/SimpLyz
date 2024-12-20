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
	ListItemIcon,
} from '@mui/material';
import {
	Close as CloseIcon,
	UploadFile as UploadFileIcon,
	Info as InfoIcon,
	QueryStats as QueryStatsIcon,
	AccountTree as AccountTreeIcon,
	Create as CreateIcon,
	AccountCircle as AccountCircleIcon,
	HelpOutline as HelpOutlineIcon
} from '@mui/icons-material';
import { useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ButtonTrigger from './ButtonTrigger/ButtonTrigger';

interface HeaderProps {
	children: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

	const toggleDrawer = () => {
		setDrawerOpen((prev) => !prev);
	};

	const handleNavigate = (path: string) => {
		navigate(path);
		setDrawerOpen(false);
	};

	const isActive = (path: string) => location.pathname === path;

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
							display: 'flex',
							'@media (max-width: 700px)': {
								display: 'none',
							},
						}}
					>
						<Box
							onClick={() => handleNavigate('/management-file')}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								cursor: 'pointer',
								padding: '10px 15px',
								'&:hover': {
									backgroundColor: 'rgba(0, 0, 0, 0.1)',
								},
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
								padding: '10px 20px',
								'&:hover': {
									backgroundColor: 'rgba(0, 0, 0, 0.1)',
								},
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
								padding: '10px 20px',
								'&:hover': {
									backgroundColor: 'rgba(0, 0, 0, 0.1)',
								},
							}}
						>
							<AccountTreeIcon fontSize="medium" />
							<Typography variant="caption" fontWeight="bold">欠損値補完</Typography>
						</Box>
						<Box
							onClick={() => handleNavigate('/feature-creation')}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								cursor: 'pointer',
								padding: '10px 20px',
								'&:hover': {
									backgroundColor: 'rgba(0, 0, 0, 0.1)',
								},
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
								padding: '10px 20px',
								'&:hover': {
									backgroundColor: 'rgba(0, 0, 0, 0.1)',
								},
							}}
						>
							<QueryStatsIcon fontSize="medium" />
							<Typography variant="caption" fontWeight="bold">データ分析</Typography>
						</Box>
						<Box
							onClick={() => handleNavigate('/tool-guide')}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								cursor: 'pointer',
								padding: '10px 20px',
								'&:hover': {
									backgroundColor: 'rgba(0, 0, 0, 0.1)',
								},
							}}
						>
							<HelpOutlineIcon fontSize="medium" />
							<Typography variant="caption" fontWeight="bold">使い方</Typography>
						</Box>
					</Box>
				</Toolbar>
			</AppBar>

			<Drawer anchor='left' open={drawerOpen} onClose={toggleDrawer} PaperProps={{ sx: { width: 250, overflow: "hidden" } }}>
				<Box sx={{ backgroundColor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', padding: '10px' }}>
					<Typography variant="h6" sx={{ flexGrow: 1 }}>メニュー</Typography>
					<IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
						<CloseIcon />
					</IconButton>
				</Box>
				<Box sx={{ width: 250, paddingRight: '20px' }}>
					<List>
						<ListItemButton
							onClick={() => handleNavigate('/management-file')}
							sx={{
								backgroundColor: isActive('/management-file') ? '#DEEBF7' : 'inherit',
								'&:hover': {
									backgroundColor: isActive('/management-file') ? '#DEEBF7' : 'rgba(0, 0, 0, 0.04)',
								},
								borderRadius: '50px'
							}}
						>
							<ListItemIcon><UploadFileIcon /></ListItemIcon>
							<ListItemText primary="ファイル管理" primaryTypographyProps={{ fontWeight: 'bold' }} />
						</ListItemButton>
						<ListItemButton
							onClick={() => handleNavigate('/data-info')}
							sx={{
								backgroundColor: isActive('/data-info') ? '#DEEBF7' : 'inherit',
								'&:hover': {
									backgroundColor: isActive('/data-info') ? '#DEEBF7' : 'rgba(0, 0, 0, 0.04)',
								},
								borderRadius: '50px'
							}}
						>
							<ListItemIcon><InfoIcon /></ListItemIcon>
							<ListItemText primary="データ情報" primaryTypographyProps={{ fontWeight: 'bold' }} />
						</ListItemButton>
						<ListItemButton
							onClick={() => handleNavigate('/miss-input')}
							sx={{
								backgroundColor: isActive('/miss-input') ? '#DEEBF7' : 'inherit',
								'&:hover': {
									backgroundColor: isActive('/miss-input') ? '#DEEBF7' : 'rgba(0, 0, 0, 0.04)',
								},
								borderRadius: '50px'
							}}
						>
							<ListItemIcon><AccountTreeIcon /></ListItemIcon>
							<ListItemText primary="欠損値補完" primaryTypographyProps={{ fontWeight: 'bold' }} />
						</ListItemButton>
						<ListItemButton
							onClick={() => handleNavigate('/feature-creation')}
							sx={{
								backgroundColor: isActive('/feature-creation') ? '#DEEBF7' : 'inherit',
								'&:hover': {
									backgroundColor: isActive('/feature-creation') ? '#DEEBF7' : 'rgba(0, 0, 0, 0.04)',
								},
								borderRadius: '50px'
							}}
						>
							<ListItemIcon><CreateIcon /></ListItemIcon>
							<ListItemText primary="特徴量作成" primaryTypographyProps={{ fontWeight: 'bold' }} />
						</ListItemButton>
						<ListItemButton
							onClick={() => handleNavigate('/data-analysis')}
							sx={{
								backgroundColor: isActive('/data-analysis') ? '#DEEBF7' : 'inherit',
								'&:hover': {
									backgroundColor: isActive('/data-analysis') ? '#DEEBF7' : 'rgba(0, 0, 0, 0.04)',
								},
								borderRadius: '50px'
							}}
						>
							<ListItemIcon><QueryStatsIcon /></ListItemIcon>
							<ListItemText primary="データ分析" primaryTypographyProps={{ fontWeight: 'bold' }} />
						</ListItemButton>
						<ListItemButton
							onClick={() => handleNavigate('/user-info')}
							sx={{
								backgroundColor: isActive('/user-info') ? '#DEEBF7' : 'inherit',
								'&:hover': {
									backgroundColor: isActive('user-info') ? '#DEEBF7' : 'rgba(0, 0, 0, 0.04)',
								},
								borderRadius: '50px'
							}}
						>
							<ListItemIcon><AccountCircleIcon /></ListItemIcon>
							<ListItemText primary="ユーザー情報" primaryTypographyProps={{ fontWeight: 'bold' }} />
						</ListItemButton>
						<ListItemButton
							onClick={() => handleNavigate('/tool-guide')}
							sx={{
								backgroundColor: isActive('/tool-guide') ? '#DEEBF7' : 'inherit',
								'&:hover': {
									backgroundColor: isActive('tool-guide') ? '#DEEBF7' : 'rgba(0, 0, 0, 0.04)',
								},
								borderRadius: '50px'
							}}
						>
							<ListItemIcon><HelpOutlineIcon /></ListItemIcon>
							<ListItemText primary="使い方" primaryTypographyProps={{ fontWeight: 'bold' }} />
						</ListItemButton>
					</List>
				</Box>
			</Drawer>

			<Box component="main" sx={{ flexGrow: 1, overflowY: 'auto' }}>
				{children}
			</Box>
		</Box>
	);
};

export default Header;
