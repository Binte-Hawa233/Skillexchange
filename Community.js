document.addEventListener("DOMContentLoaded", () => {

  // ===== SET USER INITIAL =====
const userName = localStorage.getItem('user_name');
if (userName) {
  document.getElementById('profileIcon').textContent = userName.charAt(0).toUpperCase();
}


  // ===== LOAD POSTS FROM DATABASE =====
  function loadPosts() {
    fetch('api/get_posts.php')
    .then(res => res.json())
    .then(posts => {
      const postsList = document.querySelector('.posts-list');
      // Remove existing static posts
      document.querySelectorAll('.post-card').forEach(card => card.remove());

      posts.forEach(post => {
        const date = new Date(post.created_at).toLocaleString('en-US', {
          month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        });

        const initial = post.name.charAt(0).toUpperCase();
        const card = document.createElement('div');
        card.classList.add('post-card');
        card.innerHTML = `
          <div class="post-header">
            <div class="avatar-md" style="background: linear-gradient(135deg, #4d8eff, #7b5fff);">${initial}</div>
            <div class="post-meta">
              <span class="post-author">${post.name}</span>
              <span class="post-time">${date}</span>
            </div>
            <span class="post-topic-badge">${post.topic}</span>
          </div>
          <div class="post-body">${post.content}</div>
          <div class="post-actions">
            <button class="action-btn" data-post-id="${post.id}" data-type="like">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span class="count">${post.likes}</span>
            </button>
            <button class="action-btn" data-type="comment">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span class="count">${post.comments}</span>
            </button>
          </div>
        `;
        postsList.insertBefore(card, document.querySelector('.empty-state'));
      });

      // Reattach like button events
      attachLikeEvents();
    });
  }

  loadPosts();

  // ===== LIKE WITH DATABASE =====
  function attachLikeEvents() {
    document.querySelectorAll('.action-btn[data-type="like"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const post_id = btn.getAttribute('data-post-id');
        fetch('api/like_post.php', {
          method : 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body   : new URLSearchParams({ post_id })
        })
        .then(res => res.json())
        .then(data => {
          const countSpan = btn.querySelector('.count');
          let count = parseInt(countSpan.textContent);
          if (data.status === 'liked') {
            countSpan.textContent = count + 1;
            btn.style.color = 'var(--accent)';
          } else {
            countSpan.textContent = count - 1;
            btn.style.color = '';
          }
        });
      });
    });
  }

  // ===== HAMBURGER / SIDEBAR =====
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const sidebar      = document.getElementById('sidebar');
  const overlay      = document.getElementById('overlay');

  function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
  }

  function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.contains('active') ? closeSidebar() : openSidebar();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  // Close sidebar when nav link clicked (mobile UX)
  if (sidebar) {
    sidebar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeSidebar);
    });
  }

  // ESC key closes sidebar + dropdowns
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSidebar();
      document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('show'));
    }
  });

  // ===== COMPOSER TAG TOGGLE =====
  document.querySelectorAll('.composer .tag').forEach(tag => {
    tag.addEventListener('click', () => {
      document.querySelectorAll('.composer .tag').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
    });
  });


  // ===== LIKE BUTTON TOGGLE =====
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isActive = btn.style.color === 'var(--accent)';
      btn.style.color = isActive ? '' : 'var(--accent)';

      // Update like count
      const countSpan = btn.querySelector('span.count');
      if (countSpan) {
        let count = parseInt(countSpan.textContent);
        countSpan.textContent = isActive ? count - 1 : count + 1;
      }
    });
  });

// ===== CREATE POST =====
  const textarea   = document.querySelector('.composer textarea');
  const btnCreate  = document.querySelector('.btn-create');
  const postsList  = document.querySelector('.posts-list');

  btnCreate.addEventListener('click', () => {
    const content = textarea.value.trim();
    if (content === '') {
      alert('Please write something before posting!');
      return;
    }

    const activeTag = document.querySelector('.composer .tag.active');
    const topic = activeTag ? activeTag.textContent.trim() : 'General';

    fetch('api/create_post.php', {
      method : 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body   : new URLSearchParams({ content, topic })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        textarea.value = '';
        loadPosts();
      } else {
        alert(data.message);
      }
    });
  });

  // ===== SEARCH POSTS =====
  const searchInput = document.querySelector('.search-wrap input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      document.querySelectorAll('.post-card').forEach(card => {
        const text = card.querySelector('.post-body').textContent.toLowerCase();
        card.style.display = text.includes(query) ? 'block' : 'none';
      });
    });
  }
// ===== TOPIC FILTER =====
document.querySelectorAll('.topic-tag').forEach(tag => {
  tag.addEventListener('click', () => {

    document.querySelectorAll('.topic-tag').forEach(t => t.classList.remove('active'));
    tag.classList.add('active');

    const selected = tag.textContent.trim();
    const emptyState = document.querySelector('.empty-state');
    const emptyMsg = document.querySelector('.empty-state p');
    let visibleCount = 0;

    document.querySelectorAll('.post-card').forEach(card => {
      if (selected === 'All Topics') {
        card.style.display = 'block';
        visibleCount++;
      } else {
        const badge = card.querySelector('.post-topic-badge');
        if (badge && badge.textContent.trim() === selected) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      }
    });

    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.style.display = 'flex';
        if (emptyMsg) emptyMsg.textContent = `No posts in "${selected}" yet. Be the first!`;
      } else {
        emptyState.style.display = 'none';
      }
    }

  });
});


  // ===== PROFILE DROPDOWN =====
  const profileIcon = document.getElementById("profileIcon");
  const dropdown    = document.getElementById("dropdownMenu");

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
  const notifIcon     = document.getElementById("notifIcon");
  const notifDropdown = document.getElementById("notifDropdown");
  const viewAllBtn    = document.getElementById("viewAllBtn");

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
      if (!notifIcon.contains(e.target) && !notifDropdown.contains(e.target)) {
        notifDropdown.classList.remove("show");
      }
    });
  }

});