/* =============================================
   Portfolio JavaScript — Gokulnath N
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Navbar scroll behavior ----- */
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  let sectionPositions = [];

  function cacheSectionPositions() {
    sectionPositions = [];
    sections.forEach(section => {
      sectionPositions.push({
        id: section.getAttribute('id'),
        top: section.offsetTop,
        height: section.offsetHeight
      });
    });
  }

  // Cache positions initially
  cacheSectionPositions();

  // Re-cache section positions on window resize/layout changes
  window.addEventListener('resize', cacheSectionPositions, { passive: true });
  window.addEventListener('load', cacheSectionPositions, { passive: true });

  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ----- Active nav link on scroll ----- */
  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;

    sectionPositions.forEach(sec => {
      if (scrollPos >= sec.top && scrollPos < sec.top + sec.height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sec.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Throttled scroll listener using requestAnimationFrame ticking
  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        handleNavbarScroll();
        updateActiveLink();
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  handleNavbarScroll();
  updateActiveLink();

  /* ----- Smooth scrolling for anchor links ----- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.offsetTop - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const navLinksContainer = document.querySelector('.nav-links');
        const navToggle = document.querySelector('.nav-toggle');
        if (navLinksContainer.classList.contains('active')) {
          navLinksContainer.classList.remove('active');
          navToggle.classList.remove('active');
        }
      }
    });
  });

  /* ----- Mobile menu toggle ----- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinksContainer.classList.toggle('active');
    });
  }

  /* ----- Scroll-triggered animations (IntersectionObserver) ----- */
  const animateElements = document.querySelectorAll('.animate-in');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('visible');
        
        // Remove will-change layer promotions after transition finishes to reclaim GPU memory
        el.addEventListener('transitionend', function handleTransitionEnd() {
          el.style.willChange = 'auto';
          el.removeEventListener('transitionend', handleTransitionEnd);
        });
        
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  animateElements.forEach((el) => {
    // Stagger animation delay locally relative to siblings in the same section container
    const siblings = Array.from(el.parentNode.querySelectorAll('.animate-in'));
    const index = siblings.indexOf(el);
    el.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(el);
  });

  /* ----- Typing / role text animation ----- */
  const roles = ['Full Stack Developer', 'React Developer', 'Problem Solver', 'Quick Learner'];
  const typingElement = document.querySelector('.hero-role-text');
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeRole() {
    if (!typingElement) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before next word
    }

    setTimeout(typeRole, typingSpeed);
  }

  // Start typing animation
  if (typingElement) {
    typingElement.textContent = '';
    setTimeout(typeRole, 1000);
  }

  /* ----- Stat counter animation ----- */
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCounter(element) {
    const text = element.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;

    const target = parseInt(match[1]);
    const suffix = text.replace(/\d+/, '');
    const duration = 1500; // 1.5 seconds counter duration
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * target);
      element.textContent = current + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = target + suffix;
        // Re-cache positions since layout might shift slightly after count completes
        cacheSectionPositions();
      }
    }

    window.requestAnimationFrame(step);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => statObserver.observe(stat));

  /* ----- Contact form handling ----- */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      // Simple validation
      if (!data.name || !data.email || !data.message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate form submission
      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  /* ----- Notification system ----- */
  function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;

    document.body.appendChild(notification);

    // Trigger animation
    requestAnimationFrame(() => {
      notification.classList.add('show');
    });

    // Auto remove after 4 seconds
    setTimeout(() => {
      notification.classList.add('hide');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  /* ----- Download CV button ----- */
  const downloadBtn = document.querySelector('.nav-cta');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Opens the resume HTML in a new tab for printing/saving
      window.open('resume.html', '_blank');
    });
  }

  /* ----- Back to top (on logo click) ----- */
  const logo = document.querySelector('.nav-logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----- Deferred Asynchronous Loading of Spline 3D Viewer ----- */
  window.addEventListener('load', () => {
    // Wait 1200ms to guarantee all initial page animations and assets are settled and idle
    setTimeout(() => {
      const splineContainer = document.querySelector('.hero-spline-bg');
      if (splineContainer) {
        // Dynamically inject the Spline script module to keep initial page parse unblocked
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js';
        document.body.appendChild(script);

        const viewer = document.createElement('spline-viewer');
        viewer.setAttribute('url', 'https://prod.spline.design/Dn9dBOFpxomJ9LFV/scene.splinecode');
        viewer.setAttribute('loading-anim-type', 'spinner-small-dark');
        
        // Watermark Removal Logic once Spline's internal shadow DOM has loaded
        viewer.addEventListener('load', () => {
          const shadowRoot = viewer.shadowRoot;
          if (shadowRoot) {
            const watermark = shadowRoot.getElementById('logo') || 
                              shadowRoot.querySelector('#logo') || 
                              shadowRoot.querySelector('a[href*="spline.design"]') || 
                              shadowRoot.querySelector('.logo');
            if (watermark) {
              watermark.style.display = 'none';
              watermark.style.opacity = '0';
              watermark.style.visibility = 'hidden';
              watermark.style.pointerEvents = 'none';
            }
          }
        });

        splineContainer.appendChild(viewer);
      }
    }, 1200);
  }, { passive: true });

  /* ----- Optimize Spline 3D Render Loop (GPU Performance) ----- */
  const heroSection = document.getElementById('hero');
  const splineBg = document.querySelector('.hero-spline-bg');
  if (heroSection && splineBg) {
    const splineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          splineBg.style.display = 'block'; // Resume rendering
        } else {
          splineBg.style.display = 'none';  // Suspend WebGL rendering loops
        }
      });
    }, {
      root: null,
      threshold: 0.02 // Trigger when even 2% of the hero is visible
    });
    splineObserver.observe(heroSection);
  }

});
