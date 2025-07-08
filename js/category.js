const API_URL = "https://script.google.com/macros/s/AKfycbzqYCYRSTv9Rj5jlC9n_5OoMYp8nVpHDGP_fhSmplO28ztJwPsFfSAXHYZ1vwYjrrYW/exec";

// Hardcoded default categories
let categories = [
    { id: 1, name: "Computer", icon: "💻" },
    { id: 2, name: "Phone", icon: "📱" },
    { id: 3, name: "Tablet", icon: "🖥️" },
    { id: 4, name: "Console", icon: "🎮" },
    { id: 5, name: "Accessories", icon: "🎧" },
    { id: 6, name: "Others", icon: "📦" }
];

let selectedCategory = null;
let currentEditCategory = null;
let products = [];

const categoriesContainer = document.getElementById("categories");
const productsContainer = document.getElementById("products");
const emptyProductsMessage = document.getElementById("empty-products");
const modal = document.getElementById("modal");
const loading = document.getElementById("loading");
async function loadProducts() {
    showLoading(true);
    try {
    const response = await fetch(API_URL);
    products = await response.json();
    } catch (err) {
    alert("Failed to load products.");
    } finally {
    showLoading(false);
    }
}
function renderCategories() {
    categoriesContainer.innerHTML = "";
    categories.forEach(category => {
    const card = document.createElement("div");
    card.className = "category-card";
    if (selectedCategory && selectedCategory.id === category.id) {
        card.classList.add("selected");
    }
    card.innerHTML = `
        <div class="category-icon">${category.icon}</div>
        <div>${category.name}</div>
    `;
    card.onclick = () => selectCategory(category);
    categoriesContainer.appendChild(card);
    });
}

function selectCategory(category) {
    selectedCategory = selectedCategory?.id === category.id ? null : category;
    renderCategories();
    renderProducts();
}

function renderProducts() {
    productsContainer.innerHTML = "";
    if (!selectedCategory) return;

    const filtered = products.filter(p => p.category === selectedCategory.name);

    if (filtered.length === 0) {
    emptyProductsMessage.style.display = "block";
    return;
    }

    emptyProductsMessage.style.display = "none";

    filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "category-product-card";
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="category-product-image" />
        <div class="category-product-info">
        <div class="category-product-name">${product.name}</div>
        <div class="category-product-id">ID: ${product.id}</div>
        <div class="category-product-price">$${parseFloat(product.price).toFixed(2)}</div>
        </div>
    `;
    productsContainer.appendChild(card);
    });
}

// Modal logic
const modalTitle = document.getElementById("modal-title");
const categoryNameInput = document.getElementById("category-name");
const categoryIconInput = document.getElementById("category-icon");
const saveBtn = document.getElementById("save-category-btn");
const deleteBtn = document.getElementById("delete-category-btn");
const closeBtn = document.getElementById("close-modal");
const cancelBtn = document.getElementById("cancel-btn");
const addBtn = document.querySelector(".add-category-btn");

function openModal(category = null) {
    currentEditCategory = category;
    if (category) {
    modalTitle.textContent = "Edit Category";
    categoryNameInput.value = category.name;
    categoryIconInput.value = category.icon;
    deleteBtn.style.display = "inline-block";
    } else {
    modalTitle.textContent = "Add New Category";
    categoryNameInput.value = "";
    categoryIconInput.value = "";
    deleteBtn.style.display = "none";
    }
    modal.classList.add("active");
    modal.style.visibility = "visible";
    modal.style.opacity = "1";
}

function closeModal() {
    modal.classList.remove("active");
    modal.style.visibility = "hidden";
    modal.style.opacity = "0";
    currentEditCategory = null;
}

saveBtn.onclick = () => {
    const name = categoryNameInput.value.trim();
    const icon = categoryIconInput.value.trim();
    if (!name || !icon) {
    alert("Please fill in both fields.");
    return;
    }

    if (currentEditCategory) {
    Object.assign(currentEditCategory, { name, icon });
    } else {
    const newId = Math.max(...categories.map(c => c.id)) + 1;
    categories.push({ id: newId, name, icon });
    }

    renderCategories();
    closeModal();
};

deleteBtn.onclick = () => {
    if (confirm("Are you sure you want to delete this category?")) {
    categories = categories.filter(c => c.id !== currentEditCategory.id);
    if (selectedCategory && selectedCategory.id === currentEditCategory.id) {
        selectedCategory = null;
        productsContainer.innerHTML = "";
    }
    renderCategories();
    closeModal();
    }
};

closeBtn.onclick = cancelBtn.onclick = closeModal;
addBtn.onclick = () => openModal();

function showLoading(show) {
    loading.classList.toggle("active", show);
}

// Initialize
loadProducts().then(() => {
    renderCategories();
});