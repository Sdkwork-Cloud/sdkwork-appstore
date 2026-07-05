import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

interface AppCardProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

export function AppCard({ title, subtitle, children, className }: AppCardProps) {
  return (
    <div className={cn('rounded-2xl border border-gray-100 bg-white p-4 shadow-sm', className)}>
      <div className="font-semibold text-gray-900">{title}</div>
      {subtitle ? <div className="mt-1 text-sm text-gray-500">{subtitle}</div> : null}
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}
