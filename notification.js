document.addEventListener("DOMContentLoaded", () => {
  // ===== SET USER INITIAL =====
const userName = localStorage.getItem('user_name');
if (userName) {
  document.getElementById('profileIcon').textContent = userName.charAt(0).toUpperCase();
}

  // ===== SIDEBAR =====
  const menuBtn = document.querySelector(".menu-btn");
  const sidebar = document.querySelector(".sidebar");

  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }

  // ===== PAGE TRANSITION =====
  document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const url = this.href;
      document.body.classList.add("fade-out");
      setTimeout(() => { window.location.href = url; }, 300);
    });
  });

  // ===== PROFILE DROPDOWN =====
  const profileIcon = document.getElementById("profileIcon");
  const dropdown = document.getElementById("dropdownMenu");

  if (profileIcon && dropdown) {
    profileIcon.addEventListener("click", () => {
      dropdown.classList.toggle("show");
    });
    document.addEventListener("click", (e) => {
      if (!profileIcon.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove("show");
      }
    });
    const profileBtn = document.getElementById("profileBtn");
    const signOutBtn = document.getElementById("signOutBtn");
    if (profileBtn) profileBtn.onclick = () => { window.location.href = "profile.html"; };
    if (signOutBtn) signOutBtn.onclick = () => { localStorage.clear(); window.location.href = "index.html"; };
  }

  // ===== NOTIFICATION DROPDOWN =====
  const notifIcon = document.getElementById("notifIcon");
  const notifDropdown = document.getElementById("notifDropdown");
  const viewAllBtn = document.getElementById("viewAllBtn");

  if (notifIcon && notifDropdown) {
    notifIcon.addEventListener("click", () => {
      notifDropdown.classList.toggle("show");
    });
    if (viewAllBtn) {
      viewAllBtn.addEventListener("click", () => {
        window.location.href = "notification.html";
      });
    }
    document.addEventListener("click", (e) => {
      if (!notifIcon.contains(e.target) && !notifDropdown.contains(e.target)) {
        notifDropdown.classList.remove("show");
      }
    });
  }

  // ===== LOAD NOTIFICATIONS FROM LOCALSTORAGE =====
  const container = document.querySelector(".notification-container");
  const emptyCard = document.querySelector(".notification-card");
  const markReadBtn = document.querySelector(".mark-read");

  function loadNotifications() {
    const notifs = JSON.parse(localStorage.getItem("skillswap_notifications") || "[]");

    // Update badge
    updateBadge(notifs);

    if (notifs.length === 0) {
      if (emptyCard) emptyCard.style.display = "block";
      return;
    }

    // Hide empty state
    if (emptyCard) emptyCard.style.display = "none";

    // Remove old rendered items
    container.querySelectorAll(".notif-item").forEach(el => el.remove());

    // Render newest first
    [...notifs].reverse().forEach(n => {
      const item = document.createElement("div");
      item.className = "notif-item" + (n.read ? " read" : "");
      item.setAttribute("data-id", n.id);
      item.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
          <span class="material-icons" style="font-size:20px;color:#38bdf8;background:rgba(56,189,248,0.12);padding:8px;border-radius:50%;">event_available</span>
          <div>
            <p style="font-weight:600;margin:0">${n.title}</p>
            <p style="margin:0;color:#94a3b8;font-size:13px">${n.body}</p>
          </div>
          ${!n.read ? '<span style="margin-left:auto;width:8px;height:8px;background:#38bdf8;border-radius:50%;flex-shrink:0;display:inline-block"></span>' : ''}
        </div>
        <p style="font-size:13px;color:#cbd5e1;margin:4px 0 2px 0">${n.detail || ''}</p>
        ${n.meetLink ? `
          <div style="margin-top:8px;">
            <a href="${n.meetLink}" target="_blank" style="display:inline-flex;align-items:center;gap:6px;background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.25);color:#38bdf8;padding:7px 14px;border-radius:8px;text-decoration:none;font-size:13px;font-family:Sora,sans-serif;font-weight:600;transition:background 0.2s;">
              <span class="material-icons" style="font-size:16px;color:#38bdf8">videocam</span> Join Meeting
            </a>
          </div>
        ` : ''}
        <small>${n.time}</small>
      `;
      container.querySelector(".notification-header").after(item);
    });
  }

  function updateBadge(notifs) {
    const badge = document.getElementById("notifBadge");
    if (!badge) return;
    const unread = notifs.filter(n => !n.read).length;
    badge.textContent = unread;
    badge.style.display = unread > 0 ? "flex" : "none";
  }

  // Mark all as read
  if (markReadBtn) {
    markReadBtn.addEventListener("click", () => {
      const notifs = JSON.parse(localStorage.getItem("skillswap_notifications") || "[]");
      notifs.forEach(n => n.read = true);
      localStorage.setItem("skillswap_notifications", JSON.stringify(notifs));
      // Remove unread dots
      document.querySelectorAll(".notif-item .unread-dot").forEach(el => el.remove());
      updateBadge(notifs);
      // Re-render
      loadNotifications();
    });
  }

  loadNotifications();

});