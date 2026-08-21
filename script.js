/* ============================================================
   SCRIPT.JS — Portfolio M Rifky Al Fadhry
   All interactions, animations, and dynamic behaviour
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────────
     1. GENERATE ORBIT STAR FIELD (inside ORBIT project card)
     ────────────────────────────────────────────────────────── */
  const orbitStars = document.getElementById('orbit-stars');
  if (orbitStars) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 55; i++) {
      const s = document.createElement('div');
      const sz = Math.random() * 2 + 0.5;
      s.style.cssText = `
        position: absolute;
        left: ${(Math.random() * 100).toFixed(2)}%;
        top:  ${(Math.random() * 100).toFixed(2)}%;
        width:  ${sz.toFixed(2)}px;
        height: ${sz.toFixed(2)}px;
        background: #fff;
        border-radius: 50%;
        opacity: ${(0.25 + Math.random() * 0.7).toFixed(2)};
        animation: twinkle ${(2 + Math.random() * 3).toFixed(2)}s ease-in-out infinite;
        animation-delay: ${(Math.random() * 4).toFixed(2)}s;
      `;
      fragment.appendChild(s);
    }
    orbitStars.appendChild(fragment);
  }


  /* ──────────────────────────────────────────────────────────
     3. NAVBAR — SCROLL EFFECT
     ────────────────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 72);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial run


  /* ──────────────────────────────────────────────────────────
     4. MOBILE HAMBURGER MENU
     ────────────────────────────────────────────────────────── */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');

  const toggleMenu = (forceClose = false) => {
    const isOpen = !forceClose && !hamburger.classList.contains('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.classList.toggle('open', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  };

  hamburger.addEventListener('click', () => toggleMenu());

  // Close on mobile link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(true));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) toggleMenu(true);
  });


  /* ──────────────────────────────────────────────────────────
     5. FADE-IN ON SCROLL (IntersectionObserver)
     ────────────────────────────────────────────────────────── */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  // Hero elements: trigger immediately after a short delay
  document.querySelectorAll('.hero .fade-in').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 120 + i * 150);
  });

  // All other fade-in elements
  document.querySelectorAll('.fade-in:not(.hero .fade-in)').forEach(el => {
    fadeObserver.observe(el);
  });

  // Timeline stagger — organic, non-uniform delays
  const STAGGER_DELAYS = ['0.07s', '0.19s', '0.34s'];
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    item.style.setProperty('--stagger-delay', STAGGER_DELAYS[i] ?? '0.07s');
  });


  /* ──────────────────────────────────────────────────────────
     6. ACTIVE NAV LINK — SCROLL SPY
     ────────────────────────────────────────────────────────── */
  const navLinks   = document.querySelectorAll('.nav-link[data-section]');
  const sections   = document.querySelectorAll('section[id]');

  const setActive = (id) => {
    navLinks.forEach(link => {
      const isActive = link.dataset.section === id ||
                       (id === 'skills' && link.dataset.section === 'skills');
      link.classList.toggle('active', isActive);
    });
  };

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-38% 0px -55% 0px', threshold: 0 });

  sections.forEach(sec => spyObserver.observe(sec));

  // Skills section is inside About — map #skills anchor to "skills" nav link
  const skillsAnchor = document.getElementById('skills');
  if (skillsAnchor) {
    const skillsObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setActive('skills');
    }, { rootMargin: '-30% 0px -30% 0px', threshold: 0 });
    skillsObs.observe(skillsAnchor);
  }


  /* ──────────────────────────────────────────────────────────
     7. NUMBER COUNTER ANIMATION
     ────────────────────────────────────────────────────────── */
  const animateCount = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800; // ms
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.count-num').forEach(el => counterObserver.observe(el));


  /* ──────────────────────────────────────────────────────────
     8. SKILL PROGRESS BARS ANIMATION
     ────────────────────────────────────────────────────────── */
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pct = entry.target.dataset.percent;
        // Small delay for stagger effect
        const index = [...document.querySelectorAll('.skill-bar-fill')]
          .indexOf(entry.target);
        setTimeout(() => {
          entry.target.style.width = pct + '%';
        }, index * 120);
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-bar-fill').forEach(bar => barObserver.observe(bar));


  /* ──────────────────────────────────────────────────────────
     10. SMOOTH SCROLL for anchor links
     ────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ──────────────────────────────────────────────────────────
     11. BACK TO TOP
     ────────────────────────────────────────────────────────── */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ──────────────────────────────────────────────────────────
     12. CONTACT FORM — Web3Forms integration
     ────────────────────────────────────────────────────────── */
  const contactForm   = document.getElementById('contact-form');
  const formFeedback  = document.getElementById('form-feedback');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  const BTN_DEFAULT = 'Send Message <i class="fas fa-paper-plane" aria-hidden="true"></i>';
  const BTN_LOADING = 'Sending… <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>';

  const showFeedback = (message, type) => {
    // type: 'success' | 'error'
    formFeedback.innerHTML = message;
    formFeedback.style.display  = 'block';
    formFeedback.style.padding  = '12px 16px';
    formFeedback.style.borderRadius = '8px';
    formFeedback.style.fontSize = '14px';
    formFeedback.style.fontWeight  = '500';
    formFeedback.style.marginTop   = '12px';
    if (type === 'success') {
      formFeedback.style.background = 'rgba(34, 197, 94, 0.1)';
      formFeedback.style.border     = '1px solid rgba(34, 197, 94, 0.35)';
      formFeedback.style.color      = '#4ade80';
    } else {
      formFeedback.style.background = 'rgba(239, 68, 68, 0.1)';
      formFeedback.style.border     = '1px solid rgba(239, 68, 68, 0.35)';
      formFeedback.style.color      = '#f87171';
    }
    // Auto-hide after 8 seconds
    setTimeout(() => {
      formFeedback.style.display = 'none';
      formFeedback.innerHTML = '';
    }, 8000);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // ── Client-side validation ──
      const nameVal  = document.getElementById('form-name').value.trim();
      const emailVal = document.getElementById('form-email').value.trim();
      const msgVal   = document.getElementById('form-message').value.trim();
      const emailOk  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);

      if (!nameVal || !emailVal || !msgVal) {
        showFeedback('⚠ Please fill in all fields before sending.', 'error');
        return;
      }
      if (!emailOk) {
        showFeedback('⚠ Please enter a valid email address.', 'error');
        return;
      }

      // ── Loading state ──
      formSubmitBtn.innerHTML  = BTN_LOADING;
      formSubmitBtn.disabled   = true;
      formFeedback.style.display = 'none';

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body:   formData,
        });
        const data = await response.json();

        if (data.success) {
          showFeedback('✓ Message sent! I\'ll get back to you soon.', 'success');
          contactForm.reset();
        } else {
          showFeedback('✗ Something went wrong. Please try again.', 'error');
        }
      } catch (err) {
        showFeedback('✗ Network error. Check your connection and try again.', 'error');
      } finally {
        formSubmitBtn.innerHTML = BTN_DEFAULT;
        formSubmitBtn.disabled  = false;
      }
    });
  }


  /* ──────────────────────────────────────────────────────────
     13. STATS BAR INITIAL ANIMATION (once visible)
     ────────────────────────────────────────────────────────── */
  // The stats-bar already has fade-in class,
  // the IntersectionObserver from section 5 handles it.
  // Counter triggers separately via counterObserver.


  /* ────────────────────────────────────────────────────────────
   14. CARD HOVER - tilt and spotlight effect
   ──────────────────────────────────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
    
    if (window.innerWidth > 768) {
      const tiltX = (y / rect.height - 0.5) * 5;
      const tiltY = -(x / rect.width - 0.5) * 5;
      card.style.transform = `translateY(-4px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.01)`;
      card.style.transition = 'transform 0.08s ease';
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
    card.style.transition = 'transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease';
  });
});

  /* ──────────────────────────────────────────────────────────
     15. PROJECT MODAL / LIGHTBOX
     ────────────────────────────────────────────────────────── */

  // ── Project data ──
  const PROJECT_DATA = {
    'project-filkom': {
      title:       'FILKOM UNIDA (Concept)',
      subtitle:    'Unofficial Redesign Case Study',
      description: 'A personal case study to redesign the faculty\'s main platform into a modern, international-standard website. Focuses on reducing cognitive load with Mega Menu navigation, removing public admin portals, and establishing a premium Glassmorphism aesthetic. Built to handle dynamic data via Supabase.',
      tags:        ['Next.js', 'React', 'Tailwind', 'Supabase', 'Figma'],
      link:        'https://filkom-web-5e8a.vercel.app/',
      images:      [
        'projects/Home-Filkom.png',
        'projects/Dropdown-Filkom.png',
        'projects/Akreditasi-Filkom.png',
        'projects/Dosen-Filkom.png',
        'projects/Kontak-Filkom.png',
      ],
    },
    'project-vesta': {
      title:       'VESTA',
      subtitle:    'Personal Finance Tracker',
      description: 'A personal finance tracker designed with a philosophy, observe more, speak less. Features emotional spending map, animated statistics, and a midnight ocean aesthetic.',
      tags:        ['Flutter', 'Dart', 'Hive', 'fl_chart', 'Provider'],
      images:      [
        'projects/vesta-dashboard.jpg',
        'projects/vesta-statistics.jpg',
        'projects/vesta-history.jpg',
      ],
    },
    'project-kelomapp': {
      title:       'KelomApp',
      subtitle:    'Productivity & Task Manager',
      description: 'A productivity app for managing projects, tasks, and focus sessions. Built with a premium dark UI and Pomodoro timer integration for deep work.',
      tags:        ['Flutter', 'Dart', 'Riverpod', 'Hive'],
      images:      [
        'projects/kelomapp-home.jpg',
        'projects/kelomapp-tasks.jpg',
      ],
    },
    'project-orbit': {
      title:       'ORBIT — Cosmic Diary',
      subtitle:    'A digital time capsule app. Send your memories to the future.',
      description: 'ORBIT is a cosmic-themed digital diary built with Flutter, letting users write messages, seal them inside a virtual time capsule, and open them again in the future. Built offline-first, everything stays on-device, no server, no cost. Features include Time Capsule Lock, Burn After Reading, a Cosmic Galaxy View, mood tracking, and local notifications.',
      tags:        ['Flutter', 'Dart', 'Hive', 'Provider', 'Local Notifications', 'Custom Painters', 'Cosmic UI'],
      images:      [
        'projects/orbit-home.jpg',
        'projects/orbit-write.jpg',
        'projects/orbit-capsule.jpg',
      ],
    },
    'project-lumora': {
      title:       'LUMORA',
      subtitle:    'Website Landing Page',
      description: 'A self-initiated practice project to design and build a coffee shop landing page from scratch, exploring how visual storytelling, motion, and layout hierarchy can turn a simple page into an inviting brand experience.',
      tags:        ['HTML', 'CSS', 'JavaScript', 'UI/UX'],
      link:        'https://lumora-coffee-kappa.vercel.app/',
      images:      [
        'projects/Home-Lumora.png',
        'projects/Menu-Lumora.png',
        'projects/Lokasi-Lumora.png',
        'projects/Kontak-Lumora.png',
      ],
    },
    'project-kopitagram': {
      title:       'KOPITAGRAM (Concept)',
      subtitle:    'Unofficial App Case Study',
      description: 'A personal case study to design a mobile application concept for a coffee shop, focusing on a seamless ordering experience and an engaging user interface.',
      tags:        ['Flutter', 'Dart', 'UI/UX', 'Figma'],
      images:      [
        'projects/Home-Kopitagram.jpg',
        'projects/Cafe-Kopitagram.jpg',
        'projects/Detail-Cafe-Kopitagram.jpg',
        'projects/Order-Kopitagram.jpg',
        'projects/Rewards-Kopitagram.jpg',
        'projects/Profile-Kopitagram.jpg',
      ],
    },
  };

  // ── Modal DOM refs ──
  const modalOverlay  = document.getElementById('project-modal');
  const modalCard     = document.getElementById('modal-card');
  const modalClose    = document.getElementById('modal-close');
  const modalImageArea = document.getElementById('modal-image-area');
  const modalPrev     = document.getElementById('modal-prev');
  const modalNext     = document.getElementById('modal-next');
  const modalCounter  = document.getElementById('modal-counter');
  const modalTitle    = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalDesc     = document.getElementById('modal-description');
  const modalTags     = document.getElementById('modal-tags');

  let modalImgEl  = null;   // current <img> in modal
  let modalImages = [];     // current project's image array
  let modalIdx    = 0;      // current image index

  // ── Build modal content ──
  const openModal = (projectId) => {
    const data = PROJECT_DATA[projectId];
    if (!data) return;

    // Populate text
    modalTitle.textContent    = data.title;
    modalSubtitle.textContent = data.subtitle;
    modalDesc.textContent     = data.description;

    // Tags
    modalTags.innerHTML = data.tags
      .map(t => `<span class="tag">${t}</span>`)
      .join('');

    // Clear previous image content (keep arrows + counter)
    if (modalImgEl) modalImgEl.remove();
    const prevComingSoon = modalImageArea.querySelector('.modal-coming-soon');
    if (prevComingSoon) prevComingSoon.remove();
    modalImgEl = null;

    // Action button (Live link)
    const modalActions = document.getElementById('modal-actions');
    if (data.link) {
      modalActions.innerHTML = `<a href="${data.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 1rem;"><i class="fas fa-external-link-alt" style="margin-right: 8px;"></i> Visit Live Website</a>`;
      modalActions.style.display = 'block';
    } else {
      modalActions.innerHTML = '';
      modalActions.style.display = 'none';
    }

    modalImages = data.images;
    modalIdx    = 0;

    if (modalImages.length === 0) {
      // ORBIT — Coming Soon
      const cs = document.createElement('div');
      cs.className = 'modal-coming-soon';
      cs.innerHTML = `
        <span class="orbit-badge">Coming Soon</span>
        <p class="orbit-title">ORBIT</p>
        <p class="orbit-tagline">Memory Time Capsule</p>
        <p class="orbit-dev-note">Currently in development, letters locked until a chosen date, delivered through a cinematic galaxy experience.</p>
      `;
      modalImageArea.insertBefore(cs, modalPrev);
      modalPrev.classList.add('hidden');
      modalNext.classList.add('hidden');
      modalCounter.style.display = 'none';
    } else {
      // Build img element
      modalImgEl = document.createElement('img');
      modalImgEl.alt = data.title + ' screenshot';
      modalImgEl.src = modalImages[0];
      modalImageArea.insertBefore(modalImgEl, modalPrev);
      updateModalNav();
    }

    // Show modal
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  };

  const updateModalNav = () => {
    const total = modalImages.length;
    // Arrows
    modalPrev.classList.toggle('hidden', modalIdx === 0);
    modalNext.classList.toggle('hidden', modalIdx >= total - 1);
    // Counter
    if (total > 1) {
      modalCounter.style.display = 'block';
      modalCounter.textContent = `${modalIdx + 1} / ${total}`;
    } else {
      modalCounter.style.display = 'none';
    }
  };

  const goModalImage = (direction) => {
    const total = modalImages.length;
    const next  = modalIdx + direction;
    if (next < 0 || next >= total || !modalImgEl) return;
    modalImgEl.classList.add('switching');
    setTimeout(() => {
      modalIdx = next;
      modalImgEl.src = modalImages[modalIdx];
      modalImgEl.classList.remove('switching');
      updateModalNav();
    }, 220);
  };

  const closeModal = () => {
    // Trigger exit animation via .closing class, then remove .active after
    modalOverlay.classList.add('closing');
    setTimeout(() => {
      modalOverlay.classList.remove('active', 'closing');
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (modalImgEl) { modalImgEl.remove(); modalImgEl = null; }
      const cs = modalImageArea.querySelector('.modal-coming-soon');
      if (cs) cs.remove();
    }, 310);
  };

  // ── Wire up project card clicks ──
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking carousel arrow buttons
      if (e.target.closest('#prev-btn') || e.target.closest('#next-btn')) return;
      openModal(card.id);
    });
  });

  // ── Modal controls ──
  modalClose.addEventListener('click', closeModal);

  // Click outside card → close
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Image navigation
  modalPrev.addEventListener('click', (e) => { e.stopPropagation(); goModalImage(-1); });
  modalNext.addEventListener('click', (e) => { e.stopPropagation(); goModalImage(+1); });

  // Keyboard: Escape to close, arrow keys for image nav
  document.addEventListener('keydown', (e) => {
    if (!modalOverlay.classList.contains('active')) return;
    if (e.key === 'Escape')      closeModal();
    if (e.key === 'ArrowLeft')   goModalImage(-1);
    if (e.key === 'ArrowRight')  goModalImage(+1);
  });

  /* ──────────────────────────────────────────────────────────
     15. SKILLS BENTO GRID — MOBILE TOUCH INTERACTION
     ────────────────────────────────────────────────────────── */
  const skillCards = document.querySelectorAll('.skill-proof-card');
  skillCards.forEach(card => {
    // Prevent sticky hover on iOS by manually toggling .active class
    card.addEventListener('click', (e) => {
      // If the user taps the card, toggle 'active' and remove 'active' from others
      const isActive = card.classList.contains('active');
      
      skillCards.forEach(c => c.classList.remove('active'));
      
      if (!isActive) {
        card.classList.add('active');
      }
    });
  });

  // Tap outside to close all active skill cards
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.skill-proof-card')) {
      skillCards.forEach(c => c.classList.remove('active'));
    }
  });

}); // end DOMContentLoaded
