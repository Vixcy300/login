/**
 * Enterprise Password Compliance Engine (FIPS 140-3 Standard)
 * Clean checklist UI with real-time checksum evaluation.
 */
class PasswordCompliance {
  constructor(inputEl, checklistContainerEl, onComplianceMet) {
    this.input = inputEl;
    this.container = checklistContainerEl;
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
          return `FIPS 140-3 Checksum: Sum of digits must equal 21 (Current: ${sum})`;
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
    this.input.addEventListener('input', () => this.validate());
  }

  render() {
    this.container.innerHTML = `
      <div class="checklist-header">
        <span>Corporate Policy Requirements</span>
        <span>Standard ISO-27001</span>
      </div>
    `;

    const pw = this.input.value;
    this.rules.forEach((rule) => {
      const isValid = rule.check(pw);
      const labelText = rule.getDynamicLabel ? rule.getDynamicLabel(pw) : rule.label;

      const item = document.createElement('div');
      item.className = `checklist-item ${isValid ? 'valid' : 'invalid'}`;
      item.innerHTML = `
        <span class="checklist-icon">${isValid ? '●' : '○'}</span>
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
    // 14+ chars, upper, lower, digits summing to 21 (e.g., 9+8+4 = 21), symbol #
    return 'Corporate984#Security';
  }
}

window.PasswordCompliance = PasswordCompliance;
