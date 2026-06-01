// ===== PROFILE ICON + DROPDOWN (dashboard jaisa) =====
const userName = localStorage.getItem('user_name') || 'User';
const profileIcon = document.getElementById('profileIcon');
const dropdown    = document.getElementById('dropdownMenu');

if (profileIcon) profileIcon.textContent = userName.charAt(0).toUpperCase();

if (profileIcon && dropdown) {
  profileIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
    const nd = document.getElementById('notifDropdown');
    if (nd) nd.classList.remove('show');
  });

  document.addEventListener('click', (e) => {
    if (!profileIcon.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });

  document.getElementById('profileBtn').onclick = () => {
    window.location.href = 'profile.html';
  };

  document.getElementById('signOutBtn').onclick = () => {
    localStorage.clear();
    window.location.href = 'index.html';
  };
}

// ===== SIDEBAR =====
document.getElementById('hamburgerBtn').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('active');
  document.getElementById('overlay').classList.toggle('active');
});
document.getElementById('overlay').addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
});

// ===== FILTER BOX =====
const toggleFilter = document.getElementById('toggleFilter');
const filterBox = document.getElementById('filterBox');

toggleFilter.addEventListener('click', () => {
  const isHidden = filterBox.style.display === 'none' || filterBox.style.display === '';
  filterBox.style.display = isHidden ? 'block' : 'none';
  toggleFilter.innerHTML = isHidden
    ? '<span class="material-icons">filter_alt</span> Hide Filters'
    : '<span class="material-icons">filter_alt</span> Show Filters';
  toggleFilter.classList.toggle('active', isHidden);
});

document.getElementById('closeFilter').addEventListener('click', () => {
  filterBox.style.display = 'none';
  toggleFilter.innerHTML = '<span class="material-icons">filter_alt</span> Show Filters';
  toggleFilter.classList.remove('active');
});

document.getElementById('resetFilter').addEventListener('click', () => {
  document.getElementById('teachFilter').value = '';
  document.getElementById('learnFilter').value = '';
  document.getElementById('locationFilter').value = '';
  document.querySelectorAll('.user-card').forEach(c => c.style.display = 'block');
});

document.getElementById('applyFilter').addEventListener('click', () => {
  const teach = document.getElementById('teachFilter').value.toLowerCase().trim();
  const learn = document.getElementById('learnFilter').value.toLowerCase().trim();
  document.querySelectorAll('.user-card').forEach(card => {
    const teachData = (card.getAttribute('data-teach') || '').toLowerCase();
    const learnData = (card.getAttribute('data-learn') || '').toLowerCase();
    const teachMatch = teach === '' || teachData.includes(teach) ||
      [...card.querySelectorAll('.skill-tag.teach')].some(t => t.textContent.toLowerCase().includes(teach));
    const learnMatch = learn === '' || learnData.includes(learn) ||
      [...card.querySelectorAll('.skill-tag.learn')].some(t => t.textContent.toLowerCase().includes(learn));
    card.style.display = (teachMatch && learnMatch) ? 'block' : 'none';
  });
});

// ===== SHOW MATCHES =====
document.getElementById('showMatchesBtn').addEventListener('click', () => {
  document.getElementById('cardsGrid').style.display = 'none';
  document.getElementById('noMatchesBox').classList.add('show');
  document.getElementById('showMatchesBtn').classList.add('active');
});
document.getElementById('browseUsersBtn').addEventListener('click', () => {
  document.getElementById('noMatchesBox').classList.remove('show');
  document.getElementById('cardsGrid').style.display = 'grid';
  document.getElementById('showMatchesBtn').classList.remove('active');
});

