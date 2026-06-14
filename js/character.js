async function loadCharacter() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));

    const response = await fetch("data/characters.json");
    const characters = await response.json();

    const character = characters.find(c => c.id === id);
    const container = document.getElementById("characterDetails");

    if (!character) {
        container.innerHTML = `
            <h2>Charakter nicht gefunden</h2>
            <p>Gehe zurück zur Charakterübersicht.</p>
        `;
        return;
    }

    container.innerHTML = `
        <h2>${character.name}</h2>

        <p><strong>🎬 Herkunft:</strong> ${character.film}</p>
        <p><strong>🔓 Freischaltung:</strong> ${character.freischaltung}</p>
        <p><strong>🎁 Bonus:</strong> ${character.bonus}</p>
        <p><strong>⭐ Rolle:</strong> ${character.rolle}</p>
        <p><strong>🎮 Inhalt:</strong> ${character.quelle}</p>

        <hr>

        <p>${character.beschreibung}</p>
    `;
}

document.addEventListener("DOMContentLoaded", loadCharacter);