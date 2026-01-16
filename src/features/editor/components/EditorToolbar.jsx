/**
 * EditorToolbar Component
 * Tabbed toolbar for switching between editor panels
 *
 * Features:
 * - Tab navigation (Filters, Frames)
 * - Animated tab indicator
 * - Displays corresponding panel based on active tab
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Frame } from 'lucide-react';
import FilterPanel from './FilterPanel';
import FramePanel from './FramePanel';
import { COPY } from '@/shared/copy/en';

const EditorToolbar = () => {
  const [activeTab, setActiveTab] = useState('filters');

  const tabs = [
    { id: 'filters', label: COPY.editor.tabs.filters, icon: Wand2, panel: FilterPanel },
    { id: 'frames', label: COPY.editor.tabs.frames, icon: Frame, panel: FramePanel },
  ];

  const ActivePanel = tabs.find(t => t.id === activeTab)?.panel || FilterPanel;

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-macos p-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex items-center gap-2 px-4 py-3
                text-sm font-medium transition-colors
                ${isActive
                  ? 'text-ios-blue'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>

              {/* Active Tab Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-ios-blue"
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Panel Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <ActivePanel />
      </motion.div>
    </div>
  );
};

export default EditorToolbar;
