/**
 * VaultCorp Biometric Tremor & Emotional Calibration Module
 * Detects user frustration and requires tracing a calm steady circle.
 */
class TremorCalibration {
  constructor(containerEl, onComplete) {
    this.container = containerEl;
    this.onComplete = onComplete;
    this.progress = 0;
    this.isTracing = false;
    this.hasFailed = false;

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="tremor-box">
        <div class="tremor-badge">BIOMETRIC STRESS & AGITATION CALIBRATION</div>

        <div class="stress-warning">
          <div class="stress-icon">🧘‍♂️⚡</div>
          <div class="stress-text">
            <strong>ELEVATED FRUSTRATION DETECTED</strong><br>
            <small style="color: #94a3b8;">Corporate policy requires employees to maintain complete emotional zen before accessing databases.</small>
          </div>
        </div>

        <div class="zen-prompt" id="zen-prompt">
          <div class="breathing-circle" id="breathing-circle">
            <span id="breathing-text">Inhale...</span>
          </div>
          <div class="breathing-sub">Take a deep breath and center your chi.</div>
        </div>

        <div class="canvas-track-container" id="track-section" style="display: none;">
          <p class="track-instructions">
            Trace the circular track starting from <strong style="color:#10b981;">● GREEN START</strong> around clockwise to <strong style="color:#38bdf8;">★ FINISH</strong> without touching the electric fences.
          </p>

          <canvas id="tremor-canvas" width="360" height="360"></canvas>
          <div class="track-status" id="track-status">Hold cursor inside the track and trace clockwise</div>
        </div>

        <div class="tremor-feedback" id="tremor-feedback"></div>
      </div>
    `;

    this.startBreathingPhase();
  }

  startBreathingPhase() {
    const text = document.getElementById('breathing-text');
    const circle = document.getElementById('breathing-circle');

    let stage = 0;
    const stages = [
      { t: 'Inhale... 🌬️', scale: '1.25' },
      { t: 'Hold... 🧘', scale: '1.25' },
      { t: 'Exhale rage... 💨', scale: '0.9' },
      { t: 'Zen Achieved ✨', scale: '1.0' }
    ];

    const cycle = () => {
      if (stage < stages.length) {
        text.innerText = stages[stage].t;
        circle.style.transform = `scale(${stages[stage].scale})`;
        stage++;
        setTimeout(cycle, 1100);
      } else {
        // Transition to tracing track
        document.getElementById('zen-prompt').style.display = 'none';
        const trackSec = document.getElementById('track-section');
        trackSec.style.display = 'block';
        this.initCanvasTrack();
      }
    };

    setTimeout(cycle, 600);
  }

  initCanvasTrack() {
    const canvas = document.getElementById('tremor-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const status = document.getElementById('track-status');
    const feedback = document.getElementById('tremor-feedback');

    const centerX = 180;
    const centerY = 180;
    const innerRadius = 90;
    const outerRadius = 145;
    const midRadius = (innerRadius + outerRadius) / 2;

    let currentAngle = -Math.PI / 2; // Start at top (12 o'clock)
    let completedAngle = 0;
    let started = false;

    const draw = (cursorX, cursorY, touching) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw outer boundary
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 4;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw inner boundary
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 4;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Fill valid track zone
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, innerRadius, Math.PI * 2, 0, true);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.fill();

      // Draw progress arc
      if (completedAngle > 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, midRadius, -Math.PI / 2, -Math.PI / 2 + completedAngle);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Draw Start Point (top, 12 o'clock)
      ctx.beginPath();
      ctx.arc(centerX, centerY - midRadius, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('START', centerX, centerY - midRadius - 16);

      // Draw Finish Point (just counter-clockwise of start)
      ctx.beginPath();
      ctx.arc(centerX - 18, centerY - midRadius, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.fillText('★', centerX - 18, centerY - midRadius + 4);

      // Draw cursor feedback if tracking
      if (cursorX !== undefined && cursorY !== undefined) {
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, 6, 0, Math.PI * 2);
        ctx.fillStyle = touching ? '#10b981' : '#f59e0b';
        ctx.fill();
      }
    };

    draw();

    const handlePointer = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dist = Math.hypot(x - centerX, y - centerY);
      const isInsideTrack = dist >= innerRadius && dist <= outerRadius;

      // Calculate angle from center (-PI to +PI, with 12 o'clock as -PI/2)
      let angle = Math.atan2(y - centerY, x - centerX);
      let normalizedAngle = angle + Math.PI / 2;
      if (normalizedAngle < 0) normalizedAngle += Math.PI * 2;

      // Start check
      if (!started && isInsideTrack && normalizedAngle < 0.35) {
        started = true;
        status.innerHTML = `<span style="color:#10b981;">Tracking cursor... follow the circle clockwise!</span>`;
      }

      if (started) {
        if (!isInsideTrack) {
          // Off track! Shock!
          if (window.soundEngine) window.soundEngine.buzz();
          if (window.vaultState) window.vaultState.addRage(10);
          status.innerHTML = `<span style="color:#ef4444;">⚡ BZZZT! Touched boundary fence! Restarting circle...</span>`;
          started = false;
          completedAngle = 0;
          draw(x, y, false);
          return;
        }

        // Progress clockwise
        if (normalizedAngle > completedAngle && normalizedAngle - completedAngle < 0.6) {
          completedAngle = normalizedAngle;
          if (window.soundEngine && Math.random() < 0.15) window.soundEngine.click();
        }

        // Check if full circle completed (> 92% of 2*PI)
        if (completedAngle >= Math.PI * 1.9) {
          started = false;
          completedAngle = Math.PI * 2;
          draw(x, y, true);
          if (window.soundEngine) window.soundEngine.success();
          status.innerHTML = `<span style="color:#10b981; font-weight:bold;">✅ Tremor test passed! Emotional frequency: 100% Peaceful.</span>`;

          setTimeout(() => {
            if (typeof this.onComplete === 'function') {
              this.onComplete();
            }
          }, 700);
          return;
        }

        draw(x, y, true);
      } else {
        draw(x, y, isInsideTrack);
      }
    };

    canvas.addEventListener('mousemove', handlePointer);
  }
}

window.TremorCalibration = TremorCalibration;

