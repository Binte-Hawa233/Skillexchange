document.addEventListener('DOMContentLoaded', () => {
  // 2. NAVBAR SCROLL EFFECT
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.style.background = 'rgba(15, 15, 25, 0.95)';
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.4)';
      navbar.style.backdropFilter = 'blur(10px)';
    } else {
      navbar.style.background = '';
      navbar.style.boxShadow = '';
      navbar.style.backdropFilter = '';
    }
  });


  // 3. SCROLL REVEAL ANIMATION
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .reveal.show { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  document.querySelectorAll('.hero-left, .hero-image, .how-card, .stat-card, .card, .cta')
    .forEach(el => el.classList.add('reveal'));

  new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('show'), i * 100);
      }
    });
  }, { threshold: 0.12 }).observe
  
  document.querySelectorAll('.reveal').forEach(el => {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('show');
      });
    }, { threshold: 0.12 }).observe(el);
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


  // 5. HOW-CARD HOVER LIFT
  document.querySelectorAll('.how-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px)';
      card.style.boxShadow = '0 12px 32px rgba(108,71,255,0.2)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });


  // 6. TESTIMONIAL CARD HOVER LIFT
  document.querySelectorAll('.testimonials .card').forEach(card => {
    card.addEventListener('mouseenter', () => { card.style.transform = 'translateY(-6px)'; });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });


  // 7. LEARN MORE — show coming soon message
  document.querySelectorAll('.learn-more').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      alert('Coming soon!');
    });
  });


  // 8. DOUBLE-CLICK LOGO → Back to Top
  document.querySelector('.nav-logo').addEventListener('dblclick', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});