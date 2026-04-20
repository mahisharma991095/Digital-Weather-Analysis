// ⚡ POWER ANALYSIS — power.js
// Analyses temperature and recommends device usage & power consumption level

function updatePowerAnalysis(temp) {
  const placeholder = document.getElementById("powerAnalysisPlaceholder");

  // Create the HTML structure if it doesn't exist yet
  if (placeholder && !document.getElementById("powerAnalysisSection")) {
    placeholder.innerHTML = `
      <div class="power-analysis-section" id="powerAnalysisSection">
        <h2 class="power-analysis-title">POWER ANALYSIS</h2>
        <div class="power-analysis-card">
          <div class="power-device-row">
            <div class="status-indicator" id="powerIndicator"></div>
            <div class="power-device-info">
              <span class="power-device-name" id="powerDeviceName">Initializing Analysis...</span>
              <span class="power-device-status" id="powerDeviceStatus">Please search a city</span>
            </div>
            <span class="power-badge" id="powerBadge">WAITING</span>
          </div>
          <div class="power-meter-wrap">
            <div class="power-meter-bar">
              <div class="power-meter-fill" id="powerMeterFill"></div>
            </div>
            <div class="power-meter-labels">
              <span>LOW</span>
              <span>MEDIUM</span>
              <span>HIGH</span>
            </div>
          </div>
          <p class="power-analysis-msg" id="powerAnalysisMsg">Standby for real-time data analysis.</p>
        </div>
      </div>
    `;
  }

  if (temp === undefined) return;

  const indicator = document.getElementById("powerIndicator");
  const name = document.getElementById("powerDeviceName");
  const status = document.getElementById("powerDeviceStatus");
  const badge = document.getElementById("powerBadge");
  const fill = document.getElementById("powerMeterFill");
  const msg = document.getElementById("powerAnalysisMsg");

  if (!name || !status || !badge || !fill || !msg) return;

  let fillWidth, fillColor, badgeClass, badgeText, statusColor;

  if (temp >= 35) {
    fillWidth = "95%";
    fillColor = "linear-gradient(90deg, #ff416c, #ff4b2b)";
    badgeClass = "high";
    badgeText = "HIGH DEMAND";
    statusColor = "#ff416c";
    name.textContent = "Air Conditioner";
    status.textContent = "System Required";
    msg.textContent = `Extreme thermal load detected (${temp}°C). AC cooling is required to maintain safe indoor conditions.`;

  } else if (temp >= 25) {
    fillWidth = "55%";
    fillColor = "linear-gradient(90deg, #f7971e, #ffd200)";
    badgeClass = "medium";
    badgeText = "OPTIMAL";
    statusColor = "#f7971e";
    name.textContent = "Electric Fan";
    status.textContent = "Sufficient Airflow";
    msg.textContent = `Moderate temperatures (${temp}°C). Standard ventilation is sufficient for comfort. Energy load is optimized.`;

  } else {
    fillWidth = "20%";
    fillColor = "linear-gradient(90deg, #11998e, #38ef7d)";
    badgeClass = "low";
    badgeText = "ECO MODE";
    statusColor = "#38ef7d";
    name.textContent = "Natural Cooling";
    status.textContent = "No Power Required";
    msg.textContent = `Favorable climate detected (${temp}°C). Active cooling systems are currently unnecessary.`;
  }

  // Update badge and indicator
  badge.className = "power-badge " + badgeClass;
  badge.textContent = badgeText;
  if (indicator) {
    indicator.style.background = statusColor;
    indicator.style.boxShadow = `0 0 15px ${statusColor}`;
  }

  // Animate meter
  setTimeout(() => {
    fill.style.width = fillWidth;
    fill.style.background = fillColor;
    fill.style.boxShadow = `0 0 20px ${statusColor}88`;
  }, 150);
}
