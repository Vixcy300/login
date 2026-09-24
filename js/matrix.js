/**
 * Quantum Node Cipher Matrix
 * Interactive 3x3 canvas node grid with real-time neon laser beam routing.
 */
class QuantumMatrixCircuit {
  constructor(containerEl, onComplete) {
    this.container = containerEl;
    this.onComplete = onComplete;
    this.targetSequence = [1, 5, 9, 6]; // 4-node cryptographic circuit
    this.userSequence = [];
    this.isDrawing = false;
    this.mouse = { x: 0, y: 0 };
    this.nodes = [];

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="matrix-container">
        <div class="card-protocol-tag">QUANTUM CIRCUITRY AUTHENTICATION</div>
        <h2 class="card-heading">Node Topology Cipher</h2>
        <p class="card-description">
          Trace the cryptographic routing circuit across the 3x3 quantum node array in the specified target sequence.
        </p>

        <!-- Reference Cipher Sequence -->
        <div class="reference-cipher-card">
          <span>Target Routing Cipher:</span>
          <div class="cipher-node-sequence">
            ${this.targetSequence.map(n => `<div class="cipher-pill">${n}</div>`).join('')}
          </div>
        </div>

        <!-- Matrix Canvas -->
        <canvas class="node-matrix-canvas" id="matrix-canvas" width="320" height="300"></canvas>

        <div id="matrix-status-text" class="heat-status-notice">
          Drag cursor through nodes 1 → 5 → 9 → 6 to close the quantum circuit
        </div>
      </div>
    `;

    this.initCanvas();
  }

  initCanvas() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Generate 3x3 grid coordinates
    const startX = 60;
    const startY = 50;
    const spacingX = 100;
    const spacingY = 100;

    this.nodes = [];
    let id = 1;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        this.nodes.push({
          id: id++,
          x: startX + c * spacingX,
          y: startY + r * spacingY,
          radius: 18
        });
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connected laser lines
      if (this.userSequence.length > 0) {
        ctx.beginPath();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;

        for (let i = 0; i < this.userSequence.length; i++) {
          const node = this.nodes.find(n => n.id === this.userSequence[i]);
          if (i === 0) ctx.moveTo(node.x, node.y);
          else ctx.lineTo(node.x, node.y);
        }

        // Draw live rubber-band line to cursor if actively drawing
        if (this.isDrawing && this.userSequence.length < 4) {
          ctx.lineTo(this.mouse.x, this.mouse.y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw all nodes
      this.nodes.forEach(n => {
        const isSelected = this.userSequence.includes(n.id);

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#2563eb' : '#0f172a';
        ctx.fill();

        ctx.strokeStyle = isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        if (isSelected) {
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 14;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Label
        ctx.fillStyle = isSelected ? '#fff' : '#94a3b8';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.id, n.x, n.y);
      });
    };

    draw();

    const onPointerDown = (e) => {
      this.isDrawing = true;
      this.userSequence = [];
      this.updatePointer(e, canvas);
      this.checkNodeProximity();
      draw();
    };

    const onPointerMove = (e) => {
      if (!this.isDrawing) return;
      this.updatePointer(e, canvas);
      this.checkNodeProximity();
      draw();
    };

    const onPointerUp = () => {
      if (!this.isDrawing) return;
      this.isDrawing = false;
      this.verifyCircuit();
      draw();
    };

    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
  }

  updatePointer(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    this.mouse.x = clientX - rect.left;
    this.mouse.y = clientY - rect.top;
  }

  checkNodeProximity() {
    this.nodes.forEach(n => {
      const dist = Math.hypot(this.mouse.x - n.x, this.mouse.y - n.y);
      if (dist < n.radius + 12) {
        if (!this.userSequence.includes(n.id)) {
          this.userSequence.push(n.id);
          if (window.soundEngine) window.soundEngine.click();
        }
      }
    });
  }

  verifyCircuit() {
    const isMatch = 
      this.userSequence.length === this.targetSequence.length &&
      this.userSequence.every((val, idx) => val === this.targetSequence[idx]);

    const status = document.getElementById('matrix-status-text');

    if (isMatch) {
      if (window.soundEngine) window.soundEngine.success();
      if (status) status.innerHTML = `<span style="color: #10b981;">● Quantum circuit closed. Cryptographic topology verified.</span>`;
      setTimeout(() => {
        if (typeof this.onComplete === 'function') {
          this.onComplete();
        }
      }, 450);
    } else {
      if (window.soundEngine) window.soundEngine.rejection();
      if (status) status.innerHTML = `<span style="color: #ef4444;">Parity mismatch: Routed [${this.userSequence.join('-')}]. Resetting circuit.</span>`;
      this.userSequence = [];
    }
  }
}

window.QuantumMatrixCircuit = QuantumMatrixCircuit;
