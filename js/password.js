/**
 * Enterprise Cryptographic Password Compliance & SHA-256 Hash Visualizer
 */
class PasswordCompliance {
  constructor(inputEl, checklistContainerEl, hashDisplayEl, onComplianceMet) {
    this.input = inputEl;
    this.container = checklistContainerEl;
    this.hashDisplay = hashDisplayEl;
    this.onComplianceMet = onComplianceMet;

    this.rules = [
      {
        id: 'length',
        label: 'Minimum 14 characters in length',
        check: (pw) => pw.length >= 14
      },
      {
        id: 'casing',
        label: 'Mixed case composition (Uppercase & Lowercase)',
        check: (pw) => /[a-z]/.test(pw) && /[A-Z]/.test(pw)
      },
      {
        id: 'digits',
        label: 'Minimum two numeric digits',
        check: (pw) => (pw.match(/\d/g) || []).length >= 2
      },
      {
        id: 'checksum',
        label: 'FIPS 140-3 Checksum: Sum of all digits must equal 21',
        getDynamicLabel: (pw) => {
          const digits = (pw.match(/\d/g) || []).map(Number);
          const sum = digits.reduce((a, b) => a + b, 0);
          return `FIPS Checksum: Digits sum must equal 21 (Current: ${sum})`;
        },
        check: (pw) => {
          const digits = (pw.match(/\d/g) || []).map(Number);
          return digits.reduce((a, b) => a + b, 0) === 21;
        }
      },
      {
        id: 'symbols',
        label: 'Contains approved corporate token symbols (#, $, &, _)',
        check: (pw) => /[#$&_]/.test(pw)
      }
    ];

    this.allValid = false;
    this.init();
  }

  init() {
    this.render();
    this.input.addEventListener('input', () => {
      this.validate();
      this.updateLiveHash();
    });
    this.updateLiveHash();
  }

  async updateLiveHash() {
    if (!this.hashDisplay) return;
    const pw = this.input.value;
    if (!pw) {
      this.hashDisplay.innerText = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 (empty)';
      return;
    }

    try {
      const msgBuffer = new TextEncoder().encode(pw);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      this.hashDisplay.innerText = hashHex;
    } catch (e) {
      this.hashDisplay.innerText = 'SHA-256 Engine Active';
    }
  }

  render() {
    this.container.innerHTML = `
      <div style="display: flex; justify-content: space-between; font-size: 11px; font-family: var(--font-mono); color: var(--text-dim); margin-bottom: 8px;">
        <span>POLICY COMPLIANCE REQUIREMENTS</span>
        <span>STANDARD FIPS 140-3</span>
      </div>
    `;

    const pw = this.input.value;
    this.rules.forEach((rule) => {
      const isValid = rule.check(pw);
      const labelText = rule.getDynamicLabel ? rule.getDynamicLabel(pw) : rule.label;

      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.gap = '8px';
      item.style.fontSize = '12px';
      item.style.color = isValid ? 'var(--accent-emerald)' : 'var(--text-dim)';
      item.style.marginBottom = '6px';
      item.innerHTML = `
        <span style="font-family: var(--font-mono);">${isValid ? '✓' : '○'}</span>
        <span>${labelText}</span>
      `;
      this.container.appendChild(item);
    });
  }

  validate() {
    const pw = this.input.value;
    const isNowValid = this.rules.every(r => r.check(pw));
    this.render();

    if (isNowValid && !this.allValid) {
      this.allValid = true;
      if (window.soundEngine) window.soundEngine.click();
      if (typeof this.onComplianceMet === 'function') {
        this.onComplianceMet(true);
      }
    } else if (!isNowValid && this.allValid) {
      this.allValid = false;
      if (typeof this.onComplianceMet === 'function') {
        this.onComplianceMet(false);
      }
    }
  }

  suggestCompliantPassword() {
    return 'Corporate984#Security';
  }
}

window.PasswordCompliance = PasswordCompliance;
