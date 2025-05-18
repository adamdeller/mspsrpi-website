import React from 'react';
import ProjectPhaseComponent, { PROJECT_THEMES, PROJECT_CONFIGS } from './ProjectPhaseComponent';

const MSPSRPIDetailsPage = () => {
  const projectKey = 'mspsrpi';
  
  return (
    <ProjectPhaseComponent
      {...PROJECT_CONFIGS[projectKey]}
      theme={projectKey}
      colors={PROJECT_THEMES[projectKey]}
    />
  );
};

export default MSPSRPIDetailsPage;