/**
 * Zero Trust Cyber-Physical Engine
 * 60 FPS Continuous Vector Physics, Magnetic Repulsion, Velocity HUD, and Heat-Sink System.
 */
class MagneticPhysicsEngine {
  constructor(buttonEl, arenaEl, onCaptured) {
    this.btn = buttonEl;
    this.arena = arenaEl;
    this.onCaptured = onCaptured;

    // Physics parameters
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
    this.friction = 0.88;
    this.repulsionConstant = 38000;
    this.proximityThreshold = 120; // px

    // Heat-sink parameters
    this.thrusterHeat = 0; // 0 to 100
    this.isOverheated = false;
    this.overheatCooldownTimer = null;
    this.isActive = true;

    // Pointer telemetry
    this.mouse = { x: 0, y: 0, lastX: 0, lastY: 0, speed: 0, lastTime: performance.now() };

    this.init();
  }

  init() {
    this.boundMouseMove = this.onMouseMove.bind(this);
    window.addEventListener('mousemove', this.boundMouseMove);

    // Initial center position in arena
    const arenaRect = this.arena.getBoundingClientRect();
    this.pos.x = arenaRect.width / 2;
    this.pos.y = arenaRect.height / 2;

    this.btn.addEventListener('click', () => {
      if (!this.isActive) return;
      this.triggerSuccess();
    });

    // Start 60fps physics simulation loop
    this.running = true;
    this.rafId = requestAnimationFrame(this.step.bind(this));
  }

  onMouseMove(e) {
    const now = performance.now();
    const dt = (now - this.mouse.lastTime) / 1000;

    if (dt > 0) {
      const dist = Math.hypot(e.clientX - this.mouse.lastX, e.clientY - this.mouse.lastY);
      this.mouse.speed = Math.round(dist / dt); // px/sec

      if (window.vaultState) {
        window.vaultState.mouseDistance += dist;
        window.vaultState.peakSpeed = Math.max(window.vaultState.peakSpeed || 0, this.mouse.speed);
      }
    }

    this.mouse.lastX = e.clientX;
    this.mouse.lastY = e.clientY;
    this.mouse.lastTime = now;

    // Update global background spotlight
    document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);

    // Update HUD elements
    const hudCoords = document.getElementById('hud-coords');
    if (hudCoords) hudCoords.innerText = `X:${Math.round(e.clientX)} Y:${Math.round(e.clientY)}`;

    const hudSpeed = document.getElementById('hud-speed');
    if (hudSpeed) {
      hudSpeed.innerText = `${this.mouse.speed} px/s`;
      hudSpeed.classList.toggle('alert', this.mouse.speed > 800);
    }
  }

  step() {
    if (!this.running) return;

    if (!this.isOverheated && this.isActive) {
      this.applyMagneticPhysics();
    }

    this.updateHeatSink();
    this.rafId = requestAnimationFrame(this.step.bind(this));
  }

  applyMagneticPhysics() {
    const arenaRect = this.arena.getBoundingClientRect();
    const btnRect = this.btn.getBoundingClientRect();

    // Button center in viewport
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const dx = btnCenterX - this.mouse.lastX;
    const dy = btnCenterY - this.mouse.lastY;
    const dist = Math.hypot(dx, dy);

    // If cursor enters repulsion zone
    if (dist < this.proximityThreshold && dist > 1) {
      const force = this.repulsionConstant / (dist * dist + 100);
      const angle = Math.atan2(dy, dx);

      this.vel.x += Math.cos(angle) * force;
      this.vel.y += Math.sin(angle) * force;

      // Increase thruster heat
      this.thrusterHeat = Math.min(100, this.thrusterHeat + 1.6);
      if (window.soundEngine && Math.random() < 0.12) {
        window.soundEngine.relocate();
      }

      const hudField = document.getElementById('hud-field');
      if (hudField) hudField.innerText = `${Math.min(100, Math.round(force * 10))}%`;
    } else {
      // Natural passive cooling
      this.thrusterHeat = Math.max(0, this.thrusterHeat - 0.25);
    }

    // Apply velocity and friction
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.vel.x *= this.friction;
    this.vel.y *= this.friction;

    // Constrain to arena boundaries with restitution bounce
    const halfW = btnRect.width / 2 + 10;
    const halfH = btnRect.height / 2 + 10;
    const minX = halfW;
    const maxX = arenaRect.width - halfW;
    const minY = halfH;
    const maxY = arenaRect.height - halfH;

    if (this.pos.x < minX) {
      this.pos.x = minX;
      this.vel.x *= -0.5;
    } else if (this.pos.x > maxX) {
      this.pos.x = maxX;
      this.vel.x *= -0.5;
    }

    if (this.pos.y < minY) {
      this.pos.y = minY;
      this.vel.y *= -0.5;
    } else if (this.pos.y > maxY) {
      this.pos.y = maxY;
      this.vel.y *= -0.5;
    }

    // Apply transform relative to arena top-left
    this.btn.style.left = `${this.pos.x}px`;
    this.btn.style.top = `${this.pos.y}px`;
    this.btn.style.transform = 'translate(-50%, -50%)';
  }

  updateHeatSink() {
    const heatFill = document.getElementById('thruster-heat-fill');
    const heatVal = document.getElementById('thruster-heat-val');
    const notice = document.getElementById('thruster-notice');

    if (heatFill) heatFill.style.width = `${this.thrusterHeat}%`;
    if (heatVal) heatVal.innerText = `${Math.round(this.thrusterHeat)}%`;

    if (this.thrusterHeat >= 100 && !this.isOverheated) {
      this.triggerOverheat();
    }
  }

  triggerOverheat() {
    this.isOverheated = true;
    this.btn.classList.add('overheated');
    this.btn.innerText = '⚡ FIELD OVERHEATED (Click to Authorize)';
    if (window.soundEngine) window.soundEngine.rejection();

    const notice = document.getElementById('thruster-notice');
    if (notice) {
      notice.innerHTML = `<span style="color: #ef4444;">⚠️ MAGNETIC REPULSION FIELD DRAINED (100% Heat). Disengaged for 5.0s!</span>`;
    }

    // Cooldown window
    this.overheatCooldownTimer = setTimeout(() => {
      if (!this.isActive) return;
      this.isOverheated = false;
      this.thrusterHeat = 0;
      this.btn.classList.remove('overheated');
      this.btn.innerText = 'Authenticate Identity (Shield Active)';
      if (notice) notice.innerHTML = `Magnetic shield re-charged.`;
    }, 5000);
  }

  triggerSuccess() {
    this.isActive = false;
    this.running = false;
    clearTimeout(this.overheatCooldownTimer);
    if (window.soundEngine) window.soundEngine.success();
    this.btn.innerText = 'Identity Verified & Locked';
    this.btn.style.background = '#10b981';

    setTimeout(() => {
      if (typeof this.onCaptured === 'function') {
        this.onCaptured();
      }
    }, 450);
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('mousemove', this.boundMouseMove);
    clearTimeout(this.overheatCooldownTimer);
  }
}

window.MagneticPhysicsEngine = MagneticPhysicsEngine;
