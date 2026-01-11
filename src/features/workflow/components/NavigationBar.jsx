/**
 * NavigationBar Component
 * Bottom navigation with Previous/Next buttons
 */

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { useWorkflowStore } from '@/store';
import { Button, Modal } from '@/shared/components';
import { COPY } from '@/shared/copy/en';
import { useState } from 'react';

const NavigationBar = () => {
  const {
    currentStep,
    canGoNext,
    canGoPrev,
    nextStep,
    prevStep,
    resetWorkflow,
    isFirstStep,
    isLastStep,
  } = useWorkflowStore();

  const [showRestartModal, setShowRestartModal] = useState(false);

  const handleRestart = () => {
    resetWorkflow();
    setShowRestartModal(false);
    // Also reset other stores
    window.location.reload(); // Simple way to reset everything
  };

  return (
    <>
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-ios-gray-200 glass z-30"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Previous Button */}
            <Button
              variant="secondary"
              onClick={prevStep}
              disabled={!canGoPrev || isFirstStep()}
              className="min-w-[120px]"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              {COPY.workflow.navigation.previous}
            </Button>

            {/* Restart Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRestartModal(true)}
            >
              <Home className="w-4 h-4 mr-1" />
              {COPY.export.actions.startOver}
            </Button>

            {/* Next/Finish Button */}
            <Button
              variant="primary"
              onClick={nextStep}
              disabled={!canGoNext || isLastStep()}
              className="min-w-[120px]"
            >
              {isLastStep() ? COPY.workflow.navigation.finish : COPY.workflow.navigation.next}
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Restart Confirmation Modal */}
      <Modal
        isOpen={showRestartModal}
        onClose={() => setShowRestartModal(false)}
        title={COPY.export.confirmRestart.title}
      >
        <Modal.Body>
          <p className="text-gray-700">{COPY.export.confirmRestart.message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowRestartModal(false)}
          >
            {COPY.export.confirmRestart.cancel}
          </Button>
          <Button
            variant="danger"
            onClick={handleRestart}
          >
            {COPY.export.confirmRestart.confirm}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NavigationBar;
