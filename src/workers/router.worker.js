// Haversine distance heuristic
function heuristic(nodeA, nodeB) {
  const R = 6371; // Radius of earth in km
  const dLat = (nodeB.lat - nodeA.lat) * Math.PI / 180;
  const dLon = (nodeB.lng - nodeA.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(nodeA.lat * Math.PI / 180) * Math.cos(nodeB.lat * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Minimal A* implementation for Web Worker
function findRoute(start, goal, graphNodes, graphEdges) {
  // graphNodes: Map<id, node>
  // graphEdges: Map<id, Array<{to, weight}>>
  
  const openSet = new Set([start.id]);
  const cameFrom = new Map();
  
  const gScore = new Map();
  gScore.set(start.id, 0);
  
  const fScore = new Map();
  fScore.set(start.id, heuristic(start, goal));

  while (openSet.size > 0) {
    // Find node in openSet with lowest fScore
    let currentId = null;
    let lowestF = Infinity;
    
    for (const id of openSet) {
      const f = fScore.get(id) || Infinity;
      if (f < lowestF) {
        lowestF = f;
        currentId = id;
      }
    }

    if (currentId === goal.id) {
      // Reconstruct path
      const path = [currentId];
      let curr = currentId;
      while (cameFrom.has(curr)) {
        curr = cameFrom.get(curr);
        path.unshift(curr);
      }
      return path;
    }

    openSet.delete(currentId);

    const neighbors = graphEdges.get(currentId) || [];
    for (const neighbor of neighbors) {
      const tentativeGScore = (gScore.get(currentId) || Infinity) + neighbor.weight;
      
      if (tentativeGScore < (gScore.get(neighbor.to) || Infinity)) {
        cameFrom.set(neighbor.to, currentId);
        gScore.set(neighbor.to, tentativeGScore);
        fScore.set(neighbor.to, tentativeGScore + heuristic(graphNodes.get(neighbor.to), goal));
        
        if (!openSet.has(neighbor.to)) {
          openSet.add(neighbor.to);
        }
      }
    }
  }

  return null;
}

// Worker message handler
self.onmessage = function(e) {
  const { type, payload } = e.data;

  if (type === 'FIND_ROUTE') {
    const { start, goal, nodes, edges } = payload;
    
    // Format graph structures
    const graphNodes = new Map();
    nodes.forEach(n => graphNodes.set(n.id, n));
    
    const graphEdges = new Map();
    edges.forEach(e => {
      if (!graphEdges.has(e.from)) graphEdges.set(e.from, []);
      graphEdges.get(e.from).push({ to: e.to, weight: e.weight });
    });

    try {
      const pathIds = findRoute(start, goal, graphNodes, graphEdges);
      if (pathIds) {
        const fullPath = pathIds.map(id => graphNodes.get(id));
        self.postMessage({ type: 'ROUTE_FOUND', payload: { path: fullPath } });
      } else {
        self.postMessage({ type: 'NO_ROUTE', payload: { message: 'No safe route found.' } });
      }
    } catch (error) {
      self.postMessage({ type: 'ERROR', payload: { error: error.message } });
    }
  }

  if (type === 'CANCEL') {
    console.log('Route calculation cancelled.');
    // Terminate current processing (if it was yielding, for synchronous A* it's tricky to cancel mid-flight without breaking it up)
  }
};
