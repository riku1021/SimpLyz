import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useAuth = (): { userId: string | null; csvId: string | null } => {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = localStorage.getItem('userId');
    const csvId = localStorage.getItem('selectedCsvId');
    useEffect(() => {
        const loginStatus = localStorage.getItem('loginStatus');
        if (!loginStatus && location.pathname !== '/signup') {
            navigate('/signup');
            return;
        }
        else if (loginStatus === 'ログインアウト中' && location.pathname !== '/login') {
            navigate('/login');
            return;
        }
        if (!csvId && location.pathname !== '/management-file') {
            navigate('/management-file');
        }
    }, [navigate, location.pathname, csvId]);
    return { userId, csvId };
};

export default useAuth;
