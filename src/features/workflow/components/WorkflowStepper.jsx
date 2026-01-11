/**
 * WorkflowStepper Component
 * Displays current step progress in the workflow
 */

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useWorkflowStore } from '@/store';
import { COPY } from '@/shared/copy/en';

const WorkflowStepper = () => {
  const { steps, currentStep, getCurrentStepIndex } = useWorkflowStore();
  const currentIndex = getCurrentStepIndex();

  return (
    <div className="w-full bg-white border-b border-ios-gray-200 py-4 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const stepLabel = COPY.workflow.steps[step];

            return (
              <div key={step} className="flex items-center flex-1">
                {/* Step Indicator */}
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      transition-all duration-300
                      ${isCompleted ? 'bg-ios-blue text-white' : ''}
                      ${isCurrent ? 'bg-ios-blue text-white ring-4 ring-ios-blue ring-opacity-30' : ''}
                      ${!isCompleted && !isCurrent ? 'bg-ios-gray-200 text-gray-500' : ''}
                    `}
                    initial={false}
                    animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </motion.div>

                  {/* Step Label */}
                  <div className="mt-2 text-center">
                    <p
                      className={`
                        text-xs font-medium
                        ${isCurrent ? 'text-ios-blue' : 'text-gray-600'}
                      `}
                    >
                      {stepLabel}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 mt-[-28px] bg-ios-gray-200">
                    <motion.div
                      className="h-full bg-ios-blue"
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkflowStepper;
