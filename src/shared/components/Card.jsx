/**
 * Card Component
 * macOS-style elevated surface with optional hover and selection states
 *
 * Features:
 * - White background with subtle shadow
 * - Rounded corners
 * - Optional hover effect (scale + shadow)
 * - Optional selected state (blue ring)
 */

import { motion } from 'framer-motion';

const Card = ({
  children,
  hover = false,
  selected = false,
  onClick,
  className = '',
  ...props
}) => {
  // Base card classes
  const baseClasses = 'card';

  // Optional classes
  const hoverClasses = hover ? 'card-hover' : '';
  const selectedClasses = selected ? 'card-selected' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  const cardClasses = `${baseClasses} ${hoverClasses} ${selectedClasses} ${clickableClasses} ${className}`;

  const cardContent = (
    <div className={cardClasses} onClick={onClick} {...props}>
      {children}
    </div>
  );

  // Wrap with motion if hover is enabled
  if (hover) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

/**
 * Card.Image - Image component for card
 */
Card.Image = ({ src, alt, className = '' }) => (
  <img
    src={src}
    alt={alt}
    className={`w-full h-auto rounded-xl mb-3 ${className}`}
  />
);

/**
 * Card.Title - Title component for card
 */
Card.Title = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 mb-1 ${className}`}>
    {children}
  </h3>
);

/**
 * Card.Description - Description component for card
 */
Card.Description = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-600 ${className}`}>
    {children}
  </p>
);

export default Card;
