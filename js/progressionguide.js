async function loadProgressionGuide() {
    const response = await fetch("data/progressionguide.json");
    const steps = await response.json();

    displayProgressionSteps(steps);
}

function displayProgressionSteps(steps) {
    const container = document.getElementById("progressionContainer");

    if (!container) return;

    const phases = ["Frühes Spiel", "Mittleres Spiel", "Spätes Spiel", "Endgame"];

    container.innerHTML = "";

    phases.forEach(phase => {
        const phaseSteps = steps.filter(step => step.phase === phase);

        if (phaseSteps.length === 0) return;

        container.innerHTML += `
            <section class="hero glass guide-section">
                <h2>${getPhaseIcon(phase)} ${phase}</h2>
                <div class="cards">
                    ${phaseSteps.map(step => createProgressionCard(step)).join("")}
                </div>
            </section>
        `;
    });
}

function createProgressionCard(step) {
    return `
        <div class="card">
            <div class="item-badge priority-${step.prioritaet.toLowerCase()}">
                ${step.prioritaet}-Priorität
            </div>

            <h3>${step.titel}</h3>

            <p><strong>🎯 Ziel:</strong> ${step.ziel}</p>
            <p><strong>💡 Warum:</strong> ${step.warum}</p>
            <p><strong>✅ Tipp:</strong> ${step.tipp}</p>
        </div>
    `;
}

function getPhaseIcon(phase) {
    if (phase === "Frühes Spiel") return "🌱";
    if (phase === "Mittleres Spiel") return "🌿";
    if (phase === "Spätes Spiel") return "🔥";
    if (phase === "Endgame") return "👑";
    return "🎯";
}

document.addEventListener("DOMContentLoaded", loadProgressionGuide);