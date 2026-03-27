/* ============================================================
   main.js — Comportements généraux du portfolio
   - Reveal au scroll
   - Barres de compétences animées
   - Navigation active + burger mobile
   - Formulaire de contact
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── REVEAL AU SCROLL ── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* ── BARRES DE COMPÉTENCES ── */
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-fill').forEach(bar => {
            const width = parseFloat(bar.dataset.width) / 100;
            bar.style.transform = `scaleX(${width})`;
            bar.classList.add('animated');
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.card').forEach(card => barObserver.observe(card));


  /* ── NAVIGATION ACTIVE AU SCROLL ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  const updateActiveNav = () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 200) {
        current = section.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav(); // init


  /* ── BURGER MENU MOBILE ── */
  const burger    = document.getElementById('nav-burger');
  const navMenu   = document.querySelector('.nav-links');

  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Ferme le menu au clic sur un lien
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }


  /* ── FORMULAIRE DE CONTACT ── */
  const submitBtn = document.getElementById('submit-btn');

  if (submitBtn) {
    submitBtn.addEventListener('click', handleFormSubmit);
  }

  function handleFormSubmit() {
    const name    = document.getElementById('f-name')?.value.trim();
    const email   = document.getElementById('f-email')?.value.trim();
    const subject = document.getElementById('f-subject')?.value.trim();
    const message = document.getElementById('f-message')?.value.trim();

    // Validation simple
    if (!name || !email || !message) {
      showToast('Merci de remplir tous les champs obligatoires.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showToast('Veuillez entrer une adresse email valide.', 'error');
      return;
    }

    // Simulation d'envoi (remplacer par EmailJS / Formspree)
    submitBtn.textContent = 'Envoi en cours…';
    submitBtn.disabled = true;

    setTimeout(() => {
      showToast('Message envoyé ! Je vous répondrai bientôt.', 'success');
      submitBtn.textContent = 'Envoyer le message';
      submitBtn.disabled = false;
      // Reset form
      ['f-name', 'f-email', 'f-subject', 'f-message'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    }, 1200);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  /* ── TOAST NOTIFICATIONS ── */
  function showToast(message, type = 'success') {
    // Supprimer toast existant
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;

    // Styles inline pour le toast (pas de fichier CSS supplémentaire nécessaire)
    Object.assign(toast.style, {
      position:     'fixed',
      bottom:       '2rem',
      right:        '2rem',
      background:   type === 'success' ? 'rgba(127,255,110,.15)' : 'rgba(255,80,80,.15)',
      border:       `1px solid ${type === 'success' ? 'rgba(127,255,110,.4)' : 'rgba(255,80,80,.4)'}`,
      color:        type === 'success' ? '#7fff6e' : '#ff6060',
      padding:      '.85rem 1.4rem',
      borderRadius: '4px',
      fontFamily:   "'DM Mono', monospace",
      fontSize:     '.8rem',
      zIndex:       '9999',
      backdropFilter: 'blur(10px)',
      animation:    'fadeUp .3s ease',
    });

    document.body.appendChild(toast);

    // Auto-suppression
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity .3s';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

});
