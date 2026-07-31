import React from 'react';

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  // Pass-through AuthGate for the application
  return <>{children}</>;
}
