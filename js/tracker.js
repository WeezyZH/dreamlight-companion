let allItems = [];
let allRecipes = [];
let allCharacters = [];

let currentStatusFilter = "all";
let currentTypeFilter = "all";
let currentSearch = "";

async function loadTracker() {
    try {
        const itemsResponse = await fetch("data/items.json");
        const recipesResponse = await fetch("data/recipes.json");
        const charactersResponse = await fetch("data/characters.json");

        allItems = await itemsResponse.json();
        allRecipes = await recipesResponse.json();
        allCharacters = await charactersResponse.json();

        setupStatusFilters();
        setupTypeFilters();
        setupSearch();

        renderAllTrackers();
        updateProgress();

    } catch (error) {
        console.error(error);
    }
}

function isChecked(type, id) {
    return localStorage.getItem(`${type}-${id}`) === "true";
}

function setChecked(type, id, checked) {
    localStorage.setItem(`${type}-${id}`, checked);
}

function matchesStatus(type, entry) {
    const checked = isChecked(type, entry.id);

    if (currentStatusFilter === "all") return true;
    if (currentStatusFilter === "open") return !checked;
    if (currentStatusFilter === "done") return checked;

    return true;
}

function matchesSearch(entry) {
    if (!currentSearch) return true;

    const search = currentSearch.toLowerCase();

    return (
        entry.name?.toLowerCase().includes(search) ||
        entry.kategorie?.toLowerCase().includes(search) ||
        entry.biom?.toLowerCase().includes(search) ||
        entry.fundort?.toLowerCase().includes(search) ||
        entry.quelle?.toLowerCase().includes(search) ||
        entry.film?.toLowerCase().includes(search) ||
        entry.rolle?.toLowerCase().includes(search)
    );
}

function filterList(type, list) {
    return list.filter(entry =>
        matchesStatus(type, entry) &&
        matchesSearch(entry)
    );
}

function createTrackerCard(type, entry) {
    const checked = isChecked(type, entry.id);

    return `
        <label class="card tracker-card ${checked ? "tracker-done" : ""}">
            <input
                type="checkbox"
                data-type="${type}"
                data-id="${entry.id}"
                ${checked ? "checked" : ""}
            >

            <div>
                <h3>${getTypeIcon(type)} ${entry.name}</h3>
                ${createTrackerMeta(type, entry)}
            </div>
        </label>
    `;
}

function createTrackerMeta(type, entry) {
    if (type === "item") {
        return `
            <p>🏷️ ${entry.kategorie}</p>
            <p>💰 ${entry.verkaufspreis} Münzen</p>
            <p>🗺️ ${entry.biom}</p>
        `;
    }

    if (type === "recipe") {
        return `
            <p>${"⭐".repeat(entry.sterne)} Rezept</p>
            <p>⚡ ${entry.energie} Energie</p>
            <p>💰 ${entry.verkaufspreis} Münzen</p>
        `;
    }

    if (type === "character") {
        return `
            <p>🎬 ${entry.film}</p>
            <p>⭐ ${entry.prioritaet}-Priorität</p>
            <p>🎮 ${entry.quelle}</p>
        `;
    }

    return "";
}

function getTypeIcon(type) {
    if (type === "item") return "💎";
    if (type === "recipe") return "🍳";
    if (type === "character") return "👥";
    return "⭐";
}

function renderItemTracker() {
    const section = document.getElementById("itemSection");
    const container = document.getElementById("itemTracker");

    if (!section || !container) return;

    if (currentTypeFilter !== "all" && currentTypeFilter !== "item") {
        section.style.display = "none";
        return;
    }

    section.style.display = "block";

    const filteredItems = filterList("item", allItems);

    container.innerHTML = filteredItems.length
        ? filteredItems.map(item => createTrackerCard("item", item)).join("")
        : `<p>Keine Items gefunden.</p>`;
}

function renderRecipeTracker() {
    const section = document.getElementById("recipeSection");
    const container = document.getElementById("recipeTracker");

    if (!section || !container) return;

    if (currentTypeFilter !== "all" && currentTypeFilter !== "recipe") {
        section.style.display = "none";
        return;
    }

    section.style.display = "block";

    const filteredRecipes = filterList("recipe", allRecipes);

    container.innerHTML = filteredRecipes.length
        ? filteredRecipes.map(recipe => createTrackerCard("recipe", recipe)).join("")
        : `<p>Keine Rezepte gefunden.</p>`;
}

function renderCharacterTracker() {
    const section = document.getElementById("characterSection");
    const container = document.getElementById("characterTracker");

    if (!section || !container) return;

    if (currentTypeFilter !== "all" && currentTypeFilter !== "character") {
        section.style.display = "none";
        return;
    }

    section.style.display = "block";

    const filteredCharacters = filterList("character", allCharacters);

    container.innerHTML = filteredCharacters.length
        ? filteredCharacters.map(character => createTrackerCard("character", character)).join("")
        : `<p>Keine Charaktere gefunden.</p>`;
}

function renderAllTrackers() {
    renderItemTracker();
    renderRecipeTracker();
    renderCharacterTracker();
    setupCheckboxes();
}

function setupCheckboxes() {
    const checkboxes = document.querySelectorAll(".tracker-card input[type='checkbox']");

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            const type = checkbox.dataset.type;
            const id = checkbox.dataset.id;

            setChecked(type, id, checkbox.checked);

            updateProgress();
            renderAllTrackers();
        });
    });
}

function setupStatusFilters() {
    const buttons = document.querySelectorAll("#statusFilters button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            currentStatusFilter = button.dataset.filter;

            buttons.forEach(btn => btn.classList.remove("active-filter"));
            button.classList.add("active-filter");

            renderAllTrackers();
        });
    });
}

function setupTypeFilters() {
    const buttons = document.querySelectorAll("#typeFilters button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            currentTypeFilter = button.dataset.type;

            buttons.forEach(btn => btn.classList.remove("active-filter"));
            button.classList.add("active-filter");

            renderAllTrackers();
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById("trackerSearch");

    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        currentSearch = searchInput.value.trim();
        renderAllTrackers();
    });
}

function countChecked(type, list) {
    return list.filter(entry => isChecked(type, entry.id)).length;
}

function calculatePercent(done, total) {
    if (total === 0) return 0;
    return Math.round((done / total) * 100);
}

function updateProgress() {
    const checkedItems = countChecked("item", allItems);
    const checkedRecipes = countChecked("recipe", allRecipes);
    const checkedCharacters = countChecked("character", allCharacters);

    const totalChecked = checkedItems + checkedRecipes + checkedCharacters;
    const totalEntries = allItems.length + allRecipes.length + allCharacters.length;

    updateProgressBox("itemProgress", "itemPercent", checkedItems, allItems.length);
    updateProgressBox("recipeProgress", "recipePercent", checkedRecipes, allRecipes.length);
    updateProgressBox("characterProgress", "characterPercent", checkedCharacters, allCharacters.length);
    updateProgressBox("totalProgress", "totalPercent", totalChecked, totalEntries);
}

function updateProgressBox(progressId, percentId, done, total) {
    const progressElement = document.getElementById(progressId);
    const percentElement = document.getElementById(percentId);

    if (progressElement) {
        progressElement.textContent = `${done} / ${total}`;
    }

    if (percentElement) {
        percentElement.textContent = `${calculatePercent(done, total)}%`;
    }
}

document.addEventListener("DOMContentLoaded", loadTracker);