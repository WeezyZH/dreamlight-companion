let allTools = [];

async function loadTools() {
    const response = await fetch("data/tools.json");
    allTools = await response.json();

    displayTools(allTools);
}

function displayTools(tools) {
    const container = document.getElementById("toolsContainer");

    if (!container) return;

    container.innerHTML = "";

    tools.forEach(tool => {
        const upgrades = tool.upgrades.length > 0
            ? tool.upgrades.map(upgrade => `
                <div class="card">
                    <h4>${upgrade.name}</h4>
                    <p><strong>🔓 Freischaltung:</strong> ${upgrade.freischaltung}</p>
                    <p><strong>💰 Kosten:</strong> ${upgrade.kosten}</p>
                    <p><strong>✅ Nutzen:</strong> ${upgrade.nutzen}</p>
                </div>
            `).join("")
            : `
                <div class="card">
                    <h4>Keine bekannten Upgrades</h4>
                    <p>Dieses Werkzeug hat aktuell keine klassischen Verbesserungen.</p>
                </div>
            `;

        container.innerHTML += `
            <section class="hero glass guide-section">
                <h2>${tool.icon} ${tool.name}</h2>

                <div class="cards">
                    <div class="card">
                        <h3>⭐ Priorität</h3>
                        <p>${tool.prioritaet}</p>
                    </div>

                    <div class="card">
                        <h3>🔓 Freischaltung</h3>
                        <p>${tool.freischaltung}</p>
                    </div>

                    <div class="card">
                        <h3>🎯 Wichtig für</h3>
                        <p>${tool.wichtig_fuer}</p>
                    </div>

                    <div class="card">
                        <h3>💡 Tipp</h3>
                        <p>${tool.tipp}</p>
                    </div>
                </div>

                <h3 class="dashboard-title">⬆️ Verbesserungen / Upgrades</h3>

                <div class="cards">
                    ${upgrades}
                </div>
            </section>
        `;
    });
}

document.addEventListener("DOMContentLoaded", loadTools);