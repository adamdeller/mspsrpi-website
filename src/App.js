import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import ProjectPage from './pages/ProjectPage';
import DataReleasePage from './pages/DataReleasePage';
import PublicationsPage from './pages/PublicationsPage';
import TeamPage from './pages/TeamPage';
import RestrictedArea from './pages/RestrictedArea';
import MSPSRPIDetailsPage from './pages/MSPSRPIDetailsPage';
import MSPSRPI2DetailsPage from './pages/MSPSRPI2DetailsPage';
import PSRPIDetailsPage from './pages/PSRPIDetailsPage';

function App() {
  return (
    <Routes>
      {/* Redirect root path to /test-deploy */}
      <Route path="/" element={<Homepage />} />
      <Route path="/#/mspsrpi-website" element={<Homepage />} />
      <Route path="/project" element={<ProjectPage />} />
      <Route path="/data-release" element={<DataReleasePage />} />
      <Route path="/publications" element={<PublicationsPage />} />
      <Route path="/restricted-area" element={<RestrictedArea />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/projects/mspsrpi-details" element={<MSPSRPIDetailsPage />} />
      <Route path="/projects/mspsrpi2-details" element={<MSPSRPI2DetailsPage />} />
      <Route path="/projects/psrpi-details" element={<PSRPIDetailsPage />} />
      {/* Other routes */}
    </Routes>
  );
}

export default App;
