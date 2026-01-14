/**
 * Modal Component
 * iOS-style modal sheet with backdrop blur
 *
 * Features:
 * - Backdrop with blur effect
 * - Slide up animation (mobile) / fade in (desktop)
 * - Click outside to close
 * - Escape key to close
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  size = 'md',
}) => {
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdrop ? onClose : undefined}
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
            <motion.div
              className={`modal-content ${sizeClasses[size]} pointer-events-auto`}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-ios-gray-200">
                  {title && (
                    <h2 className="text-xl font-semibold text-gray-900">
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg hover:bg-ios-gray-100 transition-colors"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

/**
 * Modal.Header - Header component
 */
Modal.Header = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

/**
 * Modal.Body - Body component
 */
Modal.Body = ({ children, className = '' }) => (
  <div className={`mb-6 ${className}`}>
    {children}
  </div>
);

/**
 * Modal.Footer - Footer component with action buttons
 */
Modal.Footer = ({ children, className = '' }) => (
  <div className={`flex gap-3 justify-end ${className}`}>
    {children}
  </div>
);

export default Modal;
