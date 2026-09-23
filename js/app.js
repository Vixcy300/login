/**
 * VaultCorp Main Application Controller
 * Manages global telemetry, step transitions, rage meter, and Easter eggs.
 */
class VaultApp {
  constructor() {
    this.state = {
      currentStep: 1,
      totalSteps: 5,
      startTime: Date.now(),
      dodgeCount: 0,
      missedClicks: 0,
      mouseDistance: 0,
      rageLevel: 10,
      shieldClicks: 0
    };

    window.vaultState = this.state;
    this.lastMousePos = null;

    this.init();
  }

  init() {
    this.initMouseTelemetry();
    this.initAudioControls();
    this.initCheatShortcuts();
    this.initStep1();
  }

  initMouseTelemetry() {
    window.addEventListener('mousemove', (e) => {
      if (this.lastMousePos) {
        const dist = Math.hypot(e.clientX - this.lastMousePos.x, e.clientY - this.lastMousePos.y);
        this.state.mouseDistance += dist;
      }
      this.lastMousePos = { x: e.clientX, y: e.clientY };
    });

    this.state.addRage = (amount) => {
      this.state.rageLevel = Math.min(100, this.state.rageLevel + amount);
      this.updateRageDisplay();
    };

    this.updateRageDisplay();
  }

  updateRageDisplay() {
    const bar = document.getElementById('rage-progress-bar');
    const label = document.getElementById('rage-score-label');
    if (bar && label) {
      bar.style.width = `${this.state.rageLevel}%`;
      label.innerText = `${Math.round(this.state.rageLevel)}%`;

      if (this.state.rageLevel > 75) {
        bar.style.background = 'linear-gradient(90deg, #f59e0b, #ef4444)';
      } else if (this.state.rageLevel > 40) {
        bar.style.background = 'linear-gradient(90deg, #38bdf8, #f59e0b)';
      } else {
        bar.style.background = 'linear-gradient(90deg, #10b981, #38bdf8)';
      }
    }
  }

  initAudioControls() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isMuted = window.soundEngine.toggleMute();
        audioBtn.innerHTML = isMuted ? '🔇 Audio Muted' : '🔊 Audio ON';
        audioBtn.classList.toggle('muted', isMuted);
      });
    }
  }

  initCheatShortcuts() {
    // Secret shortcut: Ctrl + Shift + \
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === '|' || e.key === '\\')) {
        e.preventDefault();
        this.bypassCurrentStep("Developer Override Activated (Ctrl+Shift+\\)");
      }
    });

    // Secret shortcut: Click shield 5 times
    const shield = document.getElementById('vault-shield-icon');
    if (shield) {
      shield.addEventListener('click', () => {
        this.state.shieldClicks++;
        if (window.soundEngine) window.soundEngine.click();
        if (this.state.shieldClicks >= 5) {
          this.state.shieldClicks = 0;
          this.bypassCurrentStep("Executive Shield Override Activated");
        }
      });
    }
  }

  bypassCurrentStep(reason) {
    if (window.soundEngine) window.soundEngine.success();
    const banner = document.getElementById('global-alert');
    if (banner) {
      banner.innerText = `⚡ ${reason}`;
      banner.style.display = 'block';
      setTimeout(() => banner.style.display = 'none', 3000);
    }
    this.goToStep(this.state.currentStep + 1);
  }

  goToStep(stepNumber) {
    this.state.currentStep = stepNumber;
    this.updateStepIndicator();

    const mainContainer = document.getElementById('step-content-area');
    mainContainer.innerHTML = '';

    if (stepNumber === 1) {
      this.initStep1();
    } else if (stepNumber === 2) {
      new window.QuantumCaptcha(mainContainer, () => this.goToStep(3));
    } else if (stepNumber === 3) {
      new window.RotaryMFA(mainContainer, () => this.goToStep(4));
    } else if (stepNumber === 4) {
      new window.TremorCalibration(mainContainer, () => this.goToStep(5));
    } else if (stepNumber === 5) {
      new window.FinalAuthorizationAndDashboard(mainContainer, () => {});
    }
  }

  updateStepIndicator() {
    for (let i = 1; i <= this.state.totalSteps; i++) {
      const stepItem = document.getElementById(`step-pill-${i}`);
      if (stepItem) {
        stepItem.classList.remove('active', 'completed');
        if (i === this.state.currentStep) {
          stepItem.classList.add('active');
        } else if (i < this.state.currentStep) {
          stepItem.classList.add('completed');
        }
      }
    }
  }

  initStep1() {
    const container = document.getElementById('step-content-area');
    container.innerHTML = `
      <div class="credentials-card">
        <div class="step-badge">STAGE 1: CREDENTIALS & FLEEING AUTHENTICATOR</div>
        
        <div class="form-group">
          <label class="form-label" for="username-input">
            Quantum Corporate ID:
          </label>
          <input type="text" id="username-input" class="vault-input" placeholder="e.g. employee.4092@vaultcorp.com" value="user@vaultcorp.com" autocomplete="off" />
        </div>

        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <label class="form-label" for="password-input">
              Dynamic Fort Knox Password:
            </label>
            <button type="button" class="btn-link" id="pw-hint-btn">💡 Hint Password</button>
          </div>
          <input type="text" id="password-input" class="vault-input" placeholder="Enter password to reveal security rules..." autocomplete="off" />
        </div>

        <!-- The Password Game Rules List -->
        <div class="rules-container" id="password-rules-box"></div>

        <div id="runaway-status" class="runaway-status-text"></div>

        <!-- The Runaway Arena for the Button -->
        <div class="runaway-arena" id="runaway-arena">
          <button type="button" class="btn btn-primary runaway-btn" id="runaway-login-btn" disabled>
            🔒 Unlock Quantum Session
          </button>
        </div>

        <div class="credentials-footer">
          <span>Missed/Whiffed Clicks: <strong id="missed-clicks-counter">0</strong></span>
          <span style="color:#64748b;">(Pro-tip: Button tires after 7 dodges)</span>
        </div>
      </div>
    `;

    const pwInput = document.getElementById('password-input');
    const rulesBox = document.getElementById('password-rules-box');
    const runawayBtn = document.getElementById('runaway-login-btn');
    const arena = document.getElementById('runaway-arena');
    const hintBtn = document.getElementById('pw-hint-btn');

    let runawayInstance = null;

    const validator = new window.PasswordValidator(pwInput, rulesBox, (isAllPassed) => {
      if (isAllPassed) {
        runawayBtn.disabled = false;
        runawayBtn.innerText = '🏃 Log In (Catch Me If You Can!)';
        runawayBtn.classList.add('ready-to-chase');

        if (!runawayInstance) {
          runawayInstance = new window.RunawayButton(runawayBtn, arena, () => {
            this.goToStep(2);
          });
        }
      } else {
        runawayBtn.disabled = true;
        runawayBtn.innerText = '🔒 Complete All Password Rules to Activate';
        runawayBtn.classList.remove('ready-to-chase');
      }
    });

    hintBtn.addEventListener('click', () => {
      const suggested = validator.suggestCompliantPassword();
      pwInput.value = suggested;
      validator.validate();
      if (window.soundEngine) window.soundEngine.click();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.vaultApp = new VaultApp();
});

