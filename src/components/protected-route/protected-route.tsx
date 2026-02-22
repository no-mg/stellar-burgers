import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectUser, selectAuthChecked } from '../../services/slices/userSlice';

type TProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: TProtectedRouteProps) => {
  const location = useLocation();

  const { user, isAuthChecked } = useSelector((state) => state.user);

  if (!isAuthChecked) return null;

  const isAuthenticated = !!user;

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (onlyUnAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};