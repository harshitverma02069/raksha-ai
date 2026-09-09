/**
 * Risk Assessor Engine
 * Implements multi-hazard composite risk scoring using the UNDRR framework.
 * Risk = H_comp * V * E
 */

export class RiskAssessor {
  constructor() {
    // Cascade interaction coefficients (C_ij)
    this.cascadeInteractions = {
      'EQ_L': 0.75, // Earthquake -> Landslide
      'L_F': 0.60,  // Landslide -> Flood
      'EQ_F': 0.45, // Earthquake -> Flood
      'F_L': 0.30   // Flood -> Landslide
    };
  }

  /**
   * Computes the composite hazard score H_comp = Σ(w_i * H_i) + Σ_i Σ_j(C_ij * H_i * H_j)
   * AHP weights should sum to 1.
   * 
   * @param {Object} hazards - Key-value pair of hazard type and base score (0-1)
   * @param {Object} weights - AHP weights for each hazard
   * @returns {number} Composite hazard score
   */
  computeCompositeHazard(hazards, weights) {
    let baseScore = 0;
    
    // Base weighted hazard
    for (const [hazard, score] of Object.entries(hazards)) {
      const weight = weights[hazard] || 0;
      baseScore += weight * score;
    }

    // Cascade interactions
    let cascadeScore = 0;
    if (hazards['EQ'] && hazards['L']) cascadeScore += this.cascadeInteractions['EQ_L'] * hazards['EQ'] * hazards['L'];
    if (hazards['L'] && hazards['F']) cascadeScore += this.cascadeInteractions['L_F'] * hazards['L'] * hazards['F'];
    if (hazards['EQ'] && hazards['F']) cascadeScore += this.cascadeInteractions['EQ_F'] * hazards['EQ'] * hazards['F'];
    if (hazards['F'] && hazards['L']) cascadeScore += this.cascadeInteractions['F_L'] * hazards['F'] * hazards['L'];

    return baseScore + cascadeScore;
  }

  /**
   * Computes structural and systemic vulnerability
   * V = μ1·(1-RoadQuality) + μ2·BridgeVulnerability + μ3·DrainageDeficiency
   * 
   * @param {Object} params - Vulnerability parameters (0-1 scales)
   * @returns {number} Vulnerability score (0-1)
   */
  computeVulnerability(params) {
    const {
      roadQuality = 0.8,
      bridgeVulnerability = 0.2,
      drainageDeficiency = 0.3,
      mu1 = 0.4,
      mu2 = 0.3,
      mu3 = 0.3
    } = params;

    const V = (mu1 * (1 - roadQuality)) + (mu2 * bridgeVulnerability) + (mu3 * drainageDeficiency);
    return Math.min(Math.max(V, 0), 1); // Clamp to 0-1
  }

  /**
   * Computes exposure factor based on population density and road capacity
   * 
   * @param {number} populationDensity - Normalized density (0-1)
   * @param {number} roadCapacityRatio - Ratio of demand/capacity (0-1)
   * @returns {number} Exposure score (0-1)
   */
  computeExposure(populationDensity, roadCapacityRatio) {
    // Basic linear combination, can be refined based on demography
    const E = (0.6 * populationDensity) + (0.4 * roadCapacityRatio);
    return Math.min(Math.max(E, 0), 1);
  }

  /**
   * Calculates overall risk using Risk = H_comp * V * E
   * Scales the result to 0-100.
   * 
   * @param {Object} input - Contains hazards, weights, vulnerability params, exposure params
   * @returns {Object} Risk calculation details and final score
   */
  getOverallRisk(input) {
    const H_comp = this.computeCompositeHazard(input.hazards || {}, input.weights || {});
    const V = this.computeVulnerability(input.vulnerability || {});
    const E = this.computeExposure(
      input.exposure?.populationDensity || 0,
      input.exposure?.roadCapacityRatio || 0
    );

    const riskNormalized = H_comp * V * E;
    const score = riskNormalized * 100; // Scale to 0-100

    return {
      score,
      components: { H_comp, V, E },
      level: this.getRiskLevel(score)
    };
  }

  /**
   * Returns risk level based on 0-100 score
   * 
   * @param {number} score - Total risk score (0-100)
   * @returns {string} Alert color
   */
  getRiskLevel(score) {
    if (score >= 75) return 'RED';
    if (score >= 50) return 'ORANGE';
    if (score >= 25) return 'YELLOW';
    return 'GREEN';
  }
}
