import { AQI_CATEGORIES } from './constants';

/**
 * STATION-TO-ZONE MAPPING
 * Maps specific Delhi monitoring stations to the 5 predefined zones.
 */
const STATION_ZONE_MAP = {
    // Zone A: Central District
    'ITO': 'A',
    'Mandir Marg': 'A',
    'Jawaharlal Nehru Stadium': 'A',
    'Major Dhyan Chand National Stadium': 'A',
    'Lodhi Road': 'A',
    'Chandni Chowk': 'A',

    // Zone B: Industrial Area (North-West)
    'Bawana': 'B',
    'Narela': 'B',
    'Mundka': 'B',
    'Wazirpur': 'B',
    'Jahangirpuri': 'B',
    'Alipur': 'B',
    'Rohtak Road': 'B',

    // Zone C: Residential North/East
    'North Campus': 'C',
    'Sonia Vihar': 'C',
    'IHBAS': 'C',
    'Dilshad Garden': 'C',
    'Vivek Vihar': 'C',
    'Patparganj': 'C',
    'Anand Vihar': 'C',

    // Zone D: Commercial South
    'Sri Aurobindo Marg': 'D',
    'R K Puram': 'D',
    'Sirifort': 'D',
    'Dr. Karni Singh Shooting Range': 'D',
    'Okhla Phase-2': 'D',
    'Nehru Nagar': 'D',
    'Aya Nagar': 'D',

    // Zone E: West/South-West
    'Punjabi Bagh': 'E',
    'Shadipur': 'E',
    'NSIT Dwarka': 'E',
    'Dwarka-Sector 8': 'E',
    'Najafgarh': 'E',
    'Pusa': 'E',
    'Rohini': 'E' // Often grouped with West
};

const ZONES = {
    'A': { name: 'Zone A - Central District', population: 2500000 },
    'B': { name: 'Zone B - Industrial Area', population: 3800000 },
    'C': { name: 'Zone C - Residential North', population: 4200000 },
    'D': { name: 'Zone D - Commercial South', population: 3500000 },
    'E': { name: 'Zone E - West Suburbs', population: 4500000 }
};

/**
 * HEALTH RISK COEFFICIENTS (Source: GBD / WHO)
 * Relative Risk (RR) increase per 10 µg/m³ rise in PM2.5
 */
const RISK_COEFFICIENTS = {
    respiratory_admission: 1.02, // 2% increase per 10 µg/m³
    cardiac_admission: 1.015,    // 1.5% increase per 10 µg/m³
    mortality: 1.006,            // 0.6% daily mortality increase
    asthma_visit: 1.04           // 4% increase in ER visits for asthma
};

// Baseline Rates (Daily cases per 1M population) - Approximation for Delhi
const BASELINE_RATES = {
    respiratory: 45, // daily hospital admissions per 1M
    cardiac: 30,     // daily hospital admissions per 1M
    asthma: 80       // daily ER visits per 1M
};

// Economic Cost per case (INR)
const ECONOMIC_COST = {
    admission: 15000, // Hospitalization cost + lost wages
    visit: 2000       // ER/OPD visit cost
};

/**
 * Calculate Health Impacts based on Station Data
 * @param {Array} stations - List of station objects {name, pm25, aqi}
 */
