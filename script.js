// script.js - shapes (PNG-aware), reveal, logo click, toast, form submit
(function(){
  /* ===== reveal on scroll (data-reveal) ===== */
  const reveals = document.querySelectorAll('[data-reveal]');
  function revealOnScroll(){
    const windowHeight = window.innerHeight;
    reveals.forEach(el=>{
      const top = el.getBoundingClientRect().top;
      if(top < windowHeight - 100) el.classList.add('active');
      else el.classList.remove('active');
    });
  }
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('resize', revealOnScroll);
  window.addEventListener('load', revealOnScroll);

  /* ===== logo click => smooth top (also keyboard) ===== */
  const logo = document.getElementById('logo');
  if(logo){
    logo.addEventListener('click', ()=>{ window.scrollTo({ top: 0, behavior: 'smooth' }); });
    logo.addEventListener('keydown', (e)=> { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }});
  }


  /* ===== shapes / logos animation ===== */
  const wrapper = document.getElementById('logoShapes');
  if(wrapper){
    const shapes = Array.from(wrapper.querySelectorAll('.logo-shape, .shape'));
    if(shapes.length){
      // initialize logos: if element has data-src, use it as background-image
      shapes.forEach((el)=>{
        const src = el.dataset ? el.dataset.src : null;
        const size = el.dataset && el.dataset.size ? parseInt(el.dataset.size,10) : null;
        if(src){
          el.style.backgroundImage = `url("${src}")`;
          el.style.backgroundSize = 'contain';
          el.style.backgroundRepeat = 'no-repeat';
          el.style.backgroundPosition = 'center';
          el.style.opacity = '0'; // will be animated in loop
        }
        if(size){
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
        }
        // pokud nejsou položeny left/top přes inline style, necháme výchozí CSS nebo nastavíme náhodné
        if(!el.style.left) el.style.left = `${5 + Math.random()*85}%`;
        if(!el.style.top) el.style.top = `${5 + Math.random()*65}%`;
      });

      const cfg = shapes.map((el, i) => {
        const cs = getComputedStyle(el);
        // pokud je left v procentech v inline stylu, parseFloat vrátí hodnotu (viz výše)
        const left = parseFloat(el.style.left) || (5 + Math.random()*85);
        const top = parseFloat(el.style.top) || (5 + Math.random()*65);
        const width = parseFloat(cs.width) || 100;
        const floatAmp = 6 + Math.random()*18;
        const floatFreq = 0.4 + Math.random()*1.0;
        const speed = 0.2 + Math.random()*0.9;
        const rot = (Math.random()-0.5) * 12;
        return { el, left, top, width, floatAmp, floatFreq, speed, rot, idx: i };
      });

      let start = performance.now();
      function animate(now){
        const t = (now - start) / 1000;
        const scrollY = window.scrollY || window.pageYOffset;
        const vh = Math.max(window.innerHeight, 700);
        cfg.forEach((c, i)=>{
          const baseY = (c.top / 100) * vh;
          const floatY = Math.sin(t * c.floatFreq + i) * c.floatAmp;
          const parallaxY = scrollY * c.speed * 0.15;
          const swayX = Math.sin(t * (0.25 + i*0.05)) * (Math.min(12, c.width*0.06));
          const translateY = baseY + floatY + parallaxY;
          const translateX = swayX + ((c.left - 50) * 0.3); // drobné posunutí dle left
          const rot = c.rot + Math.sin(t * (0.15 + i*0.02)) * 3;
          c.el.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rot}deg)`;

          const visibleRatio = 1 - Math.min(Math.abs((baseY - scrollY) / (vh * 1.2)), 1);
          c.el.style.opacity = (0.35 + 0.65 * visibleRatio).toString();
        });
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    }
  }
// filtr + aktivní stav
const buttons = document.querySelectorAll('.btn, .filter-btn');

// přidání click listeneru pro všechna tlačítka
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    // odebrání aktivní třídy ze všech tlačítek
    buttons.forEach(b => b.classList.remove('active'));

    // přidání aktivní třídy pouze aktuálnímu tlačítku
    btn.classList.add('active');
  });
  });
//kontakt
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!document.getElementById('consent').checked) {
      alert('Musíte souhlasit se zpracováním údajů.');
      return;
    }

    const data = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      tel: document.getElementById('tel').value,
      message: document.getElementById('message').value
    };

    try {
      const res = await fetch('/api/sendEmails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        alert('Zpráva odeslána!');
        form.reset();
      } else {
        alert('Chyba při odesílání. nova');
      }
    } catch (err) {
      alert('Chyba sítě.');
      console.error(err);
    }
  });
});

})();