// ===== NOTIFICATION BADGE =====
function updateNotifBadge() {
  const badge = document.getElementById('notifBadge');
  if (!badge) return;
  const notifs = JSON.parse(localStorage.getItem('skillswap_notifications') || '[]');
  const unread = notifs.filter(n => !n.read).length;
  if (unread > 0) {
    badge.textContent = unread > 9 ? '9+' : unread;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

// ===== NOTIFICATION DROPDOWN =====
const notifIcon     = document.getElementById('notifIcon');
const notifDropdown = document.getElementById('notifDropdown');
const viewAllBtn    = document.getElementById('viewAllBtn');

notifIcon.addEventListener('click', (e) => {
  e.stopPropagation();
  notifDropdown.classList.toggle('show');
  if (dropdown) dropdown.classList.remove('show');
  if (notifDropdown.classList.contains('show')) renderNotifDropdown();
});

viewAllBtn.addEventListener('click', () => {
  window.location.href = 'notification.html';
});

document.addEventListener('click', (e) => {
  if (!notifIcon.contains(e.target) && !notifDropdown.contains(e.target)) {
    notifDropdown.classList.remove('show');
  }
});

function renderNotifDropdown() {
  document.querySelectorAll('.dropdown-notif-item').forEach(el => el.remove());
  const notifs = JSON.parse(localStorage.getItem('skillswap_notifications') || '[]');
  if (notifs.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'dropdown-notif-item';
    empty.textContent = 'No new notifications';
    notifDropdown.insertBefore(empty, viewAllBtn);
  } else {
    [...notifs].reverse().slice(0, 3).forEach(n => {
      const item = document.createElement('div');
      item.className = 'dropdown-notif-item';
      item.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:3px;width:100%">
          <span style="font-weight:600;font-size:13px;color:#e0e6f0">${n.title}</span>
          <span style="font-size:12px;color:#94a3b8">${n.body}</span>
          ${n.meetLink ? `<a href="${n.meetLink}" style="color:#38bdf8;font-size:12px;margin-top:2px;text-decoration:none">🔗 Join Meeting</a>` : ''}
          <span style="font-size:11px;color:#64748b;margin-top:2px">${n.time}</span>
        </div>
      `;
      notifDropdown.insertBefore(item, viewAllBtn);
    });
  }
}

// ===== MODAL =====
const modalBackdrop = document.getElementById('modalBackdrop');
const modalName     = document.getElementById('modalName');
const modalRole     = document.getElementById('modalRole');
const modalMessage  = document.getElementById('modalMessage');

document.querySelectorAll('.user-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    modalName.textContent = card.getAttribute('data-name');
    modalRole.textContent = card.getAttribute('data-role') || 'Skill Exchange Partner';
    modalMessage.placeholder = `Hi ${card.getAttribute('data-name')}, I'd like to exchange...`;
    document.getElementById('modalDate').value = '';
    document.getElementById('modalTime').value = '';
    document.getElementById('modalDuration').selectedIndex = 0;
    modalMessage.value = '';
    modalBackdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modalBackdrop.classList.remove('show');
  document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancel').addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeModal();
});

// ===== SCHEDULE =====
document.getElementById('modalSchedule').addEventListener('click', () => {
  const date = document.getElementById('modalDate').value;
  const time = document.getElementById('modalTime').value;
  if (!date || !time) { alert('Please select date and time!'); return; }

  const duration = document.getElementById('modalDuration').value;
  const meetCode = Math.random().toString(36).substring(2, 10);
  const meetLink = `https://meet.skillswap.io/${meetCode}`;
  const formatted = new Date(`${date}T${time}`).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const notification = {
    id: Date.now(),
    title: 'Exchange Request Sent',
    body: `You requested to exchange skills with ${modalName.textContent}`,
    detail: `Scheduled on ${formatted} for ${duration}`,
    meetLink,
    time: new Date().toLocaleString('en-US', {
      month: 'numeric', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }),
    name: modalName.textContent,
    role: modalRole.textContent,
    read: false
  };

  const existing = JSON.parse(localStorage.getItem('skillswap_notifications') || '[]');
  existing.push(notification);
  localStorage.setItem('skillswap_notifications', JSON.stringify(existing));
  updateNotifBadge();
  closeModal();
  setTimeout(() => { window.location.href = 'notification.html'; }, 300);
});

// ===== INIT =====
updateNotifBadge();
