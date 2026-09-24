/**
 * Enterprise Anti-Automation Target Relocation Controller
 * Relocates authentication target under the guise of automated click-fraud defense.
 */
class AntiAutomationButton {
  constructor(buttonEl, containerEl, onVerified) {
    this.btn = buttonEl;
    this.container = containerEl;
    this.onVerified = onVerified;

    this.relocationCount = 0;
    this.maxRelocations = 5;
    this.isAnchored = false;
    this.isActive = true;

    this.posX = 0;
    this.posY = 0;

    this.init();
  }

  init() {
    this.btn.style.position = 'relative';
    this.btn.style.transition = 'transform 0.16s cubic-bezier(0.2, 0.8, 0.3, 1)';

    this.onMouseMove = this.handleMouseMove.bind(this);
    document.addEventListener('mousemove', this.onMouseMove);

    this.container.addEventListener('click', (e) => {
      if (e.target !== this.btn && !this.btn.contains(e.target)) {
        if (window.vaultState) window.vaultState.missedClicks++;
      }
    });

    this.btn.addEventListener('click', () => {
      if (!this.isActive) return;
      this.confirmAuthentication();
    });

    this.btn.addEventListener('mouseenter', () => {
      if (!this.isAnchored) {
        this.relocate();
      }
    });
  }

  handleMouseMove(e) {
    if (!this.isActive || this.isAnchored) return;

    const rect = this.btn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

    if (dist < 75) {
      this.relocate(e.clientX, e.clientY, btnCenterX, btnCenterY);
    }
  }

  relocate(cursorX, cursorY, btnCenterX, btnCenterY) {
    if (this.isAnchored || !this.isActive) return;

    this.relocationCount++;
    if (window.vaultState) {
      window.vaultState.dodgeCount++;
    }

    if (window.soundEngine) window.soundEngine.relocate();

    const cRect = this.container.getBoundingClientRect();
    const btnRect = this.btn.getBoundingClientRect();

    const maxX = cRect.width - btnRect.width - 24;
    const maxY = cRect.height - btnRect.height - 20;

    let targetX = 0;
    let targetY = 0;

    if (cursorX !== undefined && btnCenterX !== undefined) {
      const angle = Math.atan2(btnCenterY - cursorY, btnCenterX - cursorX);
      const jumpDistance = 110 + Math.random() * 50;
      targetX = this.posX + Math.cos(angle) * jumpDistance;
      targetY = this.posY + Math.sin(angle) * jumpDistance;
    } else {
      targetX = (Math.random() - 0.5) * (maxX * 0.7);
      targetY = (Math.random() - 0.5) * (maxY * 0.7);
    }

    const halfW = maxX / 2;
    const halfH = maxY / 2;
    this.posX = Math.max(-halfW, Math.min(halfW, targetX));
    this.posY = Math.max(-halfH, Math.min(halfH, targetY));

    this.btn.style.transform = `translate(${this.posX}px, ${this.posY}px)`;

    const notice = document.getElementById('audit-notice-text');
    if (notice) {
      notice.innerText = `Policy Notice: Dynamic target relocated to defeat automated click-fraud (${this.relocationCount}/${this.maxRelocations})`;
    }

    if (this.relocationCount >= this.maxRelocations) {
      this.anchorTarget();
    }
  }

  anchorTarget() {
    this.isAnchored = true;
    this.btn.classList.add('anchored');
    this.btn.innerText = 'Verify & Authorize Session';
    this.btn.style.transform = `translate(${this.posX}px, ${this.posY}px)`;

    const notice = document.getElementById('audit-notice-text');
    if (notice) {
      notice.innerHTML = `<span style="color: #10b981;">● Human input cadence confirmed. Target anchored for authorization.</span>`;
    }
  }

  confirmAuthentication() {
    this.isActive = false;
    if (window.soundEngine) window.soundEngine.success();
    this.btn.innerText = 'SSO Authentication Confirmed';

    setTimeout(() => {
      if (typeof this.onVerified === 'function') {
        this.onVerified();
      }
    }, 450);
  }

  destroy() {
    document.removeEventListener('mousemove', this.onMouseMove);
  }
}

window.AntiAutomationButton = AntiAutomationButton;
