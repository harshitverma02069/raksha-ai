/**
 * Landslide Predictor Engine
 * Implements Infinite Slope Factor of Safety, Caine's Intensity-Duration Threshold, 
 * and Logistic Regression Probability.
 */

export class LandslidePredictor {
  /**
   * Calculates the Factor of Safety (FoS) based on the Infinite Slope model.
   * FoS = [(c' + c_r) + [γ_m(z-z_w)cos²β - γ_w·z_w·cos²β]·tan(φ')] / 
   *       [[γ_m(z-z_w) + γ_sat·z_w]·sin(β)·cos(β) + k_h·W·cos(β)]
   * 
   * @param {Object} params - Soil, slope, and water parameters
   * @returns {Object} result - Numeric FoS and stability status
   */
  calculateFoS(params) {
    const {
      c_prime = 10,   // effective cohesion (kPa)
      c_r = 5,        // root cohesion (kPa)
      phi_prime = 30, // friction angle (degrees)
      beta = 35,      // slope angle (degrees)
      z = 5,          // soil depth (m)
      z_w = 2,        // water table height (m)
      gamma_m = 18,   // moist unit weight (kN/m³)
      gamma_sat = 20, // saturated unit weight (kN/m³)
      gamma_w = 9.81, // water unit weight (kN/m³)
      k_h = 0.1,      // seismic coefficient (PGA/g)
      W = 1000        // total column weight (kN)
    } = params;

    // Convert angles to radians
    const toRad = (angle) => angle * (Math.PI / 180);
    const betaRad = toRad(beta);
    const phiRad = toRad(phi_prime);

    const cosBeta = Math.cos(betaRad);
    const sinBeta = Math.sin(betaRad);
    const cos2Beta = Math.pow(cosBeta, 2);
    const tanPhi = Math.tan(phiRad);

    // Numerator (Resisting forces)
    const effectiveCohesion = c_prime + c_r;
    const normalStress = Math.max(0, (gamma_m * (z - z_w) * cos2Beta) - (gamma_w * z_w * cos2Beta));
    const resistingForce = effectiveCohesion + (normalStress * tanPhi);

    // Denominator (Driving forces)
    const drivingWeight = (gamma_m * (z - z_w)) + (gamma_sat * z_w);
    const columnWeight = params.W !== undefined ? params.W : drivingWeight;
    const drivingForce = (drivingWeight * sinBeta * cosBeta) + (k_h * columnWeight * cosBeta);

    const fos = resistingForce / drivingForce;

    let status = 'STABLE';
    let color = 'GREEN';
    if (fos < 1.0) {
      status = 'FAILURE';
      color = 'RED';
    } else if (fos <= 1.3) {
      status = 'MARGINAL';
      color = 'YELLOW';
    }

    return { fos, status, color };
  }

  /**
   * Caine's Intensity-Duration Threshold & Antecedent Precipitation Index
   * I = 14.82 * D^(-0.39) (global) or I = 28.5 * D^(-0.42) (monsoon)
   * 
   * @param {number} intensity - Current 1h rainfall intensity (mm/h)
   * @param {number} duration - Rain duration (hours)
   * @param {number} p24h - 24h cumulative rainfall (mm)
   * @param {number} api - Antecedent Precipitation Index
   * @param {boolean} isMonsoonRegion - Use monsoon coefficients
   * @returns {Object} Alert level (RED/ORANGE/GREEN)
   */
  checkRainfallThreshold(intensity, duration, p24h, api, isMonsoonRegion = false) {
    const P_crit = 150; // Critical 24h rainfall (mm)
    const API_thresh = 100; // API threshold
    
    // Caine's threshold for critical intensity
    const I_crit = isMonsoonRegion 
      ? 28.5 * Math.pow(duration, -0.42)
      : 14.82 * Math.pow(duration, -0.39);

    let alertLevel = 'GREEN';

    if (p24h >= P_crit || (api >= API_thresh && intensity >= I_crit)) {
      alertLevel = 'RED';
    } else if (api >= 0.8 * API_thresh) {
      alertLevel = 'ORANGE';
    }

    return {
      alertLevel,
      I_crit,
      intensity,
      api
    };
  }

  /**
   * Logistic Regression Probability Model
   * P(Landslide) = 1 / (1 + exp(-(b0 + b1·Slope + b2·Rain24h + b3·SatRatio + b4·NDVI + b5·PGA)))
   * 
   * @param {Object} features - Predictor variables
   * @returns {number} Probability of landslide (0.0 to 1.0)
   */
  calculateProbability(features) {
    const { slope = 0, rain24h = 0, satRatio = 0, ndvi = 0, pga = 0 } = features;
    
    // Coefficients
    const b0 = -4.52;
    const b1 = 0.085;
    const b2 = 0.021;
    const b3 = 2.45;
    const b4 = -1.80;
    const b5 = 3.90;

    const z = b0 + (b1 * slope) + (b2 * rain24h) + (b3 * satRatio) + (b4 * ndvi) + (b5 * pga);
    const probability = 1 / (1 + Math.exp(-z));

    return probability;
  }

  /**
   * Comprehensive Risk combining all three models.
   * 
   * @param {Object} allParams - Combination of parameters for all models
   * @returns {Object} Comprehensive risk assessment report
   */
  getComprehensiveRisk(allParams) {
    const fosResult = this.calculateFoS(allParams.fosParams || {});
    const rainResult = this.checkRainfallThreshold(
      allParams.rainParams?.intensity || 0,
      allParams.rainParams?.duration || 1,
      allParams.rainParams?.p24h || 0,
      allParams.rainParams?.api || 0,
      allParams.rainParams?.isMonsoon || false
    );
    const probResult = this.calculateProbability(allParams.probParams || {});

    let finalRisk = 'LOW';
    if (fosResult.status === 'FAILURE' || rainResult.alertLevel === 'RED' || probResult > 0.7) {
      finalRisk = 'CRITICAL';
    } else if (fosResult.status === 'MARGINAL' || rainResult.alertLevel === 'ORANGE' || probResult > 0.4) {
      finalRisk = 'MODERATE';
    }

    return {
      finalRisk,
      fosModel: fosResult,
      rainModel: rainResult,
      probModel: { probability: probResult },
      timestamp: new Date().toISOString()
    };
  }
}
