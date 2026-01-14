/**
 * ExportPreview Component
 * Preview and download final composed image
 *
 * Features:
 * - Display final composite image
 * - Download button
 * - Share button (if supported)
 * - Copy to clipboard button (if supported)
 * - Restart button to begin new session
 * - File size information
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Copy, RefreshCw, CheckCircle } from 'lucide-react';
import { usePhotoStore, useLayoutStore, useEditorStore, useWorkflowStore } from '@/store';
import { compositeImage } from '../utils/imageComposite';
import { downloadImage, getFileSize } from '../utils/download';
import { shareImage, copyImageToClipboard, isShareSupported } from '../utils/share';
import Button from '@/shared/components/Button';
import Modal from '@/shared/components/Modal';
import { FullScreenLoading } from '@/shared/components/Loading';
import { COPY } from '@/shared/copy/en';

const ExportPreview = () => {
  const [composedImage, setComposedImage] = useState(null);
  const [isComposing, setIsComposing] = useState(true);
  const [fileSize, setFileSize] = useState(null);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const { photos } = usePhotoStore();
  const { selectedLayout } = useLayoutStore();
  const { currentFilter, appliedStickers, selectedFrame } = useEditorStore();
  const { resetWorkflow } = useWorkflowStore();

  // Compose image on mount
  useEffect(() => {
    const compose = async () => {
      // Check if we have the required data
      if (!selectedLayout || !photos || photos.length === 0) {
        setIsComposing(false);
        return;
      }

      try {
        setIsComposing(true);

        const dataUrl = await compositeImage({
          photos,
          layout: selectedLayout,
          filterId: currentFilter,
          frameId: selectedFrame,
          stickers: appliedStickers,
          quality: 0.95,
        });

        setComposedImage(dataUrl);
        setFileSize(getFileSize(dataUrl));
      } catch (error) {
        console.error('Composition failed:', error);
      } finally {
        setIsComposing(false);
      }
    };

    compose();
  }, [photos, selectedLayout, currentFilter, selectedFrame, appliedStickers]);

  const handleDownload = () => {
    if (composedImage) {
      downloadImage(composedImage);
    }
  };

  const handleShare = async () => {
    if (!composedImage) return;

    try {
      await shareImage(composedImage, {
        title: 'DodoPic Photo',
        text: 'Check out my photo booth pictures!',
        filename: `dodopic-${Date.now()}.jpg`,
      });
    } catch (error) {
      console.error('Share failed:', error);
      // Fallback to download
      handleDownload();
    }
  };

  const handleCopy = async () => {
    if (!composedImage) return;

    try {
      await copyImageToClipboard(composedImage);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleRestart = () => {
    setShowRestartModal(true);
  };

  const confirmRestart = () => {
    resetWorkflow();
    setShowRestartModal(false);
  };

  if (isComposing) {
    return <FullScreenLoading text={COPY.export.composing} />;
  }

  // Show error if no photos or layout
  if (!selectedLayout || !photos || photos.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Photos to Export</h2>
          <p className="text-gray-600 mb-6">Please go back and capture some photos first.</p>
          <Button onClick={() => resetWorkflow()}>
            Start Over
          </Button>
        </div>
      </div>
    );
  }

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
          {COPY.export.title}
        </h1>
        <p className="text-gray-600">
          {COPY.export.subtitle}
        </p>
      </div>

      {/* Export Layout */}
      <div className="flex-1 flex gap-4 px-4 pt-4 pb-24 min-h-0">
        {/* Left: Image Preview */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="h-full"
              style={{ aspectRatio: `${selectedLayout.cols * 3} / ${selectedLayout.rows * 4}` }}
            >
              <div className="relative w-full h-full bg-white rounded-2xl shadow-macos overflow-hidden">
                {composedImage ? (
                  <img
                    src={composedImage}
                    alt="Final composition"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500">{COPY.export.error}</p>
                  </div>
                )}

                {/* File Info Overlay */}
                {fileSize && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-white text-sm py-2 px-4 text-center">
                    {COPY.export.fileSize}: {fileSize}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons (Fixed Sidebar) */}
        <div className="flex items-center justify-center">
          <div className="w-64 flex flex-col gap-3 flex-shrink-0">
            {/* Download Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleDownload}
              disabled={!composedImage}
              className="w-full"
            >
              <Download className="w-5 h-5 mr-2" />
              {COPY.export.download}
            </Button>

            {/* Share Button */}
            {isShareSupported() && (
              <Button
                variant="secondary"
                size="lg"
                onClick={handleShare}
                disabled={!composedImage}
                className="w-full"
              >
                <Share2 className="w-5 h-5 mr-2" />
                {COPY.export.share}
              </Button>
            )}

            {/* Copy Button */}
            {navigator.clipboard && (
              <Button
                variant="secondary"
                size="lg"
                onClick={handleCopy}
                disabled={!composedImage}
                className="w-full"
              >
                {copySuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    {COPY.export.copied}
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mr-2" />
                    {COPY.export.copy}
                  </>
                )}
              </Button>
            )}

            {/* Separator */}
            <div className="border-t border-gray-300 my-2"></div>

            {/* Restart Button */}
            <Button
              variant="ghost"
              size="lg"
              onClick={handleRestart}
              className="w-full"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              {COPY.export.restart}
            </Button>
          </div>
        </div>
      </div>

      {/* Restart Confirmation Modal */}
      <Modal
        isOpen={showRestartModal}
        onClose={() => setShowRestartModal(false)}
        title={COPY.export.restartConfirm.title}
        size="sm"
      >
        <Modal.Body>
          <p className="text-gray-600 mb-6">
            {COPY.export.restartConfirm.message}
          </p>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowRestartModal(false)}
            >
              {COPY.export.restartConfirm.cancel}
            </Button>
            <Button
              variant="danger"
              onClick={confirmRestart}
            >
              {COPY.export.restartConfirm.confirm}
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </motion.div>
  );
};

export default ExportPreview;
