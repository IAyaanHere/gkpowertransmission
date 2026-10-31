/**
 * GK Power Transmission Company Pvt. Ltd - Quanta Services Theme Interactive Scripts
 * Responsive Features, WhatsApp Quick Quote & Interactive UI
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Locked / Sticky Header System (Always pinned to top on scroll)
  const headerWrapper = document.querySelector('.site-header-wrapper');
  const navbar = document.querySelector('.navbar');

  function handleHeaderScroll() {
    const isScrolled = window.scrollY > 20;
    if (isScrolled) {
      headerWrapper?.classList.add('scrolled');
      navbar?.classList.add('scrolled');
    } else {
      headerWrapper?.classList.remove('scrolled');
      navbar?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // 2. Mobile Drawer Navigation
  const menuToggle = document.querySelector('.menu-toggle');
  const drawerClose = document.querySelector('.drawer-close');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerBackdrop = document.querySelector('.drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-nav a');

  function openDrawer() {
    mobileDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  menuToggle?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // 3. Hero Video Autoplay Assurance
  const heroVideo = document.querySelector('.hero-video-element');
  if (heroVideo) {
    heroVideo.muted = true;
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Retry autoplay if initially deferred by browser
        document.addEventListener('click', () => {
          heroVideo.play().catch(() => {});
        }, { once: true });
      });
    }
  }

  // 4. KPI Number Count-Up Animation
  const counters = document.querySelectorAll('.counter-number');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10) || 0;
          const duration = 2000; // 2 seconds
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic easing curve: fast start, soft landing
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOutProgress * target);
            el.textContent = currentVal;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = target;
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // 5. Client Toggle & Filter Logic (Top 6 Initial + Expand All)
  const clientTabs = document.querySelectorAll('.client-filter-tabs .tab-btn');
  const clientCards = document.querySelectorAll('.client-card');
  const toggleClientsBtn = document.getElementById('toggleClientsBtn');
  const clientsGrid = document.querySelector('.clients-grid');

  function updateToggleBtnState(isExpanded) {
    if (!toggleClientsBtn) return;
    toggleClientsBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    const btnText = toggleClientsBtn.querySelector('.btn-text');
    const btnSvg = toggleClientsBtn.querySelector('svg');
    if (isExpanded) {
      if (btnText) btnText.textContent = 'Show Top 6 Clients';
      if (btnSvg) btnSvg.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
    } else {
      if (btnText) btnText.textContent = 'View All 14 Clients & Partners';
      if (btnSvg) btnSvg.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
    }
  }

  if (toggleClientsBtn && clientsGrid) {
    toggleClientsBtn.addEventListener('click', () => {
      const isExpanded = clientsGrid.classList.toggle('show-all');
      updateToggleBtnState(isExpanded);

      // Re-apply current tab filter
      const activeTab = document.querySelector('.client-filter-tabs .tab-btn.active');
      const filter = activeTab ? (activeTab.getAttribute('data-filter') || 'all') : 'all';

      clientCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        const isExtra = card.classList.contains('client-extra');
        const matchesCategory = (filter === 'all' || cat.includes(filter));

        if (!matchesCategory) {
          card.style.display = 'none';
        } else if (!isExpanded && isExtra && filter === 'all') {
          card.style.display = 'none';
        } else {
          card.style.display = 'flex';
        }
      });

      if (!isExpanded) {
        const clientsSec = document.getElementById('clients');
        if (clientsSec) {
          clientsSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  clientTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      clientTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter') || 'all';

      // If user filters to a specific category, automatically expand to reveal matching cards
      if (filter !== 'all') {
        if (clientsGrid && !clientsGrid.classList.contains('show-all')) {
          clientsGrid.classList.add('show-all');
          updateToggleBtnState(true);
        }
        if (toggleClientsBtn) {
          toggleClientsBtn.style.display = 'none'; // Hide toggle while specific category tab is active
        }
      } else {
        if (toggleClientsBtn) {
          toggleClientsBtn.style.display = 'inline-flex';
        }
      }

      const isExpanded = clientsGrid ? clientsGrid.classList.contains('show-all') : true;

      clientCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        const isExtra = card.classList.contains('client-extra');
        const matchesCategory = (filter === 'all' || cat.includes(filter));

        if (!matchesCategory) {
          card.style.display = 'none';
        } else if (!isExpanded && isExtra && filter === 'all') {
          card.style.display = 'none';
        } else {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 30);
        }
      });
    });
  });

  // 6. Project Lightbox Modal
  const projectCards = document.querySelectorAll('.project-card');
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxTitle = document.querySelector('.lightbox-title');
  const lightboxDesc = document.querySelector('.lightbox-desc');
  const lightboxClose = document.querySelector('.lightbox-close');

  function openLightbox(src, title, desc) {
    if (lightboxImg) lightboxImg.src = src;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = desc;
    lightboxModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('.project-title')?.textContent || '';
      const desc = card.querySelector('.project-desc')?.textContent || '';
      if (img) {
        openLightbox(img.src, title, desc);
      }
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Close modals on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeLightbox();
    }
  });

  // 7. Project Filter Tabs & Top 5 Toggle Logic
  const projectTabs = document.querySelectorAll('.project-filter-tabs .tab-btn');
  const toggleProjectsBtn = document.getElementById('toggleProjectsBtn');
  const projectsGrid = document.querySelector('.projects-grid');

  function updateProjectToggleBtnState(isExpanded) {
    if (!toggleProjectsBtn) return;
    toggleProjectsBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    const btnText = toggleProjectsBtn.querySelector('.btn-text');
    const btnSvg = toggleProjectsBtn.querySelector('svg');
    if (isExpanded) {
      if (btnText) btnText.textContent = 'Show Top 5 Projects';
      if (btnSvg) btnSvg.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
    } else {
      if (btnText) btnText.textContent = 'View All 12 Projects & Products';
      if (btnSvg) btnSvg.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
    }
  }

  if (toggleProjectsBtn && projectsGrid) {
    toggleProjectsBtn.addEventListener('click', () => {
      const isExpanded = projectsGrid.classList.toggle('show-all');
      updateProjectToggleBtnState(isExpanded);

      // Re-apply current tab filter
      const activeTab = document.querySelector('.project-filter-tabs .tab-btn.active');
      const filter = activeTab ? (activeTab.getAttribute('data-filter') || 'all') : 'all';

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        const isExtra = card.classList.contains('project-extra');
        const matchesCategory = (filter === 'all' || cat.includes(filter));

        if (!matchesCategory) {
          card.style.display = 'none';
        } else if (!isExpanded && isExtra && filter === 'all') {
          card.style.display = 'none';
        } else {
          card.style.display = 'flex';
        }
      });

      if (!isExpanded) {
        const projSec = document.getElementById('projects');
        if (projSec) {
          projSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  projectTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      projectTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter') || 'all';

      // If user filters to a specific category, auto-expand to reveal matching cards
      if (filter !== 'all') {
        if (projectsGrid && !projectsGrid.classList.contains('show-all')) {
          projectsGrid.classList.add('show-all');
          updateProjectToggleBtnState(true);
        }
        if (toggleProjectsBtn) {
          toggleProjectsBtn.style.display = 'none';
        }
      } else {
        if (toggleProjectsBtn) {
          toggleProjectsBtn.style.display = 'inline-flex';
        }
      }

      const isExpanded = projectsGrid ? projectsGrid.classList.contains('show-all') : true;

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        const isExtra = card.classList.contains('project-extra');
        const matchesCategory = (filter === 'all' || cat.includes(filter));

        if (!matchesCategory) {
          card.style.display = 'none';
        } else if (!isExpanded && isExtra && filter === 'all') {
          card.style.display = 'none';
        } else {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 30);
        }
      });
    });
  });

  // 8. Contact Form Handling -> Direct WhatsApp pre-typed integration to +918855847066
  const contactForms = document.querySelectorAll('#contact-form, form');
  const toast = document.querySelector('.toast');

  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputs = form.querySelectorAll('input, select, textarea');
      let name = '';
      let company = '';
      let phone = '';
      let req = '';
      let msg = '';

      inputs.forEach(input => {
        const val = input.value.trim();
        const placeholder = (input.placeholder || '').toLowerCase();
        const label = input.closest('.form-group')?.querySelector('label')?.textContent.toLowerCase() || '';

        if (label.includes('name') || placeholder.includes('name')) name = val;
        else if (label.includes('company') || label.includes('utility') || placeholder.includes('organization') || placeholder.includes('msetcl')) company = val;
        else if (label.includes('phone') || placeholder.includes('phone') || input.type === 'tel') phone = val;
        else if (input.tagName === 'SELECT') req = input.options[input.selectedIndex]?.text || val;
        else if (input.tagName === 'TEXTAREA' || label.includes('message') || label.includes('details') || label.includes('scope')) msg = val;
      });

      let waText = "Hello GK Power Transmission Company Pvt. Ltd, I would like to enquire about your services and products.";
      if (name) waText += `\nName: ${name}`;
      if (company) waText += `\nCompany: ${company}`;
      if (phone) waText += `\nPhone: ${phone}`;
      if (req) waText += `\nRequirement: ${req}`;
      if (msg) waText += `\nScope/Details: ${msg}`;

      const waUrl = `https://wa.me/918855847066?text=${encodeURIComponent(waText)}`;

      if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 5000);
      }

      window.open(waUrl, '_blank');
      form.reset();
    });
  });

  // 9. Back to Top
  const backToTopBtn = document.querySelector('.back-to-top');
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 10. Light / Dark Mode System (Default: White / Light Mode)
  const themeToggleBtns = document.querySelectorAll('.theme-toggle');

  function getActiveTheme() {
    return document.documentElement.getAttribute('data-theme') || localStorage.getItem('gkpower_theme') || 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gkpower_theme', theme);

    themeToggleBtns.forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  }

  // Sync initial state
  const currentTheme = getActiveTheme();
  setTheme(currentTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const targetTheme = current === 'dark' ? 'light' : 'dark';
      setTheme(targetTheme);
    });
  });
});
