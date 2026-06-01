document.addEventListener("DOMContentLoaded", () => {


  // ===== SET USER INITIAL =====
const userName = localStorage.getItem('user_name');
if (userName) {
  document.getElementById('profileIcon').textContent = userName.charAt(0).toUpperCase();
}
    const menuBtn = document.querySelector(".menu-btn");
    const sidebar = document.querySelector(".sidebar");

    if (menuBtn && sidebar) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active");
        });
    }





    
const sidebarItems = document.querySelectorAll('.sidebar ul li');
const contentSections = document.querySelectorAll('.content-section');

sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active from all sidebar items
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Hide all content sections
        contentSections.forEach(section => section.style.display = 'none');

        // Show the selected section
        const sectionId = item.getAttribute('data-section');
        document.getElementById(sectionId).style.display = 'flex';
    });
});





  // 4. ANIMATED COUNTERS
  document.querySelectorAll('.stat-card h2').forEach(el => {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const original = el.textContent.trim();
          const target = parseInt(original.replace(/[^0-9]/g, ''), 10);
          const suffix = original.replace(/[0-9,]/g, '');
          if (!target) return;
          let current = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = Math.floor(current).toLocaleString() + suffix;
          }, 1800 / 60);
        }
      });
    }, { threshold: 0.5 }).observe(el);
  });




    // Page transition animation
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();

            const url = this.href;

            document.body.classList.add("fade-out");

            setTimeout(() => {
                window.location.href = url;
            }, 300);
        });
    });



    // ===== PROFILE DROPDOWN =====
const profileIcon = document.getElementById("profileIcon");
const dropdown = document.getElementById("dropdownMenu");

if (profileIcon && dropdown) {

  profileIcon.addEventListener("click", () => {
    dropdown.classList.toggle("show");
  });

  // click outside close
  document.addEventListener("click", (e) => {
    if (!profileIcon.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove("show");
    }
  });

  // profile page
  document.getElementById("profileBtn").onclick = () => {
    window.location.href = "profile.html";
  };

  // sign out
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


// SHOW MATCHES BUTTON

const showMatchesBtn = document.getElementById("showMatchesBtn");
const noMatchesBox = document.getElementById("noMatchesBox");
const cardsSection = document.querySelector(".cards");

if(showMatchesBtn){

    showMatchesBtn.addEventListener("click", () => {

        // cards hide
        cardsSection.style.display = "none";

        // no matches box show
        noMatchesBox.classList.add("show");

    });

}

// BROWSE ALL USERS BUTTON

const browseUsersBtn = document.getElementById("browseUsersBtn");

if(browseUsersBtn){

    browseUsersBtn.addEventListener("click", () => {

        // hide no matches box
        noMatchesBox.classList.remove("show");

        // show cards again
        cardsSection.style.display = "grid";

    });

}





});







