// 🏥 HEALTH & LIFE ANALYSIS — health.js
// Analyzes weather for health tips and outfit suggestions

function updateLifeAnalysis(temp, humidity, weatherDesc, aqi) {
  const placeholder = document.getElementById("lifeAnalysisPlaceholder");

  if (placeholder && !document.getElementById("lifeAnalysisSection")) {
    placeholder.innerHTML = `
      <div class="power-analysis-section" id="lifeAnalysisSection">
        <h2 class="power-analysis-title">HEALTH & LIFE ANALYSIS</h2>
        <div class="power-analysis-card life-analysis-card" id="lifeCard">
          <div class="analysis-grid" id="analysisGrid">
            <div class="analysis-item" style="grid-column: 1 / -1; text-align: center; opacity: 0.6; padding: 20px;">
               <b>Initializing analysis grid...</b>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (temp === undefined) return;

  const grid = document.getElementById("analysisGrid");
  const lifeCard = document.getElementById("lifeCard");
  if (!grid) return;

  grid.innerHTML = "";

  // 1. OUTFIT SUGGESTION
  let outfit = { title: "OUTFIT", desc: "Standard Layering" };
  if (temp > 30) outfit = { title: "CLOTHING", desc: "Lightweight Cotton" };
  else if (temp > 20) outfit = { title: "CLOTHING", desc: "Casual Wear" };
  else outfit = { title: "CLOTHING", desc: "Thermal/Warm Layers" };
  if (weatherDesc && weatherDesc.includes("rain")) outfit = { title: "PROTECTION", desc: "Waterproof Gear" };

  // 2. HYDRATION
  let water = { title: "HYDRATION", desc: "Normal Intake" };
  if (temp > 35) water = { title: "HYDRATION", desc: "Drink 4L+ Water" };
  else if (temp > 28) water = { title: "HYDRATION", desc: "Drink 2.5L Water" };

  // 3. OUTDOOR ACTIVITY
  let outdoor = { title: "OUTDOORS", desc: "Safe Conditions" };
  if (aqi > 3) outdoor = { title: "SAFETY", desc: "Respiratory Shield Required" };
  if (weatherDesc && weatherDesc.includes("thunderstorm")) outdoor = { title: "ADVISORY", desc: "Stay Indoors" };

  // 4. UV PROTECTION
  let uv = { title: "UV LEVEL", desc: "Low Intensity" };
  if (temp > 30 && weatherDesc && !weatherDesc.includes("cloud")) uv = { title: "UV LEVEL", desc: "Sunscreen Required" };

  const items = [outfit, water, outdoor, uv];

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "analysis-item";
    div.innerHTML = `
      <b style="font-size: 11px; letter-spacing: 1px; color: rgba(255,255,255,0.4);">${item.title}</b>
      <p style="margin-top: 5px; font-weight: 600;">${item.desc}</p>
    `;
    grid.appendChild(div);
  });
  
  // Color code based on severity
  if (aqi > 3 || temp > 40) lifeCard.style.borderLeft = "4px solid #ff416c";
  else if (temp > 32) lifeCard.style.borderLeft = "4px solid #f7971e";
  else lifeCard.style.borderLeft = "4px solid #38ef7d";
}
