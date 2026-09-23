/**
 * VaultCorp Runaway Button Controller
 * The evasive login button that tests user patience and reflex.
 */
class RunawayButton {
  constructor(buttonEl, containerEl, onCaptured) {
    this.btn = buttonEl;
    this.container = containerEl;
    this.onCaptured = onCaptured;

    this.taunts = [
      "Too slow! 💨",
      "Almost had me! 😜",
      "Nice reflexes... NOT! 🐢",
      "404: Button Not Found 👻",
      "Did you really think it'd be that easy? 😏",
      "My grandma moves a mouse faster! 👵",
      "Whoops! Over here! 🎯",
      "Stamina dropping... 🏃‍♂️💨",
      "Getting tired... 🥵",
      "Okay fine, you win... I need a nap 🪫"
    ];

    this.dodgeCount = 0;
    this.missedClicks = 0;
    this.maxDodges = 7; // After 7 dodges, button runs out of stamina and can be clicked!
    this.isExhausted = false;
    this.isActive = true;

    this.posX = 0;
    this.posY = 0;

    this.init();
  }

  init() {
    this.btn.style.position = 'relative';
    this.btn.style.transition = 'all 0.15s cubic-bezier(0.2, 0.9, 0.3, 1.2)';

    // Mouse movement proximity check
    this.onMouseMove = this.handleMouseMove.bind(this);
    document.addEventListener('mousemove', this.onMouseMove);

    // Track missed clicks on container
    this.container.addEventListener('click', (e) => {
      if (e.target !== this.btn && !this.btn.contains(e.target)) {
        this.missedClicks++;
        if (window.vaultState) window.vaultState.missedClicks++;
        this.updateRageMeter();
      }
    });

    // When clicked
    this.btn.addEventListener('click', (e) => {
      if (!this.isActive) return;

      if (!this.isExhausted && this.dodgeCount < this.maxDodges) {
        // Did user somehow click it early? If they clicked it before stamina ran out, grant double respect or dodge at the last millisecond
        // Let's allow instant win if they manage to click it, or dodge unless exhausted
        // If they click it, congratulate them!
        this.captureSuccess();
      } else {
        this.captureSuccess();
      }
    });

    // Also dodge on mouseenter/focus
    this.btn.addEventListener('mouseenter', () => {
      if (!this.isExhausted) {
        this.dodge();
      }
    });
  }

  handleMouseMove(e) {
    if (!this.isActive || this.isExhausted) return;

    const rect = this.btn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

    // Trigger proximity evasion if within 85px
    if (dist < 85) {
      this.dodge(e.clientX, e.clientY, btnCenterX, btnCenterY);
    }
  }

  dodge(cursorX, cursorY, btnCenterX, btnCenterY) {
    if (this.isExhausted || !this.isActive) return;

    this.dodgeCount++;
    if (window.vaultState) {
      window.vaultState.dodgeCount++;
      window.vaultState.addRage(12);
    }

    if (window.soundEngine) window.soundEngine.whoosh();

    const cRect = this.container.getBoundingClientRect();
    const btnRect = this.btn.getBoundingClientRect();

    const maxX = cRect.width - btnRect.width - 24;
    const maxY = cRect.height - btnRect.height - 24;

    let targetX = 0;
    let targetY = 0;

    if (cursorX !== undefined && btnCenterX !== undefined) {
      // Calculate repulsion vector
      const angle = Math.atan2(btnCenterY - cursorY, btnCenterX - cursorX);
      const jumpDistance = 140 + Math.random() * 80;
      targetX = this.posX + Math.cos(angle) * jumpDistance;
      targetY = this.posY + Math.sin(angle) * jumpDistance;
    } else {
      // Random teleport within container
      targetX = (Math.random() - 0.5) * (maxX * 0.8);
      targetY = (Math.random() - 0.5) * (maxY * 0.8);
    }

    // Keep within bounds
    const halfW = maxX / 2;
    const halfH = maxY / 2;
    this.posX = Math.max(-halfW, Math.min(halfW, targetX));
    this.posY = Math.max(-halfH, Math.min(halfH, targetY));

    // Update taunt text
    const tauntIdx = Math.min(this.dodgeCount - 1, this.taunts.length - 1);
    this.btn.innerText = this.taunts[tauntIdx];
    this.btn.style.transform = `translate(${this.posX}px, ${this.posY}px) scale(${1 - this.dodgeCount * 0.03})`;

    // Check if button runs out of stamina
    if (this.dodgeCount >= this.maxDodges) {
      this.exhaustButton();
    }

    this.updateRageMeter();
  }

  exhaustButton() {
    this.isExhausted = true;
    this.btn.classList.add('btn-exhausted');
    this.btn.innerText = '⚡ CLICK ME QUICK! (Stamina 0%) 🥵';
    this.btn.style.transform = `translate(${this.posX}px, ${this.posY}px) scale(1.05)`;
    this.btn.style.boxShadow = '0 0 25px rgba(255, 68, 68, 0.8)';
    
    // Add pulsing sweat animation
    const banner = document.getElementById('runaway-status');
    if (banner) {
      banner.innerHTML = `<span style="color:#ff6b6b; font-weight:bold;">⚠️ TARGET OUT OF BREATH! Click the button now before it recharges!</span>`;
    }
  }

  captureSuccess() {
    this.isActive = false;
    if (window.soundEngine) window.soundEngine.success();
    this.btn.innerText = '✅ VERIFIED! TARGET CAUGHT';
    this.btn.classList.remove('btn-exhausted');
    this.btn.classList.add('btn-captured');
    
    setTimeout(() => {
      if (typeof this.onCaptured === 'function') {
        this.onCaptured();
      }
    }, 450);
  }

  updateRageMeter() {
    const el = document.getElementById('missed-clicks-counter');
    if (el) el.innerText = `${this.dodgeCount + this.missedClicks}`;
  }

  destroy() {
    document.removeEventListener('mousemove', this.onMouseMove);
  }
}

window.RunawayButton = RunawayButton;

