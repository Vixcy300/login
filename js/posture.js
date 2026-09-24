/**
 * Sentinel Endpoint Device Posture & Motor Calibration
 * Verifies non-synthetic human cursor telemetry with subtle calibration hold.
 */
class DevicePosture {
  constructor(containerEl, onComplete) {
    this.container = containerEl;
    this.onComplete = onComplete;
    this.holdTime = 0;
    this.targetDuration = 2.5; // seconds
    this.holdTimer = null;
    this.isInside = false;

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="posture-wrapper">
        <div class="card-header-badge">CROWDSTRIKE ZERO TRUST ENDPOINT POSTURE</div>
        <h2 class="card-title">Endpoint Motor Telemetry</h2>
        <p class="card-subtitle">
          Organizational security policy requires micro-reflex cursor posture analysis to eliminate automated bot emulation.
        </p>

        <div class="calibration-canvas-zone" id="calib-zone">
          <div class="calibration-target-box" id="target-box">
            <span style="font-size: 11px; font-weight: 600; color: var(--accent-blue);" id="target-label">
              ALIGN
            </span>
          </div>
        </div>

        <div style="width: 100%; max-width: 320px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-tertiary);">
            <span>Telemetry Stabilization</span>
            <span id="calib-pct">0%</span>
          </div>
          <div class="hold-meter-bar">
            <div class="hold-meter-fill" id="calib-fill"></div>
          </div>
        </div>

        <div id="posture-audit-status" class="audit-notice">
          Position pointer inside the 56px target and maintain position for 2.5s
        </div>
      </div>
    `;

    this.initCalibrationListener();
  }

  initCalibrationListener() {
    const target = document.getElementById('target-box');
    const fill = document.getElementById('calib-fill');
    const pctLabel = document.getElementById('calib-pct');
    const status = document.getElementById('posture-audit-status');
    const targetLabel = document.getElementById('target-label');

    const onEnter = () => {
      this.isInside = true;
      target.classList.add('active');
      targetLabel.innerText = 'HOLD';
      targetLabel.style.color = '#10b981';
      if (window.soundEngine) window.soundEngine.click();

      clearInterval(this.holdTimer);
      this.holdTimer = setInterval(() => {
        if (!this.isInside) return;
        this.holdTime += 0.05;

        const progress = Math.min(100, (this.holdTime / this.targetDuration) * 100);
        fill.style.width = `${progress}%`;
        pctLabel.innerText = `${Math.round(progress)}%`;

        if (this.holdTime >= this.targetDuration) {
          clearInterval(this.holdTimer);
          if (window.soundEngine) window.soundEngine.success();
          targetLabel.innerText = 'VALID';
          status.innerHTML = `<span style="color: #10b981;">● Endpoint posture verified. Motor jitter within tolerance.</span>`;
          setTimeout(() => {
            if (typeof this.onComplete === 'function') this.onComplete();
          }, 450);
        }
      }, 50);
    };

    const onLeave = () => {
      this.isInside = false;
      target.classList.remove('active');
      targetLabel.innerText = 'ALIGN';
      targetLabel.style.color = 'var(--accent-blue)';
      clearInterval(this.holdTimer);

      if (this.holdTime > 0 && this.holdTime < this.targetDuration) {
        if (window.soundEngine) window.soundEngine.rejection();
        status.innerText = `Pointer jitter anomaly. Boundary exited after ${this.holdTime.toFixed(1)}s. Resetting.`;
        this.holdTime = 0;
        fill.style.width = '0%';
        pctLabel.innerText = '0%';
      }
    };

    target.addEventListener('mouseenter', onEnter);
    target.addEventListener('mouseleave', onLeave);
  }

  destroy() {
    clearInterval(this.holdTimer);
  }
}

window.DevicePosture = DevicePosture;
