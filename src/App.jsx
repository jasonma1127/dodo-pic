/**
 * App Component
 * Main application component with workflow integration
 */

import { useEffect } from 'react';
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
    <div className="h-screen flex flex-col bg-ios-gray-50 overflow-hidden">
      {/* Workflow Step Indicator */}
      <WorkflowStepper />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {currentStep === 'layout' && <LayoutSelector />}
        {currentStep === 'camera' && <CameraView />}
        {currentStep === 'editor' && <EditorView />}
        {currentStep === 'export' && <ExportPreview />}
      </div>

      {/* Bottom Navigation */}
      <NavigationBar />
    </div>
  );
}

export default App;
