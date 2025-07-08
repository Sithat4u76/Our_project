let products = [];

const API_URL = "https://script.google.com/macros/s/AKfycbzqYCYRSTv9Rj5jlC9n_5OoMYp8nVpHDGP_fhSmplO28ztJwPsFfSAXHYZ1vwYjrrYW/exec";

async function fetchProducts() {
try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to load products");
    products = await res.json();
    renderTable();
} catch (err) {
    alert("Error loading products.");
    console.error(err);
}
}

function renderTable() {
const tbody = document.querySelector("#productTable tbody");
tbody.innerHTML = "";

products.forEach(product => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td>${product.id}</td>
    <td>${product.name}</td>
    <td>$${parseFloat(product.price).toFixed(2)}</td>
    <td>${product.stock}</td>
    <td>${product.category || "-"}</td>
    <td>
        <button class="btn btn-edit" onclick="editProduct(${product.id})">Edit</button>
        <button class="btn btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
    </td>
    `;
    tbody.appendChild(tr);
});
}

function openAddModal() {
    document.getElementById("modalTitle").textContent = "Add New Product";
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = "";
    document.getElementById("addModal").style.display = "block";
}

function closeAddModal() {
document.getElementById("addModal").style.display = "none";
}

document.getElementById("productForm").addEventListener("submit", async function (e) {
e.preventDefault();

const formData = new FormData(this);
const product = {};
for (let [key, value] of formData.entries()) {
    if (value.trim()) {
    if (key === "price" || key === "originalPrice") {
        product[key] = parseFloat(value);
    } else if (key === "specs" || key === "inclusions") {
        try {
        product[key] = JSON.parse(value);
        } catch {
        product[key] = value;
        }
    } else {
        product[key] = value;
    }
    }
}

try {
    const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
    });

    if (response.ok) {
    closeAddModal();
    fetchProducts();
    } else {
    alert("Failed to save product.");
    }
} catch (err) {
    alert("Error saving product.");
    console.error(err);
}
});

function editProduct(id) {
const product = products.find(p => p.id === id);
if (!product) return;

document.getElementById("modalTitle").textContent = "Edit Product";
document.getElementById("productId").value = product.id;
document.getElementById("productName").value = product.name;
document.getElementById("productPrice").value = product.price;
document.getElementById("productOriginalPrice").value = product.originalPrice || "";
document.getElementById("productImage").value = product.image || "";
document.getElementById("productStock").value = product.stock || "";
document.getElementById("productCategory").value = product.category || "";
document.getElementById("productDescription").value = product.description || "";
document.getElementById("productSpecs").value = JSON.stringify(product.specs || {});
document.getElementById("productInclusions").value = JSON.stringify(product.inclusions || []);

document.getElementById("addModal").style.display = "block";
}

async function deleteProduct(id) {
if (!confirm("Are you sure you want to delete this product?")) return;

const product = products.find(p => p.id === id);
product._deleted = true;

try {
    const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
    });

    if (response.ok) {
    fetchProducts();
    } else {
    alert("Failed to delete product.");
    }
} catch (err) {
    alert("Error deleting product.");
    console.error(err);
}
}

window.onload = () => {
fetchProducts();
};

window.onclick = function(event) {
const modal = document.getElementById("addModal");
if (event.target == modal) {
    modal.style.display = "none";
}
};