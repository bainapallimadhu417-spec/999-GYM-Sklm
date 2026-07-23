/* ============================================================
   999 INTENSE GYM & NUTRITION BAR — script.js
   Vanilla JS: loader, scroll fx, reveal animations, BMI calc,
   gallery lightbox, testimonial slider, FAQ, contact form, ripple.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- LOADER ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hidden'), 500);
  });
  // Fallback in case load event already fired
  setTimeout(() => loader && loader.classList.add('hidden'), 2200);

  /* ---------- SCROLL PROGRESS + HEADER STATE ---------- */
  const scrollProgress = document.getElementById('scrollProgress');
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = pct + '%';

    if (header) header.classList.toggle('scrolled', scrollTop > 60);
    if (backToTop) backToTop.classList.toggle('visible', scrollTop > 600);

    updateActiveNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop && backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- MOBILE NAV ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle && navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav && mainNav.classList.remove('open');
      navToggle && navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  function updateActiveNav() {
    let currentId = sections[0] && sections[0].id;
    const scrollPos = window.scrollY + 140;
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }

  /* ---------- SCROLL INDICATOR ---------- */
  const scrollIndicator = document.getElementById('scrollIndicator');
  scrollIndicator && scrollIndicator.addEventListener('click', () => {
    const about = document.getElementById('about');
    about && about.scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- REVEAL ON SCROLL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- ANIMATED COUNTERS ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimal || '0', 10);
      const duration = 1600;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => counterObserver.observe(el));

  /* ---------- BUTTON RIPPLE EFFECT ---------- */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple-effect';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------- HERO PARTICLES (canvas) ---------- */
  const canvas = document.getElementById('particles');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    function initParticles() {
      const count = Math.min(60, Math.floor((w * h) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vy: Math.random() * 0.35 + 0.08,
        drift: Math.random() * 0.3 - 0.15,
        alpha: Math.random() * 0.5 + 0.15
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.y -= p.vy;
        p.x += p.drift;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(233, 199, 102, ${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    window.addEventListener('resize', () => { resize(); initParticles(); });
    resize(); initParticles(); draw();
  }

  /* ---------- HERO PARALLAX ---------- */
  const heroWatermark = document.querySelector('.hero-watermark');
  const heroSection = document.querySelector('.hero');
  if (heroWatermark && heroSection && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY;
      if (offset < window.innerHeight) {
        heroWatermark.style.transform = `translate(-50%, calc(-50% + ${offset * 0.25}px))`;
      }
    }, { passive: true });
  }

  /* ---------- BMI CALCULATOR ---------- */
  const bmiHeight = document.getElementById('bmiHeight');
  const bmiWeight = document.getElementById('bmiWeight');
  const bmiCalcBtn = document.getElementById('bmiCalcBtn');
  const bmiError = document.getElementById('bmiError');
  const bmiValue = document.getElementById('bmiValue');
  const bmiCategory = document.getElementById('bmiCategory');
  const bmiSuggestion = document.getElementById('bmiSuggestion');
  const bmiGaugeFill = document.getElementById('bmiGaugeFill');

  const BMI_CATEGORIES = [
    { max: 18.5, label: 'Underweight', color: '#6fb3d2', suggestion: 'Focus on nutrient-dense meals and progressive strength training to build healthy mass. Our trainers can build a gaining plan with you.' },
    { max: 25, label: 'Healthy Weight', color: '#c9a227', suggestion: 'You are in a healthy range — keep training consistently and maintain a balanced diet to stay there.' },
    { max: 30, label: 'Overweight', color: '#e07a3f', suggestion: 'A mix of cardio and strength training, paired with a calorie-aware diet, can help bring this into range. Ask about our Premium plan.' },
    { max: Infinity, label: 'Obese', color: '#c14343', suggestion: 'Consider speaking with our trainers about a structured, supervised program — sustainable progress beats a crash plan.' }
  ];

  function calculateBMI() {
    const heightCm = parseFloat(bmiHeight.value);
    const weightKg = parseFloat(bmiWeight.value);

    if (!heightCm || !weightKg || heightCm < 50 || heightCm > 260 || weightKg < 20 || weightKg > 300) {
      bmiError.textContent = 'Please enter a realistic height (50–260cm) and weight (20–300kg).';
      return;
    }
    bmiError.textContent = '';

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    const category = BMI_CATEGORIES.find(c => bmi < c.max);

    bmiValue.textContent = bmi.toFixed(1);
    bmiCategory.textContent = category.label;
    bmiCategory.style.color = category.color;
    bmiSuggestion.textContent = category.suggestion;

    // Gauge: map bmi range 12-42 onto 0-283 (full dash length), clamp
    const clamped = Math.min(Math.max(bmi, 12), 42);
    const pct = (clamped - 12) / (42 - 12);
    const dashLength = 283;
    const offset = dashLength - pct * dashLength;
    bmiGaugeFill.style.stroke = category.color;
    bmiGaugeFill.style.strokeDashoffset = offset;
  }

  bmiCalcBtn && bmiCalcBtn.addEventListener('click', calculateBMI);
  [bmiHeight, bmiWeight].forEach(input => {
    input && input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') calculateBMI();
    });
  });

  /* ---------- GALLERY LIGHTBOX ---------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      lightboxContent.style.background = getComputedStyle(item).background;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }
  lightboxClose && lightboxClose.addEventListener('click', closeLightbox);
  lightbox && lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* ---------- TESTIMONIAL SLIDER ---------- */
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  if (track && dotsWrap) {
    const slides = track.children.length;
    let current = 0;

    for (let i = 0; i < slides; i++) {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to review ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
    const dots = Array.from(dotsWrap.children);

    function goTo(index) {
      current = (index + slides) % slides;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    let autoplay = setInterval(() => goTo(current + 1), 6000);
    track.parentElement.addEventListener('mouseenter', () => clearInterval(autoplay));
    track.parentElement.addEventListener('mouseleave', () => {
      autoplay = setInterval(() => goTo(current + 1), 6000);
    });
  }

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---------- CONTACT FORM ---------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  contactForm && contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formSuccess.textContent = "Thanks — we've received your message and will reach out shortly.";
    contactForm.reset();
    setTimeout(() => { formSuccess.textContent = ''; }, 6000);
  });

});
