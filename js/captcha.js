/**
 * VaultCorp Quantum CAPTCHA Module
 * Greasy slider physics and absurd existential image selection.
 */
class QuantumCaptcha {
  constructor(containerEl, onComplete) {
    this.container = containerEl;
    this.onComplete = onComplete;
    this.sliderSolved = false;
    this.gridSolved = false;

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="captcha-box">
        <div class="captcha-badge">QUANTUM TURING VERIFICATION v4.2</div>
        <p class="captcha-instruction">
          Stage 2.1: Slide the quantum key into the containment zone.<br>
          <small style="color: #94a3b8;">⚠️ WARNING: Surface lubricated with industrial Teflon (Friction: 0.02)</small>
        </p>

        <!-- Slider Puzzle -->
        <div class="slider-track-container" id="slider-track-container">
          <div class="slider-target" id="slider-target">
            <span class="target-label">DROP HERE</span>
          </div>
          <div class="slider-thumb" id="slider-thumb">
            <span>🔑</span>
          </div>
        </div>
        <div class="slider-status" id="slider-status">Drag key to the glowing green slot</div>

        <hr style="border: 0; border-top: 1px dashed rgba(255,255,255,0.15); margin: 24px 0;">

        <!-- Absurd Image Grid -->
        <div class="captcha-instruction">
          Stage 2.2: Select all images containing <strong>an entity experiencing existential dread</strong>:
        </div>

        <div class="captcha-grid" id="captcha-grid">
          <!-- Dynamically populated -->
        </div>

        <div class="captcha-controls">
          <button type="button" class="btn btn-secondary" id="captcha-refresh-btn">🔄 New Existential Crisis</button>
          <button type="button" class="btn btn-primary" id="captcha-verify-btn">Verify Humanity</button>
        </div>
        <div class="captcha-feedback" id="captcha-feedback"></div>
      </div>
    `;

    this.initSlider();
    this.initImageGrid();

    document.getElementById('captcha-verify-btn').addEventListener('click', () => {
      this.verifyAll();
    });

    document.getElementById('captcha-refresh-btn').addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.click();
      this.initImageGrid();
    });
  }

  initSlider() {
    const track = document.getElementById('slider-track-container');
    const thumb = document.getElementById('slider-thumb');
    const target = document.getElementById('slider-target');
    const status = document.getElementById('slider-status');

    let isDragging = false;
    let startX = 0;
    let currentLeft = 0;
    let velocity = 0;
    let lastX = 0;
    let animFrame = null;

    // Position target around 70-80% of track
    const targetPercent = 0.74;
    target.style.left = `${targetPercent * 100}%`;

    const onPointerDown = (e) => {
      if (this.sliderSolved) return;
      isDragging = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX);
      lastX = startX;
      thumb.classList.add('dragging');
      if (window.soundEngine) window.soundEngine.click();
    };

    const onPointerMove = (e) => {
      if (!isDragging || this.sliderSolved) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const trackRect = track.getBoundingClientRect();
      const maxLeft = trackRect.width - thumb.offsetWidth;

      // Calculate raw offset with greasy momentum
      const delta = clientX - lastX;
      velocity = delta * 0.95;
      lastX = clientX;

      currentLeft = Math.max(0, Math.min(maxLeft, clientX - trackRect.left - thumb.offsetWidth / 2));
      thumb.style.left = `${currentLeft}px`;
    };

    const onPointerUp = () => {
      if (!isDragging || this.sliderSolved) return;
      isDragging = false;
      thumb.classList.remove('dragging');

      const trackRect = track.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const thumbRect = thumb.getBoundingClientRect();

      // Check alignment (within 16px tolerance)
      const targetCenter = targetRect.left + targetRect.width / 2;
      const thumbCenter = thumbRect.left + thumbRect.width / 2;
      const diff = Math.abs(targetCenter - thumbCenter);

      if (diff < 16) {
        // Solved! Snap and lock
        this.sliderSolved = true;
        thumb.style.left = `${target.offsetLeft + (target.offsetWidth - thumb.offsetWidth) / 2}px`;
        thumb.classList.add('locked');
        status.innerHTML = `<span style="color: #10b981;">✅ Quantum key aligned and locked!</span>`;
        if (window.soundEngine) window.soundEngine.success();
      } else {
        // Greasy slip back!
        if (window.soundEngine) window.soundEngine.whoosh();
        status.innerHTML = `<span style="color: #f59e0b;">Slipped! Over/undershot by ${Math.round(diff)}px. Greasy!</span>`;
        thumb.style.transition = 'left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        thumb.style.left = '0px';
        setTimeout(() => {
          thumb.style.transition = '';
        }, 400);
      }
    };

    thumb.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    thumb.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
  }

  initImageGrid() {
    const grid = document.getElementById('captcha-grid');
    this.selectedTiles = new Set();

    // 6 funny existential cards
    const items = [
      { id: 1, dread: true, emoji: '🍦', label: 'Melting ice cream seeing a heatwave', caption: '"Why was I scooped?"' },
      { id: 2, dread: false, emoji: '🌻', label: 'Sunflower enjoying life', caption: '"Just photosynthesizing!"' },
      { id: 3, dread: true, emoji: '🤖', label: 'Roomba staring down the stairs', caption: '"Is this my final dust bunny?"' },
      { id: 4, dread: false, emoji: '🐶', label: 'Happy golden retriever with ball', caption: '"Ball is life!"' },
      { id: 5, dread: true, emoji: '🍞', label: 'Slice of bread entering a toaster', caption: '"It is getting uncomfortably warm."' },
      { id: 6, dread: false, emoji: '☕', label: 'Fresh piping hot latte', caption: '"100% caffeine optimism"' }
    ];

    // Shuffle slightly
    this.currentItems = items;
    grid.innerHTML = '';

    items.forEach((item) => {
      const tile = document.createElement('div');
      tile.className = 'captcha-tile';
      tile.dataset.id = item.id;
      tile.innerHTML = `
        <div class="tile-emoji">${item.emoji}</div>
        <div class="tile-caption">${item.caption}</div>
        <div class="tile-label">${item.label}</div>
        <div class="tile-check">✓</div>
      `;

      tile.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.click();
        if (this.selectedTiles.has(item.id)) {
          this.selectedTiles.delete(item.id);
          tile.classList.remove('selected');
        } else {
          this.selectedTiles.add(item.id);
          tile.classList.add('selected');
        }
      });

      grid.appendChild(tile);
    });
  }

  verifyAll() {
    const feedback = document.getElementById('captcha-feedback');

    if (!this.sliderSolved) {
      if (window.soundEngine) window.soundEngine.buzz();
      feedback.innerHTML = `<span style="color:#ef4444;">❌ Slider key has not been locked into position!</span>`;
      return;
    }

    // Dread tiles are IDs 1, 3, 5
    const correctIds = [1, 3, 5];
    const isCorrect = 
      correctIds.every(id => this.selectedTiles.has(id)) &&
      this.selectedTiles.size === correctIds.length;

    if (!isCorrect) {
      if (window.soundEngine) window.soundEngine.buzz();
      if (window.vaultState) window.vaultState.addRage(15);
      feedback.innerHTML = `<span style="color:#ef4444;">❌ Incorrect existential resonance! Did you confuse blissful coffee with existential dread? Try again.</span>`;
    } else {
      this.gridSolved = true;
      if (window.soundEngine) window.soundEngine.success();
      feedback.innerHTML = `<span style="color:#10b981;">✅ Verified! You have successfully identified certified existential sorrow.</span>`;

      setTimeout(() => {
        if (typeof this.onComplete === 'function') {
          this.onComplete();
        }
      }, 700);
    }
  }
}

window.QuantumCaptcha = QuantumCaptcha;

