/**
 * Optical Laser Sweep Calibration Controller
 * Enforces precise pointer velocity window (60–160 px/s) across a cryptographic waveform.
 */
class LaserSweepCalibration {
  constructor(containerEl, onComplete) {
    this.container = containerEl;
    this.onComplete = onComplete;
    this.progress = 0;
    this.isDragging = false;
    this.lastX = 0;
    this.lastTime = 0;
    this.currentSpeed = 0;

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="laser-calibration-box">
        <div class="card-protocol-tag">OPTICAL SENSOR WAVEFORM CALIBRATION</div>
        <h2 class="card-heading">Optical Decryption Sweep</h2>
        <p class="card-description">
          Drag the optical laser sensor across the cipher track. Organizational policy mandates a controlled sweep velocity between <strong>60 px/s and 160 px/s</strong> to prevent optical blur.
        </p>

        <!-- Tachometer Readout -->
        <div class="tachometer-display">
          <div>
            <div style="font-size: 10px; color: var(--text-dim); text-transform: uppercase;">Sweep Velocity</div>
            <div class="tacho-val" id="tacho-speed">0 px/s</div>
          </div>
          <div class="tacho-zone" id="tacho-status">STANDBY</div>
        </div>

        <!-- Laser Track -->
        <div class="laser-track" id="laser-track">
          <canvas class="waveform-canvas" id="waveform-canvas"></canvas>
          <div class="laser-slider-thumb" id="laser-thumb">
            <div class="laser-beam-indicator"></div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 11px; color: var(--text-dim);">
          <span>[OPTICAL INPUT 0.0]</span>
          <span id="laser-progress-label">0% DECRYPTED</span>
          <span>[TERMINUS 1.0]</span>
        </div>

        <div id="laser-audit-notice" class="heat-status-notice">
          Click and drag optical head steadily across the waveform
        </div>
      </div>
    `;

    this.drawWaveform();
    this.initSliderDrag();
  }

  drawWaveform() {
    const canvas = document.getElementById('waveform-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = 64;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const midY = 32;
    for (let x = 0; x < canvas.width; x += 4) {
      const y = midY + Math.sin(x * 0.08) * 14 * Math.sin(x * 0.02);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  initSliderDrag() {
    const track = document.getElementById('laser-track');
    const thumb = document.getElementById('laser-thumb');
    const tachoSpeed = document.getElementById('tacho-speed');
    const tachoStatus = document.getElementById('tacho-status');
    const progLabel = document.getElementById('laser-progress-label');
    const notice = document.getElementById('laser-audit-notice');

    const onPointerDown = (e) => {
      this.isDragging = true;
      this.lastX = e.clientX || (e.touches && e.touches[0].clientX);
      this.lastTime = performance.now();
      if (window.soundEngine) window.soundEngine.click();
    };

    const onPointerMove = (e) => {
      if (!this.isDragging) return;

      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const now = performance.now();
      const dt = (now - this.lastTime) / 1000;
      const dx = clientX - this.lastX;

      if (dt > 0.02) {
        this.currentSpeed = Math.round(Math.abs(dx) / dt);
        this.lastX = clientX;
        this.lastTime = now;

        if (tachoSpeed) tachoSpeed.innerText = `${this.currentSpeed} px/s`;

        // Check velocity governor (60 to 160 px/s is optimal)
        if (this.currentSpeed > 165) {
          tachoStatus.className = 'tacho-zone danger';
          tachoStatus.innerText = 'VELOCITY EXCEEDED';
          notice.innerHTML = `<span style="color: #ef4444;">⚠️ OPTICAL BLUR: Sweep velocity ${this.currentSpeed} px/s exceeds 160 px/s threshold! Slow down.</span>`;
          if (window.soundEngine) window.soundEngine.rejection();
          // Slip back
          this.progress = Math.max(0, this.progress - 4);
        } else if (this.currentSpeed >= 50 && this.currentSpeed <= 165) {
          tachoStatus.className = 'tacho-zone';
          tachoStatus.innerText = 'OPTIMAL RATE';
          notice.innerHTML = `<span style="color: #10b981;">● Calibrated optical flux. Maintain current sweep cadence.</span>`;
          if (dx > 0) {
            this.progress += (dx / track.offsetWidth) * 100;
          }
        } else {
          tachoStatus.className = 'tacho-zone';
          tachoStatus.innerText = 'SUB-OPTIMAL';
        }
      }

      this.progress = Math.max(0, Math.min(100, this.progress));
      const maxLeft = track.offsetWidth - thumb.offsetWidth - 8;
      thumb.style.left = `${(this.progress / 100) * maxLeft + 4}px`;

      if (progLabel) progLabel.innerText = `${Math.round(this.progress)}% DECRYPTED`;

      if (this.progress >= 98) {
        this.completeSweep();
      }
    };

    const onPointerUp = () => {
      this.isDragging = false;
      if (tachoStatus) {
        tachoStatus.className = 'tacho-zone';
        tachoStatus.innerText = 'STANDBY';
      }
    };

    thumb.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    thumb.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
  }

  completeSweep() {
    this.isDragging = false;
    if (window.soundEngine) window.soundEngine.success();
    const notice = document.getElementById('laser-audit-notice');
    if (notice) notice.innerHTML = `<span style="color: #10b981;">● Cryptographic waveform decrypted. Optical alignment complete.</span>`;

    setTimeout(() => {
      if (typeof this.onComplete === 'function') {
        this.onComplete();
      }
    }, 450);
  }
}

window.LaserSweepCalibration = LaserSweepCalibration;
