let allRecipes = [];
let selectedStars = "all";
let selectedSort = "name";
let currentSearch = "";

async function loadRecipes() {
    try {
        const response = await fetch("data/recipes.json");

        if (!response.ok) {
            throw new Error("recipes.json konnte nicht geladen werden");
        }

        allRecipes = await response.json();

        setupRecipeSearch();
        setupStarFilters();
        setupRecipeSortFilters();

        filterAndDisplayRecipes();

    } catch (error) {
        console.error(error);

        const container = document.getElementById("recipesContainer");

        if (container) {
            container.innerHTML = `
                <div class="card">
                    <h3>Fehler</h3>
                    <p>Die Rezeptdaten konnten nicht geladen werden.</p>
                </div>
            `;
        }
    }
}

function filterAndDisplayRecipes() {
    let filtered = [...allRecipes];

    if (currentSearch) {
        const value = currentSearch.toLowerCase();

        filtered = filtered.filter(recipe =>
            recipe.name.toLowerCase().includes(value) ||
            recipe.zutaten.join(" ").toLowerCase().includes(value) ||
            recipe.quelle.toLowerCase().includes(value) ||
            recipe.beschreibung.toLowerCase().includes(value)
        );
    }

    if (selectedStars !== "all") {
        filtered = filtered.filter(recipe =>
            recipe.sterne === Number(selectedStars)
        );
    }

    sortRecipes(filtered);

    updateRecipeStats(filtered);
    displayRecipes(filtered);
}

function sortRecipes(recipes) {
    if (selectedSort === "name") {
        recipes.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (selectedSort === "priceHigh") {
        recipes.sort((a, b) => b.verkaufspreis - a.verkaufspreis);
    }

    if (selectedSort === "energyHigh") {
        recipes.sort((a, b) => b.energie - a.energie);
    }

    if (selectedSort === "starsHigh") {
        recipes.sort((a, b) => b.sterne - a.sterne);
    }
}

function updateRecipeStats(recipes) {
    const container = document.getElementById("recipeStats");

    if (!container) return;

    const bestPrice = [...recipes].sort((a, b) => b.verkaufspreis - a.verkaufspreis)[0];
    const bestEnergy = [...recipes].sort((a, b) => b.energie - a.energie)[0];
    const fiveStarCount = recipes.filter(recipe => recipe.sterne === 5).length;

    container.innerHTML = `
        <div class="dash-card">
            <strong>🍳 Treffer</strong>
            <span>${recipes.length} Rezepte</span>
        </div>

        <div class="dash-card">
            <strong>💰 Wertvollstes</strong>
            <span>${bestPrice ? `${bestPrice.name} (${bestPrice.verkaufspreis})` : "Keine Daten"}</span>
        </div>

        <div class="dash-card">
            <strong>⚡ Meiste Energie</strong>
            <span>${bestEnergy ? `${bestEnergy.name} (${bestEnergy.energie})` : "Keine Daten"}</span>
        </div>

        <div class="dash-card">
            <strong>⭐⭐⭐⭐⭐</strong>
            <span>${fiveStarCount} Treffer</span>
        </div>
    `;
}

function displayRecipes(recipes) {
    const container = document.getElementById("recipesContainer");

    if (!container) return;

    container.innerHTML = "";

    if (recipes.length === 0) {
        container.innerHTML = `
            <div class="card">
                <h3>Keine Rezepte gefunden</h3>
                <p>Versuche einen anderen Suchbegriff oder ändere den Filter.</p>
            </div>
        `;
        return;
    }

    recipes.forEach(recipe => {
        const sterne = "⭐".repeat(recipe.sterne);
        const zutaten = recipe.zutaten.join(", ");

        container.innerHTML += `
            <div class="card">

                <div class="item-badge">
                    ${sterne}
                </div>

                <h3>${recipe.name}</h3>

                <p><strong>🍎 Zutaten:</strong> ${zutaten}</p>
                <p><strong>💰 Verkaufspreis:</strong> ${recipe.verkaufspreis} Sternenmünzen</p>
                <p><strong>⚡ Energie:</strong> ${recipe.energie}</p>
                <p><strong>🎮 Inhalt:</strong> ${recipe.quelle}</p>

                <p class="item-description">
                    ${recipe.beschreibung}
                </p>

            </div>
        `;
    });
}

function setupRecipeSearch() {
    const searchInput = document.getElementById("recipeSearch");

    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        currentSearch = searchInput.value.trim();
        filterAndDisplayRecipes();
    });
}

function setupStarFilters() {
    const buttons = document.querySelectorAll("#starFilters button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            selectedStars = button.dataset.stars;

            buttons.forEach(btn => btn.classList.remove("active-filter"));
            button.classList.add("active-filter");

            filterAndDisplayRecipes();
        });
    });
}

function setupRecipeSortFilters() {
    const buttons = document.querySelectorAll("#recipeSortFilters button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            selectedSort = button.dataset.sort;

            buttons.forEach(btn => btn.classList.remove("active-filter"));
            button.classList.add("active-filter");

            filterAndDisplayRecipes();
        });
    });
}

document.addEventListener("DOMContentLoaded", loadRecipes);