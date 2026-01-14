/**
 * useCamera Hook
 * Manages camera state and photo capture logic
 */

import { useState, useEffect, useRef } from 'react';
import { usePhotoStore, useWorkflowStore } from '@/store';

export const useCamera = () => {
  const webcamRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [retakeIndex, setRetakeIndex] = useState(null);

  const { photos, maxPhotos, addPhoto, replacePhoto, areAllPhotosCaptured } = usePhotoStore();
  const { setCanGoNext, nextStep } = useWorkflowStore();

  /**
   * Toggle camera on/off
   */
  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
    setCameraError(null);
  };

  /**
   * Start camera
   */
  const startCamera = () => {
    setIsCameraOn(true);
    setCameraError(null);
  };

  /**
   * Stop camera
   */
  const stopCamera = () => {
    setIsCameraOn(false);
  };

  /**
   * Handle camera user media error
   */
  const handleCameraError = (error) => {
    console.error('Camera error:', error);
    setCameraError(error.message || 'Camera access failed');
    setIsCameraOn(false);
  };

  /**
   * Start capture sequence with countdown
   */
  const startCapture = () => {
    if (isCapturing) return;
    if (photos.length >= maxPhotos && retakeIndex === null) return;

    setIsCapturing(true);
    setCountdown(3); // Start 3-second countdown
  };

  /**
   * Countdown effect
   */
  useEffect(() => {
    if (countdown === null || countdown === 0) return;

    const timer = setTimeout(() => {
      if (countdown === 1) {
        // Countdown finished, capture photo
        capturePhoto();
        setCountdown(null);
      } else {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  /**
   * Capture photo from webcam
   */
  const capturePhoto = () => {
    if (!webcamRef.current) {
      console.error('Webcam ref not available');
      setIsCapturing(false);
      return;
    }

    try {
      // Trigger shutter flash
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 300);

      // Capture screenshot
      const imageSrc = webcamRef.current.getScreenshot();

      if (!imageSrc) {
        console.error('Failed to capture image');
        setIsCapturing(false);
        return;
      }

      // Add or replace photo
      if (retakeIndex !== null) {
        replacePhoto(retakeIndex, imageSrc);
        setRetakeIndex(null);
      } else {
        addPhoto(imageSrc);
      }

      setIsCapturing(false);

      // Check if all photos captured
      if (areAllPhotosCaptured() || (retakeIndex !== null && photos.length === maxPhotos)) {
        // Enable next step - let user manually proceed
        setCanGoNext(true);
      }
    } catch (error) {
      console.error('Capture error:', error);
      setIsCapturing(false);
    }
  };

  /**
   * Initiate retake for specific photo
   */
  const initiateRetake = (index) => {
    setRetakeIndex(index);
    setIsCameraOn(true);
  };

  /**
   * Cancel retake
   */
  const cancelRetake = () => {
    setRetakeIndex(null);
  };

  return {
    // Refs
    webcamRef,

    // State
    isCameraOn,
    isCapturing,
    countdown,
    isFlashing,
    cameraError,
    retakeIndex,

    // Actions
    toggleCamera,
    startCamera,
    stopCamera,
    startCapture,
    initiateRetake,
    cancelRetake,
    handleCameraError,
  };
};
