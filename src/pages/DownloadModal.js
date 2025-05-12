import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const DownloadModal = ({ isOpen, pulsar, onClose }) => {
  if (!isOpen || !pulsar) return null;

  const handleDownloadData = async (format) => {
    try {
      // Create a new zip file
      const zip = new JSZip();

      // Add data files
      if (format === 'json') {
        // Adding JSON Data
        zip.file(`${pulsar.name}_data.json`, JSON.stringify(pulsar.originalData || pulsar, null, 2));
      } else if (format === 'csv') {
        // Convert pulsar data to CSV format
        const csvData = convertPulsarToCSV(pulsar);
        zip.file(`${pulsar.name}_data.csv`, csvData);
      }

      // Add visualizations (if any)
      if (pulsar.visualizations && pulsar.visualizations.length > 0) {
        // Create an images folder
        const imagesFolder = zip.folder("images");

        // Download and add each visualization image
        await Promise.all(pulsar.visualizations.map(async (viz, index) => {
          try {
            const imageUrl = `${process.env.PUBLIC_URL}${viz.path}`;
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error(`Failed to fetch image: ${imageUrl}`);

            const imageBlob = await response.blob();
            const imageName = `${pulsar.name}_${viz.title.replace(/\s+/g, '_').toLowerCase()}.${getFileExtension(viz.path)}`;
            imagesFolder.file(imageName, imageBlob);
          } catch (error) {
            console.error(`Error downloading image ${viz.path}:`, error);
          }
        }));
      }

      // Add a README file
      const readmeContent = createReadmeContent(pulsar, format);
      zip.file("README.txt", readmeContent);

      // Generate and download the zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${pulsar.name}_data_package.zip`);

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error creating download package:", error);
      alert("There was an error creating your download package. Please try again.");
    }
  };

  // Get the file extension from the path
  const getFileExtension = (path) => {
    if (!path) return 'jpg';  // Default format
    const match = path.match(/\.([^.]+)$/);
    return match ? match[1].toLowerCase() : 'jpg';
  };

  // Convert pulsar data to CSV format
  const convertPulsarToCSV = (pulsar) => {
    let data = [];
    let csvString = '';

    if (pulsar.phase === 'MSPSRPI') {
      // Processing MSPSRPI pulsar data
      data = [
        ['Name', pulsar.name],
        ['Type', pulsar.type],
        ['Distance (kpc)', pulsar.distance],
        ['Parallax (mas)', pulsar.parallax],
        ['Proper Motion RA (mas/yr)', pulsar.properMotionRA],
        ['Proper Motion Dec (mas/yr)', pulsar.properMotionDec],
        ['Right Ascension', pulsar.position?.rightAscension],
        ['Declination', pulsar.position?.declination],
        ['Description', pulsar.description],
      ];

      // Add astrometric data (if available)
      if (pulsar.originalData?.astrometry) {
        Object.entries(pulsar.originalData.astrometry).forEach(([key, value]) => {
          data.push([`Astrometry - ${key.replace(/_/g, ' ')}`, value]);
        });
      }
    } else {
      // Processing MSPSRPI2 pulsar data
      data = [
        ['Name', pulsar.name],
        ['Status', pulsar.status],
        ['Flux Density (mJy)', pulsar.fluxDensity],
        ['Distance (kpc)', pulsar.distance],
        ['Proper Motion', pulsar.properMotion],
        ['Session Duration', pulsar.sessionDuration],
        ['Flux Category', pulsar.fluxCategory],
        ['Right Ascension', pulsar.position?.rightAscension],
        ['Declination', pulsar.position?.declination],
        ['Notes', pulsar.notes],
        ['Search Session', pulsar.searchSession],
        ['Astrometry Session', pulsar.astrometrySession],
      ];
    }

    // Convert to CSV string
    data.forEach(row => {
      csvString += row.map(value => `"${value || ''}"`).join(',') + '\r\n';
    });

    // If there are membership, add them
    if (pulsar.memberships && pulsar.memberships.length > 0) {
      csvString += '\r\n"Memberships"\r\n';
      pulsar.memberships.forEach(membership => {
        csvString += `"${membership}"\r\n`;
      });
    }

    return csvString;
  };

  // Create README file content
  const createReadmeContent = (pulsar, format) => {
    const content = `
# ${pulsar.name} Data Package

## Contents
1. ${pulsar.name}_data.${format} - Complete pulsar data in ${format.toUpperCase()} format
${pulsar.visualizations && pulsar.visualizations.length > 0 ?
        '2. /images/ - Folder containing visualization images\n' : ''}

## Data Description
- Name: ${pulsar.name}
- Type: ${pulsar.type || pulsar.fluxCategory || 'Not specified'}
- Phase: ${pulsar.phase}
- Status: ${pulsar.status || 'Complete'}
${pulsar.distance ? `- Distance: ${pulsar.distance} kpc\n` : ''}
${pulsar.description || pulsar.notes ? `\n## Description\n${pulsar.description || pulsar.notes}\n` : ''}

## Visualizations
${pulsar.visualizations && pulsar.visualizations.length > 0 ?
        pulsar.visualizations.map(viz => `- ${viz.title}: ${viz.description || 'No description available'}`).join('\n') :
        'No visualizations available for this pulsar.'
      }

## Data Format
${format === 'json' ?
        'The JSON file contains the complete pulsar data structure with all available properties and metadata.' :
        'The CSV file contains key pulsar properties in a tabular format for easy analysis in spreadsheet applications.'
      }

## Citation
When using this data in publications, please cite:
"Pulsar Astrometry Research Initiative (2025). Millisecond Pulsar Astrometric Measurements."

---
Downloaded on: ${new Date().toLocaleString()}
© 2025 Pulsar Astrometry Research Initiative
`;

    return content;
  };

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
            Download {pulsar.name} Data
          </h3>
          <button
            className="text-gray-400 hover:text-white text-2xl"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Format Selection */}
        <div className="mb-6">
          <p className="text-gray-300 mb-4">Please select the data format you want to download:</p>

          <div className="grid grid-cols-2 gap-4">
            <button
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-indigo-500/30 bg-slate-800/60 hover:bg-slate-700/80 transition"
              onClick={() => handleDownloadData('json')}
            >
              <div className="text-indigo-300 text-lg font-medium mb-2">JSON</div>
              <div className="text-gray-400 text-xs text-center">Complete data structure with full metadata</div>
            </button>

            <button
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-cyan-500/30 bg-slate-800/60 hover:bg-slate-700/80 transition"
              onClick={() => handleDownloadData('csv')}
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
            <li>Complete pulsar data in selected format</li>
            <li>All available visualization images</li>
            <li>README.txt with data description</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;