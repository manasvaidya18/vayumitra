const BASE_URL = 'http://127.0.0.1:8000';

// --- Policymaker API ---

export const fetchSensors = async () => {
    const res = await fetch(`${BASE_URL}/api/policymaker/sensors`);
    if (!res.ok) throw new Error('Failed to fetch sensors');
    return res.json();
};

export const fetchHistory = async () => {
    const res = await fetch(`${BASE_URL}/api/policymaker/history`);
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
};

export const fetchForecast = async () => {
    const res = await fetch(`${BASE_URL}/api/policymaker/forecast`);
    if (!res.ok) throw new Error('Failed to fetch forecast');
    return res.json();
};

export const fetchHotspots = async () => {
    const res = await fetch(`${BASE_URL}/api/policymaker/hotspots`);
    if (!res.ok) throw new Error('Failed to fetch hotspots');
    return res.json();
};

export const fetchAlerts = async () => {
    const res = await fetch(`${BASE_URL}/api/policymaker/alerts`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
};

export const fetchHealthData = async () => {
    const res = await fetch(`${BASE_URL}/api/policymaker/health`);
    if (!res.ok) throw new Error('Failed to fetch health data');
    return res.json();
};

export const fetchZoneHealth = async () => {
    const res = await fetch(`${BASE_URL}/api/policymaker/zone-health`);
    if (!res.ok) throw new Error('Failed to fetch zone health');
    return res.json();
};

export const fetchTrafficData = async () => {
    const res = await fetch(`${BASE_URL}/api/policymaker/traffic`);
    if (!res.ok) throw new Error('Failed to fetch traffic data');
    return res.json();
};

export const fetchTrafficHourly = async () => {
    const res = await fetch(`${BASE_URL}/api/policymaker/traffic-hourly`);
    if (!res.ok) throw new Error('Failed to fetch hourly traffic');
    return res.json();
};

export const fetchEmissions = async () => {
    const res = await fetch(`${BASE_URL}/api/policymaker/emissions`);
    if (!res.ok) throw new Error('Failed to fetch emissions');
    return res.json();
};

export const fetchCongestion = async () => {
    const res = await fetch(`${BASE_URL}/api/policymaker/congestion`);
    if (!res.ok) throw new Error('Failed to fetch congestion');
    return res.json();
};

export const fetchRecentReports = async () => {
    const res = await fetch(`${BASE_URL}/api/policymaker/reports/recent`);
    if (!res.ok) throw new Error('Failed to fetch recent reports');
    return res.json();
};

export const fetchScheduledReports = async () => {
    const res = await fetch(`${BASE_URL}/api/policymaker/reports/scheduled`);
    if (!res.ok) throw new Error('Failed to fetch scheduled reports');
    return res.json();
};

export const fetchWeatherData = async () => {
    const res = await fetch(`${BASE_URL}/api/policymaker/weather`);
    if (!res.ok) throw new Error('Failed to fetch weather data');
    return res.json();
};

export const fetchSourceAttribution = async () => {
    const res = await fetch(`${BASE_URL}/api/policymaker/source-attribution`);
    if (!res.ok) throw new Error('Failed to fetch source attribution');
    return res.json();
};

export const fetchVulnerablePopulations = async () => {
    const res = await fetch(`${BASE_URL}/api/policymaker/vulnerable`);
    if (!res.ok) throw new Error('Failed to fetch vulnerable populations');
    return res.json();
};

export const fetchPolicySimulation = async () => {
    const res = await fetch(`${BASE_URL}/api/policymaker/policy-simulation`);
    if (!res.ok) throw new Error('Failed to fetch policy simulation');
    return res.json();
};

// --- Citizen API ---

export const fetchCitizenAQI = async () => {
    const res = await fetch(`${BASE_URL}/api/citizen/aqi`);
    if (!res.ok) throw new Error('Failed to fetch AQI');
    return res.json();
};

export const fetchCitizenScore = async () => {
    const res = await fetch(`${BASE_URL}/api/citizen/score`);
    if (!res.ok) throw new Error('Failed to fetch score');
    return res.json();
};

export const fetchCitizenBestTime = async () => {
    const res = await fetch(`${BASE_URL}/api/citizen/best-time`);
    if (!res.ok) throw new Error('Failed to fetch best time data');
    return res.json();
};

export const fetchCitizenShockPredictor = async () => {
    const res = await fetch(`${BASE_URL}/api/citizen/shock-predictor`);
    if (!res.ok) throw new Error('Failed to fetch shock predictor');
    return res.json();
};

export const fetchCitizenGreenSuggestions = async () => {
    const res = await fetch(`${BASE_URL}/api/citizen/green-suggestions`);
    if (!res.ok) throw new Error('Failed to fetch green suggestions');
    return res.json();
};

export const fetchCitizenWildlife = async () => {
    const res = await fetch(`${BASE_URL}/api/citizen/wildlife`);
    if (!res.ok) throw new Error('Failed to fetch wildlife data');
    return res.json();
};

export const fetchCitizenTreeImpact = async () => {
    const res = await fetch(`${BASE_URL}/api/citizen/tree-impact`);
    if (!res.ok) throw new Error('Failed to fetch tree impact data');
    return res.json();
};

export const fetchCitizenHealthRisk = async (age, conditions) => {
    const res = await fetch(`${BASE_URL}/api/citizen/health-risk-calc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age, conditions })
    });
    if (!res.ok) throw new Error('Failed to fetch health risk');
    return res.json();
};

export const fetchMLForecast = async () => {
    const res = await fetch(`${BASE_URL}/api/ml/forecast-3day`);
    if (!res.ok) throw new Error('Failed to fetch ML forecast');
    return res.json();
};
