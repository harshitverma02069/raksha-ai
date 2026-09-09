/**
 * Survival Decision Engine
 * Hierarchical state-machine decision tree for real-time survival guidance.
 */

export class SurvivalDecisionEngine {
  /**
   * Evaluates the telemetry and user state to generate a survival action plan.
   * 
   * @param {Object} userState - { locationType, floorLevel, mobilityImpaired, currentElevation }
   * @param {Object} telemetry - { hazardType, timeToImpact, intensityPGA, floodVelocity, floodDepth, slopeFoS }
   * @returns {Object} Response { actionCode, priority, instruction, audioBeacon, checklist }
   */
  evaluate(userState, telemetry) {
    const { hazardType } = telemetry;

    switch (hazardType) {
      case 'EARTHQUAKE':
        return this._evaluateEarthquake(userState, telemetry);
      case 'FLASH_FLOOD':
        return this._evaluateFlashFlood(userState, telemetry);
      case 'LANDSLIDE':
        return this._evaluateLandslide(userState, telemetry);
      default:
        return this._getDefaultResponse();
    }
  }

  _evaluateEarthquake(userState, telemetry) {
    const { intensityPGA } = telemetry;
    const isIndoor = userState.locationType.startsWith('indoor');
    
    if (intensityPGA > 0.15) { // Active strong shaking
      if (isIndoor) {
        return {
          actionCode: 'DROP_COVER_HOLD',
          priority: 'CRITICAL',
          instruction: 'Drop to your hands and knees. Cover your head and neck under a sturdy table. Hold on until shaking stops.',
          audioBeacon: 'ALARM_EQ_INDOOR',
          checklist: ['Do not run outside', 'Stay away from windows', 'Avoid elevators']
        };
      } else {
        return {
          actionCode: 'OPEN_AREA_STAY',
          priority: 'CRITICAL',
          instruction: 'Move to an open area away from buildings, trees, and power lines. Drop down and stay there.',
          audioBeacon: 'ALARM_EQ_OUTDOOR',
          checklist: ['Avoid tall structures', 'Watch for falling glass', 'Stay low']
        };
      }
    } else { // Post-shaking
      return {
        actionCode: 'POST_EQ_EVAC',
        priority: 'HIGH',
        instruction: 'Carefully exit the building using stairs. Watch for debris and expect aftershocks.',
        audioBeacon: 'INFO_ALERT',
        checklist: ['Check building integrity', 'Do not use elevators', 'Turn off gas if you smell a leak']
      };
    }
  }

  _evaluateFlashFlood(userState, telemetry) {
    const { timeToImpact, floodDepth, floodVelocity } = telemetry;
    const waterEnergy = (floodDepth || 0) * (floodVelocity || 0);

    if (waterEnergy > 0.4) {
      return {
        actionCode: 'WATER_ENERGY_CRITICAL',
        priority: 'CRITICAL',
        instruction: 'Dangerous flood waters detected. NEVER drive or walk through flowing water.',
        audioBeacon: 'ALARM_FLOOD',
        checklist: ['Abandon vehicles in water', 'Seek immediate elevation', 'Do not attempt to cross']
      };
    }

    if (timeToImpact < 15) {
      if (userState.locationType === 'indoor_highrise') {
        return {
          actionCode: 'VERTICAL_EVAC',
          priority: 'CRITICAL',
          instruction: 'Move immediately to higher floors or the roof. Do not attempt to leave the building.',
          audioBeacon: 'ALARM_FLOOD',
          checklist: ['Take emergency kit', 'Avoid basements', 'Move up']
        };
      } else {
        return {
          actionCode: 'SEEK_HIGH_GROUND',
          priority: 'CRITICAL',
          instruction: 'Evacuate immediately to designated high ground on foot.',
          audioBeacon: 'ALARM_FLOOD',
          checklist: ['Leave belongings behind', 'Move away from drainage channels', 'Move upslope']
        };
      }
    }

    return this._getDefaultResponse();
  }

  _evaluateLandslide(userState, telemetry) {
    const { slopeFoS, timeToImpact } = telemetry;
    
    if (slopeFoS < 1.0 || timeToImpact < 2) {
      return {
        actionCode: 'RUN_PERPENDICULAR',
        priority: 'CRITICAL',
        instruction: 'Landslide imminent! Run laterally across the slope, perpendicular to the path of the slide. NEVER run downslope.',
        audioBeacon: 'ALARM_LANDSLIDE',
        checklist: ['Move perpendicular to slope', 'Seek shelter behind large boulders if trapped', 'Curl into a tight ball and protect head if swept']
      };
    }

    return {
      actionCode: 'PREPARE_EVAC_LANDSLIDE',
      priority: 'HIGH',
      instruction: 'Slope instability detected. Prepare for immediate evacuation.',
      audioBeacon: 'INFO_ALERT',
      checklist: ['Listen for unusual sounds (cracking trees, boulders knocking)', 'Move away from steep slopes']
    };
  }

  _getDefaultResponse() {
    return {
      actionCode: 'STAY_ALERT',
      priority: 'NORMAL',
      instruction: 'No immediate critical threats detected. Monitor local alerts.',
      audioBeacon: 'NONE',
      checklist: ['Keep devices charged', 'Review evacuation plans']
    };
  }

  /**
   * Generates a preparation checklist based on hazard type.
   */
  getPreparationChecklist(hazardType) {
    const common = ['Water', 'Flashlight', 'First Aid Kit'];
    const specific = {
      'EARTHQUAKE': ['Sturdy shoes', 'Dust mask', 'Wrench to turn off gas'],
      'FLASH_FLOOD': ['Life jackets', 'Waterproof document bags', 'Rope'],
      'LANDSLIDE': ['Helmet', 'Sturdy boots', 'Whistle']
    };
    return [...common, ...(specific[hazardType] || [])];
  }

  /**
   * Provides immediate first aid guidance.
   */
  getFirstAidGuidance(injuryType) {
    const instructions = {
      'BLEEDING': 'Apply firm, direct pressure with a clean cloth. Elevate the wound if possible.',
      'FRACTURE': 'Do not move the injured person unless in immediate danger. Immobilize the area.',
      'SHOCK': 'Lay the person down, elevate legs, and keep them warm.'
    };
    return instructions[injuryType] || 'Seek professional medical help immediately.';
  }
}
