/**
 * Zero Trust Cyber-Physical Gateway Controller
 * Manages stage progression, telemetry flight recorder, and developer override.
 */
class GatewayApp {
  constructor() {
    this.state = {
      currentStep: 1,
      totalSteps: 4,
      startTime: Date.now(),
      mouseDistance: 0,
      peakSpeed: 0,
      logoClicks: 0
    };

    window.vaultState = this.state;
    this.init();
  }

  init() {
    this.initAudioControls();
    this.initBypassShortcuts();
    this.goToStep(1);
  }

  initAudioControls() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isMuted = window.soundEngine.toggleMute();
        audioBtn.innerText = isMuted ? 'Muted' : 'System Audio';
      });
    }
  }

  initBypassShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === '|' || e.key === '\\')) {
        e.preventDefault();
        this.bypassCurrentStep("Administrative Exemption Invoked (Ctrl+Shift+\\)");
      }
    });

    const logo = document.getElementById('brand-logo-mark');
    if (logo) {
      logo.addEventListener('click', () => {
        this.state.logoClicks++;
        if (window.soundEngine) window.soundEngine.click();
        if (this.state.logoClicks >= 5) {
          this.state.logoClicks = 0;
          this.bypassCurrentStep("Executive Protocol Override");
        }
      });
    }
  }

  bypassCurrentStep(reason) {
    if (window.soundEngine) window.soundEngine.success();
    const notice = document.getElementById('hud-status');
    if (notice) notice.innerText = `OVERRIDE: ${reason}`;
    this.goToStep(this.state.currentStep + 1);
  }

  goToStep(stepNumber) {
    this.state.currentStep = stepNumber;
    this.updateFlowTracker();

    const mainContainer = document.getElementById('step-content-area');
    mainContainer.innerHTML = '';

    if (stepNumber === 1) {
      this.initStep1(mainContainer);
    } else if (stepNumber === 2) {
      new window.LaserSweepCalibration(mainContainer, () => this.goToStep(3));
    } else if (stepNumber === 3) {
      new window.QuantumMatrixCircuit(mainContainer, () => this.goToStep(4));
    } else if (stepNumber === 4) {
      new window.ExecutiveCommandCenter(mainContainer);
    }
  }

  updateFlowTracker() {
    for (let i = 1; i <= this.state.totalSteps; i++) {
      const stepEl = document.getElementById(`flow-step-${i}`);
      if (stepEl) {
        stepEl.classList.remove('active', 'done');
        if (i === this.state.currentStep) {
          stepEl.classList.add('active');
        } else if (i < this.state.currentStep) {
          stepEl.classList.add('done');
        }
      }
    }
  }

  initStep1(container) {
    container.innerHTML = `
      <div>
        <div class="card-protocol-tag">AZURE AD ZERO TRUST SSO • FIPS 140-3 LEVEL 4</div>
        <h2 class="card-heading">Enterprise SSO Identity</h2>
        <p class="card-description">
          Cryptographically authenticated identity clearance. Enter corporate credentials to engage the magnetic authentication target.
        </p>

        <div class="input-block">
          <label class="input-label-bar" for="work-email">
            <span>Corporate SSO Email</span>
          </label>
          <input type="email" id="work-email" class="cyber-input" value="alex.mercer@enterprise-global.com" autocomplete="off" />
        </div>

        <div class="input-block">
          <div class="input-label-bar">
            <span>Enterprise Password</span>
            <button type="button" class="btn-text" id="auto-fill-btn" style="color: var(--accent-cyan);">Auto-generate Compliant Token</button>
          </div>
          <input type="password" id="work-password" class="cyber-input" placeholder="Enter corporate password..." autocomplete="off" />

          <!-- SHA-256 Live Hash Visualizer -->
          <div class="hash-preview-box">
            <span class="hash-label">SHA-256</span>
            <span class="hash-string" id="live-hash-display">Calculating...</span>
          </div>
        </div>

        <!-- FIPS Password Compliance Checklist -->
        <div id="pw-checklist-box" style="margin: 14px 0;"></div>

        <!-- Thruster Heat-Sink Meter -->
        <div class="heat-sink-container">
          <div class="heat-sink-header">
            <span>Anti-Automation Thruster Core Temp</span>
            <span id="thruster-heat-val">0%</span>
          </div>
          <div class="heat-sink-track">
            <div class="heat-sink-fill" id="thruster-heat-fill"></div>
          </div>
        </div>

        <!-- 60fps Magnetic Repulsion Arena -->
        <div class="magnetic-arena" id="magnetic-arena">
          <button type="button" class="cyber-btn magnetic-btn" id="magnetic-submit-btn" disabled>
            🔒 Complete FIPS Checklist to Engage
          </button>
        </div>

        <div id="thruster-notice" class="heat-status-notice">
          Hover cursor near button to test magnetic field deflection
        </div>

        <div class="telemetry-strip">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="pulse-indicator"></span>
            <span>VECTOR DRIFT TELEMETRY ACTIVE</span>
          </div>
          <span>60 FPS KINETIC ENGINE</span>
        </div>
      </div>
    `;

    const pwInput = document.getElementById('work-password');
    const checklistBox = document.getElementById('pw-checklist-box');
    const hashDisplay = document.getElementById('live-hash-display');
    const submitBtn = document.getElementById('magnetic-submit-btn');
    const arena = document.getElementById('magnetic-arena');
    const autoFillBtn = document.getElementById('auto-fill-btn');

    let physicsInstance = null;

    const validator = new window.PasswordCompliance(pwInput, checklistBox, hashDisplay, (isCompliant) => {
      if (isCompliant) {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Authenticate Identity (Shield Active)';

        if (!physicsInstance) {
          physicsInstance = new window.MagneticPhysicsEngine(submitBtn, arena, () => {
            this.goToStep(2);
          });
        }
      } else {
        submitBtn.disabled = true;
        submitBtn.innerText = '🔒 Complete FIPS Checklist to Engage';
      }
    });

    autoFillBtn.addEventListener('click', () => {
      pwInput.value = validator.suggestCompliantPassword();
      validator.validate();
      validator.updateLiveHash();
      if (window.soundEngine) window.soundEngine.click();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.gatewayApp = new GatewayApp();
});
