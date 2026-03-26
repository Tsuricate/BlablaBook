import { Navigate } from 'react-router';
import { useCurrentUser } from '../context/UserContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user } = useCurrentUser();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
