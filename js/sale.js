const apiUrl = 'https://script.google.com/macros/s/AKfycbwhaTdN_5Efrlt42FbGDmjnRgrHVCZYtJ-WjscZBfBoQL9x7fP6XfqAy2iIqPMjYb8I/exec?action=read';

    let cart = [];
    let allProducts = []; // To store all products fetched from API
    // Load all products from API
    async function loadProducts() {
      try {
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result.status === 'success') {
          allProducts = result.data;
          renderProducts(allProducts);
        } else {
          alert('Failed to load products.');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        alert('Could not connect to the server.');
      }
    }
    document.getElementById('searchInput').addEventListener('input', filterProducts);

    document.querySelectorAll('.category-buttons button').forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class
        document.querySelector('.category-buttons .active').classList.remove('active');
        // Add active class to clicked button
        button.classList.add('active');
        // Re-filter
        filterProducts();
      });
    });

    function renderProducts(filteredProducts) {
      const container = document.getElementById('products-container');
      container.innerHTML = '';

      filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
          <img src="${product.image}" alt="${product.type}" class="product-image">
          <div class="product-info">
            <div class="product-name">${product.type}</div>
            <div class="product-size">size:${product.size}</div>
            <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
            <div class="stock-status">In Stock: ${product.instock}</div>
            <button class="add-to-cart" onclick='addToCart("${product.id}", "${product.type}","${product.size}", ${product.price}, "${product.image}")'>Add To Cart</button>
          </div>
        `;
        container.appendChild(card);
      });
    }

    // Filter products based on category and search text
    function filterProducts() {
      const selectedCategory = document.querySelector('.category-buttons .active').dataset.category;
      const searchText = document.getElementById('searchInput').value.trim().toLowerCase();

      let filtered = [...allProducts];

      // Filter by category
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(product =>
          (product.type || "").trim().toLowerCase() === selectedCategory.toLowerCase()
        );
      }

      // Filter by search text
      if (searchText) {
        filtered = filtered.filter(product =>
          (product.type || "").toLowerCase().includes(searchText)
        );
      }

      renderProducts(filtered);
    }


   

    function addToCart(id, name, size, price, image) {
      const existingItem = cart.find(item => item.id === id);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({
          id,
          name,
          size,
          price,
          image,
          quantity: 1,
        });
      }

      updateCartUI();
      calculateTotals();
      updateCartCount();
    }

    function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';

      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width:60px;height:60px;object-fit:cover;margin-right:10px;">
        <div class="cart-item-details">
          <strong>${item.name}</strong><br/>
          <strong>size:${item.size}</strong><br/>
          $${item.price.toFixed(2)} x ${item.quantity}
        </div>
        <div class="cart-item-actions">
          <div class="quantity-control">
            <button onclick="updateQuantity('${item.id}', -1)">−</button>
            <button>${item.quantity}</button>
            <button onclick="updateQuantity('${item.id}', 1)">+</button>
          </div>
          <span class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</span>
        </div>
      `;
      cartItemsContainer.appendChild(cartItem);
    });
  }

    function updateQuantity(id, change) {
      const item = cart.find(item => item.id === id);
      if (item) {
        item.quantity += change;
        if (item.quantity <= 0) removeFromCart(id);
        updateCartUI();
        calculateTotals();
      }
    }

    function removeFromCart(id) {
      cart = cart.filter(item => item.id !== id);
      updateCartUI();
      calculateTotals();
      updateCartCount();
    }

    function calculateTotals() {
      let subtotal = 0;
      cart.forEach(item => {
        subtotal += item.price * item.quantity;
      });

      const discountRate = 0.03; // 3%
      const taxRate = 0.10; // 10%

      const discount = subtotal * discountRate;
      const tax = (subtotal - discount) * taxRate;
      const total = subtotal - discount + tax;

      document.getElementById('subtotal').textContent = subtotal.toFixed(2);
      document.getElementById('discount').textContent = discount.toFixed(2);
      document.getElementById('tax').textContent = tax.toFixed(2);
      document.getElementById('total').textContent = total.toFixed(2);
    }

    function toggleCart() {
      const cartSidebar = document.getElementById('cart-sidebar');
      cartSidebar.style.display = cartSidebar.style.display === 'none' ? 'block' : 'none';
    }

    function updateCartCount() {
      document.getElementById('cart-count').textContent = cart.length;
    }

    // Load products on page load
    window.onload = loadProducts;