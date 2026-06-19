let allItems = [];
let preparedItems = [];
let selectedCategory = "Alle";
let selectedSource = "Alle";
let selectedSort = "name";
let searchTimeout = null;

async function loadItems() {
    const response = await fetch("data/items.json");
    allItems = await response.json();

    preparedItems = allItems.map(item => {
        const searchableText = [
            item.name,
            item.fundort,
            item.kategorie,
            item.quelle,
            item.biom,
            item.beschreibung,
            item.blasenfarbe,
            item.wetter,
            item.zeit
        ]
            .filter(hasValue)
            .join(" ")
            .toLowerCase();

        return {
            ...item,
            searchableText
        };
    });

    filterItems();
}

function escapeText(value) {
    if (value === undefined || value === null) return "";

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function hasValue(value) {
    return value !== undefined &&
        value !== null &&
        String(value).trim() !== "";
}

function createFishDetails(item) {
    if (item.kategorie !== "Fisch") return "";

    const details = [];

    if (hasValue(item.blasenfarbe)) {
        details.push(`<p>🎣 Blasenfarbe: ${escapeText(item.blasenfarbe)}</p>`);
    }

    if (hasValue(item.wetter)) {
        details.push(`<p>🌦️ Wetter: ${escapeText(item.wetter)}</p>`);
    }

    if (hasValue(item.zeit)) {
        details.push(`<p>🕒 Zeit: ${escapeText(item.zeit)}</p>`);
    }

    return details.join("");
}

function createItemCard(item) {
    const recommendation = item.behalten
        ? "✅ Behalten empfohlen"
        : "💰 Gut zum Verkaufen";

    const fishDetails = createFishDetails(item);

    return `
        <div class="card item-card">

            <img
                class="item-image"
                src="${escapeText(item.bild)}"
                alt="${escapeText(item.name)}"
                onerror="this.src='images/items/placeholder.png'"
            >

            <div class="item-badge">${escapeText(item.kategorie)}</div>

            <h3>
                <a href="item.html?id=${escapeText(item.id)}" class="item-link">
                    ${escapeText(item.name)}
                </a>
            </h3>

            <p>💰 Verkaufspreis: ${escapeText(item.verkaufspreis)} Sternenmünzen</p>
            <p>📍 Fundort: ${escapeText(item.fundort)}</p>
            <p>🗺️ Biom: ${escapeText(item.biom)}</p>
            <p>🎮 Inhalt: ${escapeText(item.quelle)}</p>
            <p>⭐ Seltenheit: ${escapeText(item.seltenheit)}</p>
            ${fishDetails}
            <p>${recommendation}</p>

            <p class="item-description">${escapeText(item.beschreibung)}</p>

        </div>
    `;
}

function displayItems(items) {
    const container = document.getElementById("itemsContainer");

    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = `
            <div class="card">
                <h3>Keine Items gefunden</h3>
                <p>Versuche eine andere Suche oder ändere den Filter.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(createItemCard).join("");
}

function filterItems() {
    const searchInput = document.getElementById("searchInput");
    const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : "";

    let filtered = preparedItems.filter(item => {
        const matchesSearch =
            searchValue === "" ||
            item.searchableText.includes(searchValue);

        const matchesCategory =
            selectedCategory === "Alle" ||
            item.kategorie === selectedCategory;

        const matchesSource =
            selectedSource === "Alle" ||
            item.quelle === selectedSource;

        return matchesSearch && matchesCategory && matchesSource;
    });

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

    searchInput.addEventListener("input", () => {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            filterItems();
        }, 300);
    });
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