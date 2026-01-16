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
      className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden"
    >
      {/* Header */}
      <div className="p-3 text-center flex-shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {COPY.editor.title}
        </h1>
        <p className="text-gray-600">
          {COPY.editor.subtitle}
        </p>
      </div>

      {/* Editor Layout */}
      <div className="flex-1 flex gap-4 px-4 pt-4 pb-32 min-h-0">
        {/* Left: Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-6">
          <EditorCanvas />
        </div>

        {/* Right: Toolbar Area */}
        <div className="flex-1 flex items-start justify-center p-6 overflow-y-auto">
          <EditorToolbar />
        </div>
      </div>
    </motion.div>
  );
};

export default EditorView;
