async function loadDashboard() {
    try {
        const itemsResponse = await fetch("data/items.json");
        const recipesResponse = await fetch("data/recipes_final.json");
        const charactersResponse = await fetch("data/characters.json");
        const schnipselResponse = await fetch("data/schnipsel.json");

        const items = await itemsResponse.json();
        const recipes = await recipesResponse.json();
        const characters = await charactersResponse.json();
        const schnipsel = await schnipselResponse.json();

        document.getElementById("itemCount").textContent = items.length;
        document.getElementById("recipeCount").textContent = recipes.length;
        document.getElementById("characterCount").textContent = characters.length;
        document.getElementById("schnipselCount").textContent = schnipsel.length;

        const mostValuableItem = [...items]
            .sort((a, b) => b.verkaufspreis - a.verkaufspreis)[0];

        const mostValuableFish = items
            .filter(item => item.kategorie === "Fisch")
            .sort((a, b) => b.verkaufspreis - a.verkaufspreis)[0];

        const mostValuableCrop = items
            .filter(item => item.kategorie === "Pflanze")
            .sort((a, b) => b.verkaufspreis - a.verkaufspreis)[0];

        const bestEnergyRecipe = [...recipes]
            .sort((a, b) => b.energie - a.energie)[0];

        document.getElementById("topItem").textContent =
            mostValuableItem
                ? `${mostValuableItem.name} (${mostValuableItem.verkaufspreis} Münzen)`
                : "Keine Daten";

        document.getElementById("topFish").textContent =
            mostValuableFish
                ? `${mostValuableFish.name} (${mostValuableFish.verkaufspreis} Münzen)`
                : "Keine Fischdaten";

        document.getElementById("topCrop").textContent =
            mostValuableCrop
                ? `${mostValuableCrop.name} (${mostValuableCrop.verkaufspreis} Münzen)`
                : "Keine Pflanzendaten";

        document.getElementById("topRecipe").textContent =
            bestEnergyRecipe
                ? `${bestEnergyRecipe.name} (${bestEnergyRecipe.energie} Energie)`
                : "Keine Rezeptdaten";

    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", loadDashboard);