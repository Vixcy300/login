/**
 * VaultCorp Dynamic Password Game Validator
 * Escalating absurd rules, live sum counter, and real-time audio feedback.
 */
class PasswordValidator {
  constructor(inputEl, rulesContainerEl, onAllPassed) {
    this.input = inputEl;
    this.container = rulesContainerEl;
    this.onAllPassed = onAllPassed;

    // Determine current day in Roman Numerals (1 = Monday, ..., 7 = Sunday)
    const dayIndex = new Date().getDay(); // 0 = Sun, 1 = Mon ...
    const romanDays = ['VII', 'I', 'II', 'III', 'IV', 'V', 'VI'];
    this.todayRoman = romanDays[dayIndex];
    this.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.todayName = this.dayNames[dayIndex];

    this.moons = ['Io', 'Europa', 'Ganymede', 'Callisto'];
    this.emojis = ['🤬', '🤡', '🚀', '💀', '☕'];

    this.rules = [
      {
        id: 'rule-length',
        title: 'Rule 1: Length Requirement',
        desc: 'Your password must be at least 8 characters long.',
        check: (pw) => pw.length >= 8
      },
      {
        id: 'rule-case',
        title: 'Rule 2: Polarity Balance',
        desc: 'Must include at least one UPPERCASE and one lowercase letter.',
        check: (pw) => /[a-z]/.test(pw) && /[A-Z]/.test(pw)
      },
      {
        id: 'rule-number',
        title: 'Rule 3: Mathematical Integrity',
        desc: 'Your password must contain at least one numeric digit.',
        check: (pw) => /\d/.test(pw)
      },
      {
        id: 'rule-sum',
        title: 'Rule 4: The Casino Rule (Blackjack)',
        desc: `The numeric digits in your password must sum up to exactly 21.`,
        getDynamicDesc: (pw) => {
          const digits = (pw.match(/\d/g) || []).map(Number);
          const sum = digits.reduce((a, b) => a + b, 0);
          return `The numeric digits in your password must sum up to exactly 21. (Current digit sum: <strong style="color: ${sum === 21 ? '#10b981' : '#f59e0b'}">${sum}</strong>)`;
        },
        check: (pw) => {
          const digits = (pw.match(/\d/g) || []).map(Number);
          const sum = digits.reduce((a, b) => a + b, 0);
          return sum === 21;
        }
      },
      {
        id: 'rule-roman',
        title: 'Rule 5: Ancient Roman Clock Synchronization',
        desc: `Must contain today's day of week (${this.todayName}) in Roman Numerals: "${this.todayRoman}".`,
        check: (pw) => pw.includes(this.todayRoman)
      },
      {
        id: 'rule-moon',
        title: 'Rule 6: Celestial Orbit Alignment',
        desc: `Must contain the name of one of Jupiter's Galilean moons: (Io, Europa, Ganymede, Callisto).`,
        check: (pw) => this.moons.some(moon => pw.includes(moon))
      },
      {
        id: 'rule-emoji',
        title: 'Rule 7: Emotional Distress Telemetry',
        desc: `Must contain an approved state-of-mind emoji: 🤬, 🤡, 🚀, 💀, or ☕.`,
        check: (pw) => this.emojis.some(emoji => pw.includes(emoji))
      }
    ];

    this.visibleRuleCount = 1;
    this.passedStates = {};
    this.allValid = false;

    this.init();
  }

  init() {
    this.render();
    this.input.addEventListener('input', () => this.validate());
  }

  render() {
    this.container.innerHTML = '';
    
    // Render rules up to current visibleRuleCount
    for (let i = 0; i < Math.min(this.visibleRuleCount, this.rules.length); i++) {
      const rule = this.rules[i];
      const isPassed = this.passedStates[rule.id] || false;

      const ruleEl = document.createElement('div');
      ruleEl.className = `rule-card ${isPassed ? 'rule-passed' : 'rule-failed'}`;
      ruleEl.id = rule.id;

      const descText = rule.getDynamicDesc ? rule.getDynamicDesc(this.input.value) : rule.desc;

      ruleEl.innerHTML = `
        <div class="rule-header">
          <span class="rule-icon">${isPassed ? '✅' : '❌'}</span>
          <span class="rule-title">${rule.title}</span>
        </div>
        <div class="rule-body">${descText}</div>
      `;
      this.container.appendChild(ruleEl);
    }
  }

  validate() {
    const pw = this.input.value;
    let allCurrentPassed = true;
    let newRuleUnlocked = false;

    for (let i = 0; i < this.visibleRuleCount; i++) {
      const rule = this.rules[i];
      const wasPassed = this.passedStates[rule.id];
      const nowPassed = rule.check(pw);
      this.passedStates[rule.id] = nowPassed;

      if (!nowPassed) {
        allCurrentPassed = false;
      }

      // Check if this rule specifically changed to passed
      if (!wasPassed && nowPassed) {
        if (window.soundEngine) window.soundEngine.click();
      }
    }

    // If all current visible rules are satisfied, unlock the next rule!
    if (allCurrentPassed && this.visibleRuleCount < this.rules.length) {
      this.visibleRuleCount++;
      newRuleUnlocked = true;
      if (window.soundEngine) window.soundEngine.ruleDing();
    }

    this.render();

    // Check if ALL 7 rules are satisfied
    const totalPassed = this.rules.every(r => r.check(pw));
    if (totalPassed && !this.allValid) {
      this.allValid = true;
      if (window.soundEngine) window.soundEngine.success();
      if (typeof this.onAllPassed === 'function') {
        this.onAllPassed(true);
      }
    } else if (!totalPassed && this.allValid) {
      this.allValid = false;
      if (typeof this.onAllPassed === 'function') {
        this.onAllPassed(false);
      }
    }
  }

  // Helper autofill for testing or hint
  suggestCompliantPassword() {
    return `Secure993${this.todayRoman}Europa🚀`;
  }
}

window.PasswordValidator = PasswordValidator;

