let row = document.getElementById("row");
let url = "https://script.google.com/macros/s/AKfycbwIPnH9_NT5w-F-znQypP5dRPdSY8k9zZNZNvhJpyAtBZOgheEpdPnJtVp0f0A7wu-v/exec";
function Getapi() {
  fetch(`${url}?action=read`)
    .then(res => res.json())
    .then(data => {
      row.innerHTML = "";

      data.data.forEach(user => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td><input type="checkbox"></td>
          <td contenteditable="true" class="editable " data-field="name">${user.id}</td>
          <td contenteditable="true" class="editable " data-field="name">${user.name}</td>
          <td contenteditable="true" class="editable" data-field="role"><span class="admin">${user.role}</span></td>
          <td contenteditable="true" class="editable" data-field="stature">${user.stature||"Not Married"}</td>
          <td contenteditable="true" class="editable" data-field="phone">0${user.phone}</td>
          <td><label class="switch"><input type="checkbox" ${user.stature === "TRUE" ? "checked" : ""}><span class="slider round"></span></label></td>
          <td contenteditable="true" class="editable" data-field="email">${user.email}</td>
          <td>${user.last_login||formatDate(user.last_login)}</td>
          <td class="dont_show">${user.image}</td>
          <td class="dont_show">${user.dob}</td>
          <td class="dont_show">${user.working_day}</td>
          <td class="dont_show">${user.working_time}</td>
          <td class="dont_show">${user.salary}</td>
          <td class="dont_show">${user.stature}</td>
          <td class="dont_show">${user.village}</td>
          <td class="dont_show">${user.commune}</td>
          <td class="dont_show">${user.province}</td>
          <td class="dont_show">${user.district}</td>
          <td class="dont_show">${user.district}</td>
          <td>
            <button class="action-btn" onclick='openEditModal(${JSON.stringify(user)})'>Edit</button>
            <button class="action-btn" onclick="deleteUser('${user.id}')">Delete</button>
          </td>
        `;

        row.appendChild(tr);
      });
    });
}

// Open Add user Modal
function openAddModal() {
  document.getElementById("addModal").style.display = "block";
}
// Open Add user Modal

// Close Add Modal
function closeAddModal() {
  document.getElementById("addModal").style.display = "none";
  document.getElementById("addForm").reset();
}




// Delete user
function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  fetch(`${url}?action=delete&id=${id}`)
    .then(res => res.json())
    .then(() => {
      alert("User deleted!");
      Getapi(); // Refresh table
    })
    .catch(err => {
      console.error("Delete failed:", err);
      alert("Failed to delete user.");
    });
}



// Handle Form Submission
document.getElementById("addForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const params = new URLSearchParams(formData).toString();

  fetch(`${url}?action=insert&${params}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        alert("✅ User added successfully!");
        closeAddModal();
        Getapi(); // Refresh the user table
      } else {
        alert("❌ Failed to add user. Please try again.");
      }
    })
    .catch((err) => {
      console.error("Error adding user:", err);
      alert("⚠️ An error occurred while adding the user.");
    });
});

// Optional: Close modal when clicking outside of it
window.onclick = function (event) {
  const modal = document.getElementById("addModal");
  if (event.target == modal) {
    closeAddModal();
  }
};

// Open Edit Modal with Pre-filled Data
function openEditModal(user) {
    document.getElementById("editModal").style.display = "block";
    document.getElementById("editId").value = user.id;
    document.getElementById("editName").value = user.name || "";
    document.getElementById("editUsername").value = user.username || "";
    document.getElementById("editPassword").value = user.password || "";
    document.getElementById("editEmail").value = user.email || "";
    document.getElementById("editPhone").value = user.phone || "";
    document.getElementById("editRole").value = user.role || "";
    document.getElementById("editImage").value = user.image || "";
    document.getElementById("editDob").value = formatDateInput(user.dob);
    document.getElementById("editLastLogin").value = formatDateInput(user.last_login);
    document.getElementById("editRegistered").value = formatDateInput(user.registered);
    document.getElementById("editSalary").value = user.salary || "";
    document.getElementById("editStature").value = user.stature || "";
    document.getElementById("editVillage").value = user.village || "";
    document.getElementById("editCommune").value = user.commune || "";
    document.getElementById("editDistrict").value = user.district || "";
    document.getElementById("editProvince").value = user.province || "";

  // Set Working Day
  const daySelect = document.getElementById("editWorkingDay");
  daySelect.value = user.working_day || "";
  document.getElementById("customDayGroup").style.display = daySelect.value === "Custom" ? "block" : "none";

  // Set Working Time
  const timeSelect = document.getElementById("editWorkingTime");
  timeSelect.value = user.working_time || "";
  document.getElementById("customTimeGroup").style.display = timeSelect.value === "Custom" ? "block" : "none";

}

// Close Edit Modal
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
  document.getElementById("editForm").reset();
}

// Handle Form Submission
document.getElementById("editForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const params = new URLSearchParams(formData).toString();

  fetch(`${url}?action=update&${params}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        alert("✅ User updated successfully!");
        closeEditModal();
        Getapi(); // Refresh the user table
      } else {
        alert("❌ Failed to update user. Please try again.");
      }
    })
    .catch((err) => {
      console.error("Error updating user:", err);
      alert("⚠️ An error occurred while updating the user.");
    });
});

// Optional: Close modal when clicking outside of it
window.onclick = function (event) {
  const modal = document.getElementById("editModal");
  if (event.target == modal) {
    closeEditModal();
  }
};

// Show/hide custom inputs
document.getElementById("editWorkingDay").addEventListener("change", function () {
  const customDayGroup = document.getElementById("customDayGroup");
  customDayGroup.style.display = this.value === "Custom" ? "block" : "none";
});

document.getElementById("editWorkingTime").addEventListener("change", function () {
  const customTimeGroup = document.getElementById("customTimeGroup");
  customTimeGroup.style.display = this.value === "Custom" ? "block" : "none";
});

// Helper: Format date input (date or datetime-local)
function formatDateInput(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
// Format date
function formatDate(input) {
  if (!input) return 'N/A';
  const date = new Date(input);
  return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
}
Getapi();
