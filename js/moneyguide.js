async function loadMoneyGuide() {
    const itemsResponse = await fetch("data/items.json");
    const items = await itemsResponse.json();

    showMoneyList("moneyCrops", items, "Pflanze");
    showMoneyList("moneyGems", items, "Edelstein");
    showMoneyList("moneyFish", items, "Fisch");

    const guideResponse = await fetch("data/moneyguide.json");
    const guideEntries = await guideResponse.json();

    showGuideEntries(guideEntries);
}

function showMoneyList(containerId, items, category) {
    const container = document.getElementById(containerId);

    if (!container) return;

    const result = items
        .filter(item => item.kategorie === category)
        .sort((a, b) => b.verkaufspreis - a.verkaufspreis)
        .slice(0, 6);

    container.innerHTML = result
        .map(item => createMoneyCard(item))
        .join("");
}

function createMoneyCard(item) {
    const recommendation = item.behalten
        ? "✅ Einige behalten"
        : "💰 Gut zum Verkaufen";

    return `
        <div class="card item-card">

            <img
                class="item-image"
                src="${item.bild}"
                alt="${item.name}"
                onerror="this.src='images/items/placeholder.png'"
            >

            <div class="item-badge">${item.kategorie}</div>

            <h3>
                <a href="item.html?id=${item.id}" class="item-link">
                    ${item.name}
                </a>
            </h3>

            <p>💰 Verkaufspreis: ${item.verkaufspreis} Sternenmünzen</p>
            <p>📍 Fundort: ${item.fundort}</p>
            <p>🗺️ Biom: ${item.biom}</p>
            <p>${recommendation}</p>

        </div>
    `;
}

function showGuideEntries(entries) {
    const container = document.getElementById("moneyGuideContainer");

    if (!container) return;

    const categories = ["Pflanze", "Fisch", "Edelstein", "Rezept", "Route", "Warnung"];

    container.innerHTML = "";

    categories.forEach(category => {
        const categoryEntries = entries.filter(entry => entry.kategorie === category);

        if (categoryEntries.length === 0) return;

        container.innerHTML += `
            <section class="hero glass guide-section">
                <h2>${getMoneyCategoryIcon(category)} ${getMoneyCategoryTitle(category)}</h2>

                <div class="cards">
                    ${categoryEntries.map(entry => createGuideCard(entry)).join("")}
                </div>
            </section>
        `;
    });
}

function createGuideCard(entry) {
    return `
        <div class="card">
            <div class="item-badge">${entry.rang}-Rang · ${entry.phase}</div>

            <h3>${entry.name}</h3>

            <p><strong>🗺️ Bereich:</strong> ${entry.biom}</p>
            <p><strong>💰 Warum gut:</strong> ${entry.grund}</p>
            <p><strong>✅ Tipp:</strong> ${entry.tipp}</p>
        </div>
    `;
}

function getMoneyCategoryIcon(category) {
    if (category === "Pflanze") return "🎃";
    if (category === "Fisch") return "🐟";
    if (category === "Edelstein") return "💎";
    if (category === "Rezept") return "🍳";
    if (category === "Route") return "🧭";
    if (category === "Warnung") return "⚠️";
    return "💰";
}

function getMoneyCategoryTitle(category) {
    if (category === "Pflanze") return "Beste Pflanzen";
    if (category === "Fisch") return "Beste Fische";
    if (category === "Edelstein") return "Beste Edelsteine";
    if (category === "Rezept") return "Beste Geld-Rezepte";
    if (category === "Route") return "Beste Farm-Routen";
    if (category === "Warnung") return "Nicht verkaufen";
    return category;
}

document.addEventListener("DOMContentLoaded", loadMoneyGuide);