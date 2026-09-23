/**
 * VaultCorp 2FA Rotary Safe Dial Module
 * Simulates ultra-secure MFA where keyboard is disabled and code must be entered via an authentic rotary dial.
 */
class RotaryMFA {
  constructor(containerEl, onComplete) {
    this.container = containerEl;
    this.onComplete = onComplete;
    this.targetCode = this.generateCode();
    this.enteredCode = [];
    this.timeLeft = 25;
    this.timer = null;

    this.render();
  }

  generateCode() {
    // 4 digits (e.g., '7241')
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  render() {
    this.container.innerHTML = `
      <div class="rotary-box">
        <div class="mfa-badge">TACTICAL MULTI-FACTOR AUTHENTICATION</div>

        <div class="device-alert">
          <div class="device-icon">🧊📱</div>
          <div class="device-info">
            <div class="device-title">One-Time Security Passcode Dispatched!</div>
            <div class="device-subtitle">Sent to: <strong>Samsung Family Hub Smart Refrigerator RF28 (Crisper Drawer 2)</strong></div>
          </div>
        </div>

        <div class="code-display-banner">
          <div class="code-label">INCOMING CODE FROM REFRIGERATOR:</div>
          <div class="code-digits" id="target-code-display">${this.targetCode}</div>
          <div class="code-timer" id="code-timer-display">⏱️ Code expires in: <span id="timer-sec">25</span>s</div>
        </div>

        <div class="input-instruction">
          ⚠️ <strong>HARDWARE KEYBOARD INPUT REJECTED (High Threat Level)</strong><br>
          <small>Rotate the mechanical vault dial below to input each digit.</small>
        </div>

        <!-- The Dialed Code Slots -->
        <div class="dialed-slots-container">
          <div class="digit-slot" id="slot-0">-</div>
          <div class="digit-slot" id="slot-1">-</div>
          <div class="digit-slot" id="slot-2">-</div>
          <div class="digit-slot" id="slot-3">-</div>
        </div>

        <!-- Interactive Rotary Dial -->
        <div class="rotary-wrapper">
          <div class="rotary-dial" id="rotary-wheel">
            <!-- 10 dial holes (0 to 9) -->
            <div class="dial-hole" data-digit="1" style="transform: rotate(30deg) translate(0, -95px) rotate(-30deg);">1</div>
            <div class="dial-hole" data-digit="2" style="transform: rotate(60deg) translate(0, -95px) rotate(-60deg);">2</div>
            <div class="dial-hole" data-digit="3" style="transform: rotate(90deg) translate(0, -95px) rotate(-90deg);">3</div>
            <div class="dial-hole" data-digit="4" style="transform: rotate(120deg) translate(0, -95px) rotate(-120deg);">4</div>
            <div class="dial-hole" data-digit="5" style="transform: rotate(150deg) translate(0, -95px) rotate(-150deg);">5</div>
            <div class="dial-hole" data-digit="6" style="transform: rotate(180deg) translate(0, -95px) rotate(-180deg);">6</div>
            <div class="dial-hole" data-digit="7" style="transform: rotate(210deg) translate(0, -95px) rotate(-210deg);">7</div>
            <div class="dial-hole" data-digit="8" style="transform: rotate(240deg) translate(0, -95px) rotate(-240deg);">8</div>
            <div class="dial-hole" data-digit="9" style="transform: rotate(270deg) translate(0, -95px) rotate(-270deg);">9</div>
            <div class="dial-hole" data-digit="0" style="transform: rotate(300deg) translate(0, -95px) rotate(-300deg);">0</div>
            <div class="rotary-center">
              <span>VAULT 2FA</span>
            </div>
          </div>
          <!-- Metal stop finger at bottom right (~330 deg) -->
          <div class="rotary-finger-stop">🛑</div>
        </div>

        <div class="rotary-actions">
          <button type="button" class="btn btn-secondary" id="rotary-clear-btn">Clear Dial</button>
          <button type="button" class="btn btn-secondary" id="rotary-resend-btn">Re-send to Microwave</button>
        </div>

        <div class="rotary-feedback" id="rotary-feedback"></div>
      </div>
    `;

    this.startTimer();
    this.initRotaryWheel();

    document.getElementById('rotary-clear-btn').addEventListener('click', () => {
      this.clearDigits();
    });

    document.getElementById('rotary-resend-btn').addEventListener('click', () => {
      this.resendCode();
    });
  }

  startTimer() {
    clearInterval(this.timer);
    this.timeLeft = 25;
    const secEl = document.getElementById('timer-sec');

    this.timer = setInterval(() => {
      this.timeLeft--;
      if (secEl) secEl.innerText = `${this.timeLeft}`;

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        const feedback = document.getElementById('rotary-feedback');
        if (feedback) {
          feedback.innerHTML = `<span style="color:#ef4444;">⏱️ CODE EXPIRED! Refrigerator connection timed out. New code issued!</span>`;
        }
        if (window.soundEngine) window.soundEngine.buzz();
        this.resendCode();
      }
    }, 1000);
  }

