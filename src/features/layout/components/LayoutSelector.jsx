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
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {COPY.layout.title}
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {COPY.layout.subtitle}
          </motion.p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LAYOUTS.map((layout, index) => (
            <motion.div
              key={layout.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
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
