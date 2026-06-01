// ===== SET USER INITIAL =====
const userName = localStorage.getItem('user_name');
if (userName) {
  document.getElementById('profileIcon').textContent = userName.charAt(0).toUpperCase();
}

// ===== FILTER FUNCTION =====
function filterCards() {
  let selected = document.getElementById("skillFilter").value;
  let cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    let skill = card.getAttribute("data-skill");

    if (selected === "all" || skill === selected) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// ===== LIKE BUTTON =====
function likePost(btn) {
  let icon = btn.querySelector(".material-icons");
  let count = btn.querySelector(".like-count");

  if (icon.innerText === "favorite_border") {
    icon.innerText = "favorite";
    count.innerText = parseInt(count.innerText) + 1;
  } else {
    icon.innerText = "favorite_border";
    count.innerText = parseInt(count.innerText) - 1;
  }
}

// ===== COMMENT TOGGLE =====
function toggleComment(btn) {
  let card = btn.closest(".card");
  let box = card.querySelector(".comment-box");

  box.style.display =
    box.style.display === "none" || box.style.display === ""
      ? "block"
      : "none";
}

// ===== POST COMMENT =====
function postComment(btn) {
  let input = btn.previousElementSibling;

  if (input.value.trim() !== "") {
    alert("Comment: " + input.value);
    input.value = "";
  }
}

// ===== DOM LOADED =====
document.addEventListener("DOMContentLoaded", () => {

  // ===== SIDEBAR =====
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.getElementById("overlay");

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      overlay.classList.toggle("active");
    });
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
    });
  }

  // ===== PROFILE DROPDOWN =====
  const profileIcon = document.getElementById("profileIcon");
  const dropdown = document.getElementById("dropdownMenu");

  if (profileIcon && dropdown) {

    profileIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (
        !profileIcon.contains(e.target) &&
        !dropdown.contains(e.target)
      ) {
        dropdown.classList.remove("show");
      }
    });

    // Profile page
    const profileBtn = document.getElementById("profileBtn");

    if (profileBtn) {
      profileBtn.onclick = () => {
        window.location.href = "profile.html";
      };
    }

    // Sign out
    const signOutBtn = document.getElementById("signOutBtn");

    if (signOutBtn) {
      signOutBtn.onclick = () => {
        localStorage.clear();
        window.location.href = "index.html";
      };
    }
  }

  // ===== NOTIFICATION DROPDOWN =====
  const notifIcon = document.getElementById("notifIcon");
  const notifDropdown = document.getElementById("notifDropdown");
  const viewAllBtn = document.getElementById("viewAllBtn");

  if (notifIcon && notifDropdown) {

    notifIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle("show");
    });

    if (viewAllBtn) {
      viewAllBtn.addEventListener("click", () => {
        window.location.href = "notification.html";
      });
    }

    document.addEventListener("click", (e) => {
      if (
        !notifIcon.contains(e.target) &&
        !notifDropdown.contains(e.target)
      ) {
        notifDropdown.classList.remove("show");
      }
    });
  }
});


