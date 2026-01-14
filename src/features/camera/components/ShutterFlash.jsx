/**
 * ShutterFlash Component
 * White flash animation when photo is captured
 */

import { motion, AnimatePresence } from 'framer-motion';

const ShutterFlash = ({ isFlashing }) => {
  return (
    <AnimatePresence>
      {isFlashing && (
        <motion.div
          className="absolute inset-0 bg-white z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.3, times: [0, 0.5, 1] }}
        />
      )}
    </AnimatePresence>
  );
};

export default ShutterFlash;
