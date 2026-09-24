/**
 * Enterprise MFA & FIDO2 Hardware Token Verification
 * Clean Okta/Microsoft Authenticator aesthetic with rapid 8-second rotation cycle.
 */
class EnterpriseMFA {
  constructor(containerEl, onComplete) {
    this.container = containerEl;
    this.onComplete = onComplete;
    this.activeCode = this.generateTOTP();
    this.cycleSeconds = 8;
    this.timeLeft = this.cycleSeconds;
    this.timer = null;
    this.digitsEntered = [];
    this.fidoHoldTimer = null;
    this.fidoHoldElapsed = 0;

    this.render();
  }

  generateTOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  render() {
    this.container.innerHTML = `
      <div class="totp-container">
        <div class="card-header-badge">FIPS 140-3 LEVEL 4 MULTI-FACTOR AUTHENTICATION</div>
        <h2 class="card-title">Verify Device Identity</h2>
        <p class="card-subtitle">
          An ephemeral 6-digit cryptographic token has been synchronized with your registered corporate endpoint.
        </p>

        <!-- Method A: Rapid TOTP -->
        <div class="auth-method-card">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase;">
              Active Endpoint Token (Auto-cycling)
            </span>
            <span style="font-size: 11px; font-family: var(--font-mono); color: var(--accent-amber);" id="totp-countdown-text">
              Cycles in 8s
            </span>
          </div>

          <div style="font-size: 26px; font-weight: 700; font-family: var(--font-mono); letter-spacing: 6px; text-align: center; margin: 12px 0; color: var(--text-primary);" id="totp-token-display">
            ${this.activeCode}
          </div>

          <div class="rotation-timer-bar">
            <div class="rotation-timer-fill" id="totp-timer-fill"></div>
          </div>

          <!-- Input Slots -->
          <div class="totp-input-row" id="totp-slots-row">
            <div class="totp-digit-box" id="digit-0"></div>
            <div class="totp-digit-box" id="digit-1"></div>
            <div class="totp-digit-box" id="digit-2"></div>
            <div class="totp-digit-box" id="digit-3"></div>
            <div class="totp-digit-box" id="digit-4"></div>
            <div class="totp-digit-box" id="digit-5"></div>
          </div>

          <div style="text-align: center; margin-top: 10px;">
            <input type="text" id="hidden-totp-input" maxlength="6" inputmode="numeric" style="opacity: 0; position: absolute; pointer-events: none;" autofocus />
            <button type="button" class="btn-secondary" id="focus-totp-btn" style="width: 100%;">
              Click to Type Passcode
            </button>
          </div>
        </div>

        <!-- Method B: FIDO2 Hardware Key -->
        <div class="auth-method-card" style="text-align: center;">
          <div style="font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 12px;">
            Alternative: FIDO2 / WebAuthn Hardware Sensor
          </div>

          <div class="fido-sensor-area">
            <div class="fido-touch-pad" id="fido-pad">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-blue);">
                <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
              </svg>
            </div>
            <span style="font-size: 11px; color: var(--text-tertiary);" id="fido-instruction">
              Press and hold security key for 3.0 seconds
            </span>
          </div>
        </div>

        <div id="mfa-audit-status" class="audit-notice"></div>
      </div>
    `;

    this.startCycleTimer();
    this.initInputHandler();
    this.initFidoHandler();
  }

  startCycleTimer() {
    clearInterval(this.timer);
    this.timeLeft = this.cycleSeconds;
    const fill = document.getElementById('totp-timer-fill');
    const label = document.getElementById('totp-countdown-text');

    this.timer = setInterval(() => {
      this.timeLeft -= 0.1;
      const pct = Math.max(0, (this.timeLeft / this.cycleSeconds) * 100);
      if (fill) fill.style.width = `${pct}%`;
      if (label) label.innerText = `Cycles in ${Math.ceil(this.timeLeft)}s`;

      if (this.timeLeft <= 0) {
        this.activeCode = this.generateTOTP();
        const display = document.getElementById('totp-token-display');
        if (display) display.innerText = this.activeCode;
        this.timeLeft = this.cycleSeconds;

        const status = document.getElementById('mfa-audit-status');
        if (status) {
          status.innerText = 'Token expired. Cryptographic rotation completed.';
        }
      }
    }, 100);
  }

