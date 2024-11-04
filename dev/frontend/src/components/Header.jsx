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
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InfoIcon from '@mui/icons-material/Info';
import TableChartIcon from '@mui/icons-material/TableChart';
import CreateIcon from '@mui/icons-material/Create';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
						sx={{ marginRight: '10px' }}
						onClick={toggleDrawer}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h5" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
						SimpLyz
					</Typography>
				</Toolbar>
			</AppBar>

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
							<ListItemText primary="CSVファイル管理" primaryTypographyProps={{ fontWeight: 'bold' }} />
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
						<ListItemButton onClick={() => handleNavigate('/analysis')}>
							<ListItemIcon>
								<AssessmentIcon />
							</ListItemIcon>
							<ListItemText primary="分析" primaryTypographyProps={{ fontWeight: 'bold' }} />
						</ListItemButton>
						<ListItemButton onClick={() => handleNavigate('/data-analysis')}>
							<ListItemIcon>
								<AssessmentIcon />
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
