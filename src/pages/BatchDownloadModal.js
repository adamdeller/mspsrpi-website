import React from 'react';
import { Download } from 'lucide-react';

const BatchDownloadModal = ({
  isOpen,
  phase,
  onClose,
  onDownload,
  isDownloading,
  downloadProgress
}) => {
  if (!isOpen) return null;

  const phaseName = phase === 'MSPSRPI' ? 'MSPSRPI' :
    phase === 'MSPSRPI2' ? 'MSPSRPI2' :
      phase === 'PSRPI' ? 'PSRPI' : 'Pulsar';

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-indigo-500/30 rounded-lg p-6 shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent clicking the content area from closing the modal
      >
        {/* Title Bar */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-indigo-300">
            Download {phaseName} Data Release
          </h3>
          <button
            className="text-gray-400 hover:text-white text-2xl"
            onClick={onClose}
            disabled={isDownloading}
          >
            ×
          </button>
        </div>

        {!isDownloading ? (
          <>
            {/* Format selection */}
            <div className="mb-6">
              <p className="text-gray-300 mb-4">Please select the data format you want to download:</p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  className="flex flex-col items-center justify-center p-4 rounded-lg border border-indigo-500/30 bg-slate-800/60 hover:bg-slate-700/80 transition"
                  onClick={() => onDownload(phase, 'json')}
                >
                  <div className="text-indigo-300 text-lg font-medium mb-2">JSON</div>
                  <div className="text-gray-400 text-xs text-center">Complete data structure with full metadata</div>
                </button>

                <button
                  className="flex flex-col items-center justify-center p-4 rounded-lg border border-cyan-500/30 bg-slate-800/60 hover:bg-slate-700/80 transition"
                  onClick={() => onDownload(phase, 'csv')}
                >
                  <div className="text-cyan-300 text-lg font-medium mb-2">CSV</div>
                  <div className="text-gray-400 text-xs text-center">Tabular data format for easy spreadsheet analysis</div>
                </button>
              </div>
            </div>

            {/* Explanation */}
            <div className="text-sm text-gray-400 p-3 bg-slate-800/40 rounded-md">
              <p>The download package will include:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Complete data for all pulsars in the {phaseName} phase</li>
                <li>All available visualization images</li>
                <li>README.txt and index.html for easy navigation</li>
              </ul>
              <p className="mt-3 text-amber-300">
                <strong>Note:</strong> This may take several minutes to download depending on the number of pulsars and images.
              </p>
            </div>
          </>
        ) : (
          <div className="py-4">
            <div className="flex items-center justify-center mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
            <p className="text-center text-gray-300 mb-4">Preparing download package...</p>
            <div className="mb-2 flex justify-between">
              <span className="text-gray-400 text-sm">Progress:</span>
              <span className="text-cyan-300 text-sm font-medium">{downloadProgress}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div
                className="bg-cyan-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
              Even if the window is closed, the download will continue to prepare for you
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchDownloadModal;