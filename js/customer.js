const apiUrl =
  "https://script.google.com/macros/s/AKfycby-J3O2aFJN4CTt5D1NxiFjlW02-LMd4EihExFmjrlVurvMKmeNCIlfMjVsvCTojl1F/exec";

window.onload = fetchData;

function openModal(type) {
  document.getElementById(`${type}Modal`).classList.add("active");
}

function closeModal(type) {
  document.getElementById(`${type}Modal`).classList.remove("active");

  // Reset edit modal form if closed
  if (type === "edit") {
    const form = document.getElementById("customer-editForm");
    if (form) form.reset();
  }
}

function fetchData() {
  fetch(`${apiUrl}?action=read`)
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector("#customerTable tbody");
      tbody.innerHTML = "";
      if (data.status === "success") {
        data.data.forEach((customer) => {
          const tr = document.createElement("tr");

          tr.innerHTML = `
          <td>${customer.id}</td>
          <td>${customer.name}</td>
          <td>${customer.email}</td>
          <td>$${parseFloat(customer.phone).toFixed(2)}</td>
          <td>${customer.address}</td>
          <td><img class="customer-img" src="${
            customer.image
          }" alt="customer Image" /></td>
          <td class="customer-actions">
            <button class="customer-edit customer-btn" onclick='editcustomer(${JSON.stringify(
              customer
            )})'>Edit</button>
            <button class="customer-delete customer-btn" onclick='deletecustomer("${
              customer.id
            }")'>Delete</button>
          </td>
        `;
          tbody.appendChild(tr);
        });
      }
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      alert("Failed to load customers.");
    });
}

// Handle Add customer Form Submission
document
  .getElementById("customer-addForm")
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
          alert("customer added successfully!");
          this.reset();
          closeModal("add");
          fetchData();
        } else {
          alert("Failed to add customer: " + (data.message || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Insert Error:", err);
        alert("An error occurred while adding the customer.");
      });
  });

// Handle Edit customer Form Submission
document
  .getElementById("customer-editForm")
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
          alert("customer updated successfully!");
          closeModal("edit");
          fetchData();
        } else {
          alert(
            "Failed to update customer: " + (data.message || "Unknown error")
          );
        }
      })
      .catch((err) => {
        console.error("Update Error:", err);
        alert("An error occurred while updating the customer.");
      });
  });

// Edit customer - Populate Modal
function editcustomer(customer) {
  const form = document.getElementById("customer-editForm");
  if (!form) {
    console.error("Edit form not found!");
    return;
  }

  form.id.value = customer.id;
  form.type.value = customer.name;
  form.size.value = customer.email;
  form.price.value = customer.phone;
  form.instock.value = customer.address;
  form.image.value = customer.image;

  openModal("edit");
}

// Delete customer
function deletecustomer(id) {
  if (!confirm("Are you sure you want to delete this customer?")) return;

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
        alert("customer deleted successfully!");
        fetchData(); // Ensure this exists
      } else {
        alert(
          "Failed to delete customer: " + (data.message || "Unknown error")
        );
      }
    })
    .catch((err) => {
      console.error("Delete Error:", err);
      alert("An error occurred while deleting the customer.");
    });
}

// Search by ID
function searchcustomer() {
  const id = document.getElementById("customer-searchInput").value.trim();
  if (!id) return alert("Please enter a customer ID.");

  fetch(`${apiUrl}?action=search&id=${encodeURIComponent(id)}`)
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector("#customerTable tbody");
      tbody.innerHTML = "";
      if (data.status === "success") {
        const customer = data.data;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${customer.id}</td>
          <td>${customer.name}</td>
          <td>${customer.email}</td>
          <td>$${parseFloat(customer.phone).toFixed(2)}</td>
          <td>${customer.address}</td>
          <td><img class="customer-img" src="${
            customer.image
          }" alt="customer Image" /></td>
          <td class="customer-actions">
            <button class="customer-edit customer-btn" onclick='editcustomer(${JSON.stringify(
              customer
            )})'>Edit</button>
            <button class="customer-delete customer-btn" onclick='deletecustomer("${
              customer.id
            }")'>Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      } else {
        alert("customer not found.");
      }
    })
    .catch((err) => {
      console.error("Search Error:", err);
      alert("An error occurred during search.");
    });
}

// Reset Search
function resetSearch() {
  document.getElementById("customer-searchInput").value = "";
  fetchData();
}
