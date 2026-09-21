/**
 * Observation Tracker Utility for MSPSRπ2
 * 
 * Provides centralized fetching, parsing, and aggregation of MSPSRπ2
 * observation records from public/data/mspsrpi2/observationTrack.json.
 * 
 * Updating public/data/mspsrpi2/observationTrack.json automatically updates
 * observation hours, progress bars, pulsar status, and epoch counts
 * across the entire website.
 */

// Helper to check if an observation date is valid (i.e. observed)
export const isObservationCompleted = (obs) => {
  if (!obs) return false;
  const rawDate = obs.obsDate ?? obs.obs_date;
  if (rawDate === null || rawDate === undefined) return false;
  const str = String(rawDate).trim();
  if (str === '' || str.toLowerCase() === 'null' || str.toLowerCase() === 'none' || str.toLowerCase() === 'undefined') {
    return false;
  }
  return true;
};

// Helper to get duration
export const getObservationDuration = (obs) => {
  if (!obs) return 0;
  const dur = parseFloat(obs.dur ?? obs.duration ?? 0);
  return isNaN(dur) ? 0 : dur;
};

// Helper to get pulsar name
export const getObservationPulsarName = (obs) => {
  return obs.srcname || obs.name || obs.pulsar || '';
};

/**
 * Calculates metrics from an array of observation records
 * 
 * Total number of hours to be observed is the sum of the duration of each observation.
 * Observations that have not been taken have a Null value for obsDate/obs_date,
 * and are not counted toward the total of hours that have already been observed.
 */
export const calculateObservationMetrics = (observations) => {
  if (!Array.isArray(observations) || observations.length === 0) {
    return {
      totalHours: 0,
      observedHours: 0,
      remainingHours: 0,
      percentComplete: 0,
      totalObservations: 0,
      completedObservations: 0,
      remainingObservations: 0,
      totalPulsars: 0,
      observedPulsars: 0,
      pulsarStats: {},
      rawObservations: []
    };
  }

  let totalHours = 0;
  let observedHours = 0;
  let completedObservations = 0;

  const pulsarStats = {};

  observations.forEach((obs) => {
    const dur = getObservationDuration(obs);
    const completed = isObservationCompleted(obs);
    const name = getObservationPulsarName(obs);

    totalHours += dur;
    if (completed) {
      observedHours += dur;
      completedObservations += 1;
    }

    if (name) {
      if (!pulsarStats[name]) {
        pulsarStats[name] = {
          name,
          totalHours: 0,
          observedHours: 0,
          remainingHours: 0,
          totalObservations: 0,
          completedObservations: 0,
          status: 'Scheduled',
          observations: []
        };
      }

      pulsarStats[name].totalHours += dur;
      pulsarStats[name].totalObservations += 1;
      pulsarStats[name].observations.push(obs);

      if (completed) {
        pulsarStats[name].observedHours += dur;
        pulsarStats[name].completedObservations += 1;
      }
    }
  });

  // Compute status for each pulsar
  let observedPulsarsCount = 0;
  Object.values(pulsarStats).forEach((p) => {
    p.totalHours = Number(p.totalHours.toFixed(1));
    p.observedHours = Number(p.observedHours.toFixed(1));
    p.remainingHours = Number(Math.max(0, p.totalHours - p.observedHours).toFixed(1));

    if (p.completedObservations === 0) {
      p.status = 'Scheduled';
    } else if (p.completedObservations < p.totalObservations) {
      p.status = 'In Progress';
      observedPulsarsCount += 1;
    } else {
      p.status = 'Completed';
      observedPulsarsCount += 1;
    }
  });

  const roundedTotalHours = Number(totalHours.toFixed(1));
  const roundedObservedHours = Number(observedHours.toFixed(1));
  const remainingHours = Number(Math.max(0, roundedTotalHours - roundedObservedHours).toFixed(1));
  const percentComplete = roundedTotalHours > 0 ? Math.round((roundedObservedHours / roundedTotalHours) * 100) : 0;
  const uniquePulsarsCount = Object.keys(pulsarStats).length;

  return {
    totalHours: roundedTotalHours,
    observedHours: roundedObservedHours,
    remainingHours,
    percentComplete,
    totalObservations: observations.length,
    completedObservations,
    remainingObservations: observations.length - completedObservations,
    totalPulsars: uniquePulsarsCount,
    observedPulsars: observedPulsarsCount,
    pulsarStats,
    rawObservations: observations
  };
};

let cachedPromise = null;

/**
 * Fetches observationTrack.json and parses the metrics
 */
export const fetchObservationMetrics = async () => {
  if (cachedPromise) return cachedPromise;

  cachedPromise = (async () => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/data/mspsrpi2/observationTrack.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch observationTrack.json: ${response.status}`);
      }
      const data = await response.json();
      return calculateObservationMetrics(data);
    } catch (err) {
      console.error('Error in fetchObservationMetrics:', err);
      cachedPromise = null; // reset cache on error so caller can retry
      throw err;
    }
  })();

  return cachedPromise;
};

/**
 * Enriches a pulsar list (e.g. from mspsrpi2Pulsars.json) with dynamic observation data
 */
export const enrichPulsarsWithObservationData = (pulsarsList, metrics) => {
  if (!Array.isArray(pulsarsList) || !metrics || !metrics.pulsarStats) {
    return pulsarsList || [];
  }

  return pulsarsList.map((pulsar) => {
    const stats = metrics.pulsarStats[pulsar.name];
    if (!stats) {
      return {
        ...pulsar,
        epochs_observed: pulsar.epochs_observed || 0,
        status: pulsar.status || 'Scheduled'
      };
    }

    return {
      ...pulsar,
      epochs_observed: stats.completedObservations,
      total_epochs: stats.totalObservations,
      observed_hours: stats.observedHours,
      total_hours: stats.totalHours,
      remaining_hours: stats.remainingHours,
      status: stats.status
    };
  });
};
