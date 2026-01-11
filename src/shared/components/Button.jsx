/**
 * Button Component
 * Reusable button with multiple variants following macOS/iOS design
 *
 * Variants:
 * - primary: Blue filled button (main actions)
 * - secondary: Gray outline button (cancel, back)
 * - danger: Red filled button (destructive actions)
 * - ghost: Transparent button (subtle actions)
 *
 * Sizes:
 * - sm: Small (32px height)
 * - md: Medium (40px height) [default]
 * - lg: Large (48px height)
 */

import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'font-medium transition-all duration-150 rounded-lg focus-ring disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant classes
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="spinner w-4 h-4" />
          <span>{children}</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
