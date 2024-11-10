import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = localStorage.getItem('userId');
    const csvId = localStorage.getItem('csvId');
    useEffect(() => {
        const loginStatus = localStorage.getItem('loginStatus');
        if (location.pathname === '/' && loginStatus === 'ログイン中') {
            navigate('/manage-csv');
        } else if (loginStatus !== 'ログイン中') {
            navigate('/');
        }
    }, [navigate, location.pathname]);
    return userId, csvId;
};

export default useAuth;
