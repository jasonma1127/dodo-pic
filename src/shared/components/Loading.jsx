/**
 * Loading Component
 * Reusable loading spinner with optional text
 *
 * Variants:
 * - spinner: Classic spinning circle
 * - dots: Animated dots
 * - pulse: Pulsing circle
 */

import { motion } from 'framer-motion';

const Loading = ({
  variant = 'spinner',
  size = 'md',
  text,
  className = '',
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // Spinner variant
  if (variant === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
        <div className={`spinner ${sizeClasses[size]}`} />
        {text && (
          <p className="text-sm text-gray-600 animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  // Dots variant
  if (variant === 'dots') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-ios-blue rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
        {text && (
          <p className="ml-2 text-sm text-gray-600">{text}</p>
        )}
      </div>
    );
  }

  // Pulse variant
  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
        <motion.div
          className={`bg-ios-blue rounded-full ${sizeClasses[size]}`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
        {text && (
          <p className="text-sm text-gray-600 animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  return null;
};

/**
 * FullScreenLoading - Full screen loading overlay
 */
export const FullScreenLoading = ({ text }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm">
    <Loading variant="spinner" size="xl" text={text} />
  </div>
);

export default Loading;
