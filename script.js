/* =============================================
   Portfolio JavaScript — Gokulnath N
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Navbar scroll behavior ----- */
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

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

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', () => {
    handleNavbarScroll();
    updateActiveLink();
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
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach((el, index) => {
    // Stagger animation delay
    el.style.transitionDelay = `${index % 4 * 0.1}s`;
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
    let current = 0;
    const increment = Math.ceil(target / 40);
    const duration = 1500;
    const stepTime = duration / (target / increment);

    const counter = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(counter);
      }
      element.textContent = current + suffix;
    }, stepTime);
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

  /* ----- Hiding Spline Watermark Logo ----- */
  const splineViewer = document.querySelector('spline-viewer');
  if (splineViewer) {
    // Wait for the Spline viewer to load its shadow DOM
    splineViewer.addEventListener('load', () => {
      const shadowRoot = splineViewer.shadowRoot;
      if (shadowRoot) {
        // Try multiple selectors to guarantee we find and remove the watermark anchor/logo
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
  }

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
