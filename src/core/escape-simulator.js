// RAKSHA AI — Cinematic 3D Isometric Animated Escape Simulation Engine ("Video Model")
// Renders 3D topography, physics-based debris tumbling, articulated running avatar,
// dynamic camera tracking with screen shake, holographic AR escape vectors, and multi-lingual coaching.

export class EscapeSimulator {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.scenario = options.scenario || 'landslide';
    this.language = options.language || 'en';
    this.onStepChange = options.onStepChange || (() => {});
    
    this.isPlaying = false;
    this.progress = 0; // 0.0 to 1.0
    this.speed = 1.0;
    this.animationFrameId = null;
    this.viewMode = '3d_isometric';

    // Camera & Screen Shake Dynamics
    this.camera = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      zoom: 1.0,
      shake: 0
    };

    // Physics & Particle systems
    this.boulders = [];
    this.dustParticles = [];
    this.waterParticles = [];
    this.footstepPuffs = [];
    this.avatar = {
      x: 0,
      y: 0,
      z: 0,
      gaitPhase: 0,
      facingAngle: 0,
      speed: 0,
      state: 'alert'
    };

    this.initScenario(this.scenario);
  }

  setScenario(scenario) {
    this.scenario = scenario;
    this.progress = 0;
    this.initScenario(scenario);
    this.render();
  }

  setLanguage(lang) {
    this.language = lang;
  }

  setViewMode(mode) {
    this.viewMode = mode;
    this.render();
  }

  setPlaybackSpeed(speed) {
    this.speed = Math.max(0.25, Math.min(3.0, speed));
  }

  initScenario(scenario) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.boulders = [];
    this.dustParticles = [];
    this.waterParticles = [];
    this.footstepPuffs = [];

    if (scenario === 'landslide') {
      for (let i = 0; i < 35; i++) {
        this.boulders.push({
          x: w * 0.32 + (Math.random() - 0.5) * (w * 0.22),
          y: -40 - Math.random() * 350,
          z: 80 + Math.random() * 60,
          vx: (Math.random() - 0.5) * 1.8,
          vy: 5 + Math.random() * 6.5,
          vz: -2 - Math.random() * 2,
          radius: 8 + Math.random() * 16,
          rotX: Math.random() * Math.PI,
          rotY: Math.random() * Math.PI,
          rotSpeed: 0.05 + Math.random() * 0.15,
          color: Math.random() > 0.4 ? '#78350f' : '#451a03',
          facets: 6 + Math.floor(Math.random() * 3)
        });
      }

      this.avatar = {
        x: w * 0.32,
        y: h * 0.68,
        z: 0,
        gaitPhase: 0,
        facingAngle: 0,
        speed: 0,
        state: 'alert'
      };
    } else if (scenario === 'flood') {
      for (let i = 0; i < 50; i++) {
        this.waterParticles.push({
          x: Math.random() * w * 0.5,
          y: h * 0.7 + (Math.random() - 0.5) * 60,
          vx: 3 + Math.random() * 4,
          vy: (Math.random() - 0.5) * 1.5,
          size: 4 + Math.random() * 14,
          opacity: 0.3 + Math.random() * 0.6
        });
      }

      this.avatar = {
        x: w * 0.28,
        y: h * 0.78,
        z: 0,
        gaitPhase: 0,
        facingAngle: -Math.PI / 4,
        speed: 0,
        state: 'alert'
      };
    } else if (scenario === 'road') {
      this.avatar = {
        x: w * 0.30,
        y: h * 0.66,
        z: 0,
        gaitPhase: 0,
        facingAngle: 0,
        speed: 0,
        state: 'alert'
      };
    } else {
      this.avatar = {
        x: w * 0.40,
        y: h * 0.58,
        z: 0,
        gaitPhase: 0,
        facingAngle: 0,
        speed: 0,
        state: 'alert'
      };
    }

    this.camera.x = this.avatar.x;
    this.camera.y = this.avatar.y;
    this.camera.targetX = this.avatar.x;
    this.camera.targetY = this.avatar.y;
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.lastTime = performance.now();
    this.loop();
  }

  pause() {
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  reset() {
    this.pause();
    this.progress = 0;
    this.initScenario(this.scenario);
    this.render();
  }

  setProgress(val) {
    this.progress = Math.max(0, Math.min(1, val));
    this.updatePhysics(0.016);
    this.render();
  }

  loop() {
    if (!this.isPlaying) return;
    const now = performance.now();
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    this.progress += (dt / 13) * this.speed;

    let stepNum = 1;
    if (this.progress >= 1.0) {
      this.progress = 1.0;
      this.isPlaying = false;
      stepNum = 4;
    } else if (this.progress > 0.72) {
      stepNum = 3;
    } else if (this.progress > 0.22) {
      stepNum = 2;
    } else {
      stepNum = 1;
    }

    this.onStepChange(stepNum, this.getStepText(stepNum));

    this.updatePhysics(dt);
    this.render();

    if (this.isPlaying) {
      this.animationFrameId = requestAnimationFrame(() => this.loop());
    }
  }

  updatePhysics(dt) {
    const w = this.canvas.width;
    const h = this.canvas.height;

    if (this.camera.shake > 0) {
      this.camera.shake = Math.max(0, this.camera.shake - dt * 18);
    }

    if (this.scenario === 'landslide') {
      for (const b of this.boulders) {
        b.y += b.vy * this.speed;
        b.x += b.vx * this.speed;
        b.rotX += b.rotSpeed * this.speed;
        b.rotY += b.rotSpeed * this.speed;

        if (Math.random() < 0.25 && b.y > 0 && b.y < h) {
          this.dustParticles.push({
            x: b.x + (Math.random() - 0.5) * 10,
            y: b.y + b.radius,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -0.5 - Math.random() * 1.5,
            radius: 4 + Math.random() * 8,
            opacity: 0.6,
            life: 1.0
          });
        }

        if (b.y > h * 0.5 && b.y < h * 0.8 && Math.abs(b.x - this.avatar.x) < 90) {
          if (Math.random() < 0.08) {
            this.camera.shake = Math.max(this.camera.shake, 6);
          }
        }

        if (b.y > h + 60) {
          b.y = -30 - Math.random() * 100;
          b.x = w * 0.32 + (Math.random() - 0.5) * (w * 0.22);
          b.vx = (Math.random() - 0.5) * 1.8;
        }
      }
    }

    for (let i = this.dustParticles.length - 1; i >= 0; i--) {
      const p = this.dustParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.radius += 0.25;
      p.opacity -= dt * 0.7;
      if (p.opacity <= 0) {
        this.dustParticles.splice(i, 1);
      }
    }

    for (let i = this.footstepPuffs.length - 1; i >= 0; i--) {
      const p = this.footstepPuffs[i];
      p.radius += 0.15;
      p.opacity -= dt * 1.2;
      if (p.opacity <= 0) {
        this.footstepPuffs.splice(i, 1);
      }
    }

    this.updateAvatarPosition(dt);

    const camTargetX = this.avatar.x;
    const camTargetY = this.avatar.y;
    this.camera.x += (camTargetX - this.camera.x) * 0.08;
    this.camera.y += (camTargetY - this.camera.y) * 0.08;
  }

  updateAvatarPosition(dt) {
    const w = this.canvas.width;
    const h = this.canvas.height;

    if (this.scenario === 'landslide') {
      const startX = w * 0.32;
      const startY = h * 0.68;
      const targetX = w * 0.82;
      const targetY = h * 0.44;

      if (this.progress < 0.18) {
        this.avatar.x = startX;
        this.avatar.y = startY;
        this.avatar.state = 'alert';
        this.avatar.facingAngle = -Math.PI / 2;
        this.avatar.speed = 0;
      } else {
        const t = Math.min(1.0, (this.progress - 0.18) / 0.72);
        const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        const prevX = this.avatar.x;
        const prevY = this.avatar.y;

        this.avatar.x = startX + (targetX - startX) * easeT;
        this.avatar.y = startY + (targetY - startY) * easeT;

        const dx = this.avatar.x - prevX;
        const dy = this.avatar.y - prevY;
        this.avatar.facingAngle = Math.atan2(dy, dx);
        this.avatar.speed = Math.sqrt(dx * dx + dy * dy) / (dt || 0.016);
        this.avatar.gaitPhase += dt * 16 * this.speed;

        if (Math.random() < 0.3 && t < 0.95) {
          this.footstepPuffs.push({
            x: this.avatar.x,
            y: this.avatar.y + 4,
            radius: 2,
            opacity: 0.7
          });
        }

        this.avatar.state = t >= 0.95 ? 'safe' : 'sprint';
      }
    } else if (this.scenario === 'flood') {
      const startX = w * 0.28;
      const startY = h * 0.78;
      const targetX = w * 0.78;
      const targetY = h * 0.30;

      if (this.progress < 0.15) {
        this.avatar.x = startX;
        this.avatar.y = startY;
        this.avatar.state = 'alert';
        this.avatar.facingAngle = -Math.PI / 2;
      } else {
        const t = Math.min(1.0, (this.progress - 0.15) / 0.75);
        const easeT = 1 - Math.pow(1 - t, 2);
        this.avatar.x = startX + (targetX - startX) * easeT;
        this.avatar.y = startY + (targetY - startY) * easeT;
        this.avatar.facingAngle = Math.atan2(targetY - startY, targetX - startX);
        this.avatar.gaitPhase += dt * 14 * this.speed;
        this.avatar.state = t >= 0.95 ? 'safe' : 'sprint';
      }
    } else {
      const startX = w * 0.30;
      const targetX = w * 0.75;
      const t = Math.min(1.0, this.progress);
      this.avatar.x = startX + (targetX - startX) * t;
      this.avatar.y = h * 0.58 - Math.sin(t * Math.PI) * 35;
      this.avatar.facingAngle = 0;
      this.avatar.gaitPhase += dt * 12 * this.speed;
      this.avatar.state = t >= 0.9 ? 'safe' : 'sprint';
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Apply Camera Shake
    ctx.save();
    if (this.camera.shake > 0) {
      const sx = (Math.random() - 0.5) * this.camera.shake;
      const sy = (Math.random() - 0.5) * this.camera.shake;
      ctx.translate(sx, sy);
    }

    if (this.scenario === 'landslide') {
      this.render3DLandslideScenario(ctx, w, h);
    } else if (this.scenario === 'flood') {
      this.render3DFloodScenario(ctx, w, h);
    } else if (this.scenario === 'road') {
      this.render3DRoadScenario(ctx, w, h);
    } else {
      this.render3DQuakeScenario(ctx, w, h);
    }

    ctx.restore();

    // Render HUD on top of camera
    this.renderCinematicHUD(ctx, w, h);
  }

  // =========================================================================
  // 1. CINEMATIC 3D ISOMETRIC LANDSLIDE SCENARIO
  // =========================================================================
  render3DLandslideScenario(ctx, w, h) {
    // 1. Sky & Atmospheric Twilight Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#020617');
    skyGrad.addColorStop(0.35, '#0f172a');
    skyGrad.addColorStop(0.7, '#1e293b');
    skyGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Distant Himalayan Ridgelines
    this.renderDistantMountains(ctx, w, h);

    // 3. Isometric Mountain Slope Base & Contours
    this.renderIsometricMountainSlope(ctx, w, h);

    // 4. Hazardous Debris Chute (Red 3D Danger Volume)
    this.renderDebrisChute(ctx, w, h);

    // 5. Holographic AR 90-Degree Escape Vector Corridor
    this.renderHolographicEscapeVector(ctx, w, h);

    // 6. Solid Bedrock Ridge (Granite Deflection Barrier)
    this.renderBedrockRidge(ctx, w, h);

    // 7. Green Verified Safe Zone (Behind Deflection Ridge)
    this.renderSafeZoneTerrace(ctx, w, h);

    // 8. Volumetric Dust Particles
    for (const d of this.dustParticles) {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 150, 120, ${d.opacity * 0.35})`;
      ctx.fill();
    }

    // 9. Falling 3D Boulders (Sorted by Y for depth)
    const sortedBoulders = [...this.boulders].sort((a, b) => a.y - b.y);
    for (const b of sortedBoulders) {
      this.render3DBoulder(ctx, b);
    }

    // 10. Footstep Puffs
    for (const fp of this.footstepPuffs) {
      ctx.beginPath();
      ctx.arc(fp.x, fp.y, fp.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(226, 232, 240, ${fp.opacity * 0.4})`;
      ctx.fill();
    }

    // 11. Articulated Running Avatar ("You")
    this.renderArticulatedAvatar(ctx, this.avatar);
  }

  renderDistantMountains(ctx, w, h) {
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.32);
    ctx.lineTo(w * 0.25, h * 0.18);
    ctx.lineTo(w * 0.55, h * 0.28);
    ctx.lineTo(w * 0.85, h * 0.14);
    ctx.lineTo(w, h * 0.24);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Snow caps on distant peaks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(w * 0.25, h * 0.18);
    ctx.lineTo(w * 0.21, h * 0.23);
    ctx.lineTo(w * 0.29, h * 0.23);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(w * 0.85, h * 0.14);
    ctx.lineTo(w * 0.80, h * 0.19);
    ctx.lineTo(w * 0.90, h * 0.19);
    ctx.closePath();
    ctx.fill();
  }

  renderIsometricMountainSlope(ctx, w, h) {
    const slopeGrad = ctx.createLinearGradient(0, h * 0.25, w, h);
    slopeGrad.addColorStop(0, '#1c1917');
    slopeGrad.addColorStop(0.5, '#292524');
    slopeGrad.addColorStop(1, '#0c0a09');
    ctx.fillStyle = slopeGrad;

    ctx.beginPath();
    ctx.moveTo(0, h * 0.35);
    ctx.lineTo(w * 0.5, h * 0.15);
    ctx.lineTo(w, h * 0.40);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Elevation Contour Lines
    ctx.strokeStyle = 'rgba(120, 113, 108, 0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);

    for (let elevation = 1; elevation <= 4; elevation++) {
      const yOffset = h * (0.35 + elevation * 0.12);
      ctx.beginPath();
      ctx.moveTo(0, yOffset);
      ctx.bezierCurveTo(w * 0.3, yOffset - 40, w * 0.7, yOffset - 15, w, yOffset);
      ctx.stroke();

      ctx.fillStyle = 'rgba(168, 162, 158, 0.5)';
      ctx.font = '9px monospace';
      ctx.fillText(`${1400 - elevation * 50}m`, 14, yOffset - 4);
    }
    ctx.setLineDash([]);

    // Highway Roadway Cut across the slope
    ctx.beginPath();
    ctx.moveTo(0, h * 0.74);
    ctx.bezierCurveTo(w * 0.35, h * 0.70, w * 0.65, h * 0.62, w, h * 0.55);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 16;
    ctx.stroke();

    // Highway Centerline
    ctx.beginPath();
    ctx.moveTo(0, h * 0.74);
    ctx.bezierCurveTo(w * 0.35, h * 0.70, w * 0.65, h * 0.62, w, h * 0.55);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 12]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  renderDebrisChute(ctx, w, h) {
    const chuteGrad = ctx.createLinearGradient(w * 0.3, 0, w * 0.4, h);
    chuteGrad.addColorStop(0, 'rgba(239, 68, 68, 0.32)');
    chuteGrad.addColorStop(0.7, 'rgba(185, 28, 28, 0.22)');
    chuteGrad.addColorStop(1, 'rgba(127, 29, 29, 0.38)');

    ctx.beginPath();
    ctx.moveTo(w * 0.22, 0);
    ctx.lineTo(w * 0.44, 0);
    ctx.lineTo(w * 0.56, h);
    ctx.lineTo(w * 0.12, h);
    ctx.closePath();
    ctx.fillStyle = chuteGrad;
    ctx.fill();

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 8]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('⚠️ DEBRIS FLOW LINE (DOWNFALL LINE)', w * 0.16, h * 0.20);

    ctx.fillStyle = '#fca5a5';
    ctx.font = '10px monospace';
    ctx.fillText('DO NOT RUN DOWNSLOPE! (FATAL RUNOUT ZONE)', w * 0.14, h * 0.25);

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    this.drawArrow(ctx, w * 0.32, h * 0.70, w * 0.32, h * 0.92);

    ctx.fillStyle = '#fecaca';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('FATAL DOWNWARD SPRINT ❌', w * 0.21, h * 0.90);
  }

  renderHolographicEscapeVector(ctx, w, h) {
    const startX = w * 0.32;
    const startY = h * 0.68;
    const endX = w * 0.82;
    const endY = h * 0.44;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.25)';
    ctx.lineWidth = 26;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.restore();

    const pulseOffset = (Date.now() / 250) % 1;
    for (let i = 0.2; i <= 0.85; i += 0.2) {
      const t = (i + pulseOffset * 0.2) % 1;
      const cx = startX + (endX - startX) * t;
      const cy = startY + (endY - startY) * t;
      this.drawChevron(ctx, cx, cy, Math.atan2(endY - startY, endX - startX));
    }

    this.renderDistanceMarker(ctx, startX + (endX - startX) * 0.45, startY + (endY - startY) * 0.45, '45m', 'CLEARING CHUTE');
    this.renderDistanceMarker(ctx, endX, endY, '85m', 'BEDROCK RIDGE');

    ctx.fillStyle = '#86efac';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('OPTIMAL 90° PERPENDICULAR VECTOR ✅', w * 0.38, h * 0.54);
    ctx.font = '9px monospace';
    ctx.fillStyle = '#bbf7d0';
    ctx.fillText('Lateral sprint clears fall line in 7.2 seconds', w * 0.38, h * 0.58);
  }

  renderBedrockRidge(ctx, w, h) {
    const rx = w * 0.72;
    const ry = h * 0.28;

    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx + w * 0.12, ry - 30);
    ctx.lineTo(rx + w * 0.20, ry + 80);
    ctx.lineTo(rx + w * 0.16, ry + h * 0.42);
    ctx.lineTo(rx - w * 0.04, ry + h * 0.40);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(rx + 15, ry + 10);
    ctx.lineTo(rx + w * 0.08, ry);
    ctx.lineTo(rx + w * 0.06, ry + 90);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('🪨 GRANITE DEFLECTION BLUFF', rx - 10, ry - 14);
    ctx.font = '9px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Deflects rockfall trajectory downward', rx - 10, ry);
  }

  renderSafeZoneTerrace(ctx, w, h) {
    const zx = w * 0.75;
    const zy = h * 0.36;
    const zw = w * 0.22;
    const zh = h * 0.42;

    ctx.fillStyle = 'rgba(34, 197, 94, 0.22)';
    ctx.fillRect(zx, zy, zw, zh);

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.strokeRect(zx, zy, zw, zh);

    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 4;
    this.drawCornerBracket(ctx, zx, zy, 12, 1, 1);
    this.drawCornerBracket(ctx, zx + zw, zy, 12, -1, 1);
    this.drawCornerBracket(ctx, zx, zy + zh, 12, 1, -1);
    this.drawCornerBracket(ctx, zx + zw, zy + zh, 12, -1, -1);

    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('🟢 SAFE REFUGE TERRACE', zx + 10, zy + 22);

    ctx.fillStyle = '#86efac';
    ctx.font = '10px sans-serif';
    ctx.fillText('Outside Reach Angle (α = 24°)', zx + 10, zy + 38);
    ctx.fillText('HAND Elevation: +18m Clearance', zx + 10, zy + 52);
    ctx.fillText('FoS > 1.8 (Stable Bedrock)', zx + 10, zy + 66);
  }

  render3DBoulder(ctx, b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.rotX);

    ctx.beginPath();
    ctx.ellipse(4, b.radius + 2, b.radius * 0.9, b.radius * 0.35, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fill();

    ctx.beginPath();
    const numPoints = b.facets || 7;
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const r = b.radius * (0.8 + Math.sin(i * 2 + b.rotY) * 0.2);
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = b.color;
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }

  // =========================================================================
  // ARTICULATED RUNNING HUMAN AVATAR
  // =========================================================================
  renderArticulatedAvatar(ctx, av) {
    const x = av.x;
    const y = av.y;
    const gait = av.gaitPhase;
    const isRunning = av.state === 'sprint';
    const isSafe = av.state === 'safe';

    ctx.save();
    ctx.translate(x, y);

    // Ground shadow
    ctx.beginPath();
    ctx.ellipse(0, 6, 12, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fill();

    const lean = isRunning ? 0.22 : 0;
    ctx.rotate(lean);

    const hipAngle = isRunning ? Math.sin(gait) * 0.75 : 0;
    const kneeAngle = isRunning ? Math.max(0, Math.cos(gait) * 0.9) : 0;
    const armAngle = isRunning ? -Math.sin(gait) * 0.8 : 0;

    // Back Leg
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -10);
    const blx = Math.sin(-hipAngle) * 12;
    const bly = Math.cos(-hipAngle) * 12 - 10;
    ctx.lineTo(blx, bly);
    ctx.lineTo(blx + Math.sin(-hipAngle + kneeAngle) * 10, bly + Math.cos(-hipAngle + kneeAngle) * 10);
    ctx.stroke();

    // Torso (Jacket with Hiking Backpack)
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(0, -32);
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Backpack
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.roundRect(-7, -30, 6, 14, 3);
    ctx.fill();

    // Front Leg
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(0, -10);
    const flx = Math.sin(hipAngle) * 12;
    const fly = Math.cos(hipAngle) * 12 - 10;
    ctx.lineTo(flx, fly);
    ctx.lineTo(flx + Math.sin(hipAngle + kneeAngle) * 10, fly + Math.cos(hipAngle + kneeAngle) * 10);
    ctx.stroke();

    // Arms
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(Math.sin(armAngle) * 11, -28 + Math.cos(armAngle) * 11);
    ctx.stroke();

    // Head with Safety Helmet
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(0, -38, 7.5, 0, Math.PI * 2);
    ctx.fill();

    // Headlamp Beam
    ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
    ctx.beginPath();
    ctx.moveTo(3, -38);
    ctx.lineTo(35, -46);
    ctx.lineTo(35, -30);
    ctx.closePath();
    ctx.fill();

    // Identification Badge
    ctx.rotate(-lean);
    ctx.fillStyle = isSafe ? '#22c55e' : '#38bdf8';
    ctx.beginPath();
    ctx.roundRect(-24, -58, 48, 16, 4);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isSafe ? 'YOU (SAFE)' : 'YOU (SPRINT)', 0, -46);
    ctx.textAlign = 'left';

    ctx.restore();
  }

  // =========================================================================
  // 2. FLASH FLOOD SCENARIO
  // =========================================================================
  render3DFloodScenario(ctx, w, h) {
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    this.renderDistantMountains(ctx, w, h);

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.4);
    ctx.lineTo(w, h * 0.25);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    const waterGrad = ctx.createLinearGradient(0, h * 0.55, 0, h);
    waterGrad.addColorStop(0, 'rgba(2, 132, 199, 0.7)');
    waterGrad.addColorStop(1, 'rgba(3, 105, 161, 0.95)');
    ctx.fillStyle = waterGrad;

    ctx.beginPath();
    ctx.moveTo(0, h * 0.65);
    const waveShift = (Date.now() / 300) % (Math.PI * 2);
    for (let x = 0; x <= w * 0.55; x += 20) {
      const y = h * 0.65 + Math.sin(x * 0.03 + waveShift) * 8;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w * 0.55, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
    ctx.fillRect(w * 0.68, h * 0.20, w * 0.30, h * 0.45);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.strokeRect(w * 0.68, h * 0.20, w * 0.30, h * 0.45);

    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('🟢 SAFE HIGH TERRACE (+15m HAND)', w * 0.70, h * 0.26);
    ctx.font = '10px sans-serif';
    ctx.fillText('Safe from 30-meter wave crests', w * 0.70, h * 0.31);

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    this.drawArrow(ctx, w * 0.28, h * 0.78, w * 0.78, h * 0.32);

    this.renderArticulatedAvatar(ctx, this.avatar);
  }

  // =========================================================================
  // 3. ROAD SCENARIO
  // =========================================================================
  render3DRoadScenario(ctx, w, h) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, h * 0.5, w, 80);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(0, h * 0.5 + 40);
    ctx.lineTo(w, h * 0.5 + 40);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(w * 0.85, h * 0.5 + 40, 50, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('⛔ BLOCKED HIGHWAY (KM 48)', w * 0.75, h * 0.42);

    ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
    ctx.fillRect(w * 0.55, h * 0.68, w * 0.35, 70);
    ctx.strokeStyle = '#22c55e';
    ctx.strokeRect(w * 0.55, h * 0.68, w * 0.35, 70);

    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('🟢 WIDE VEHICLE TURNOUT BAY / TRAILHEAD', w * 0.57, h * 0.75);

    this.renderArticulatedAvatar(ctx, this.avatar);
  }

  // =========================================================================
  // 4. EARTHQUAKE SCENARIO
  // =========================================================================
  render3DQuakeScenario(ctx, w, h) {
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(w * 0.1, h * 0.2, w * 0.35, h * 0.6);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.strokeRect(w * 0.1, h * 0.2, w * 0.35, h * 0.6);

    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('⚠️ UNREINFORCED MASONRY ZONE', w * 0.12, h * 0.16);

    ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
    ctx.fillRect(w * 0.6, h * 0.25, w * 0.35, h * 0.55);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.strokeRect(w * 0.6, h * 0.25, w * 0.35, h * 0.55);

    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('🟢 OPEN GROUND CLEARING', w * 0.64, h * 0.32);
    ctx.font = '10px sans-serif';
    ctx.fillText('Away from powerlines & cliff edges', w * 0.64, h * 0.37);

    this.renderArticulatedAvatar(ctx, this.avatar);
  }

  // =========================================================================
  // CINEMATIC TELEMETRY HUD OVERLAY
  // =========================================================================
  renderCinematicHUD(ctx, w, h) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(12, 12, 260, 58);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(12, 12, 260, 58);

    const stepIdx = this.progress > 0.72 ? 3 : this.progress > 0.22 ? 2 : 1;
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`RAKSHA 3D ESCAPE ENGINE • PHASE ${stepIdx}/3`, 20, 28);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '10px sans-serif';
    const distRemaining = Math.max(0, Math.round(85 * (1 - Math.min(1, (this.progress - 0.18) / 0.72))));
    ctx.fillText(`Safety Proximity: ${distRemaining}m • Speed: ${(this.speed).toFixed(1)}x • Time: ${(this.progress * 13).toFixed(1)}s`, 20, 44);
    ctx.fillText(`Perspective: 3D Isometric View (Topographic Depth)`, 20, 58);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(w - 180, 12, 168, 58);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(w - 180, 12, 168, 58);

    ctx.fillStyle = this.progress > 0.72 ? '#22c55e' : '#ef4444';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`STATUS: ${this.avatar.state.toUpperCase()}`, w - 170, 28);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Slope Stability: FoS 0.74`, w - 170, 44);
    ctx.fillText(`Reach Angle α: 24° Runout`, w - 170, 58);
  }

  drawArrow(ctx, fromx, fromy, tox, toy) {
    const headlen = 12;
    const dx = tox - fromx;
    const dy = toy - fromy;
    const angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  }

  drawChevron(ctx, x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(-6, -6);
    ctx.lineTo(2, 0);
    ctx.lineTo(-6, 6);
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  }

  drawCornerBracket(ctx, x, y, size, dirX, dirY) {
    ctx.beginPath();
    ctx.moveTo(x + dirX * size, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + dirY * size);
    ctx.stroke();
  }

  renderDistanceMarker(ctx, x, y, distText, label) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(x - 30, y - 28, 60, 24, 4);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(distText, x, y - 16);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '7.5px sans-serif';
    ctx.fillText(label, x, y - 7);
    ctx.textAlign = 'left';
  }

  getStepText(step) {
    const lang = this.language;
    if (this.scenario === 'landslide') {
      if (step === 1) {
        if (lang === 'hi') return 'चरण 1: चेतावनी! पहाड़ से चट्टानें टूटने की गड़गड़ाहट सुनें। ढलान की ओर नीचे कभी न भागें! दाईं ओर देखें।';
        if (lang === 'ny') return 'Lam 1: Dolo siko nyirup agar tatla! Downside daado ma! Right side aato!';
        if (lang === 'adi') return 'Step 1: Lodi rumbuk tatla! Downslope daado ma! Right side be kalingka!';
        if (lang === 'mon') return 'Step 1: Ri-ngan rockfall nyento! Downslope gyuk ma! Right side lok!';
        return 'Step 1: Hazard Detected! Trees cracking and rocks tumbling on slope. DO NOT run downslope along the fall line! Look to your right.';
      } else if (step === 2) {
        if (lang === 'hi') return 'चरण 2: तुरंत 90 अंश लंबवत दिशा में दौड़ें! हरे नेविगेशन पाथवे का पालन करते हुए ग्रेनाइट चट्टान की ओर भागें!';
        if (lang === 'ny') return 'Lam 2: Molo be daalo! 90 degree slope side solid rock ridge be daalo!';
        if (lang === 'adi') return 'Step 2: Lodi side be 90 degree gidumika! Solid rock ridge be aato!';
        if (lang === 'mon') return 'Step 2: Ri-ngan side be 90 degree yampa rock ridge gyuk!';
        return 'Step 2: Sprint 90° perpendicular to debris flow immediately! Follow the glowing green AR escape vector toward the granite ridge!';
      } else if (step === 3) {
        if (lang === 'hi') return 'चरण 3: ग्रेनाइट चट्टान की आड़ में ऊपर चढ़ें। आप मलबे के बहाव क्षेत्र से बाहर निकल रहे हैं।';
        if (lang === 'ny') return 'Lam 3: Solid bedrock outcrop aato! Chute reach angle outside aato!';
        if (lang === 'adi') return 'Step 3: Bedrock ridge aato! Reach angle outside clearance!';
        if (lang === 'mon') return 'Step 3: Rock barrier ritsang gyuk! Debris flow outside!';
        return 'Step 3: Scramble behind the granite deflection barrier! You are clearing the debris runout reach angle (α = 24°).';
      } else {
        if (lang === 'hi') return 'चरण 4: बधाई! आप सुरक्षित आश्रय स्थल में पहुँच चुके हैं। यहाँ बने रहें और आपातकालीन सिगनल 1070/112 पर भेजें।';
        if (lang === 'ny') return 'Lam 4: Aito! Verified safe zone siko aato. 12th Bn NDRF aato!';
        if (lang === 'adi') return 'Step 4: Aito be! Safe zone reached outside slide path!';
        if (lang === 'mon') return 'Step 4: Lekpo! Safe refuge reached. Do not return to slope!';
        return 'Step 4: Reached verified green safe zone behind deflection barrier! Stay sheltered, do not return to the slide path, and transmit SOS.';
      }
    } else if (this.scenario === 'flood') {
      if (step === 1) {
        if (lang === 'hi') return 'चरण 1: सियांग नदी का जलस्तर तेजी से बढ़ रहा है। पानी में गाड़ी या पैदल न जाएं!';
        return 'Step 1: Siang River flash flood surge detected! Never enter flowing water.';
      } else if (step === 2) {
        if (lang === 'hi') return 'चरण 2: तुरंत नदी के किनारे से कम से कम 15 मीटर ऊपर पहाड़ी पर लंबवत चढ़ें!';
        return 'Step 2: Ascend vertically up river terraces at least 15m above the current waterline!';
      } else {
        if (lang === 'hi') return 'चरण 3: आप सुरक्षित उच्च भूमि पर पहुँच चुके हैं (+15m HAND)। बचाव दल की प्रतीक्षा करें।';
        return 'Step 3: Reached safe elevation (+15m HAND clearance). Safe from trans-boundary flood waves.';
      }
    } else {
      if (step <= 2) return 'Step 1-2: Execute safety maneuver and avoid structural hazard perimeter.';
      return 'Step 3: Successfully reached open safe clearance zone.';
    }
  }
}

