// =============================================
// notif-badge.js  — include on EVERY page
// Reads unread count from localStorage and
// updates the red badge on the notif icon.
// =============================================

(function () {
  function updateBadge() {
    const notifs = JSON.parse(localStorage.getItem('skillswap_notifications') || '[]');
    const unread = notifs.filter(n => !n.read).length;

    // Support both id="notifBadge" (exchange/notification pages)
    // and any element with class .notif-badge
    const badges = document.querySelectorAll('#notifBadge, .notif-badge');
    badges.forEach(badge => {
      badge.textContent = unread;
      badge.style.display = unread > 0 ? 'flex' : 'none';
    });
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateBadge);
  } else {
    updateBadge();
  }

  // Also re-run whenever localStorage changes (cross-tab support)
  window.addEventListener('storage', updateBadge);

  // Expose globally so other scripts can call it after saving
  window.updateNotifBadge = updateBadge;
})();
