let bntClose = document.getElementsByClassName("close-btn");
document.addEventListener("click", function (event) {
const sidebar = document.querySelector(".sideBar");
const toggleBtn = document.querySelector(".menu-toggle");
if (window.innerWidth <= 899) {
    if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
        sidebar.classList.remove("show");
    }
}
else{
    bntClose.display = "none";
}
});

function MenuToggle() {
    let menu = document.querySelector(".sideBar");
    menu.classList.toggle("show");
}


const today = new Date(2024, 5, 10); // Month is 0-based: 5 = June
const options = { year: 'numeric', month: 'long', day: 'numeric' };
const formattedDate = today.toLocaleDateString('en-US', options);
document.getElementById('myFormattedDate').value = formattedDate;
const now = new Date();
const hours = String(now.getHours()).padStart(2, '0');      // ម៉ោង
const minutes = String(now.getMinutes()).padStart(2, '0');  // នាទី
const currentTime = `${hours}:${minutes}`;
document.getElementById('myTime').value = currentTime;


function loadPage(event, page) {
    event.preventDefault(); // Stop full reload
    fetch(page)
        .then(res => res.text())
        .then(data => {
        document.getElementById("content").innerHTML = data;
        window.history.pushState({}, "", page); // Update URL
    });
}
 // Show image preview BEFORE upload
function uploadImage() {
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (!file) {
    alert("Please select an image first.");
    return;
    }

    const formData = new FormData();
    formData.append("image", file); // This name must match your API field

    fetch("https://script.google.com/macros/s/AKfycbzqYCYRSTv9Rj5jlC9n_5OoMYp8nVpHDGP_fhSmplO28ztJwPsFfSAXHYZ1vwYjrrYW/exec", {
    method: "POST",
    body: formData
    })
    .then(res => res.json())
    .then(data => {
    console.log("Upload success:", data);
    alert("Image uploaded successfully!");

    // Optional: update preview with uploaded URL
    document.getElementById("preview1").src = data.imageUrl;
    document.getElementById("preview2").src = data.imageUrl;
    })
    .catch(err => {
    console.error("Upload error:", err);
    alert("Image upload failed!");
    });
}


// Format date helper
function formatDate(input) {
  if (!input) return 'N/A';
  const date = new Date(input);
  return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
}
