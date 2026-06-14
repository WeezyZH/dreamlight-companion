async function loadItem() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const id =
        parseInt(
            params.get("id")
        );

    const response =
        await fetch(
            "data/items.json"
        );

    const items =
        await response.json();

    const item =
        items.find(
            i => i.id === id
        );

    const container =
        document.getElementById(
            "itemDetails"
        );

    if (!item) {

        container.innerHTML = `
            <h2>Item nicht gefunden</h2>
        `;

        return;
    }

    const recommendation =
        item.behalten
            ? "✅ Behalten empfohlen"
            : "💰 Gut zum Verkaufen";

    container.innerHTML = `

        <img
            class="detail-image"
            src="${item.bild}"
            alt="${item.name}"
            onerror="this.src='images/items/placeholder.png'"
        >

        <h2>${item.name}</h2>

        <p><strong>💰 Verkaufspreis:</strong> ${item.verkaufspreis}</p>

        <p><strong>📍 Fundort:</strong> ${item.fundort}</p>

        <p><strong>🗺️ Biom:</strong> ${item.biom}</p>

        <p><strong>🎮 Inhalt:</strong> ${item.quelle}</p>

        <p><strong>⭐ Seltenheit:</strong> ${item.seltenheit}</p>

        <p><strong>${recommendation}</strong></p>

        <hr>

        <p>${item.beschreibung}</p>

    `;
}

document.addEventListener(
    "DOMContentLoaded",
    loadItem
);