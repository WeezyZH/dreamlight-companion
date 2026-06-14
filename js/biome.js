let allItems = [];
let allBiomes = [];

const biomeOrder = [
    "Platz",
    "Friedliche Wiese",
    "Schillernder Strand",
    "Wald der Tapferkeit",
    "Lichtung des Vertrauens",
    "Sonnige Ebene",
    "Eisige Höhen",
    "Vergessene Lande",
    "Chez Remy",
    "Handwerk",
    "Alle Gebiete"
];

async function loadBiomeData() {
    const itemsResponse = await fetch("data/items.json");
    const biomesResponse = await fetch("data/biomes.json");

    allItems = await itemsResponse.json();
    allBiomes = await biomesResponse.json();

    renderBiomes(allItems);
    setupBiomeSearch();
}

function getUniqueBiomes(items) {
    const biomes = [...new Set(items.map(item => item.biom))];

    return biomes.sort((a, b) => {
        const indexA = biomeOrder.indexOf(a);
        const indexB = biomeOrder.indexOf(b);

        if (indexA === -1 && indexB === -1) {
            return a.localeCompare(b);
        }

        if (indexA === -1) return 1;
        if (indexB === -1) return -1;

        return indexA - indexB;
    });
}

function renderBiomes(items) {
    const container = document.getElementById("biomeContainer");

    if (!container) return;

    container.innerHTML = "";

    const biomes = getUniqueBiomes(items);

    biomes.forEach(biome => {
        const biomeItems = items.filter(item => item.biom === biome);
        const biomeInfo = allBiomes.find(info => info.name === biome);

        const bestMoneyItem = [...biomeItems]
            .sort((a, b) => b.verkaufspreis - a.verkaufspreis)[0];

        const gems = biomeItems.filter(item => item.kategorie === "Edelstein");
        const fish = biomeItems.filter(item => item.kategorie === "Fisch");
        const crops = biomeItems.filter(item => item.kategorie === "Pflanze");
        const materials = biomeItems.filter(item => item.kategorie === "Handwerk");
        const ingredients = biomeItems.filter(item => item.kategorie === "Zutat");
        const flowers = biomeItems.filter(item => item.kategorie === "Blume");

        container.innerHTML += `
            <section class="biome-block">

                <h2>🗺️ ${biome}</h2>

                ${biomeInfo ? createBiomeInfoBox(biomeInfo, biomeItems) : ""}

                <div class="cards">

                    <div class="card">
                        <h3>📦 Gesamt</h3>
                        <p>${biomeItems.length} Einträge in deiner Datenbank</p>
                    </div>

                    <div class="card">
                        <h3>💰 Beste Geldquelle</h3>
                        <p>
                            ${bestMoneyItem
                                ? `${bestMoneyItem.name} (${bestMoneyItem.verkaufspreis} Münzen)`
                                : "Noch keine Daten"}
                        </p>
                    </div>

                    <div class="card">
                        <h3>💎 Edelsteine (${gems.length})</h3>
                        <p>${formatItemList(gems)}</p>
                    </div>

                    <div class="card">
                        <h3>🐟 Fische (${fish.length})</h3>
                        <p>${formatItemList(fish)}</p>
                    </div>

                    <div class="card">
                        <h3>🎃 Pflanzen (${crops.length})</h3>
                        <p>${formatItemList(crops)}</p>
                    </div>

                    <div class="card">
                        <h3>🍎 Zutaten (${ingredients.length})</h3>
                        <p>${formatItemList(ingredients)}</p>
                    </div>

                    <div class="card">
                        <h3>🌸 Blumen (${flowers.length})</h3>
                        <p>${formatItemList(flowers)}</p>
                    </div>

                    <div class="card">
                        <h3>🛠️ Materialien (${materials.length})</h3>
                        <p>${formatItemList(materials)}</p>
                    </div>

                </div>

            </section>
        `;
    });
}

function createBiomeInfoBox(info, biomeItems) {
    const dreamlightText = info.dreamlight === 0
        ? "Keine Dreamlight-Kosten"
        : `${info.dreamlight} Dreamlight`;

    const sellableItems = biomeItems.filter(item => item.behalten === false);
    const keepItems = biomeItems.filter(item => item.behalten === true);

    return `
        <div class="cards biome-info-cards">

            <div class="card">
                <h3>⭐ Priorität</h3>
                <p>${info.prioritaet}-Priorität</p>
                <p>${info.phase}</p>
            </div>

            <div class="card">
                <h3>🔓 Freischaltung</h3>
                <p>${info.freischaltung}</p>
                <p>✨ ${dreamlightText}</p>
            </div>

            <div class="card">
                <h3>💰 Geldquelle</h3>
                <p>${info.besteGeldquelle}</p>
            </div>

            <div class="card">
                <h3>📊 Datenbank</h3>
                <p>${biomeItems.length} Items</p>
                <p>💰 ${sellableItems.length} gut verkaufbar</p>
                <p>✅ ${keepItems.length} besser behalten</p>
            </div>

            <div class="card">
                <h3>💡 Tipp</h3>
                <p>${info.tipp}</p>
            </div>

            <div class="card">
                <h3>🎯 Wichtig für</h3>
                <p>${info.wichtigFuer.join(", ")}</p>
            </div>

        </div>
    `;
}

function formatItemList(items) {
    if (items.length === 0) {
        return "Noch keine Daten";
    }

    return items
        .map(item => `
            <a href="item.html?id=${item.id}" class="item-link">
                ${item.name}
            </a>
        `)
        .join(", ");
}

function setupBiomeSearch() {
    const searchInput = document.getElementById("biomeSearch");

    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        const value = searchInput.value.toLowerCase();

        const filteredItems = allItems.filter(item =>
            item.name.toLowerCase().includes(value) ||
            item.biom.toLowerCase().includes(value) ||
            item.fundort.toLowerCase().includes(value) ||
            item.kategorie.toLowerCase().includes(value)
        );

        renderBiomes(filteredItems);
    });
}

document.addEventListener("DOMContentLoaded", loadBiomeData);