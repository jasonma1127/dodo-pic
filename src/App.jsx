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
import EditorView from '@/features/editor/components/EditorView';
import ExportPreview from '@/features/export/components/ExportPreview';
import WorkflowStepper from '@/features/workflow/components/WorkflowStepper';
import NavigationBar from '@/features/workflow/components/NavigationBar';

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
          {currentStep === 'export' && <ExportPreview key="export" />}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <NavigationBar />
    </div>
  );
}

export default App;
