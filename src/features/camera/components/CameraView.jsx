/**
 * CameraView Component
 * Main camera interface for capturing photos
 */

import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import { Camera as CameraIcon, CameraOff, Circle } from 'lucide-react';
import { usePhotoStore } from '@/store';
import { useCamera } from '../hooks/useCamera';
import { Button } from '@/shared/components';
import { COPY } from '@/shared/copy/en';
import Countdown from './Countdown';
import ShutterFlash from './ShutterFlash';
import PhotoGrid from './PhotoGrid';

const CameraView = () => {
  const { photos, maxPhotos } = usePhotoStore();
  const {
    webcamRef,
    isCameraOn,
    isCapturing,
    countdown,
    isFlashing,
    cameraError,
    retakeIndex,
    toggleCamera,
    startCapture,
    initiateRetake,
    cancelRetake,
    handleCameraError,
  } = useCamera();

  const remainingPhotos = maxPhotos - photos.length;
  const allPhotosCaptured = photos.length === maxPhotos;

  return (
    <motion.div
      className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="p-4 text-center flex-shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {retakeIndex !== null
            ? `${COPY.camera.retaking} ${retakeIndex + 1}`
            : COPY.camera.title}
        </h1>
        <p className="text-gray-600">
          {allPhotosCaptured
            ? COPY.camera.progress.complete
            : COPY.camera.subtitle(photos.length, maxPhotos)}
        </p>
        {!allPhotosCaptured && remainingPhotos > 0 && (
          <p className="text-sm text-ios-blue mt-1">
            {COPY.camera.progress.remaining(remainingPhotos)}
          </p>
        )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-0">
        {/* Camera Section */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl">
            {/* Camera Preview */}
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-macos-lg aspect-[3/4]">
              {isCameraOn ? (
                <>
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/png"
                    videoConstraints={{
                      width: 1280,
                      height: 1920,
                      facingMode: 'user',
                    }}
                    onUserMediaError={handleCameraError}
                    className="w-full h-full object-cover"
                  />

                  {/* Countdown Overlay */}
                  <Countdown count={countdown} />

                  {/* Shutter Flash */}
                  <ShutterFlash isFlashing={isFlashing} />
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <CameraOff className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-6">
                      {cameraError || 'Camera is off'}
                    </p>
                    {cameraError && (
                      <p className="text-sm text-red-400 mb-4">
                        {COPY.camera.permissions.errorHelp}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div className="mt-6 flex flex-col items-center gap-4">
              {!isCameraOn ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={toggleCamera}
                  className="min-w-[200px]"
                >
                  <CameraIcon className="w-5 h-5 mr-2" />
                  {COPY.camera.startCamera}
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={startCapture}
                    disabled={isCapturing || (allPhotosCaptured && retakeIndex === null)}
                    className="min-w-[200px]"
                  >
                    <Circle className="w-5 h-5 mr-2" />
                    {COPY.camera.capture}
                  </Button>

                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={toggleCamera}
                    >
                      {COPY.camera.stopCamera}
                    </Button>

                    {retakeIndex !== null && (
                      <Button
                        variant="ghost"
                        size="md"
                        onClick={cancelRetake}
                      >
                        {COPY.global.cancel}
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Photo Grid Section */}
        <div className="flex-1">
          <PhotoGrid onRetake={initiateRetake} />
        </div>
      </div>
    </motion.div>
  );
};

export default CameraView;
