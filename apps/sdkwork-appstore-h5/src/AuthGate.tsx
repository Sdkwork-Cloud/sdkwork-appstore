import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/bootstrap/iamRuntime';

interface AuthGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGate({ children, fallback }: AuthGateProps) {
  const location = useLocation();

  if (!isAuthenticated()) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export { isAuthenticated } from '@/bootstrap/iamRuntime';
