/**
 * Evacuation Router Engine
 * Implements Time-Dependent Multi-Objective A* (TD-MOA*) for evacuation routing.
 */

export class EvacuationRouter {
  constructor(graphNodes = {}, graphEdges = []) {
    // Map of nodeId -> node data {id, lat, lon, elevation, type, capacity}
    this.nodes = graphNodes;
    
    // Adjacency list: nodeId -> array of edges {target, mode, length, speed, slope, capacity, isBlocked, riskScore}
    this.adjacencyList = {};
    for (const nodeId in this.nodes) {
      this.adjacencyList[nodeId] = [];
    }
    for (const edge of graphEdges) {
      const eNorm = { ...edge, mode: (edge.mode || 'road').toLowerCase() };
      if (!this.adjacencyList[edge.source]) this.adjacencyList[edge.source] = [];
      this.adjacencyList[edge.source].push(eNorm);

      // Roads, railways, and air corridors are naturally bi-directional for evacuations
      if (!this.adjacencyList[edge.target]) this.adjacencyList[edge.target] = [];
      this.adjacencyList[edge.target].push({
        ...eNorm,
        id: `${edge.id}_rev`,
        source: edge.target,
        target: edge.source
      });
    }
  }

  /**
   * Calculates the Haversine distance between two coordinates in kilometers.
   */
  haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Dynamic Edge Cost Calculation
   * C(e,t) = w_T·T̃(e,t) + w_R·R(e,t) + w_D·D(e) + w_B·P_block(e,t)
   */
  calculateEdgeCost(edge, mode, time, riskTolerance) {
    // BPR Congestion Model (T̃)
    const T_0 = edge.length / edge.speed; 
    const V_C_ratio = edge.currentVolume ? (edge.currentVolume / edge.capacity) : 0;
    const T_tilde = T_0 * (1 + 0.15 * Math.pow(V_C_ratio, 4));

    // Mode specific terrain penalties (D)
    let D_e = 0;
    if (mode === 'FOOT') {
      // Tobler's hiking function inverse for time (speed v = 6*exp(-3.5*|s+0.05|))
      const speed = 6 * Math.exp(-3.5 * Math.abs(edge.slope + 0.05));
      D_e = edge.length / speed; 
    } else if (mode === 'VEHICLE') {
      // Vehicle terrain penalty
      const D_veh = 1 + 2.5 * Math.max(0, edge.slope) + 5.0 * Math.pow(edge.slope, 2);
      D_e = T_tilde * D_veh;
    }

    // Risk penalty (R)
    const R_e = edge.riskScore || 0;
    
    // Blockage penalty (P_block)
    const P_block = edge.isBlocked ? 999999 : 0;

    // Weights configuration based on riskTolerance (0.0 to 1.0)
    const w_T = 1.0 - (riskTolerance * 0.5);
    const w_R = riskTolerance;
    const w_D = 0.5;
    const w_B = 1.0;

    return (w_T * T_tilde) + (w_R * R_e) + (w_D * D_e) + (w_B * P_block);
  }

  /**
   * Finds the optimal route using A* based on the dynamic cost function
   */
  findRoute(sourceId, targetId, departureTime, mode, riskTolerance) {
    // Priority queue storing {id, cost, path, time}
    const openSet = [{ id: sourceId, cost: 0, path: [sourceId], time: departureTime }];
    const closedSet = new Set();
    const gScores = { [sourceId]: 0 };

    const targetNode = this.nodes[targetId];

    while (openSet.length > 0) {
      // Pop node with lowest cost
      openSet.sort((a, b) => a.cost - b.cost);
      const current = openSet.shift();

      if (current.id === targetId) {
        return { path: current.path, totalCost: current.cost, estimatedArrival: current.time };
      }

      closedSet.add(current.id);

      const neighbors = this.adjacencyList[current.id] || [];
      for (const edge of neighbors) {
        if (edge.isBlocked) continue; // Skip blocked completely
        
        // Multi-modal compatibility check
        const reqM = (mode || 'ANY').toLowerCase();
        const edgM = (edge.mode || 'road').toLowerCase();
        const isMatch = reqM === 'any' || reqM === 'all' || edgM === reqM ||
          (reqM === 'vehicle' && edgM === 'road') ||
          (reqM === 'foot' && (edgM === 'foot' || edgM === 'road' || edgM === 'track')) ||
          (reqM === 'air' && (edgM === 'air' || edgM === 'air_heli')) ||
          edgM === 'road'; // Roads are generally multi-modal

        if (!isMatch) continue;

        const edgeCost = this.calculateEdgeCost(edge, mode, current.time, riskTolerance);
        const tentativeG = gScores[current.id] + edgeCost;

        if (!gScores[edge.target] || tentativeG < gScores[edge.target]) {
          gScores[edge.target] = tentativeG;
          
          const neighborNode = this.nodes[edge.target];
          const hScore = targetNode && neighborNode ? this.haversine(neighborNode.lat, neighborNode.lon, targetNode.lat, targetNode.lon) : 0;
          const fScore = tentativeG + hScore;

          if (!closedSet.has(edge.target)) {
            openSet.push({
              id: edge.target,
              cost: fScore,
              path: [...current.path, edge.target],
              time: current.time + edgeCost // Simple time accumulation
            });
          }
        }
      }
    }

    return null; // No route found
  }

  /**
   * Finds the nearest safe zone from origin
   */
  findNearestSafeZone(originId, safeZoneIds, mode = 'FOOT', riskTolerance = 0.5) {
    let bestRoute = null;
    let minCost = Infinity;

    for (const szId of safeZoneIds) {
      const route = this.findRoute(originId, szId, 0, mode, riskTolerance);
      if (route && route.totalCost < minCost) {
        minCost = route.totalCost;
        bestRoute = { safeZoneId: szId, ...route };
      }
    }
    return bestRoute;
  }

  /**
   * Computes multiple route alternatives for pareto analysis
   */
  computeAllAlternatives(source, target) {
    // In a full implementation, this would track pareto-optimal frontiers.
    // Simulating by varying risk vs time tolerances.
    return {
      fastest: this.findRoute(source, target, 0, 'VEHICLE', 0.1),
      safest: this.findRoute(source, target, 0, 'VEHICLE', 0.9),
      pedestrian: this.findRoute(source, target, 0, 'FOOT', 0.5)
    };
  }
}
