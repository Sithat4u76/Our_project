const apiURL = 'https://script.google.com/macros/s/AKfycbzqYCYRSTv9Rj5jlC9n_5OoMYp8nVpHDGP_fhSmplO28ztJwPsFfSAXHYZ1vwYjrrYW/exec';

let products = [];

async function fetchProducts() {
try {
    const response = await fetch(apiURL);
    if (!response.ok) throw new Error("Failed to load data");

    products = await response.json();
    renderProducts(products);

    document.getElementById("loading").style.display = "none";

} catch (error) {
    console.error(error);
    document.getElementById("loading").textContent = "❌ Error loading products.";
}
}

function renderProducts(data) {
const container = document.getElementById("productsContainer");
container.innerHTML = "";

if (data.length === 0) {
    container.innerHTML = "<p style='text-align:center;'>No products found.</p>";
    return;
}

data.forEach(product => {
    const card = document.createElement("div");
    card.className = "salereport-card";
    card.innerHTML = `
    <h3>${product.name || ''}</h3>
    <p><strong>ID:</strong> ${product.id || ''}</p>
    <p><strong>Category:</strong> ${product.category || ''}</p>
    <p><strong>Price:</strong> $${parseFloat(product.price).toFixed(2)}</p>
    <p><strong>Stock:</strong> ${product.stock || 0}</p>
    <p><strong>Specs:</strong></p>
    <div class="salereport-specs"><pre>${JSON.stringify(product.specs, null, 2)}</pre></div>
    <p><strong>Inclusions:</strong></p>
    <div class="salereport-inclusions"><pre>${JSON.stringify(product.inclusions, null, 2)}</pre></div>
    `;
    container.appendChild(card);
});
}

document.getElementById("searchInput").addEventListener("input", function () {
const filter = this.value.toLowerCase();
const filtered = products.filter(p =>
    (p.name && p.name.toLowerCase().includes(filter))
);
renderProducts(filtered);
});

window.onload = fetchProducts;