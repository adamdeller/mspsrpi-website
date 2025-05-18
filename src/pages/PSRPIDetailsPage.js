import React from 'react';
import ProjectPhaseComponent, { PROJECT_THEMES, PROJECT_CONFIGS } from './ProjectPhaseComponent';

const PSRPIDetailsPage = () => {
  const projectKey = 'psrpi';
  
  return (
    <ProjectPhaseComponent
      {...PROJECT_CONFIGS[projectKey]}
      theme={projectKey}
      colors={PROJECT_THEMES[projectKey]}
    />
  );
};

export default PSRPIDetailsPage;