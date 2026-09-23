/**
 * VaultCorp Terms, Security Question, and Victory Dashboard Module
 * Handles final legal check, confetti celebration, rage report, and joke dashboard.
 */
class FinalAuthorizationAndDashboard {
  constructor(containerEl, onComplete) {
    this.container = containerEl;
    this.onComplete = onComplete;
    this.renderStage5();
  }

  renderStage5() {
    this.container.innerHTML = `
      <div class="terms-box">
        <div class="terms-badge">LEGAL COMPLIANCE & IDENTITY INQUEST</div>

        <p class="terms-instructions">
          Please review the <strong>VaultCorp Quantum Terms of Eternity (v98.4)</strong> and verify your childhood security question.
        </p>

        <!-- Terms scroll container -->
        <div class="terms-scroll-area" id="terms-scroll-area">
          <h4>SECTION 1: UNCONDITIONAL SUBMISSION</h4>
          <p>By logging into VaultCorp, you hereby agree to surrender all rights to complain about button movements, evasive UI components, refrigerator passcodes, and existential ice creams.</p>
          <h4>SECTION 2: COMPUTATIONAL USAGE</h4>
          <p>You agree that 3% of your browser's idle CPU cycles may be utilized to compute the meaning of life or heat the server room microwave.</p>
          <h4>SECTION 3: PASSWORDS AND GALILEAN CELESTIAL BODIES</h4>
          <p>You acknowledge that Jupiter's moons are inherently superior to Saturn's moons for password entropy.</p>
          <h4>SECTION 4: COFFEE PROTOCOLS</h4>
          <p>You agree never to leave 2 drops of coffee in the communal pot without brewing a fresh batch. Violation results in immediate demotion to CAPTCHA solver.</p>
          <h4>SECTION 5: THE RUNAWAY BUTTON CLAUSE</h4>
          <p>Any emotional distress caused by buttons dodging your cursor is solely the result of subpar wrist ergonomics and cannot be attributed to VaultCorp UX engineers.</p>
          <h4>SECTION 6: FINAL CLAUSE</h4>
          <p>You have reached the bottom of this document. Congratulations on exercising your eye muscles.</p>
          <div style="height: 40px;"></div>
        </div>

        <div class="terms-checkbox-wrap">
          <label class="custom-checkbox-label">
            <input type="checkbox" id="terms-checkbox" disabled>
            <span class="checkbox-text">I have read and fully understood all 42,000 words in their entirety.</span>
          </label>
        </div>

        <div class="security-question-wrap">
          <label class="question-label" for="sec-question-select">
            Security Question: What was your childhood goldfish's astrological rising sign?
          </label>
          <select id="sec-question-select" class="vault-select">
            <option value="" disabled selected>-- Select Astrological Chart --</option>
            <option value="pisces">Pisces (He felt most at home in water)</option>
            <option value="scorpio">Scorpio (He stared at me with intense judgment)</option>
            <option value="aries">Aries (He had unresolved anger issues)</option>
            <option value="declined">He refused to disclose his birth chart to HR</option>
          </select>
        </div>

        <div class="terms-actions">
          <button type="button" class="btn btn-primary" id="final-login-btn" disabled>GRANT ABSOLUTE ACCESS</button>
        </div>
        <div class="terms-feedback" id="terms-feedback"></div>
      </div>
    `;

    this.initTermsListener();
  }

  initTermsListener() {
    const scrollArea = document.getElementById('terms-scroll-area');
    const checkbox = document.getElementById('terms-checkbox');
    const select = document.getElementById('sec-question-select');
    const submitBtn = document.getElementById('final-login-btn');
    const feedback = document.getElementById('terms-feedback');

    let scrollStartTime = Date.now();
    let hasReachedBottom = false;

    scrollArea.addEventListener('scroll', () => {
      const scrollPos = scrollArea.scrollTop + scrollArea.clientHeight;
      const scrollHeight = scrollArea.scrollHeight;

      if (scrollPos >= scrollHeight - 15 && !hasReachedBottom) {
        const timeElapsed = (Date.now() - scrollStartTime) / 1000;
        if (timeElapsed < 1.2) {
          // Scrolled too quickly!
          if (window.soundEngine) window.soundEngine.buzz();
          feedback.innerHTML = `<span style="color:#f59e0b;">⚠️ SPEED-READING DETECTED! No human reads 6 legal sections in ${timeElapsed.toFixed(1)}s! Slow down.</span>`;
          scrollArea.scrollTop = scrollArea.scrollTop * 0.4;
          return;
        }

        hasReachedBottom = true;
        checkbox.disabled = false;
        feedback.innerHTML = `<span style="color:#10b981;">📜 Terms completed! You may now check the agreement box.</span>`;
        if (window.soundEngine) window.soundEngine.click();
      }
    });

    const checkForm = () => {
      if (checkbox.checked && select.value !== '') {
        submitBtn.disabled = false;
      } else {
        submitBtn.disabled = true;
      }
    };

    checkbox.addEventListener('change', () => {
      if (window.soundEngine) window.soundEngine.click();
      checkForm();
    });

    select.addEventListener('change', () => {
      if (window.soundEngine) window.soundEngine.click();
      checkForm();
    });

    submitBtn.addEventListener('click', () => {
      this.grantAccess();
    });
  }

  grantAccess() {
    if (window.soundEngine) window.soundEngine.victory();
    this.renderAccessGranted();
  }

