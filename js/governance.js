/**
 * Enterprise Data Governance & Security Attestation
 * Professional compliance review with reading cadence audit and corporate security inquest.
 */
class GovernanceAttestation {
  constructor(containerEl, onComplete) {
    this.container = containerEl;
    this.onComplete = onComplete;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div>
        <div class="card-header-badge">GLOBAL DATA GOVERNANCE & NDA v2026.4</div>
        <h2 class="card-title">Security Attestation</h2>
        <p class="card-subtitle">
          All employees and contractors must attest to corporate acceptable use and confidential data handling standards.
        </p>

        <!-- Legal Scroll -->
        <div class="governance-text-scroll" id="gov-scroll">
          <h4>1. ACCEPTABLE DATA USAGE POLICY</h4>
          <p>Personnel authorized under this Zero Trust session shall not exfiltrate, mirror, or capture corporate telemetry across non-managed hardware endpoints.</p>

          <h4>2. EPHEMERAL SESSION DEPRECIATION</h4>
          <p>Sessions authenticated via FIPS 140-3 protocols are subject to continuous re-authentication, anti-automation audits, and device posture telemetry monitoring.</p>

          <h4>3. HARDWARE TOKEN CUSTODY</h4>
          <p>Any loss of physical security keys or unauthorized delegation of TOTP credentials constitutes an immediate Tier-1 security violation.</p>

          <h4>4. COGNITIVE FATIGUE CLAUSE</h4>
          <p>Personnel who experience frustration or elevated pulse rates during multi-step authentication are advised to utilize ergonomic peripheral devices.</p>

          <h4>5. FINAL DISCLOSURE</h4>
          <p>By checking the attestation below, you certify under penalty of internal audit that all prior credentials were submitted manually without robotic aid.</p>
          <div style="height: 30px;"></div>
        </div>

        <div class="compliance-checkbox-row">
          <input type="checkbox" id="gov-check" disabled />
          <label class="compliance-checkbox-label" for="gov-check">
            I have reviewed the complete Data Governance & Compliance terms in full.
          </label>
        </div>

        <div class="field-group">
          <label class="field-label" for="cost-center-select">
            Corporate Division Cost-Center Clearance Code:
          </label>
          <select id="cost-center-select" class="enterprise-select">
            <option value="" disabled selected>-- Select Authorized Cost Center --</option>
            <option value="capex">CAPEX-7749-US (General Cloud Infrastructure)</option>
            <option value="opex">OPEX-2091-EU (Zero Trust Network Gateway)</option>
            <option value="sec">SEC-8831-GL (Internal Cryptographic Operations)</option>
            <option value="coffee">CORP-0012-HQ (Executive Espresso Machine Subsidies)</option>
          </select>
        </div>

        <button type="button" class="btn-primary" id="finalize-auth-btn" disabled>
          Authorize Enterprise Session
        </button>

        <div id="gov-audit-notice" class="audit-notice"></div>
      </div>
    `;

    this.initListeners();
  }

  initListeners() {
    const scrollBox = document.getElementById('gov-scroll');
    const check = document.getElementById('gov-check');
    const select = document.getElementById('cost-center-select');
    const submitBtn = document.getElementById('finalize-auth-btn');
    const status = document.getElementById('gov-audit-notice');

    let startTime = Date.now();
    let hasReachedBottom = false;

    scrollBox.addEventListener('scroll', () => {
      const scrollPos = scrollBox.scrollTop + scrollBox.clientHeight;
      const scrollMax = scrollBox.scrollHeight;

      if (scrollPos >= scrollMax - 15 && !hasReachedBottom) {
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed < 1.2) {
          if (window.soundEngine) window.soundEngine.rejection();
          status.innerText = `Audit Notice: Traversal rate exceeds human reading cadence (>1,200 WPM). Reviewing sections carefully is required.`;
          scrollBox.scrollTop = scrollBox.scrollTop * 0.3;
          return;
        }

        hasReachedBottom = true;
        check.disabled = false;
        status.innerHTML = `<span style="color: #10b981;">● Governance traversal verified. Agreement box unlocked.</span>`;
        if (window.soundEngine) window.soundEngine.click();
      }
    });

    const evaluate = () => {
      submitBtn.disabled = !(check.checked && select.value !== '');
    };

    check.addEventListener('change', () => {
      if (window.soundEngine) window.soundEngine.click();
      evaluate();
    });

    select.addEventListener('change', () => {
      if (window.soundEngine) window.soundEngine.click();
      evaluate();
    });

    submitBtn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.clearance();
      if (typeof this.onComplete === 'function') this.onComplete();
    });
  }
}

window.GovernanceAttestation = GovernanceAttestation;
