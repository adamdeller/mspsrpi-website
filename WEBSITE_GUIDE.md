     # MSPSRπ2 Website Structure & Update Guide
 ┃
 ┃     This website is a React application built with Create React App and hosted on GitHub
 ┃   Pages. It is designed to track the progress of a long-term VLBI astrometry project and
 ┃   provide a home page for the collaboration. 
 ┃
 ┃     To make it easy to update without needing to rewrite React code, the site uses a "static
 ┃   database" approach. The data that populates the pages is stored as JSON files within the
 ┃   `public/` directory and is fetched by the React components when the page loads.
 ┃
 ┃     ## Website Architecture
 ┃
 ┃     * **`src/` (React Components & Logic):** Contains the front-end code. 
 ┃       * `src/pages/`: Contains the individual page layouts (e.g., `Homepage.js`,
 ┃   `ProjectPage.js`). 
 ┃       * `Homepage.js` is responsible for fetching the project data, calculating the total

### How to Update the Observation Status

  With the new observationTrack.json file powering the tracker, updating the MSPSRπ2 progress is
  very straightforward:

  1. Locate the Tracking File:
  In your repository, navigate to public/data/mspsrpi2/observationTrack.json.
  2. Find the Target Pulsar / Observation:
  Look for the specific observation entry you want to update (e.g., using the obs_code or
  srcname).
  3. Log the Observation Date:
  For observations that haven't been taken yet, their "obsDate" attribute will typically be set
  to null or an empty string (""). To mark an observation as complete, simply update this
  attribute to the date the observation was performed (e.g., "obsDate": "2026-09-21").
  4. Deploy Changes:
  Save the file, commit, and push your changes to the main branch on GitHub.

  Because the homepage calculations now sum the "dur" (duration) of any observation that has a
  populated, non-empty date, the status bar will automatically calculate and update the total
  hours observed and the hours remaining without needing to edit any code!
