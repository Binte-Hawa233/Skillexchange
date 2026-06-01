// ── Floating particles ──────────────────────────────────────
const container = document.getElementById('particles');
const colors = ['#7c5df9', '#4ac8f8', '#f0436e', '#5b8cf7', '#9b7dff'];

for (let i = 0; i < 22; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 5 + 2;
  p.style.cssText = `
    width:${size}px;
    height:${size}px;
    left:${Math.random() * 100}%;
    background:${colors[Math.floor(Math.random() * colors.length)]};
    animation-duration:${Math.random() * 12 + 8}s;
    animation-delay:${Math.random() * 10}s;
  `;
  container.appendChild(p);
}

