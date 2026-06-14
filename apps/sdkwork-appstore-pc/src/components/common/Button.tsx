import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full',
        {
          'bg-[#0071e3] text-white hover:bg-[#0077ed] active:scale-95': variant === 'primary',
          'bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-95': variant === 'secondary',
          'text-gray-700 hover:bg-gray-100': variant === 'ghost',
          'bg-red-500 text-white hover:bg-red-600 active:scale-95': variant === 'danger',
          'px-3 py-1.5 text-xs': size === 'sm',
          'px-5 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
          'opacity-50 cursor-not-allowed': disabled || loading,
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
