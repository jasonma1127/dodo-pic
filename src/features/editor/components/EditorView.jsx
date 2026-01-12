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
      className="container mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          {COPY.editor.title}
        </h1>
        <p className="text-lg text-gray-600">
          {COPY.editor.subtitle}
        </p>
      </div>

      {/* Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Canvas Area */}
        <div className="order-2 lg:order-1">
          <EditorCanvas />
        </div>

        {/* Toolbar Area */}
        <div className="order-1 lg:order-2">
          <EditorToolbar />
        </div>
      </div>
    </motion.div>
  );
};

export default EditorView;
