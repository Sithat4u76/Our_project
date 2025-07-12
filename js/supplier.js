const apiUrl =
  "https://script.google.com/macros/s/AKfycbypSGwxoeb6etcmxswpijkqTgFCE8xxz4sYNMXhS358uVJUKqr79Xs6IKBhJBJjdqla/exec";

window.onload = fetchData;

function openModal(type) {
  document.getElementById(`${type}Modal`).classList.add("active");
}

function closeModal(type) {
  document.getElementById(`${type}Modal`).classList.remove("active");

  // Reset edit modal form if closed
  if (type === "edit") {
    const form = document.getElementById("supplier-editForm");
    if (form) form.reset();
  }
}

function fetchData() {
  fetch(`${apiUrl}?action=read`)
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector("#supplierTable tbody");
      tbody.innerHTML = "";
      if (data.status === "success") {
        data.data.forEach((supplier) => {
          const tr = document.createElement("tr");

          tr.innerHTML = `
          <td>${supplier.id}</td>
          <td>${supplier.name}</td>
          <td>${supplier.contect}</td>
          <td>${supplier.phone}</td>
          <td>${supplier.email}</td>
          <td><img class="supplier-img" src="${
            supplier.image
          }" alt="supplier Image" /></td>
          <td class="supplier-actions">
            <button class="supplier-edit supplier-btn" onclick='editsupplier(${JSON.stringify(
              supplier
            )})'>Edit</button>
            <button class="supplier-delete supplier-btn" onclick='deletesupplier("${
              supplier.id
            }")'>Delete</button>
          </td>
        `;
          tbody.appendChild(tr);
        });
      }
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      alert("Failed to load suppliers.");
    });
}

// Handle Add supplier Form Submission
document
  .getElementById("supplier-addForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const params = new URLSearchParams(formData);

    fetch(`${apiUrl}?action=insert`, {
      method: "POST",
      body: params,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          alert("supplier added successfully!");
          this.reset();
          closeModal("add");
          fetchData();
        } else {
          alert("Failed to add supplier: " + (data.message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Insert Error:", err);
        alert("An error occurred while adding the supplier.");
      });
  });

// Handle Edit supplier Form Submission
document
  .getElementById("supplier-editForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const params = new URLSearchParams(formData);

    fetch(`${apiUrl}?action=update`, {
      method: "POST",
      body: params,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          alert("supplier updated successfully!");
          closeModal("edit");
          fetchData();
        } else {
          alert(
            "Failed to update supplier: " + (data.message || "Unknown error")
          );
        }
      })
      .catch((err) => {
        console.error("Update Error:", err);
        alert("An error occurred while updating the supplier.");
      });
  });

// Edit supplier - Populate Modal
function editsupplier(supplier) {
  const form = document.getElementById("supplier-editForm");
  if (!form) {
    console.error("Edit form not found!");
    return;
  }

  form.id.value = supplier.id;
  form.name.value = supplier.name;
  form.contect.value = supplier.contect;
  form.phone.value = supplier.phone;
  form.email.value = supplier.email;
  form.image.value = supplier.image;

  openModal("edit");
}

// Delete supplier
function deletesupplier(id) {
  if (!confirm("Are you sure you want to delete this supplier?")) return;

  fetch(`${apiUrl}?action=delete`, {
    method: "POST",
    body: new URLSearchParams({ id }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("HTTP error, status = " + res.status);
      return res.json();
    })
    .then((data) => {
      console.log("Delete Response:", data); // Debugging
      if (data.status === "success") {
        alert("supplier deleted successfully!");
        fetchData(); // Ensure this exists
      } else {
        alert(
          "Failed to delete supplier: " + (data.message || "Unknown error")
        );
      }
    })
    .catch((err) => {
      console.error("Delete Error:", err);
      alert("An error occurred while deleting the supplier.");
    });
}

// Search by ID
function searchsupplier() {
  const id = document.getElementById("supplier-searchInput").value.trim();
  if (!id) return alert("Please enter a supplier ID.");

  fetch(`${apiUrl}?action=search&id=${encodeURIComponent(id)}`)
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector("#supplierTable tbody");
      tbody.innerHTML = "";
      if (data.status === "success") {
        const supplier = data.data;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${supplier.id}</td>
          <td>${supplier.name}</td>
          <td>${supplier.contect}</td>
          <td>$${parseFloat(supplier.phone).toFixed(2)}</td>
          <td>${supplier.email}</td>
          <td><img class="supplier-img" src="${
            supplier.image
          }" alt="supplier Image" /></td>
          <td class="supplier-actions">
            <button class="supplier-edit supplier-btn" onclick='editsupplier(${JSON.stringify(
              supplier
            )})'>Edit</button>
            <button class="supplier-delete supplier-btn" onclick='deletesupplier("${
              supplier.id
            }")'>Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      } else {
        alert("supplier not found.");
      }
    })
    .catch((err) => {
      console.error("Search Error:", err);
      alert("An error occurred during search.");
    });
}

// Reset Search
function resetSearch() {
  document.getElementById("supplier-searchInput").value = "";
  fetchData();
}
