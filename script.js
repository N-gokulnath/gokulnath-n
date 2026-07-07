document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------------------------------------------------------- */
  /*                      Dynamic Background Rotation                           */
  /* -------------------------------------------------------------------------- */
  const images = [
    "jack-anstey-XVoyX7l9ocY-unsplash.jpg",
    "luca-micheli-ruWkmt3nU58-unsplash.jpg",
    "sebastien-goldberg-oXgPDa0OtAk-unsplash.jpg",
    "niklas-ohlrogge-niamoh-de-8t05UUZk8K4-unsplash.jpg",
    "pexels-baptiste-valthier-193914-803250.jpg",
    "pexels-jplenio-3131634.jpg",
    "view-old-tree-lake-with-snow-covered-mountains-cloudy-day.jpg",
    "new-zealand-wallpaper-3840x2160-scenic-view-mountainous-landscape-556.jpg",
    "new-zealand-wallpaper-3840x2160-sea-water-899.jpg",
    "lake-wanaka-new-zealand-2025-best-ultra-hd-high-resolution-4k-desktop-backgrounds-wallpapers-for-mac-linux-and-windows-pc-macos-11-03-2025-1741731768-hd-wallpaper.jpeg",
    "Screenshot 2026-03-07 212308.png",
    "Screenshot 2026-03-07 212521.png",
    "pexels-pixabay-40896.jpg",
    "sea.jpg"
  ];
  const totalImages = images.length;
  let currentIndex = Math.floor(Math.random() * totalImages);
  const bgContainer = document.getElementById("bg-container");

  // Initialize images
  images.forEach((filename, i) => {
    const img = document.createElement("img");
    img.src = `images/${filename}`;
    img.alt = "Nature Background";
    img.className = `bg-image ${i === currentIndex ? "active" : ""}`;
    img.id = `bg-img-${i}`;
    bgContainer.appendChild(img);
  });

  // Rotate images every 30 seconds
  setInterval(() => {
    const currentImg = document.getElementById(`bg-img-${currentIndex}`);
    if(currentImg) currentImg.classList.remove("active");

    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * totalImages);
    } while (nextIndex === currentIndex && totalImages > 1);
    
    currentIndex = nextIndex;
    
    const nextImg = document.getElementById(`bg-img-${currentIndex}`);
    if(nextImg) nextImg.classList.add("active");
  }, 60000);

  /* -------------------------------------------------------------------------- */
  /*                      Scroll Blur & Overlay Effect                          */
  /* -------------------------------------------------------------------------- */
  const blurOverlay = document.getElementById("blur-overlay");
  const mainHeader = document.getElementById("main-header");
  
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    
    // Header logic
    if (scrollY > 20) {
      if (mainHeader) {
        mainHeader.classList.remove("py-6", "bg-transparent", "border-transparent");
        mainHeader.classList.add("py-3", "bg-black/40", "backdrop-blur-[20px]", "shadow-[0_4px_30px_rgba(0,0,0,0.1)]", "border-white/10");
      }
    } else {
      if (mainHeader) {
        mainHeader.classList.add("py-6", "bg-transparent", "border-transparent");
        mainHeader.classList.remove("py-3", "bg-black/40", "backdrop-blur-[20px]", "shadow-[0_4px_30px_rgba(0,0,0,0.1)]", "border-white/10");
      }
    }

    // Smooth transition: 
    // 0 to 200px: completely clear (0 opacity)
    // 200px to 800px: gradually fade in to 1
    let opacity = 0;
    if (scrollY > 200) {
      if (scrollY >= 800) {
        opacity = 1;
      } else {
        opacity = (scrollY - 200) / 600;
      }
    }
    
    if (blurOverlay) {
      blurOverlay.style.opacity = opacity;
    }
  });

  /* -------------------------------------------------------------------------- */
  /*                      Mobile Menu Toggle                                    */
  /* -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  let isMobileMenuOpen = false;

  const toggleMobileMenu = () => {
    isMobileMenuOpen = !isMobileMenuOpen;
    if (isMobileMenuOpen) {
      mobileMenu.classList.remove("opacity-0", "pointer-events-none");
      mobileMenu.classList.add("opacity-100", "pointer-events-auto");
      mobileMenuBtn.innerHTML = '<i class="fa-solid fa-xmark text-2xl"></i>';
    } else {
      mobileMenu.classList.add("opacity-0", "pointer-events-none");
      mobileMenu.classList.remove("opacity-100", "pointer-events-auto");
      mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars text-2xl"></i>';
    }
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (isMobileMenuOpen) {
        toggleMobileMenu();
      }
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                      Scroll Spy Navigation                                 */
  /* -------------------------------------------------------------------------- */
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.remove("bg-accent/80", "text-white", "shadow-sm");
            link.classList.add("text-neutral-300");
            if (link.getAttribute("href") === `#${id}`) {
              link.classList.remove("text-neutral-300");
              link.classList.add("bg-accent/80", "text-white", "shadow-sm");
            }
          });
        }
      });
    },
    { rootMargin: "-20% 0px -80% 0px" }
  );

  sections.forEach((section) => navObserver.observe(section));

  /* -------------------------------------------------------------------------- */
  /*                      Entrance Animations                                   */
  /* -------------------------------------------------------------------------- */
  const animationObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // Only animate once
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  animatedElements.forEach((el) => animationObserver.observe(el));

});
