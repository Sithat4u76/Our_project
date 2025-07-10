const apiUrl = "https://script.google.com/macros/s/AKfycbwhaTdN_5Efrlt42FbGDmjnRgrHVCZYtJ-WjscZBfBoQL9x7fP6XfqAy2iIqPMjYb8I/exec";

window.onload = fetchData;

function openModal(type) {
document.getElementById(`${type}Modal`).classList.add("active");
}

function closeModal(type) {
document.getElementById(`${type}Modal`).classList.remove("active");

// Reset edit modal form if closed
if (type === "edit") {
  const form = document.getElementById("product-editForm");
  if (form) form.reset();
}
}

function fetchData() {
fetch(`${apiUrl}?action=read`)
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector("#productTable tbody");
    tbody.innerHTML = "";
    if (data.status === "success") {
      data.data.forEach(product => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${product.id}</td>
          <td>${product.type}</td>
          <td>${product.size}</td>
          <td>$${parseFloat(product.price).toFixed(2)}</td>
          <td>${product.instock}</td>
          <td><img class="product-img" src="${product.image}" alt="Product Image" /></td>
          <td class="product-actions">
            <button class="product-edit product-btn" onclick='editProduct(${JSON.stringify(product)})'>Edit</button>
            <button class="product-delete product-btn" onclick='deleteProduct("${product.id}")'>Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  })
  .catch(err => {
    console.error("Error fetching data:", err);
    alert("Failed to load products.");
  });
}

// Handle Add Product Form Submission
document.getElementById("product-addForm").addEventListener("submit", function (e) {
e.preventDefault();

const formData = new FormData(this);
const params = new URLSearchParams(formData);

fetch(`${apiUrl}?action=insert`, {
  method: "POST",
  body: params
})
.then(res => res.json())
.then(data => {
  if (data.status === "success") {
    alert("Product added successfully!");
    this.reset();
    closeModal("add");
    fetchData();
  } else {
    alert("Failed to add product: " + (data.message || "Unknown error"));
  }
})
.catch(err => {
  console.error("Insert Error:", err);
  alert("An error occurred while adding the product.");
});
});

// Handle Edit Product Form Submission
document.getElementById("product-editForm").addEventListener("submit", function (e) {
e.preventDefault();

const formData = new FormData(this);
const params = new URLSearchParams(formData);

fetch(`${apiUrl}?action=update`, {
  method: "POST",
  body: params
})
.then(res => res.json())
.then(data => {
  if (data.status === "success") {
    alert("Product updated successfully!");
    closeModal("edit");
    fetchData();
  } else {
    alert("Failed to update product: " + (data.message || "Unknown error"));
  }
})
.catch(err => {
  console.error("Update Error:", err);
  alert("An error occurred while updating the product.");
});
});

// Edit Product - Populate Modal
function editProduct(product) {
const form = document.getElementById("product-editForm");
if (!form) {
  console.error("Edit form not found!");
  return;
}

form.id.value = product.id;
form.type.value = product.type;
form.size.value = product.size;
form.price.value = product.price;
form.instock.value = product.instock;
form.image.value = product.image;

openModal("edit");
}

// Delete Product
function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  fetch(`${apiUrl}?action=delete`, {
    method: "POST",
    body: new URLSearchParams({ id })
  })
  .then(res => {
    if (!res.ok) throw new Error("HTTP error, status = " + res.status);
    return res.json();
  })
  .then(data => {
    console.log("Delete Response:", data); // Debugging
    if (data.status === "success") {
      alert("Product deleted successfully!");
      fetchData(); // Ensure this exists
    } else {
      alert("Failed to delete product: " + (data.message || "Unknown error"));
    }
  })
  .catch(err => {
    console.error("Delete Error:", err);
    alert("An error occurred while deleting the product.");
  });
}

// Search by ID
function searchProduct() {
  const id = document.getElementById("product-searchInput").value.trim();
  if (!id) return alert("Please enter a product ID.");

  fetch(`${apiUrl}?action=search&id=${encodeURIComponent(id)}`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#productTable tbody");
      tbody.innerHTML = "";
      if (data.status === "success") {
        const product = data.data;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${product.id}</td>
          <td>${product.type}</td>
          <td>${product.size}</td>
          <td>$${parseFloat(product.price).toFixed(2)}</td>
          <td>${product.instock}</td>
          <td><img class="product-img" src="${product.image}" alt="Product Image" /></td>
          <td class="product-actions">
            <button class="product-edit product-btn" onclick='editProduct(${JSON.stringify(product)})'>Edit</button>
            <button class="product-delete product-btn" onclick='deleteProduct("${product.id}")'>Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      } else {
        alert("Product not found.");
      }
    })
    .catch(err => {
      console.error("Search Error:", err);
      alert("An error occurred during search.");
    });
}

// Reset Search
function resetSearch() {
document.getElementById("product-searchInput").value = "";
fetchData();
}