/**
 * LayoutSelector Component
 * Allows user to choose a photo layout
 */

import { motion } from 'framer-motion';
import { useLayoutStore } from '@/store';
import { usePhotoStore } from '@/store';
import { useWorkflowStore } from '@/store';
import { LAYOUTS } from '../constants/layouts';
import LayoutPreview from './LayoutPreview';
import { COPY } from '@/shared/copy/en';

const LayoutSelector = () => {
  const { selectedLayout, selectLayout } = useLayoutStore();
  const { setMaxPhotos } = usePhotoStore();
  const { setCanGoNext, nextStep } = useWorkflowStore();

  const handleLayoutSelect = (layout) => {
    // Update layout store
    selectLayout(layout);

    // Update max photos in photo store
    setMaxPhotos(layout.total);

    // Enable next step
    setCanGoNext(true);

    // Auto-advance to camera step after a short delay
    setTimeout(() => {
      nextStep();
    }, 300);
  };

  return (
    <motion.div
      className="h-full flex flex-col items-center justify-start pt-12 pb-28 px-6 bg-gradient-to-br from-slate-50 to-slate-100 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-6xl w-full">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-ios-blue to-purple-600 bg-clip-text text-transparent mb-4"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {COPY.layout.welcome}
          </motion.h1>
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {COPY.layout.title}
          </motion.h2>
          <motion.p
            className="text-base text-gray-600"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {COPY.layout.subtitle}
          </motion.p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {LAYOUTS.map((layout, index) => (
            <motion.div
              key={layout.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + 0.1 * index }}
            >
              <LayoutPreview
                layout={layout}
                isSelected={selectedLayout?.id === layout.id}
                onSelect={handleLayoutSelect}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LayoutSelector;
