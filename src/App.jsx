/**
 * App Component
 * Main application component with workflow integration
 */

import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWorkflowStore } from '@/store';

// Feature components
import LayoutSelector from '@/features/layout/components/LayoutSelector';
import CameraView from '@/features/camera/components/CameraView';
import WorkflowStepper from '@/features/workflow/components/WorkflowStepper';
import NavigationBar from '@/features/workflow/components/NavigationBar';

// Placeholder components for upcoming features
const EditorView = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Editor</h2>
      <p className="text-gray-600">Coming soon: Filters, Stickers, and Frames</p>
    </div>
  </div>
);

const ExportView = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Export</h2>
      <p className="text-gray-600">Coming soon: Download and Share</p>
    </div>
  </div>
);

function App() {
  const { currentStep, setCanGoPrev } = useWorkflowStore();

  // Initialize workflow on mount
  useEffect(() => {
    // Can't go back from first step
    setCanGoPrev(false);
  }, [setCanGoPrev]);

  return (
    <div className="min-h-screen bg-ios-gray-50">
      {/* Workflow Step Indicator */}
      <WorkflowStepper />

      {/* Main Content - Animated page transitions */}
      <div className="pb-24">
        <AnimatePresence mode="wait">
          {currentStep === 'layout' && <LayoutSelector key="layout" />}
          {currentStep === 'camera' && <CameraView key="camera" />}
          {currentStep === 'editor' && <EditorView key="editor" />}
          {currentStep === 'export' && <ExportView key="export" />}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <NavigationBar />
    </div>
  );
}

export default App;
