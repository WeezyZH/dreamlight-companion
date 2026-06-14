let allRecipes = [];

async function loadRecipes() {

    try {

        const response = await fetch("data/recipes.json");

        if (!response.ok) {
            throw new Error("recipes.json konnte nicht geladen werden");
        }

        allRecipes = await response.json();

        displayRecipes(allRecipes);

    } catch (error) {

        console.error(error);

        const container =
            document.getElementById("recipesContainer");

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

function displayRecipes(recipes) {

    const container =
        document.getElementById("recipesContainer");

    if (!container) return;

    container.innerHTML = "";

    if (recipes.length === 0) {

        container.innerHTML = `
            <div class="card">
                <h3>Keine Rezepte gefunden</h3>
                <p>Versuche einen anderen Suchbegriff.</p>
            </div>
        `;

        return;
    }

    recipes.forEach(recipe => {

        const sterne =
            "⭐".repeat(recipe.sterne);

        const zutaten =
            recipe.zutaten.join(", ");

        container.innerHTML += `

            <div class="card">

                <div class="item-badge">
                    ${sterne}
                </div>

                <h3>${recipe.name}</h3>

                <p>
                    🍎 Zutaten:
                    ${zutaten}
                </p>

                <p>
                    💰 Verkaufspreis:
                    ${recipe.verkaufspreis}
                    Sternenmünzen
                </p>

                <p>
                    ⚡ Energie:
                    ${recipe.energie}
                </p>

                <p>
                    🎮 Inhalt:
                    ${recipe.quelle}
                </p>

                <p class="item-description">
                    ${recipe.beschreibung}
                </p>

            </div>

        `;
    });
}

function setupRecipeSearch() {

    const searchInput =
        document.getElementById("recipeSearch");

    if (!searchInput) return;

    searchInput.addEventListener("input", () => {

        const value =
            searchInput.value.toLowerCase();

        const filtered =
            allRecipes.filter(recipe =>

                recipe.name
                    .toLowerCase()
                    .includes(value)

                ||

                recipe.zutaten
                    .join(" ")
                    .toLowerCase()
                    .includes(value)

                ||

                recipe.quelle
                    .toLowerCase()
                    .includes(value)

                ||

                recipe.beschreibung
                    .toLowerCase()
                    .includes(value)
            );

        displayRecipes(filtered);

    });
}

document.addEventListener(
    "DOMContentLoaded",
    () => {
        loadRecipes();
        setupRecipeSearch();
    }
);