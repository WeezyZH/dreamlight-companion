let allCharacters = [];

async function loadCharacters() {
    try {
        const response = await fetch("data/characters.json");

        if (!response.ok) {
            throw new Error("characters.json konnte nicht geladen werden");
        }

        allCharacters = await response.json();
        displayCharacters(allCharacters);

    } catch (error) {
        console.error(error);

        const container = document.getElementById("charactersContainer");

        if (container) {
            container.innerHTML = `
                <div class="card">
                    <h3>Fehler</h3>
                    <p>Die Charakterdaten konnten nicht geladen werden.</p>
                </div>
            `;
        }
    }
}

function displayCharacters(characters) {
    const container = document.getElementById("charactersContainer");

    if (!container) return;

    container.innerHTML = "";

    if (characters.length === 0) {
        container.innerHTML = `
            <div class="card">
                <h3>Keine Charaktere gefunden</h3>
                <p>Versuche einen anderen Suchbegriff.</p>
            </div>
        `;
        return;
    }

    characters.forEach(character => {
        container.innerHTML += `
            <div class="card">
                <div class="item-badge">${character.quelle}</div>

                <h3>
                    <a href="charakter.html?id=${character.id}" class="item-link">
                        ${character.name}
                    </a>
                </h3>

                <p>🎬 Herkunft: ${character.film}</p>
                <p>🔓 Freischaltung: ${character.freischaltung}</p>
                <p>🎁 Bonus: ${character.bonus}</p>
                <p>⭐ Rolle: ${character.rolle}</p>

                <p class="item-description">
                    ${character.beschreibung}
                </p>
            </div>
        `;
    });
}

function setupCharacterSearch() {
    const searchInput = document.getElementById("characterSearch");

    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        const value = searchInput.value.toLowerCase();

        const filtered = allCharacters.filter(character =>
            character.name.toLowerCase().includes(value) ||
            character.film.toLowerCase().includes(value) ||
            character.freischaltung.toLowerCase().includes(value) ||
            character.bonus.toLowerCase().includes(value) ||
            character.rolle.toLowerCase().includes(value) ||
            character.quelle.toLowerCase().includes(value) ||
            character.beschreibung.toLowerCase().includes(value)
        );

        displayCharacters(filtered);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadCharacters();
    setupCharacterSearch();
});