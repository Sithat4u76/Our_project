let products = [];
let cart = [];

// YOUR GOOGLE APPS SCRIPT API ENDPOINT
const API_URL = "https://script.google.com/macros/s/AKfycbzqYCYRSTv9Rj5jlC9n_5OoMYp8nVpHDGP_fhSmplO28ztJwPsFfSAXHYZ1vwYjrrYW/exec";

async function fetchProducts() {
  try {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to load products");
  products = await res.json();
  renderCategories();
  renderProducts(products);
  document.getElementById('loading').style.display = 'none';
  } catch (err) {
  document.getElementById('loading').textContent = "Error loading products.";
  console.error(err);
  }
}

function renderCategories() {
  const categories = ['all', ...new Set(products.map(p => p.category))];
  const container = document.getElementById('categoryList');
  container.innerHTML = '';
  categories.forEach(cat => {
  const li = document.createElement('li');
  const btn = document.createElement('button');
  btn.textContent = cat;
  btn.className = cat === 'all' ? 'active' : '';
  btn.onclick = () => {
      document.querySelectorAll('#categoryList button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProducts(cat);
  };
  li.appendChild(btn);
  container.appendChild(li);
  });
}

function filterProducts(category) {
  const filtered = category === 'all'
  ? products
  : products.filter(p => p.category === category);
  renderProducts(filtered);
}

function renderProducts(productArray = products) {
  const container = document.getElementById("productListings");
  container.innerHTML = "";
  productArray.forEach(product => {
  const card = document.createElement("div");
  card.className = "product";
  card.dataset.productId = product.id;

  if (product.originalPrice === 0) {
      card.innerHTML = `
      <div class="img_content"><img src="${product.image}" alt="${product.name}"></div>
      <h3>${product.name}</h3>
      <div id="hover-product">
          <p id="price"><span class="price">$${parseFloat(product.price).toFixed(2)}</span></p>
          <p class="stock">${product.stock}</p>
          <button class="add-to-cart">Add To Cart</button>
      </div>`;
  } else {
      card.innerHTML = `
      <div class="img_content"><img src="${product.image}" alt="${product.name}"></div>
      <h3>${product.name}</h3>
      <div id="hover-product">
          <p id="price"><span class="price">$${parseFloat(product.price).toFixed(2)}</span> <del>$${parseFloat(product.originalPrice).toFixed(2)}</del></p>
          <p class="stock">${product.stock}</p>
          <button class="add-to-cart">Add To Cart</button>
      </div>`;
  }

  card.addEventListener("click", () => showDetails(product.id));
  card.querySelector(".add-to-cart").addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(product);
  });

  container.appendChild(card);
  });
}

function showDetails(productId) {
  const product = products.find(p => p.id === productId);
  const modal = document.getElementById("modal");
  const modalImage = modal.querySelector(".modal-image");
  const modalDetails = modal.querySelector(".modal-details");

  modalImage.innerHTML = `<img src="${product.image}" alt="${product.name}" />`;
  modalDetails.innerHTML = `
  <h2>${product.name}</h2>
  <p><strong>Price:</strong> $${parseFloat(product.price).toFixed(2)} ${product.originalPrice > 0 ? '<del>$'+parseFloat(product.originalPrice).toFixed(2)+'</del>' : ''}</p>
  <p><strong>Description:</strong> ${product.description || "No description available."}</p>
  <p><strong>Specifications:</strong></p>
  <ul>
      ${Object.entries(product.spece || {}).map(([k,v]) => `<li><strong>${k}:</strong> ${v}</li>`).join("")}
  </ul>
  <p><strong>Inclusions:</strong></p>
  <ul>
      ${product.inclusions.map(item => `<li>${item}</li>`).join("")}
  </ul>
  `;
  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
  existingItem.quantity += 1;
  } else {
  cart.push({...product, quantity: 1});
  }
  renderCart();
}

function updateCartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountRate = 0.03;
  const taxRate = 0.10;
  const discountAmount = subtotal * discountRate;
  const taxAmount = (subtotal - discountAmount) * taxRate;
  const total = subtotal - discountAmount + taxAmount;

  document.getElementById("cart-subtotal").textContent = subtotal.toFixed(2) + "$";
  document.getElementById("cart-discount").textContent = discountAmount.toFixed(2) + "$";
  document.getElementById("cart-tax").textContent = taxAmount.toFixed(2) + "$";
  document.getElementById("cart-total").textContent = total.toFixed(2) + "$";
  document.getElementById("cartCount").textContent = cart.length;
}

function renderCart() {
  const cartItems = document.querySelector(".cart-items");
  cartItems.innerHTML = "";

  cart.forEach(item => {
  const li = document.createElement("li");
  li.innerHTML = `
      <img src="${item.image}" alt="${item.name}" width="50" />
      <div class="item-details">
      <h3>${item.name}</h3>
      <p>$${item.price.toFixed(2)}</p>
      </div>
      <div class="quantity-controls">
      <button class="btn-move-item" onclick="changeQty(${item.id}, -1)">-</button>
      <span>${item.quantity}</span>
      <button class="btn-move-item" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
      <button class="remove-item" onclick="removeItem(${item.id})">&times;</button>
  `;
  cartItems.appendChild(li);
  });

  updateCartTotals();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
  item.quantity += delta;
  if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== id);
  }
  renderCart();
  }
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

function cartShow() {
  document.getElementById("cart").classList.add("show");
}

function cartClose() {
  document.getElementById("cart").classList.remove("show");
}

// Search functionality
document.getElementById("searchInput").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(query));
  renderProducts(filtered);
});

// Initialize app
window.onload = () => {
  fetchProducts();
};

async function handleCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const saleId = Date.now(); // Unique ID for this sale
  const saleDate = new Date().toISOString();
  const saleItems = [];

  // Prepare sale items and update stock
  const updatedProducts = [...products];
  const requests = cart.map(async item => {
    const productIndex = updatedProducts.findIndex(p => p.id === item.id);
    if (productIndex > -1) {
      const product = updatedProducts[productIndex];

      if (item.quantity > product.stock) {
        alert(`Not enough stock for ${product.name}`);
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      product.stock -= item.quantity;

      saleItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        totalPrice: item.quantity * product.price
      });

      return fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
    }
  });

  try {
    // Send all updates at once
    await Promise.all(requests);

    // Save sale data
    const saleData = {
      saleId,
      saleDate,
      customerName: "Guest", // Can be replaced with logged-in user name later
      items: saleItems,
      totalAmount: saleItems.reduce((sum, i) => sum + i.totalPrice, 0),
      paymentStatus: "Paid"
    };

    // Send POST request to save sale
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saleData)
    });

    if (!res.ok) throw new Error("Failed to save sale");

    alert("✅ Purchase completed successfully!");
    cart = [];
    renderCart();
    fetchProducts(); // Refresh product list
  } catch (err) {
    console.error(err);
    alert("❌ There was an error processing your purchase.");
  }
}