  renderAccessGranted() {
    const state = window.vaultState || {
      startTime: Date.now() - 45000,
      dodgeCount: 7,
      missedClicks: 12,
      mouseDistance: 4520,
      rageScore: 88
    };

    const timeTakenSec = Math.max(10, Math.floor((Date.now() - state.startTime) / 1000));
    const mins = Math.floor(timeTakenSec / 60);
    const secs = timeTakenSec % 60;
    const timeFormatted = `${mins > 0 ? mins + 'm ' : ''}${secs}s`;

    this.container.innerHTML = `
      <div class="victory-box">
        <canvas id="confetti-canvas"></canvas>

        <div class="clearance-badge">LEVEL 999 ULTRA CLEARANCE ACTIVATED</div>
        <h1 class="victory-title">🎉 ACCESS GRANTED!</h1>
        <p class="victory-subtitle">Against all odds, frustrating buttons, and smart refrigerators, you have logged in.</p>

        <!-- Player Rage Telemetry Report -->
        <div class="telemetry-card">
          <div class="card-header">📊 OPERATOR RAGE & ENDURANCE TELEMETRY</div>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">${timeFormatted}</div>
              <div class="stat-label">Time Spent Chasing Buttons</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${state.dodgeCount}</div>
              <div class="stat-label">Button Evasions Survived</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${state.missedClicks}</div>
              <div class="stat-label">Missed Clicks & Whiffs</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${Math.round(state.mouseDistance)} px</div>
              <div class="stat-label">Cursor Mileage Traveled</div>
            </div>
          </div>
          <div class="patience-verdict">
            <span>Official Temperament Rating:</span>
            <strong style="color: #10b981;">ZEN MASTER (0% Rage Quit Probability)</strong>
          </div>
        </div>

        <!-- Badges Unlocked -->
        <div class="badges-row">
          <div class="badge-pill">🏃 Button Hunter</div>
          <div class="badge-pill">🪐 Moon Walker</div>
          <div class="badge-pill">🧊 Fridge Decoder</div>
          <div class="badge-pill">🧘 Zen Calibrated</div>
          <div class="badge-pill">📜 Terms Skimmer</div>
        </div>

        <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 28px 0;">

        <!-- Top Secret Humorous Enterprise Dashboard -->
        <div class="secret-dashboard">
          <div class="dashboard-header">
            <h3>🏢 TOP SECRET CORPORATE OVERRIDE CONSOLE</h3>
            <span class="live-dot">● SYSTEM ONLINE</span>
          </div>

          <div class="dashboard-grid">
            <div class="dash-card">
              <div class="dash-card-title">☕ Office Espresso Machine</div>
              <div class="dash-metric">Pressure: <span id="coffee-pressure">15.4</span> BAR</div>
              <button class="btn btn-secondary dash-btn" id="coffee-vent-btn">💨 Vent Excess Steam</button>
            </div>

            <div class="dash-card">
              <div class="dash-card-title">🌡️ Thermostat War</div>
              <div class="dash-metric">Current: <span id="thermostat-val">21.5°C</span> (War Ongoing)</div>
              <button class="btn btn-secondary dash-btn" id="temp-toggle-btn">🔥 Sneakily Adjust by 0.5°</button>
            </div>

            <div class="dash-card">
              <div class="dash-card-title">🍕 Emergency Pizza Order</div>
              <div class="dash-metric">Pizzas in flight: <strong>4 Large Pepperoni</strong></div>
              <button class="btn btn-secondary dash-btn" id="pizza-boost-btn">🍕 Add Extra Garlic Dip</button>
            </div>

            <div class="dash-card">
              <div class="dash-card-title">🛑 Logout Trap</div>
              <div class="dash-metric" style="color: #ef4444;">Warning: Irreversible!</div>
              <button class="btn btn-danger dash-btn" id="logout-btn">Log Out (Do it all again)</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.startConfetti();
    this.initDashboardActions();
  }

  startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = 360;

    const pieces = [];
    const colors = ['#38bdf8', '#818cf8', '#34d399', '#f472b6', '#fbbf24', '#f87171'];

    for (let i = 0; i < 90; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        w: 6 + Math.random() * 8,
        h: 6 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        rot: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 8
      });
    }

    let frame = 0;
    const loop = () => {
      if (frame > 220) return; // Stop after ~4 seconds
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();

        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
      });

      frame++;
      requestAnimationFrame(loop);
    };

    loop();
  }

  initDashboardActions() {
    const ventBtn = document.getElementById('coffee-vent-btn');
    if (ventBtn) {
      ventBtn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.whoosh();
        const el = document.getElementById('coffee-pressure');
        if (el) el.innerText = (12.0 + Math.random() * 4).toFixed(1);
      });
    }

    const tempBtn = document.getElementById('temp-toggle-btn');
    if (tempBtn) {
      tempBtn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.click();
        const el = document.getElementById('thermostat-val');
        if (el) el.innerText = (20.0 + Math.random() * 3).toFixed(1) + '°C';
      });
    }

    const pizzaBtn = document.getElementById('pizza-boost-btn');
    if (pizzaBtn) {
      pizzaBtn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.success();
        pizzaBtn.innerText = '✅ Extra Garlic Dispatched!';
        pizzaBtn.disabled = true;
      });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm("Are you SURE? You will have to face the runaway button and smart fridge all over again!")) {
          location.reload();
        }
      });
    }
  }
}

window.FinalAuthorizationAndDashboard = FinalAuthorizationAndDashboard;

