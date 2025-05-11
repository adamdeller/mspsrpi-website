import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import BatchDownloadModal from './BatchDownloadModal';

// Batch download processing component - modified to accept data from all stages
const BatchDownloadHandler = ({ allPhasesPulsars, currentPulsars }) => {
  const [batchDownloadPhase, setBatchDownloadPhase] = useState(null);
  const [isBatchDownloadModalOpen, setIsBatchDownloadModalOpen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  // Handling batch download button clicks
  const handleBatchDownloadClick = (phase) => {
    setBatchDownloadPhase(phase);
    setIsBatchDownloadModalOpen(true);
  };

  // Close the batch download modal
  const closeBatchDownloadModal = () => {
    setIsBatchDownloadModalOpen(false);
    setBatchDownloadPhase(null);
  };

  // Batch download of pulsar data at a specific phase
  const handleBatchDownload = async (phase, format = 'json') => {
    try {
      setIsDownloading(true);
      setDownloadProgress(0);

      // Create a new ZIP file
      const zip = new JSZip();

      // Get data from the appropriate dataset
      const phasePulsars = allPhasesPulsars && allPhasesPulsars[phase]
        ? allPhasesPulsars[phase]
        : phase === batchDownloadPhase
          ? currentPulsars.filter(pulsar => pulsar.phase === phase)
          : [];

      if (phasePulsars.length === 0) {
        alert(`No pulsars found for phase ${phase}`);
        setIsDownloading(false);
        return;
      }

      // Add a README file
      const readmeContent = createBatchReadmeContent(phase, phasePulsars, format);
      zip.file("README.txt", readmeContent);

      // Create a subfolder for each pulsar
      const totalPulsars = phasePulsars.length;
      for (let i = 0; i < totalPulsars; i++) {
        const pulsar = phasePulsars[i];
        const pulsarFolder = zip.folder(pulsar.name);

        // Add pulsar data files
        if (format === 'json') {
          pulsarFolder.file(`${pulsar.name}_data.json`, JSON.stringify(pulsar.originalData || pulsar, null, 2));
        } else if (format === 'csv') {
          const csvData = convertPulsarToCSV(pulsar);
          pulsarFolder.file(`${pulsar.name}_data.csv`, csvData);
        }

        // Add visualizations (if any)
        if (pulsar.visualizations && pulsar.visualizations.length > 0) {
          const imagesFolder = pulsarFolder.folder("images");

          // Download and add each visualization image
          for (const viz of pulsar.visualizations) {
            try {
              if (!viz.path) continue; // Skip empty paths

              const imageUrl = `${process.env.PUBLIC_URL}${viz.path}`;
              const response = await fetch(imageUrl);

              if (!response.ok) {
                console.error(`Failed to fetch image: ${imageUrl}`);
                continue;
              }

              const imageBlob = await response.blob();
              const imageName = `${viz.title.replace(/\s+/g, '_').toLowerCase()}.${getFileExtension(viz.path)}`;
              imagesFolder.file(imageName, imageBlob);
            } catch (error) {
              console.error(`Error downloading image for ${pulsar.name}:`, error);
            }
          }
        }

        // Update progress
        setDownloadProgress(Math.round((i + 1) / totalPulsars * 100));
      }

      // Generate index file
      const indexContent = createBatchIndexFile(phase, phasePulsars);
      zip.file("index.html", indexContent);

      // Generate and download the zip file
      const phaseName = phase === 'MSPSRPI' ? 'MSPSRPI_Data' :
        phase === 'MSPSRPI2' ? 'MSPSRPI2_Data' :
          phase === 'PSRPI' ? 'PSRPI_Data' : 'Pulsar_Data';
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${phaseName}_Release_${format.toUpperCase()}.zip`);

      // Resume loading state
      setIsDownloading(false);
      closeBatchDownloadModal();
    } catch (error) {
      console.error("Error creating batch download package:", error);
      alert("There was an error creating your download package. Please try again.");
      setIsDownloading(false);
    }
  };

  // Get the file extension from the path
  const getFileExtension = (path) => {
    if (!path) return 'jpg'; // Default extension
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
      // Processing other phases of pulsar data
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

  // Create README content for batch download
  const createBatchReadmeContent = (phase, pulsars, format) => {
    const phaseName = phase === 'MSPSRPI' ? 'MSPSRPI' :
      phase === 'MSPSRPI2' ? 'MSPSRPI2' :
        phase === 'PSRPI' ? 'PSRPI' : 'Pulsar';
    const phaseDescription = phase === 'MSPSRPI' ?
      'Millisecond pulsar data from 2015-2018 observations' :
      phase === 'MSPSRPI2' ?
        'Preliminary data from Phase 2 observations' :
        'Original pulsar parallax data from 2011-2013 observations';

    return `# ${phaseName} Data Release Package

## Overview
This package contains data for ${pulsars.length} pulsars from the ${phaseName} phase of the MSPSRπ program.
${phaseDescription}.

## Contents
- Individual pulsar data folders, each containing:
  - Pulsar data file in ${format.toUpperCase()} format
  - Visualization images (where available)
- index.html - A simple HTML file to browse the contents of this package
- README.txt - This file

## Data Description
This package includes data for the following pulsars:
${pulsars.map((p, i) => `${i + 1}. ${p.name} - ${p.type || p.fluxCategory || 'Pulsar'}`).join('\n')}

## Data Format
${format === 'json' ?
        'The JSON files contain the complete pulsar data structure with all available properties and metadata.' :
        'The CSV files contain key pulsar properties in a tabular format for easy analysis in spreadsheet applications.'
      }

## Citation
When using this data in publications, please cite:
"Pulsar Astrometry Research Initiative (2025). Millisecond Pulsar Astrometric Measurements."

---
Downloaded on: ${new Date().toLocaleString()}
© 2025 Pulsar Astrometry Research Initiative
`;
  };

  // Create an index HTML file for batch downloads
  const createBatchIndexFile = (phase, pulsars) => {
    const phaseName = phase === 'MSPSRPI' ? 'MSPSRPI' :
      phase === 'MSPSRPI2' ? 'MSPSRPI2' :
        phase === 'PSRPI' ? 'PSRPI' : 'Pulsar';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${phaseName} Data Release Index</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1 {
      color: #2c3e50;
      border-bottom: 2px solid #3498db;
      padding-bottom: 10px;
    }
    .pulsar-list {
      list-style-type: none;
      padding: 0;
    }
    .pulsar-item {
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      margin-bottom: 10px;
      padding: 15px;
      border-radius: 5px;
    }
    .pulsar-name {
      font-weight: bold;
      color: #2980b9;
      font-size: 1.2em;
    }
    .pulsar-details {
      margin-top: 8px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 10px;
      border-top: 1px solid #ddd;
      font-size: 0.8em;
      color: #7f8c8d;
    }
  </style>
</head>
<body>
  <h1>${phaseName} Data Release - Contents</h1>
  
  <p>This package contains data for ${pulsars.length} pulsars from the ${phaseName} phase of the MSPSRπ program.</p>
  
  <h2>Included Pulsars</h2>
  <ul class="pulsar-list">
    ${pulsars.map(p => `
      <li class="pulsar-item">
        <div class="pulsar-name">${p.name}</div>
        <div class="pulsar-details">
          <strong>Type:</strong> ${p.type || p.fluxCategory || 'Not specified'}<br>
          <strong>Status:</strong> ${p.status || 'Complete'}<br>
          ${p.distance ? `<strong>Distance:</strong> ${p.distance} kpc<br>` : ''}
          ${p.parallax ? `<strong>Parallax:</strong> ${p.parallax}<br>` : ''}
          <strong>Visualizations:</strong> ${p.visualizations && p.visualizations.length > 0 ?
        `${p.visualizations.length} available` : 'None available'}
        </div>
      </li>
    `).join('')}
  </ul>
  
  <div class="footer">
    <p>© 2025 Pulsar Astrometry Research Initiative</p>
    <p>Generated on: ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>`;
  };

  return {
    handleBatchDownloadClick,
    BatchDownloadModalComponent: (
      <BatchDownloadModal
        isOpen={isBatchDownloadModalOpen}
        phase={batchDownloadPhase}
        onClose={closeBatchDownloadModal}
        onDownload={handleBatchDownload}
        isDownloading={isDownloading}
        downloadProgress={downloadProgress}
      />
    )
  };
};

export default BatchDownloadHandler;