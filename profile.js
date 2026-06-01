document.addEventListener("DOMContentLoaded", () => {
  // ===== USER INFO =====
  const userName  = localStorage.getItem('user_name')  || 'User';
  const userEmail = localStorage.getItem('user_email') || '';

  const profileIconEl = document.getElementById('profileIcon');
  if (profileIconEl) profileIconEl.textContent = userName.charAt(0).toUpperCase();

  const profileNameEl  = document.getElementById('profileName');
  const profileEmailEl = document.getElementById('profileEmail');
  if (profileNameEl)  profileNameEl.textContent  = userName;
  if (profileEmailEl) profileEmailEl.textContent = userEmail;

  // ================= DATA =================
  let teachSkills = JSON.parse(localStorage.getItem("teachSkills")) || [];
  let learnSkills = JSON.parse(localStorage.getItem("learnSkills")) || [];

  // ================= ELEMENTS =================
  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");

  const bioText = document.getElementById("bioText");
  const bioInput = document.getElementById("bioInput");

  const skillsView = document.getElementById("skillsView");
  const skillsEdit = document.getElementById("skillsEdit");

  const teachTags = document.getElementById("teachTags");
  const learnTags = document.getElementById("learnTags");

  const teachList = document.getElementById("teachList");
  const learnList = document.getElementById("learnList");

  const profileImg = document.getElementById("profileImg");
  const imgInput = document.getElementById("imgInput");
  const profileImageWrapper = document.querySelector(".profile-image-wrapper");

  const menuBtn = document.querySelector(".menu-btn");
  const sidebar = document.querySelector(".sidebar");

  const profileIcon = document.getElementById("profileIcon");
  const dropdown = document.getElementById("dropdownMenu");

  let tempImage = null;

  // ================= LOAD BIO =================
  const savedBio = localStorage.getItem("bio");
  if (savedBio) bioText.innerText = savedBio;

  // ================= PROFILE IMAGE =================
  let savedImg = localStorage.getItem("profileImage");

  if (savedImg) {
    profileImg.style.backgroundImage = `url(${savedImg})`;
  } else {
    profileImg.style.backgroundImage = `url(images/avatar.png)`; // default avatar
  }

  // click to upload
  if (profileImageWrapper) {
    profileImageWrapper.addEventListener("click", () => {
      imgInput.click();
    });
  }

  // image select (NO auto save)
  imgInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      tempImage = e.target.result; // temporary only
      profileImg.style.backgroundImage = `url(${tempImage})`;
    };

    reader.readAsDataURL(file);
  });

  // ================= INITIAL RENDER =================
  renderSkills();

  // ================= EDIT MODE =================
  let isEditMode = false;

  editBtn.onclick = () => {
    if (!isEditMode) {
      bioText.style.display = "none";
      bioInput.style.display = "block";
      bioInput.value = bioText.innerText;

      skillsView.style.display = "none";
      skillsEdit.style.display = "block";

      saveBtn.style.display = "inline-block";
      editBtn.innerHTML = "👁 View Mode";

      renderTags();
      isEditMode = true;

    } else {
      saveData();
    }
  };

  // ================= SAVE =================
  saveBtn.onclick = () => saveData();

  function saveData() {

    const newBio = bioInput.value.trim() || "No bio yet. Add something!";
    bioText.innerText = newBio;

    localStorage.setItem("bio", newBio);
    localStorage.setItem("teachSkills", JSON.stringify(teachSkills));
    localStorage.setItem("learnSkills", JSON.stringify(learnSkills));

    // save image ONLY on save
    if (tempImage) {
      localStorage.setItem("profileImage", tempImage);
    }

    renderSkills();

    skillsView.style.display = "block";
    skillsEdit.style.display = "none";

    bioText.style.display = "block";
    bioInput.style.display = "none";

    saveBtn.style.display = "none";
    editBtn.innerHTML = "✏️ Edit Profile";

    isEditMode = false;
  }

  // ================= SKILLS =================
  function addSkill(type) {
    let input = document.getElementById(type + "Input");
    if (input.value.trim() === "") return;

    if (type === "teach") teachSkills.push(input.value.trim());
    else learnSkills.push(input.value.trim());

    input.value = "";
    renderTags();
    renderSkills();
  }

  function removeSkill(type, index) {
    if (type === "teach") teachSkills.splice(index, 1);
    else learnSkills.splice(index, 1);

    renderTags();
    renderSkills();
  }

  function renderTags() {
    teachTags.innerHTML = "";
    learnTags.innerHTML = "";

    teachSkills.forEach((skill, index) => {
      teachTags.innerHTML += `
        <div class="tag">
          ${skill} <span onclick="removeSkill('teach', ${index})">×</span>
        </div>`;
    });

    learnSkills.forEach((skill, index) => {
      learnTags.innerHTML += `
        <div class="tag">
          ${skill} <span onclick="removeSkill('learn', ${index})">×</span>
        </div>`;
    });
  }

  function renderSkills() {
    teachList.innerHTML = "";
    learnList.innerHTML = "";

    if (teachSkills.length === 0) {
      let li = document.createElement("li");
      li.innerText = "No teaching skills added yet";
      li.style.color = "#64748b";
      teachList.appendChild(li);
    } else {
      teachSkills.forEach(skill => {
        let li = document.createElement("li");
        li.innerText = skill;
        teachList.appendChild(li);
      });
    }

    if (learnSkills.length === 0) {
      let li = document.createElement("li");
      li.innerText = "No learning skills added yet";
      li.style.color = "#64748b";
      learnList.appendChild(li);
    } else {
      learnSkills.forEach(skill => {
        let li = document.createElement("li");
        li.innerText = skill;
        learnList.appendChild(li);
      });
    }
  }

  window.addSkill = addSkill;
  window.removeSkill = removeSkill;

  // ================= SIDEBAR =================
  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
        sidebar.classList.remove("show");
      }
    });
  }

  // ================= DROPDOWN =================
  if (profileIcon && dropdown) {

    profileIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!profileIcon.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove("show");
      }
    });

    document.getElementById("profileBtn").onclick = () => {
      window.location.href = "profile.html";
    };

    document.getElementById("signOutBtn").onclick = () => {
      localStorage.clear();
      window.location.href = "index.html";
    };
  }



  // ===== NOTIFICATION DROPDOWN =====
const notifIcon = document.getElementById("notifIcon");
const notifDropdown = document.getElementById("notifDropdown");
const viewAllBtn = document.getElementById("viewAllBtn");

if (notifIcon && notifDropdown) {

  notifIcon.addEventListener("click", () => {
    notifDropdown.classList.toggle("show");
  });

  viewAllBtn.addEventListener("click", () => {
    window.location.href = "notification.html";
  });

  document.addEventListener("click", (e) => {
    if (!notifIcon.contains(e.target) && !notifDropdown.contains(e.target)) {
      notifDropdown.classList.remove("show");
    }
  });
}



});