  initInputHandler() {
    const input = document.getElementById('hidden-totp-input');
    const focusBtn = document.getElementById('focus-totp-btn');

    focusBtn.addEventListener('click', () => {
      input.focus();
      focusBtn.innerText = 'Listening for input...';
    });

    input.addEventListener('input', (e) => {
      const val = e.target.value.replace(/\D/g, '');
      e.target.value = val;
      this.digitsEntered = val.split('');

      for (let i = 0; i < 6; i++) {
        const slot = document.getElementById(`digit-${i}`);
        if (slot) {
          slot.innerText = this.digitsEntered[i] || '';
          slot.classList.toggle('active', i === this.digitsEntered.length);
        }
      }

      if (this.digitsEntered.length === 6) {
        this.verifyCode(val);
      }
    });
  }

  verifyCode(entered) {
    const status = document.getElementById('mfa-audit-status');
    if (entered === this.activeCode) {
      clearInterval(this.timer);
      if (window.soundEngine) window.soundEngine.success();
      status.innerHTML = `<span style="color: #10b981;">● Token valid. Identity cryptographically verified.</span>`;
      setTimeout(() => {
        if (typeof this.onComplete === 'function') this.onComplete();
      }, 500);
    } else {
      if (window.soundEngine) window.soundEngine.rejection();
      status.innerHTML = `<span style="color: #ef4444;">● Passcode mismatch. Please enter current active token.</span>`;
      const input = document.getElementById('hidden-totp-input');
      if (input) input.value = '';
      this.digitsEntered = [];
      for (let i = 0; i < 6; i++) {
        const slot = document.getElementById(`digit-${i}`);
        if (slot) slot.innerText = '';
      }
    }
  }

  initFidoHandler() {
    const pad = document.getElementById('fido-pad');
    const label = document.getElementById('fido-instruction');

    const startHold = () => {
      pad.classList.add('holding');
      this.fidoHoldElapsed = 0;
      if (window.soundEngine) window.soundEngine.click();

      this.fidoHoldTimer = setInterval(() => {
        this.fidoHoldElapsed += 0.1;
        const remaining = Math.max(0, 3.0 - this.fidoHoldElapsed).toFixed(1);
        label.innerText = `Authorizing hardware key... Hold for ${remaining}s`;

        if (this.fidoHoldElapsed >= 3.0) {
          clearInterval(this.fidoHoldTimer);
          clearInterval(this.timer);
          pad.classList.remove('holding');
          if (window.soundEngine) window.soundEngine.success();
          label.innerHTML = `<span style="color: #10b981;">● Hardware Token FIDO2 Authorized</span>`;
          setTimeout(() => {
            if (typeof this.onComplete === 'function') this.onComplete();
          }, 500);
        }
      }, 100);
    };

    const stopHold = () => {
      pad.classList.remove('holding');
      if (this.fidoHoldTimer && this.fidoHoldElapsed < 3.0) {
        clearInterval(this.fidoHoldTimer);
        if (window.soundEngine) window.soundEngine.rejection();
        label.innerText = `Token release premature. Hold for full 3.0 seconds.`;
      }
    };

    pad.addEventListener('mousedown', startHold);
    window.addEventListener('mouseup', stopHold);
    pad.addEventListener('touchstart', startHold, { passive: true });
    window.addEventListener('touchend', stopHold);
  }

  destroy() {
    clearInterval(this.timer);
    clearInterval(this.fidoHoldTimer);
  }
}

window.EnterpriseMFA = EnterpriseMFA;