export const calculateHealthImpacts = (stations) => {
    if (!stations || stations.length === 0) return null;

    // 1. Aggregate to Zones
    const zoneStats = {
        'A': { sum_pm25: 0, count: 0, stations: [] },
        'B': { sum_pm25: 0, count: 0, stations: [] },
        'C': { sum_pm25: 0, count: 0, stations: [] },
        'D': { sum_pm25: 0, count: 0, stations: [] },
        'E': { sum_pm25: 0, count: 0, stations: [] }
    };

    let citySumPM25 = 0;
    let matches = 0;

    stations.forEach(st => {
        // Determine Zone
        let zoneId = STATION_ZONE_MAP[st.name];

        // Fuzzy match
        if (!zoneId) {
            for (const k in STATION_ZONE_MAP) {
                if (st.name.includes(k) || k.includes(st.name)) {
                    zoneId = STATION_ZONE_MAP[k];
                    break;
                }
            }
        }

        if (zoneId) {
            const pm25 = (st.pm25 || st.aqi * 0.6); // Fallback assumption
            zoneStats[zoneId].sum_pm25 += pm25;
            zoneStats[zoneId].count++;
            zoneStats[zoneId].stations.push({ ...st, pm25 });
        }

        citySumPM25 += (st.pm25 || st.aqi * 0.6);
        matches++;
    });

    // 2. Estimate Station Populations & Impacts
    const stationImpacts = [];
    const zoneImpacts = []; // Keep zone impacts for city totals

    Object.keys(ZONES).forEach(zoneId => {
        const stats = zoneStats[zoneId];

        // Zone Impact Logic
        const avgPM25 = stats.count > 0 ? stats.sum_pm25 / stats.count : 0;
        const pop = ZONES[zoneId].population;
        // ... Simplified zone impact just for totals ...

        if (stats.count > 0) {
            // Distribute Zone Population evenly among stations (Heuristic)
            const estStationPop = Math.floor(ZONES[zoneId].population / stats.count);
            const popMillions = estStationPop / 1000000;

            stats.stations.forEach(st => {
                // Calculate Risks for this station's catchment
                const excessPM = Math.max(0, st.pm25 - 30);
                const units = excessPM / 10;

                const excessResp = (BASELINE_RATES.respiratory * popMillions) * Math.max(0, ((1 + (RISK_COEFFICIENTS.respiratory_admission - 1) * units) - 1));
                const excessCardiac = (BASELINE_RATES.cardiac * popMillions) * Math.max(0, ((1 + (RISK_COEFFICIENTS.cardiac_admission - 1) * units) - 1));
                const excessAsthma = (BASELINE_RATES.asthma * popMillions) * Math.max(0, ((1 + (RISK_COEFFICIENTS.asthma_visit - 1) * units) - 1));

                const totalCases = excessResp + excessCardiac + excessAsthma;

                let riskLevel = 'LOW';
                if (st.pm25 > 250) riskLevel = 'SEVERE';
                else if (st.pm25 > 120) riskLevel = 'HIGH';
                else if (st.pm25 > 60) riskLevel = 'MEDIUM';

                stationImpacts.push({
                    station: st.name,
                    zone: ZONES[zoneId].name,
                    population: estStationPop,
                    pm25: Math.round(st.pm25),
                    cases: Math.round(totalCases),
                    risk: riskLevel,
                    cost: (excessResp + excessCardiac) * ECONOMIC_COST.admission + excessAsthma * ECONOMIC_COST.visit
                });
            });
        }
    });

    // Sort by Cases descending
    stationImpacts.sort((a, b) => b.cases - a.cases);

    // 3. City Totals from stations
    const totalCost = stationImpacts.reduce((sum, s) => sum + s.cost, 0);
    const totalCases = stationImpacts.reduce((sum, s) => sum + s.cases, 0);

    // Re-approx zone-level for compatibility if needed, or just return station list
    // We can rebuild zoneImpacts from stationImpacts if UI needed it, but UI now uses stationImpacts

    return {
        stationImpacts,
        zoneImpacts: [], // Empty as deprecated
        cityTotal: {
            cases: Math.round(totalCases),
            cost: totalCost,
            formattedCost: `₹${(totalCost / 10000000).toFixed(2)} Cr`
        }
    };
};

/**
 * Vulnerable Population Risk
 */
export const calculateVulnerableRisk = (group, aqi) => {
    // Simple risk scaler 1-10
    const baseRisk = aqi > 400 ? 9 : aqi > 300 ? 7 : aqi > 200 ? 5 : 2;

    if (group === 'Children' || group === 'Elderly' || group === 'Asthmatic') {
        return Math.min(10, baseRisk + 1); // Higher risk
    }
    return baseRisk;
};