  resendCode() {
    this.targetCode = this.generateCode();
    const display = document.getElementById('target-code-display');
    if (display) {
      display.innerText = this.targetCode;
      display.classList.add('flash-code');
      setTimeout(() => display.classList.remove('flash-code'), 600);
    }
    this.clearDigits();
    this.startTimer();
    if (window.soundEngine) window.soundEngine.click();
  }

  initRotaryWheel() {
    const wheel = document.getElementById('rotary-wheel');
    const holes = wheel.querySelectorAll('.dial-hole');

    holes.forEach((hole) => {
      hole.addEventListener('click', () => {
        const digit = hole.dataset.digit;
        this.dialDigit(digit, hole);
      });
    });
  }

  dialDigit(digit, holeEl) {
    if (this.enteredCode.length >= 4) return;

    // Animate wheel spinning clockwise then springing back
    const wheel = document.getElementById('rotary-wheel');
    const digitNum = parseInt(digit, 10);
    // Angular rotation proportional to digit
    const rotDeg = 60 + (digitNum === 0 ? 10 : digitNum) * 26;

    if (window.soundEngine) {
      window.soundEngine.ratchet();
      setTimeout(() => window.soundEngine.ratchet(), 150);
      setTimeout(() => window.soundEngine.ratchet(), 300);
    }

    wheel.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.4, 1)';
    wheel.style.transform = `rotate(${rotDeg}deg)`;

    setTimeout(() => {
      // Spring back
      wheel.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
      wheel.style.transform = 'rotate(0deg)';

      // Register digit
      this.enteredCode.push(digit);
      this.updateSlots();

      if (this.enteredCode.length === 4) {
        this.checkCode();
      }
    }, 350);
  }

  updateSlots() {
    for (let i = 0; i < 4; i++) {
      const slot = document.getElementById(`slot-${i}`);
      if (slot) {
        slot.innerText = this.enteredCode[i] || '-';
        if (this.enteredCode[i]) {
          slot.classList.add('filled');
        } else {
          slot.classList.remove('filled');
        }
      }
    }
  }

  clearDigits() {
    this.enteredCode = [];
    this.updateSlots();
    if (window.soundEngine) window.soundEngine.click();
    const feedback = document.getElementById('rotary-feedback');
    if (feedback) feedback.innerHTML = '';
  }

  checkCode() {
    const entered = this.enteredCode.join('');
    const feedback = document.getElementById('rotary-feedback');

    if (entered === this.targetCode) {
      clearInterval(this.timer);
      if (window.soundEngine) window.soundEngine.success();
      feedback.innerHTML = `<span style="color: #10b981; font-weight: bold;">✅ 2FA ACCEPTED! Smart Fridge Identity Synchronized.</span>`;

      setTimeout(() => {
        if (typeof this.onComplete === 'function') {
          this.onComplete();
        }
      }, 750);
    } else {
      if (window.soundEngine) window.soundEngine.buzz();
      if (window.vaultState) window.vaultState.addRage(20);
      feedback.innerHTML = `<span style="color: #ef4444;">❌ Invalid Passcode (${entered})! Re-dialing required.</span>`;
      setTimeout(() => {
        this.clearDigits();
      }, 800);
    }
  }

  destroy() {
    clearInterval(this.timer);
  }
}

window.RotaryMFA = RotaryMFA;

