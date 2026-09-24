/**
 * Enterprise Application Controller
 * Manages Zero Trust authentication flow, security telemetry, and pipeline progression.
 */
class EnterpriseApp {
  constructor() {
    this.state = {
      currentStep: 1,
      totalSteps: 5,
      startTime: Date.now(),
      dodgeCount: 0,
      missedClicks: 0,
      mouseDistance: 0,
      logoClicks: 0
    };

    window.vaultState = this.state;
    this.lastMousePos = null;

    this.init();
  }

  init() {
    this.initMouseTelemetry();
    this.initAudioControls();
    this.initBypassShortcuts();
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
  }

  initAudioControls() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isMuted = window.soundEngine.toggleMute();
        audioBtn.innerHTML = isMuted ? 'Muted' : 'System Audio';
      });
    }
  }

  initBypassShortcuts() {
    // Secret developer shortcut: Ctrl + Shift + \
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === '|' || e.key === '\\')) {
        e.preventDefault();
        this.bypassCurrentStep("Administrative Policy Exemption Invoked");
      }
    });

    // Secret shortcut: Click brand logo mark 5 times
    const logo = document.getElementById('brand-logo-mark');
    if (logo) {
      logo.addEventListener('click', () => {
        this.state.logoClicks++;
        if (window.soundEngine) window.soundEngine.click();
        if (this.state.logoClicks >= 5) {
          this.state.logoClicks = 0;
          this.bypassCurrentStep("Executive Credential Override Activated");
        }
      });
    }
  }

  bypassCurrentStep(reason) {
    if (window.soundEngine) window.soundEngine.success();
    const banner = document.getElementById('security-alert-banner');
    if (banner) {
      banner.innerText = `[AUDIT OVERRIDE] ${reason}`;
      banner.style.display = 'block';
      setTimeout(() => banner.style.display = 'none', 3000);
    }
    this.goToStep(this.state.currentStep + 1);
  }

  goToStep(stepNumber) {
    this.state.currentStep = stepNumber;
    this.updatePipelineIndicator();

    const mainContainer = document.getElementById('step-content-area');
    mainContainer.innerHTML = '';

    if (stepNumber === 1) {
      this.initStep1();
    } else if (stepNumber === 2) {
      new window.EnterpriseMFA(mainContainer, () => this.goToStep(3));
    } else if (stepNumber === 3) {
      new window.DevicePosture(mainContainer, () => this.goToStep(4));
    } else if (stepNumber === 4) {
      new window.GovernanceAttestation(mainContainer, () => this.goToStep(5));
    } else if (stepNumber === 5) {
      new window.EnterpriseConsole(mainContainer);
    }
  }

  updatePipelineIndicator() {
    for (let i = 1; i <= this.state.totalSteps; i++) {
      const stepEl = document.getElementById(`pipe-step-${i}`);
      if (stepEl) {
        stepEl.classList.remove('active', 'completed');
        if (i === this.state.currentStep) {
          stepEl.classList.add('active');
        } else if (i < this.state.currentStep) {
          stepEl.classList.add('completed');
        }
      }
    }
  }

  initStep1() {
    const container = document.getElementById('step-content-area');
    container.innerHTML = `
      <div>
        <div class="card-header-badge">GLOBAL ENTERPRISE SSO • AZURE AD FEDERATED</div>
        <h2 class="card-title">Sign in to Enterprise Account</h2>
        <p class="card-subtitle">
          Enter your managed enterprise identity credentials to request session clearance.
        </p>

        <div class="field-group">
          <label class="field-label" for="work-email">Work Email</label>
          <input type="email" id="work-email" class="enterprise-input" value="alex.mercer@enterprise-global.com" autocomplete="off" />
        </div>

        <div class="field-group">
          <div class="field-label-row">
            <label class="field-label" for="work-password">Enterprise Password</label>
            <button type="button" class="btn-text" id="auto-fill-pw-btn">Auto-generate compliant password</button>
          </div>
          <input type="password" id="work-password" class="enterprise-input" placeholder="Enter corporate password..." autocomplete="off" />
        </div>

        <!-- FIPS Password Compliance Checklist -->
        <div class="compliance-checklist" id="pw-checklist"></div>

        <!-- Anti-Automation Target Relocation Arena -->
        <div class="anti-bot-container" id="anti-bot-arena">
          <button type="button" class="btn-primary anti-bot-btn" id="sso-submit-btn" disabled>
            Authenticate SSO Identity
          </button>
        </div>

        <div id="audit-notice-text" class="audit-notice"></div>

        <div class="telemetry-status-box">
          <div class="status-dot"></div>
          <span>SOC 2 Type II Encrypted Gateway • Session Telemetry Enabled</span>
        </div>
      </div>
    `;

    const pwInput = document.getElementById('work-password');
    const checklistBox = document.getElementById('pw-checklist');
    const submitBtn = document.getElementById('sso-submit-btn');
    const arena = document.getElementById('anti-bot-arena');
    const autoFillBtn = document.getElementById('auto-fill-pw-btn');

    let buttonController = null;

    const validator = new window.PasswordCompliance(pwInput, checklistBox, (isCompliant) => {
      if (isCompliant) {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Authenticate Identity (Verify Cadence)';

        if (!buttonController) {
          buttonController = new window.AntiAutomationButton(submitBtn, arena, () => {
            this.goToStep(2);
          });
        }
      } else {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Authenticate SSO Identity';
      }
    });

    autoFillBtn.addEventListener('click', () => {
      pwInput.value = validator.suggestCompliantPassword();
      validator.validate();
      if (window.soundEngine) window.soundEngine.click();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.enterpriseApp = new EnterpriseApp();
});
