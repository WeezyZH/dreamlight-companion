async function loadTopLists() {
    try {
        const itemsResponse = await fetch("data/items.json");
        const recipesResponse = await fetch("data/recipes.json");

        const items = await itemsResponse.json();
        const recipes = await recipesResponse.json();

        showMostValuableItems(items);
        showMostValuableGems(items);
        showMostValuableFish(items);
        showMostValuableCrops(items);
        showKeepItems(items);
        showSellItems(items);
        showBestEnergyRecipes(recipes);

    } catch (error) {
        console.error(error);
    }
}

function createItemCard(item) {
    const recommendation = item.behalten
        ? "✅ Behalten empfohlen"
        : "💰 Gut zum Verkaufen";

    return `
        <div class="card item-card">
            <div class="item-badge">${item.kategorie}</div>

            <h3>
                <a href="item.html?id=${item.id}" class="item-link">
                    ${item.name}
                </a>
            </h3>

            <p>💰 Verkaufspreis: ${item.verkaufspreis} Sternenmünzen</p>
            <p>📍 Fundort: ${item.fundort}</p>
            <p>🗺️ Biom: ${item.biom}</p>
            <p>⭐ Seltenheit: ${item.seltenheit}</p>
            <p>${recommendation}</p>
        </div>
    `;
}

function createRecipeCard(recipe) {
    return `
        <div class="card">
            <div class="item-badge">${"⭐".repeat(recipe.sterne)}</div>

            <h3>${recipe.name}</h3>

            <p>🍎 Zutaten: ${recipe.zutaten.join(", ")}</p>
            <p>💰 Verkaufspreis: ${recipe.verkaufspreis} Sternenmünzen</p>
            <p>⚡ Energie: ${recipe.energie}</p>
            <p>🎮 Inhalt: ${recipe.quelle}</p>
        </div>
    `;
}

function renderList(containerId, items, cardFunction) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = items
        .map(cardFunction)
        .join("");
}

function showMostValuableItems(items) {
    const result = [...items]
        .sort((a, b) => b.verkaufspreis - a.verkaufspreis)
        .slice(0, 6);

    renderList("valuableItemsContainer", result, createItemCard);
}

function showMostValuableGems(items) {
    const result = items
        .filter(item => item.kategorie === "Edelstein")
        .sort((a, b) => b.verkaufspreis - a.verkaufspreis)
        .slice(0, 6);

    renderList("valuableGemsContainer", result, createItemCard);
}

function showMostValuableFish(items) {
    const result = items
        .filter(item => item.kategorie === "Fisch")
        .sort((a, b) => b.verkaufspreis - a.verkaufspreis)
        .slice(0, 6);

    renderList("valuableFishContainer", result, createItemCard);
}

function showMostValuableCrops(items) {
    const result = items
        .filter(item => item.kategorie === "Pflanze")
        .sort((a, b) => b.verkaufspreis - a.verkaufspreis)
        .slice(0, 6);

    renderList("valuableCropsContainer", result, createItemCard);
}

function showKeepItems(items) {
    const result = items
        .filter(item => item.behalten === true)
        .slice(0, 6);

    renderList("keepItemsContainer", result, createItemCard);
}

function showSellItems(items) {
    const result = items
        .filter(item => item.behalten === false)
        .sort((a, b) => b.verkaufspreis - a.verkaufspreis)
        .slice(0, 6);

    renderList("sellItemsContainer", result, createItemCard);
}

function showBestEnergyRecipes(recipes) {
    const result = [...recipes]
        .sort((a, b) => b.energie - a.energie)
        .slice(0, 6);

    renderList("bestEnergyRecipesContainer", result, createRecipeCard);
}

document.addEventListener("DOMContentLoaded", loadTopLists);