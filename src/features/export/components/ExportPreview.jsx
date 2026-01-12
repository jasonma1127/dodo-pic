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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          {COPY.export.title}
        </h1>
        <p className="text-lg text-gray-600">
          {COPY.export.subtitle}
        </p>
      </div>

      {/* Preview and Actions */}
      <div className="max-w-3xl mx-auto">
        {/* Image Preview */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-macos bg-white p-4">
          {composedImage ? (
            <img
              src={composedImage}
              alt="Final composition"
              className="w-full h-auto rounded-xl"
            />
          ) : (
            <div className="aspect-[3/4] bg-gray-100 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">{COPY.export.error}</p>
            </div>
          )}

          {/* File Info */}
          {fileSize && (
            <div className="mt-4 text-center text-sm text-gray-500">
              {COPY.export.fileSize}: {fileSize}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
        </div>

        {/* Restart Button */}
        <div className="text-center">
          <Button
            variant="ghost"
            size="md"
            onClick={handleRestart}
            className="w-full md:w-auto"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            {COPY.export.restart}
          </Button>
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
