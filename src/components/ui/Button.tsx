import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  success?: boolean;
  disabledReason?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  loading = false,
  success = false,
  disabledReason,
  className = '',
  disabled,
  title,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-sans font-medium transition-all duration-150 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 select-none active:translate-y-[0.5px]';

  const sizeClasses = {
    sm: 'text-xs h-8 px-2.5 gap-1.5',
    md: 'text-sm h-9 px-3.5 gap-2',
    lg: 'text-base h-11 px-5 gap-2.5',
  }[size];

  const variantClasses = {
    primary: 'bg-primary text-bg hover:bg-primary-hover active:bg-primary-active border border-primary',
    secondary: 'bg-surface text-ink hover:bg-surface-sunken active:bg-border border border-border-strong shadow-1',
    outline: 'bg-transparent text-ink hover:bg-surface-sunken active:bg-border border border-border',
    ghost: 'bg-transparent text-text-secondary hover:text-ink hover:bg-surface-sunken border border-transparent',
    destructive: 'bg-error-tint text-error hover:bg-error hover:text-surface-elevated border border-error/30 active:bg-error',
  }[variant];

  const isDisabled = disabled || loading || success;
  const computedTitle = disabled && disabledReason ? disabledReason : title;

  return (
    <button
      {...props}
      disabled={isDisabled}
      title={computedTitle}
      className={`
        ${baseClasses}
        ${sizeClasses}
        ${variantClasses}
        ${isDisabled ? 'opacity-50 cursor-not-allowed active:translate-y-0' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading && (
        <svg
          className="animate-spin -ml-0.5 h-3.5 w-3.5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {success && (
        <svg className="h-3.5 w-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      <span>{children}</span>
    </button>
  );
};
