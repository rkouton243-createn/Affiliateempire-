// ===== THEME TOGGLE =====
const html = document.documentElement;
const toggle = document.getElementById('themeToggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('cg-theme', html.dataset.theme);
  });
}
const saved = localStorage.getItem('cg-theme');
if (saved) html.dataset.theme = saved;

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
if (cursor && ring) {
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => {
    mx=e.clientX;
    my=e.clientY;
    cursor.style.transform=`translate(${mx-5}px,${my-5}px)`;
  });
  (function animateRing(){
    rx+=(mx-rx)*0.12;
    ry+=(my-ry)*0.12;
    ring.style.transform=`translate(${rx-18}px,${ry-18}px)`;
    requestAnimationFrame(animateRing);
  })();
  document.querySelectorAll('a,button,.chip,.content-type-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{
      ring.style.width='52px';
      ring.style.height='52px';
      ring.style.opacity='0.3';
    });
    el.addEventListener('mouseleave',()=>{
      ring.style.width='36px';
      ring.style.height='36px';
      ring.style.opacity='0.6';
    });
  });
}

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting) e.target.classList.add('visible');
}),{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
