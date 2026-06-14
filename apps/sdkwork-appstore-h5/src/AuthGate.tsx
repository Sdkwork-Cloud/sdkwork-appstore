import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGate({ children, fallback }: AuthGateProps) {
  const location = useLocation();
  const isAuthenticated = checkAuth();

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function checkAuth(): boolean {
  return !!localStorage.getItem('auth-token');
}
