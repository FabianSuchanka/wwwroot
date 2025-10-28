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

  /* ===== mobile menu toggle ===== */
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if(mobileMenuToggle && mainNav){
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.contains('mobile-open');
      
      if(isOpen){
        mainNav.classList.remove('mobile-open');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', 'Otevřít menu');
        document.body.style.overflow = '';
      } else {
        mainNav.classList.add('mobile-open');
        mobileMenuToggle.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        mobileMenuToggle.setAttribute('aria-label', 'Zavřít menu');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close menu when clicking on nav links
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('mobile-open');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', 'Otevřít menu');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if(!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)){
        mainNav.classList.remove('mobile-open');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', 'Otevřít menu');
        document.body.style.overflow = '';
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape' && mainNav.classList.contains('mobile-open')){
        mainNav.classList.remove('mobile-open');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-label', 'Otevřít menu');
        document.body.style.overflow = '';
      }
    });
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
document.addEventListener("DOMContentLoaded", () => {
  const langBtn = document.getElementById("lang-btn");
  let currentLang = "cs";

  const translations = {
    cs: {
      htmlLang: "cs",
      title: "SpecifAI",
      metaDescription: "Specifai - moderní řešení pro vaše podnikání.",
      headerNav: ["Služby", "Projekty", "O nás", "Kontakt"],
      heroTitle: "Automatizace, která šetří váš čas a peníze",
      heroText: "Chytrá řešení pro vaši firmu – s AI i bez AI. Uvolněte své týmy, nechte rutinu na nás.",
      heroBtn: "Zjistit víc",
      servicesTitle: "Naše služby",
      serviceCards: [
        { title: "💡 Inovace", text: "Navrhujeme moderní a efektivní řešení přesně na míru. Každý projekt přizpůsobujeme individuálním potřebám klienta." },
        { title: "🚀 Rychlost", text: "Implementace projektů probíhá rychle a efektivně, přičemž zachováváme vysokou kvalitu a spolehlivost řešení." },
        { title: "🔒 Bezpečnost", text: "Dbáme na bezpečnost a spolehlivost všech našich řešení, aby naši klienti mohli pracovat bez obav." }
      ],
      projects: {
        title: "Projekty",
        filters: ["Vše", "Make", "AI", "Skript / Non-AI"],
        emptyTitle: "Žádné projekty zatím nejsou",
        emptyText: "Jakmile sem přidáte případové studie, budou se tu krásně zobrazovat. Prozatím můžete nahrát vlastní.",
        emptyAdd: "Přidat ukázkový projekt",
        emptyConsult: "Chci konzultaci"
      },
      aboutTitle: "O nás",
      aboutCards: [
        { title: "Expertíza v automatizacích", text: "Optimalizujeme procesy a vytváříme chytré automatizace, které firmám šetří čas a peníze." },
        { title: "Kreativní tým", text: "Naši specialisté kombinují teoretické know-how s praktickými dovednostmi, aby dodali reálné výsledky." },
        { title: "Zodpovědnost", text: "Pracujeme důkladně a s důrazem na bezpečnost, kvalitu a dlouhodobou hodnotu pro klienty." }
      ],
      contactTitle: "Kontakt",
      contactForm: {
        heading: "Kontaktujte nás",
        placeholders: { name: "Vaše jméno", email: "vas@email.cz", tel: "Tel. číslo", message: "Vaše zpráva" },
        consent: "Souhlasím se zpracováním údajů",
        submit: "Odeslat"
      },
      companyInfo: {
        heading: "Firemní údaje",
        nameLabel: "Název firmy:",
        nameValue: "SpecifAI s.r.o.",
        addressLabel: "Adresa:",
        addressValue: "Zatím žadná, ale v Brně",
        icoLabel: "IČO:",
        icoValue: "Taky není",
        dicLabel: "DIČ:",
        dicValue: "Taky není",
        phoneLabel: "Telefon:",
        phoneValue: "+420 773 952 636",
        emailLabel: "Email:",
        emailValue: "kontakt@specifai.cz"
      },
      toast: "Vaše zpráva byla úspěšně odeslána",
      footer: {
        copyright: "© 2025 SpecifAI.",
        privacy: "Zásady ochrany osobních údajů"
      },
      headerBtnText: "CZ/EN"
    },

    en: {
      htmlLang: "en",
      title: "SpecifAI",
      metaDescription: "Specifai - modern solutions for your business.",
      headerNav: ["Services", "Projects", "About", "Contact"],
      heroTitle: "Automation that saves your time and money",
      heroText: "Smart solutions for your business – with or without AI. Free your teams, leave the routine to us.",
      heroBtn: "Learn more",
      servicesTitle: "Our Services",
      serviceCards: [
        { title: "💡 Innovation", text: "We design modern and efficient solutions tailored exactly to your needs." },
        { title: "🚀 Speed", text: "Projects are implemented quickly and efficiently while maintaining high quality and reliability." },
        { title: "🔒 Security", text: "We ensure security and reliability so you can work without worries." }
      ],
      projects: {
        title: "Projects",
        filters: ["All", "Make", "AI", "Script / Non-AI"],
        emptyTitle: "No projects yet",
        emptyText: "Once you add case studies they'll appear here. For now you can upload your own.",
        emptyAdd: "Add sample project",
        emptyConsult: "Request consultation"
      },
      aboutTitle: "About",
      aboutCards: [
        { title: "Expertise in automations", text: "We optimize processes and build smart automations that save companies time and money." },
        { title: "Creative team", text: "Our specialists combine theoretical know-how with practical skills to deliver real results." },
        { title: "Responsibility", text: "We work thoroughly with emphasis on security, quality and long-term value for clients." }
      ],
      contactTitle: "Contact",
      contactForm: {
        heading: "Contact us",
        placeholders: { name: "Your name", email: "your@email.com", tel: "Phone number", message: "Your message" },
        consent: "I consent to the processing of data",
        submit: "Send"
      },
      companyInfo: {
        heading: "Company info",
        nameLabel: "Company:",
        nameValue: "SpecifAI s.r.o.",
        addressLabel: "Address:",
        addressValue: "Not yet, but in Brno",
        icoLabel: "Company ID:",
        icoValue: "not yet",
        dicLabel: "Tax ID:",
        dicValue: "not yet",
        phoneLabel: "Phone:",
        phoneValue: "+420 773 952 636",
        emailLabel: "Email:",
        emailValue: "kontakt@specifai.cz"
      },
      toast: "Your message has been sent successfully",
      footer: {
        copyright: "© 2025 SpecifAI.",
        privacy: "Privacy Policy"
      },
      headerBtnText: "EN/CZ"
    }
  };

  // funkce pro bezpečné nasazení textu (pokud element existuje)
  const safeSetText = (selector, text, useInnerHTML = false) => {
    const el = document.querySelector(selector);
    if (!el) return;
    if (useInnerHTML) el.innerHTML = text;
    else el.textContent = text;
  };

  function applyLanguage(lang) {
    const t = translations[lang];

    // html lang
    document.documentElement.lang = t.htmlLang;

    // title + meta description
    if (t.title) document.title = t.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", t.metaDescription || "");

    // header nav
    const navLinks = document.querySelectorAll("header nav ul li a");
    navLinks.forEach((a, i) => {
      if (t.headerNav[i]) a.textContent = t.headerNav[i];
    });

    // hero
    safeSetText(".hero-content h1", t.heroTitle);
    safeSetText(".hero-content p", t.heroText);
    safeSetText(".hero-btn", t.heroBtn);

    // services
    safeSetText("#services .section-title", t.servicesTitle);
    const serviceCards = document.querySelectorAll("#services .benefit-card");
    serviceCards.forEach((card, i) => {
      if (!t.serviceCards[i]) return;
      const h = card.querySelector("h3");
      const p = card.querySelector("p");
      if (h) h.textContent = t.serviceCards[i].title;
      if (p) p.textContent = t.serviceCards[i].text;
    });

    // projects section title + filters + empty state
    safeSetText("#projects .section-title", t.projects.title);
    const filterBtns = document.querySelectorAll(".filter-bar .filter-btn");
    filterBtns.forEach((btn, i) => {
      if (t.projects.filters[i]) btn.textContent = t.projects.filters[i];
    });
    safeSetText("#projects-empty h3", t.projects.emptyTitle);
    safeSetText("#projects-empty .muted", t.projects.emptyText);
    const emptyAdd = document.getElementById("empty-add");
    if (emptyAdd) emptyAdd.textContent = t.projects.emptyAdd;
    const emptyConsult = document.querySelector("#projects-empty .empty-ctas .btn-link") || document.querySelector(".empty-ctas .btn-link");
    if (emptyConsult) emptyConsult.textContent = t.projects.emptyConsult;

    // about
    safeSetText("#about .section-title", t.aboutTitle);
    const aboutCards = document.querySelectorAll("#about .benefit-card");
    // if structure differs, try generic replacement from translations
    if (aboutCards.length >= t.aboutCards.length) {
      aboutCards.forEach((card, i) => {
        if (!t.aboutCards[i]) return;
        const h = card.querySelector("h3");
        const p = card.querySelector("p");
        if (h) h.textContent = t.aboutCards[i].title;
        if (p) p.textContent = t.aboutCards[i].text;
      });
    }
    // contact section title (nad formulářem)
    safeSetText("#contact-title", t.contactTitle);

    // contact form
    safeSetText("#contact-form h3", t.contactForm.heading);
    const inputName = document.getElementById("name");
    const inputEmail = document.getElementById("email");
    const inputTel = document.getElementById("tel");
    const textarea = document.getElementById("message");
    if (inputName) inputName.placeholder = t.contactForm.placeholders.name;
    if (inputEmail) inputEmail.placeholder = t.contactForm.placeholders.email;
    if (inputTel) inputTel.placeholder = t.contactForm.placeholders.tel;
    if (textarea) textarea.placeholder = t.contactForm.placeholders.message;
    // consent label
    const consentLabel = document.querySelector("label[for='consent']");
    if (consentLabel) consentLabel.textContent = t.contactForm.consent;
    // submit button
    const submitBtn = document.querySelector("#contact-form button[type='submit']");
    if (submitBtn) submitBtn.textContent = t.contactForm.submit;

    // company info (přepíšu celý blok bezpečně jako HTML)
    const companyContainer = document.querySelector("#company-info .benefit-card");
    if (companyContainer) {
      companyContainer.innerHTML = `
        <h3>${t.companyInfo.heading}</h3>
        <p><strong>${t.companyInfo.nameLabel}</strong> ${t.companyInfo.nameValue}</p>
        <p><strong>${t.companyInfo.addressLabel}</strong> ${t.companyInfo.addressValue}</p>
        <p><strong>${t.companyInfo.icoLabel}</strong> ${t.companyInfo.icoValue}</p>
        <p><strong>${t.companyInfo.dicLabel}</strong> ${t.companyInfo.dicValue}</p>
        <p><strong>${t.companyInfo.phoneLabel}</strong> ${t.companyInfo.phoneValue}</p>
        <p><strong>${t.companyInfo.emailLabel}</strong> ${t.companyInfo.emailValue}</p>
      `;
    }

    // toast
    safeSetText("#toast", t.toast);

    // footer
    const footer = document.querySelector("footer");
    if (footer) {
      // zachovávám rok a odkaz, jen nahradím texty
      footer.innerHTML = `${t.footer.copyright} <a href="#">${t.footer.privacy}</a>`;
    }

    // aria labels / accessibility tweaks
    const nav = document.querySelector("nav[aria-label]");
    if (nav) nav.setAttribute("aria-label", lang === "cs" ? "Hlavní menu" : "Main menu");

    const filterBar = document.querySelector(".filter-bar");
    if (filterBar) filterBar.setAttribute("aria-label", lang === "cs" ? "Filtry projektů" : "Project filters");

    // header button text
    langBtn.textContent = t.headerBtnText;
  }

  // inicializace (nastavit výchozí české texty)
  applyLanguage(currentLang);

  // přepínání
  langBtn.addEventListener("click", () => {
  // Fade out
  document.body.classList.add("fade-out");

  // Po skončení animace (500ms) přepni jazyk a fade in
  setTimeout(() => {
    currentLang = currentLang === "cs" ? "en" : "cs";
    applyLanguage(currentLang);

    document.body.classList.remove("fade-out");
    document.body.classList.add("fade-in");

    // Po dalších 500ms odstraníme fade-in třídu
    setTimeout(() => {
      document.body.classList.remove("fade-in");
    }, 500);

  }, 500);
});

});

})();


