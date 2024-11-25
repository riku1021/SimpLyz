import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useAuth = (): { userId: string | null; csvId: string | null } => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));
    const [csvId, setCsvId] = useState<string | null>(localStorage.getItem('selectedCsvId'));

    useEffect(() => {
        const loginStatus = localStorage.getItem('loginStatus');

        if (loginStatus === 'ログイン中' && ['/signup', '/login'].includes(location.pathname)) {
            navigate('/management-file');
            return;
        }

        if (['/signup', '/login'].includes(location.pathname)) return;

        // ログイン状態の確認
        if (!loginStatus) {
            navigate('/signup');
            return;
        } else if (loginStatus === 'ログアウト中') {
            navigate('/login');
            return;
        }

        // CSVファイル選択の確認
        if (!csvId && location.pathname !== '/management-file') {
            navigate('/management-file');
        }
    }, [navigate, location.pathname, csvId]);

    useEffect(() => {
        const handleStorageChange = () => {
            setUserId(localStorage.getItem('userId'));
            setCsvId(localStorage.getItem('selectedCsvId'));
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return { userId, csvId };
};

export default useAuth;
