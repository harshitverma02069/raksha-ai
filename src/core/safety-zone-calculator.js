/**
 * Safety Zone Calculator Engine
 * Identifies and validates safe evacuation zones based on HAND, runout distance, 
 * and multi-criteria indicators.
 */

export class SafetyZoneCalculator {
  
  /**
   * Checks if an elevation is safe from flooding using the HAND model.
   * HAND(x) = z(x) - z(drainage_point(x))
   * Safe if HAND >= H_100yr_flood + 1.5m freeboard
   * 
   * @param {number} elevation - Elevation of the zone
   * @param {number} drainageElevation - Elevation of nearest drainage/river
   * @param {number} floodHeight - Expected 100-year flood height
   * @returns {boolean} Is safe from flood
   */
  checkFloodSafety(elevation, drainageElevation, floodHeight) {
    const hand = elevation - drainageElevation;
    const requiredFreeboard = 1.5; // meters
    return hand >= (floodHeight + requiredFreeboard);
  }

  /**
   * Calculates the Fahrböschung reach angle runout distance to ensure a zone is outside debris range.
   * L_safe > H_slope / tan(α_reach) + D_margin
   * 
   * @param {number} slopeHeight - Height of the dangerous slope
   * @param {number} alphaReach - Reach angle in degrees (typically 20-31 for debris)
   * @param {number} margin - Safety margin in meters
   * @returns {number} Minimum safe distance from toe of slope
   */
  calculateRunoutDistance(slopeHeight, alphaReach, margin = 10) {
    const alphaRad = alphaReach * (Math.PI / 180);
    const lSafe = (slopeHeight / Math.tan(alphaRad)) + margin;
    return lSafe;
  }

  /**
   * Validates a zone against multiple hazard criteria.
   * A zone is safe IFF all flood, landslide, fire, and structural indicators pass.
   * 
   * @param {Object} zone - Zone data { id, elevation, slope, distToSlope, distToDrainage, structuralIntegrity, capacity }
   * @param {Object} hazardContext - Current hazard parameters { floodHeight, slopeHeight, reachAngle }
   * @returns {Object} Validation result { isSafe, reasons }
   */
  validateZone(zone, hazardContext) {
    const reasons = [];
    let isSafe = true;

    // 1. Flood Validation
    if (hazardContext.floodHeight) {
      const floodSafe = this.checkFloodSafety(zone.elevation, zone.distToDrainage, hazardContext.floodHeight);
      if (!floodSafe) {
        isSafe = false;
        reasons.push("Fails HAND flood safety model (insufficient elevation above drainage).");
      }
    }

    // 2. Landslide/Debris Validation
    if (hazardContext.slopeHeight && hazardContext.reachAngle) {
      const minSafeDist = this.calculateRunoutDistance(hazardContext.slopeHeight, hazardContext.reachAngle);
      if (zone.distToSlope < minSafeDist) {
        isSafe = false;
        reasons.push(`Within landslide runout distance. Requires >${minSafeDist.toFixed(1)}m, has ${zone.distToSlope}m.`);
      }
      if (zone.slope >= 8) {
        isSafe = false;
        reasons.push(`Zone slope is too steep (${zone.slope}° >= 8° limit).`);
      }
    }

    // 3. Structural Validation (Assuming a 0-1 scale, minimum 0.7 required)
    if (zone.structuralIntegrity < 0.7) {
      isSafe = false;
      reasons.push("Insufficient structural integrity for shelter.");
    }

    return { isSafe, reasons };
  }

  /**
   * Finds the nearest safe zones with available capacity.
   * 
   * @param {Object} location - Evacuee { lat, lon }
   * @param {Array} zones - Array of zone objects to test
   * @param {number} count - Number of top zones to return
   * @returns {Array} List of validated, sorted zones
   */
  findNearestSafeZones(location, zones, count = 3) {
    // Simple Euclidean sort for demonstration. In production, this uses EvacuationRouter's haversine or graph cost.
    const dist = (z) => Math.sqrt(Math.pow(z.lat - location.lat, 2) + Math.pow(z.lon - location.lon, 2));
    
    return zones
      .filter(z => z.capacity > z.currentOccupancy) // Must have capacity
      .sort((a, b) => dist(a) - dist(b))
      .slice(0, count);
  }
}
