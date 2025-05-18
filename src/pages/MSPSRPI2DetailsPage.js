import React from 'react';
import ProjectPhaseComponent, { PROJECT_THEMES, PROJECT_CONFIGS } from './ProjectPhaseComponent';

const MSPSRPI2DetailsPage = () => {
  const projectKey = 'mspsrpi2';
  
  return (
    <ProjectPhaseComponent
      {...PROJECT_CONFIGS[projectKey]}
      theme={projectKey}
      colors={PROJECT_THEMES[projectKey]}
    />
  );
};

export default MSPSRPI2DetailsPage;