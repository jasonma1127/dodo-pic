/**
 * EditorView Component
 * Main editor page combining canvas and toolbar
 *
 * Features:
 * - Two-column layout (canvas + toolbar)
 * - Responsive design
 * - Auto-advance to export when done editing
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import EditorCanvas from './EditorCanvas';
import EditorToolbar from './EditorToolbar';
import { useWorkflowStore } from '@/store';
import { COPY } from '@/shared/copy/en';

const EditorView = () => {
  const { setCanGoNext } = useWorkflowStore();

  useEffect(() => {
    // User can always proceed to export after entering editor
    setCanGoNext(true);
  }, [setCanGoNext]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col container mx-auto px-4 py-4"
    >
      {/* Header */}
      <div className="text-center mb-4 flex-shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {COPY.editor.title}
        </h1>
        <p className="text-sm text-gray-600">
          {COPY.editor.subtitle}
        </p>
      </div>

      {/* Editor Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start min-h-0">
        {/* Canvas Area */}
        <div className="order-2 lg:order-1 h-full overflow-auto">
          <EditorCanvas />
        </div>

        {/* Toolbar Area */}
        <div className="order-1 lg:order-2 h-full overflow-auto">
          <EditorToolbar />
        </div>
      </div>
    </motion.div>
  );
};

export default EditorView;
