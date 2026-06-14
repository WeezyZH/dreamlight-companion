let allItems = [];
let selectedCategory = "Alle";
let selectedSource = "Alle";
let selectedSort = "name";

async function loadItems() {
    const response = await fetch("data/items.json");
    allItems = await response.json();
    filterItems();
}

function displayItems(items) {
    const container = document.getElementById("itemsContainer");

    if (!container) return;

    container.innerHTML = "";

    if (items.length === 0) {
        container.innerHTML = `
            <div class="card">
                <h3>Keine Items gefunden</h3>
                <p>Versuche eine andere Suche oder ändere den Filter.</p>
            </div>
        `;
        return;
    }

    items.forEach(item => {
        const recommendation = item.behalten
            ? "✅ Behalten empfohlen"
            : "💰 Gut zum Verkaufen";

        container.innerHTML += `
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
                <p>🎮 Inhalt: ${item.quelle}</p>
                <p>⭐ Seltenheit: ${item.seltenheit}</p>
                <p>${recommendation}</p>

                <p class="item-description">${item.beschreibung}</p>

            </div>
        `;
    });
}

function filterItems() {
    const searchInput = document.getElementById("searchInput");
    const searchValue = searchInput ? searchInput.value.toLowerCase() : "";

    let filtered = allItems.filter(item =>
        item.name.toLowerCase().includes(searchValue) ||
        item.fundort.toLowerCase().includes(searchValue) ||
        item.kategorie.toLowerCase().includes(searchValue) ||
        item.quelle.toLowerCase().includes(searchValue) ||
        item.biom.toLowerCase().includes(searchValue) ||
        item.beschreibung.toLowerCase().includes(searchValue)
    );

    if (selectedCategory !== "Alle") {
        filtered = filtered.filter(item => item.kategorie === selectedCategory);
    }

    if (selectedSource !== "Alle") {
        filtered = filtered.filter(item => item.quelle === selectedSource);
    }

    if (selectedSort === "name") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (selectedSort === "priceHigh") {
        filtered.sort((a, b) => b.verkaufspreis - a.verkaufspreis);
    }

    if (selectedSort === "priceLow") {
        filtered.sort((a, b) => a.verkaufspreis - b.verkaufspreis);
    }

    displayItems(filtered);
}

function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", filterItems);
}

function setupSortFilters() {
    const buttons = document.querySelectorAll("#sortFilters button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            selectedSort = button.dataset.sort;

            buttons.forEach(btn => btn.classList.remove("active-filter"));
            button.classList.add("active-filter");

            filterItems();
        });
    });
}

function setupCategoryFilters() {
    const buttons = document.querySelectorAll("#categoryFilters button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            selectedCategory = button.dataset.category;

            buttons.forEach(btn => btn.classList.remove("active-filter"));
            button.classList.add("active-filter");

            filterItems();
        });
    });
}

function setupSourceFilters() {
    const buttons = document.querySelectorAll("#sourceFilters button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            selectedSource = button.dataset.source;

            buttons.forEach(btn => btn.classList.remove("active-filter"));
            button.classList.add("active-filter");

            filterItems();
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadItems();
    setupSearch();
    setupSortFilters();
    setupCategoryFilters();
    setupSourceFilters();
});