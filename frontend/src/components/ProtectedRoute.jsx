import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
    const currentVoter = useSelector((state) => state?.vote?.currentVoter);

    if (!currentVoter) {
        return <Navigate to='/' replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
