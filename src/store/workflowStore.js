/**
 * Workflow Store
 * Manages multi-step workflow progression
 *
 * This store handles:
 * - Current step in the workflow
 * - Step navigation (next, previous, jump to step)
 * - Validation for step progression
 * - Workflow reset
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * @typedef {'layout' | 'camera' | 'editor' | 'export'} WorkflowStep
 */

const STEPS = ['layout', 'camera', 'editor', 'export'];

export const useWorkflowStore = create(
  devtools(
    (set, get) => ({
      /**
       * State
       */
      currentStep: 'layout', // WorkflowStep - Current step in workflow
      steps: STEPS,          // Array<string> - All workflow steps
      canGoNext: false,      // boolean - Whether user can proceed to next step
      canGoPrev: false,      // boolean - Whether user can go back

      /**
       * Actions
       */

      /**
       * Proceed to the next step
       */
      nextStep: () =>
        set((state) => {
          if (!state.canGoNext) {
            console.warn('Cannot proceed to next step');
            return state;
          }

          const currentIndex = state.steps.indexOf(state.currentStep);
          if (currentIndex === state.steps.length - 1) {
            console.warn('Already at last step');
            return state;
          }

          const nextStep = state.steps[currentIndex + 1];

          return {
            currentStep: nextStep,
            canGoPrev: true,
            // Reset canGoNext - will be set by validation
            canGoNext: false,
          };
        }, false, 'workflow/nextStep'),

      /**
       * Go back to the previous step
       */
      prevStep: () =>
        set((state) => {
          if (!state.canGoPrev) {
            console.warn('Cannot go to previous step');
            return state;
          }

          const currentIndex = state.steps.indexOf(state.currentStep);
          if (currentIndex === 0) {
            console.warn('Already at first step');
            return state;
          }

          const prevStep = state.steps[currentIndex - 1];

          return {
            currentStep: prevStep,
            canGoNext: true, // Can always go forward when going back
            canGoPrev: currentIndex - 1 > 0,
          };
        }, false, 'workflow/prevStep'),

      /**
       * Jump to a specific step (if allowed)
       * @param {WorkflowStep} step - Step to jump to
       */
      goToStep: (step) =>
        set((state) => {
          if (!state.steps.includes(step)) {
            console.error('Invalid step:', step);
            return state;
          }

          const stepIndex = state.steps.indexOf(step);
          const currentIndex = state.steps.indexOf(state.currentStep);

          // Only allow going back to completed steps
          if (stepIndex > currentIndex) {
            console.warn('Cannot jump forward to incomplete step');
            return state;
          }

          return {
            currentStep: step,
            canGoNext: true,
            canGoPrev: stepIndex > 0,
          };
        }, false, 'workflow/goToStep'),

      /**
       * Set whether user can proceed to next step
       * @param {boolean} canGo - Whether next is allowed
       */
      setCanGoNext: (canGo) =>
        set(
          {
            canGoNext: canGo,
          },
          false,
          'workflow/setCanGoNext'
        ),

      /**
       * Set whether user can go to previous step
       * @param {boolean} canGo - Whether previous is allowed
       */
      setCanGoPrev: (canGo) =>
        set(
          {
            canGoPrev: canGo,
          },
          false,
          'workflow/setCanGoPrev'
        ),

      /**
       * Reset workflow to initial state
       */
      resetWorkflow: () =>
        set(
          {
            currentStep: 'layout',
            canGoNext: false,
            canGoPrev: false,
          },
          false,
          'workflow/reset'
        ),

      /**
       * Get current step index
       * @returns {number}
       */
      getCurrentStepIndex: () => {
        const state = get();
        return state.steps.indexOf(state.currentStep);
      },

      /**
       * Get total number of steps
       * @returns {number}
       */
      getTotalSteps: () => {
        return get().steps.length;
      },

      /**
       * Check if at first step
       * @returns {boolean}
       */
      isFirstStep: () => {
        return get().currentStep === get().steps[0];
      },

      /**
       * Check if at last step
       * @returns {boolean}
       */
      isLastStep: () => {
        const state = get();
        return state.currentStep === state.steps[state.steps.length - 1];
      },
    }),
    {
      name: 'workflow-storage',
      enabled: true,
    }
  )
);
