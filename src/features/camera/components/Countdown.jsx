/**
 * Countdown Component
 * Displays animated countdown before photo capture (3, 2, 1)
 */

import { motion, AnimatePresence } from 'framer-motion';

const Countdown = ({ count }) => {
  if (count === null || count === 0) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={count}
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="text-white text-9xl font-bold"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.2, 1],
            opacity: [0, 1, 1],
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            duration: 0.4,
            ease: 'easeOut',
          }}
        >
          {count}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Countdown;
