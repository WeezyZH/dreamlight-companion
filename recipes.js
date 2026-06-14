let allRecipes = [];
let selectedStars = "all";
let selectedSort = "name";

async function loadRecipes() {
    const response = await fetch("data/recipes.json");
    allRecipes = await response.json();
    filterRecipes();
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
        const sterne = "⭐".repeat(Number(recipe.sterne));
        const zutaten = recipe.zutaten.join(", ");

        container.innerHTML += `
            <div class="card">
                <div class="item-badge">${sterne}</div>

                <h3>${recipe.name}</h3>

                <p><strong>🍎 Zutaten:</strong> ${zutaten}</p>
                <p><strong>💰 Verkaufspreis:</strong> ${recipe.verkaufspreis} Sternenmünzen</p>
                <p><strong>⚡ Energie:</strong> ${recipe.energie}</p>
                <p><strong>🎮 Inhalt:</strong> ${recipe.quelle}</p>

                <p class="item-description">${recipe.beschreibung}</p>
            </div>
        `;
    });
}

function filterRecipes() {
    const searchInput = document.getElementById("recipeSearch");
    const searchValue = searchInput ? searchInput.value.toLowerCase() : "";

    let filtered = allRecipes.filter(recipe =>
        String(recipe.name).toLowerCase().includes(searchValue) ||
        recipe.zutaten.join(" ").toLowerCase().includes(searchValue) ||
        String(recipe.quelle).toLowerCase().includes(searchValue) ||
        String(recipe.beschreibung).toLowerCase().includes(searchValue)
    );

    if (selectedStars !== "all") {
        filtered = filtered.filter(recipe =>
            Number(recipe.sterne) === Number(selectedStars)
        );
    }

    if (selectedSort === "name") {
        filtered.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    }

    if (selectedSort === "priceHigh") {
        filtered.sort((a, b) => Number(b.verkaufspreis) - Number(a.verkaufspreis));
    }

    if (selectedSort === "energyHigh") {
        filtered.sort((a, b) => Number(b.energie) - Number(a.energie));
    }

    if (selectedSort === "starsHigh") {
        filtered.sort((a, b) => Number(b.sterne) - Number(a.sterne));
    }

    updateRecipeStats(filtered);
    displayRecipes(filtered);
}

function updateRecipeStats(recipes) {
    const container = document.getElementById("recipeStats");

    if (!container) return;

    const bestPrice = [...recipes].sort((a, b) => Number(b.verkaufspreis) - Number(a.verkaufspreis))[0];
    const bestEnergy = [...recipes].sort((a, b) => Number(b.energie) - Number(a.energie))[0];
    const fiveStarCount = recipes.filter(recipe => Number(recipe.sterne) === 5).length;

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

function setupRecipeSearch() {
    const searchInput = document.getElementById("recipeSearch");

    if (!searchInput) return;

    searchInput.addEventListener("input", filterRecipes);
}

function setupStarFilters() {
    const buttons = document.querySelectorAll("#starFilters button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            selectedStars = button.dataset.stars;

            buttons.forEach(btn => btn.classList.remove("active-filter"));
            button.classList.add("active-filter");

            filterRecipes();
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

            filterRecipes();
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadRecipes();
    setupRecipeSearch();
    setupStarFilters();
    setupRecipeSortFilters();
});