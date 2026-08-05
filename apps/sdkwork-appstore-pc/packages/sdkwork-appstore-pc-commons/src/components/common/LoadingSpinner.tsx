interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`p-8 flex items-center justify-center min-h-[50vh] ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-[#0A84FF]" />
    </div>
  );
}
