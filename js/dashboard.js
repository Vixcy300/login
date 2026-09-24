/**
 * Executive Command Operations Center (Stage 4)
 * High-tech operations dashboard with session flight recorder telemetry.
 */
class ExecutiveCommandCenter {
  constructor(containerEl) {
    this.container = containerEl;
    this.render();
  }

  render() {
    const state = window.vaultState || {
      startTime: Date.now() - 32000,
      mouseDistance: 2840,
      peakSpeed: 520,
      dodgeCount: 6
    };

    const timeSec = Math.max(10, Math.floor((Date.now() - state.startTime) / 1000));
    const mins = Math.floor(timeSec / 60);
    const secs = timeSec % 60;
    const timeFormatted = `${mins > 0 ? mins + 'm ' : ''}${secs}s`;

    this.container.innerHTML = `
      <div class="operations-center">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 14px;">
          <div>
            <div style="font-size: 10px; font-family: var(--font-mono); color: var(--accent-cyan); letter-spacing: 0.5px;">
              LEVEL-5 EXECUTIVE ACCESS GRANTED
            </div>
            <h2 style="font-size: 18px; font-weight: 800; color: #fff; margin-top: 2px;">
              Operations Command Terminal
            </h2>
          </div>
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--accent-emerald); background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 10px; border-radius: 20px;">
            ● 48 ENCLAVES ONLINE
          </div>
        </div>

        <!-- Telemetry Flight Recorder -->
        <div>
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase; margin-bottom: 8px;">
            Operator Telemetry Flight Recorder
          </div>
          <div class="flight-recorder-grid">
            <div class="flight-tile">
              <div class="flight-val">${timeFormatted}</div>
              <div class="flight-lbl">Authentication Time Elapsed</div>
            </div>
            <div class="flight-tile">
              <div class="flight-val">${Math.round(state.mouseDistance)} px</div>
              <div class="flight-lbl">Cursor Mileage Traveled</div>
            </div>
            <div class="flight-tile">
              <div class="flight-val">${state.peakSpeed || 480} px/s</div>
              <div class="flight-lbl">Peak Pointer Velocity</div>
            </div>
            <div class="flight-tile">
              <div class="flight-val">0.00%</div>
              <div class="flight-lbl">Synthetic Bot Probability</div>
            </div>
          </div>
        </div>

        <!-- High-Tech Operations Controls -->
        <div>
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim); text-transform: uppercase; margin-bottom: 8px;">
            Infrastructure Control Nodes
          </div>
          <div class="system-node-grid">
            <div class="node-card" id="btn-jira">
              <div class="node-title">
                <span>JIRA Backlog Node</span>
                <span style="color: var(--accent-cyan); font-family: var(--font-mono);">1,492 BUGS</span>
              </div>
              <div class="node-sub">Sync sprint workload items</div>
            </div>

            <div class="node-card" id="btn-hvac">
              <div class="node-title">
                <span>HQ Climate Mesh</span>
                <span style="color: var(--accent-amber); font-family: var(--font-mono);">21.5°C</span>
              </div>
              <div class="node-sub">Thermostat governance locked</div>
            </div>

            <div class="node-card" id="btn-coffee">
              <div class="node-title">
                <span>Espresso Barometer</span>
                <span style="color: var(--accent-emerald); font-family: var(--font-mono);">15.2 BAR</span>
              </div>
              <div class="node-sub">Boiler telemetry nominal</div>
            </div>

            <div class="node-card" id="btn-revoke" style="border-color: rgba(239, 68, 68, 0.3);">
              <div class="node-title" style="color: var(--accent-rose);">
                <span>Revoke Session</span>
                <span style="font-family: var(--font-mono);">EXIT</span>
              </div>
              <div class="node-sub">Requires full re-authentication</div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.initActions();
  }

  initActions() {
    const jira = document.getElementById('btn-jira');
    if (jira) {
      jira.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.click();
        alert("JIRA sync complete: 62 urgent critical severity tickets allocated.");
      });
    }

    const hvac = document.getElementById('btn-hvac');
    if (hvac) {
      hvac.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.click();
        alert("HVAC Override: Facilities management alerted of unauthorized temperature adjustment.");
      });
    }

    const coffee = document.getElementById('btn-coffee');
    if (coffee) {
      coffee.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.relocate();
        alert("Espresso steam valve purged. Internal pressure stabilized.");
      });
    }

    const revoke = document.getElementById('btn-revoke');
    if (revoke) {
      revoke.addEventListener('click', () => {
        if (confirm("Terminate Level-5 Executive Session? All vector physics and cipher stages must be re-solved.")) {
          location.reload();
        }
      });
    }
  }
}

window.ExecutiveCommandCenter = ExecutiveCommandCenter;
