/**
 * app.js — All JavaScript Interactions
 * Handles: sticky nav, scroll progress, smooth scrolling, ripple,
 * counters, testimonials, FAQ accordion, contact form,
 * back to top, toast notifications, dashboard gallery, modal viewer
 */

(function() {
  'use strict';

  // Wait for components to load before initializing
  document.addEventListener('componentsLoaded', function() {
    initApp();
  });

  // If components already loaded (safety check)
  if (document.readyState === 'complete') {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen && loadingScreen.classList.contains('hidden')) {
      initApp();
    }
  }

  function initApp() {
    console.log('🚀 ShopFlow App initialized');

    // --- STICKY NAVIGATION & SCROLL PROGRESS ---
    const header = document.querySelector('#header-container .sticky-nav');
    const progressBar = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');

    function handleScroll() {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

      if (progressBar) {
        progressBar.style.width = progress + '%';
      }

      if (header) {
        if (scrollY > 20) {
          header.classList.add('shadow-md', 'border-b', 'border-gray-100/50');
        } else {
          header.classList.remove('shadow-md', 'border-b', 'border-gray-100/50');
        }
      }

      if (backToTop) {
        if (scrollY > 400) {
          backToTop.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
          backToTop.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        } else {
          backToTop.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
          backToTop.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // --- BACK TO TOP CLICK ---
    if (backToTop) {
      backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // --- SMOOTH SCROLLING FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // Close android sidebar if open
          const sidebar = document.getElementById('android-sidebar');
          if (sidebar && !sidebar.classList.contains('hidden')) {
            sidebar.classList.remove('open');
            document.body.classList.remove('sidebar-open');
            setTimeout(() => {
              sidebar.classList.add('hidden');
            }, 300);
          }
        }
      });
    });






// --- ANDROID SIDEBAR ---
const sidebarOpen = document.getElementById('android-sidebar-open');
const sidebar = document.getElementById('android-sidebar');
const sidebarClose = document.getElementById('android-sidebar-close');
const backdrop = document.getElementById('android-sidebar-backdrop');

function openSidebar() {
  if (!sidebar) return;

  sidebar.classList.remove('hidden');
  sidebar.setAttribute('aria-hidden', 'false');
  sidebarOpen?.setAttribute('aria-expanded', 'true');
  document.body.classList.add('sidebar-open');

  requestAnimationFrame(() => {
    sidebar.classList.add('open');
  });
}

function closeSidebar() {
  if (!sidebar) return;

  sidebar.classList.remove('open');
  sidebar.setAttribute('aria-hidden', 'true');
  sidebarOpen?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('sidebar-open');

  setTimeout(() => {
    sidebar.classList.add('hidden');
  }, 300);
}

sidebarOpen?.addEventListener('click', openSidebar);
sidebarClose?.addEventListener('click', closeSidebar);
backdrop?.addEventListener('click', closeSidebar);

sidebar?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeSidebar);
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && sidebar && !sidebar.classList.contains('hidden')) {
    closeSidebar();
  }
});












    // --- RIPPLE EFFECT ---
    document.querySelectorAll('.ripple').forEach(el => {
      el.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          pointer-events: none;
          transform: scale(0);
          animation: rippleAnim 0.6s ease-out forwards;
        `;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
      });
    });

    // --- TOAST NOTIFICATION SYSTEM ---
    window.showToast = function(message, type = 'success') {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const colors = {
        success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        error: 'bg-rose-50 text-rose-800 border-rose-200',
        info: 'bg-blue-50 text-blue-800 border-blue-200',
        warning: 'bg-amber-50 text-amber-800 border-amber-200'
      };

      const toast = document.createElement('div');
      toast.className = `toast glass border ${colors[type] || colors.info} pointer-events-auto`;
      toast.textContent = message;
      container.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    };

    // --- CONTACT FORM VALIDATION ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('contact-name')?.value?.trim();
        const email = document.getElementById('contact-email')?.value?.trim();
        const phone = document.getElementById('contact-phone')?.value?.trim();
        const business = document.getElementById('contact-business')?.value?.trim();
        const message = document.getElementById('contact-message')?.value?.trim();

        if (!name || !email || !phone || !message) {
          showToast('Please fill in all required fields.', 'error');
          return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          showToast('Please enter a valid email address.', 'error');
          return;
        }

        if (!/^[0-9+\-\s()]{10,15}$/.test(phone)) {
          showToast('Please enter a valid phone number.', 'error');
          return;
        }

        showToast("Thank you! We'll get back to you within 24 hours.", 'success');
        this.reset();
      });
    }

    // --- TESTIMONIAL SLIDER ---
    let slideIndex = 0;
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    let sliderInterval;

    function showSlide(index) {
      if (!slides.length) return;

      slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
        dot.classList.toggle('bg-gray-300', i !== index);
      });
    }

    function nextSlide() {
      slideIndex = (slideIndex + 1) % slides.length;
      showSlide(slideIndex);
    }

    if (slides.length) {
      showSlide(0);

      dots.forEach((dot, i) => {
        dot.addEventListener('click', function() {
          slideIndex = i;
          showSlide(i);
          resetSliderInterval();
        });
      });

      sliderInterval = setInterval(nextSlide, 5000);

      function resetSliderInterval() {
        clearInterval(sliderInterval);
        sliderInterval = setInterval(nextSlide, 5000);
      }
    }

    // --- FAQ ACCORDION ---
    document.querySelectorAll('.faq-item').forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const icon = item.querySelector('.faq-icon');

      if (question && answer) {
        question.addEventListener('click', function() {
          const isOpen = answer.classList.contains('open');

          document.querySelectorAll('.faq-answer').forEach(el => {
            el.classList.remove('open');
          });
          document.querySelectorAll('.faq-icon').forEach(el => {
            el.classList.remove('ri-subtract-fill');
            el.classList.add('ri-add-fill');
          });

          if (!isOpen) {
            answer.classList.add('open');
            if (icon) {
              icon.classList.remove('ri-add-fill');
              icon.classList.add('ri-subtract-fill');
            }
          }
        });
      }
    });

    // --- COUNTER ANIMATION (Intersection Observer) ---
    const counters = document.querySelectorAll('.counter');

    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target') || '0', 10);
            const duration = 2000;
            const start = performance.now();

            function updateCounter(now) {
              const progress = Math.min((now - start) / duration, 1);
              const ease = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(ease * target);
              el.textContent = current.toLocaleString();

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                el.textContent = target.toLocaleString();
              }
            }

            requestAnimationFrame(updateCounter);
            counterObserver.unobserve(el);
          }
        });
      }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

      counters.forEach(c => counterObserver.observe(c));
    }

    // --- FADE-UP ANIMATIONS (Intersection Observer) ---
    const fadeElements = document.querySelectorAll('.fade-up');

    if ('IntersectionObserver' in window) {
      const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
            fadeObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });

      fadeElements.forEach(el => {
        el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700', 'ease-out');
        fadeObserver.observe(el);
      });
    }

    // --- DASHBOARD GALLERY / LIGHTBOX ---
    const galleryItems = document.querySelectorAll('.gallery-thumb');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const closeModal = document.getElementById('modal-close');
    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    const zoomIn = document.getElementById('modal-zoom-in');
    const zoomOut = document.getElementById('modal-zoom-out');
    let currentIndex = 0;
    let currentZoom = 1;

    function openModal(index) {
      if (!modal || !modalImg || !galleryItems.length) return;
      currentIndex = Math.min(index, galleryItems.length - 1);
      const imgSrc = galleryItems[currentIndex].getAttribute('data-src') ||
                     galleryItems[currentIndex].querySelector('img')?.src;
      if (imgSrc) {
        modalImg.src = imgSrc;
        modalImg.style.transform = 'scale(1)';
        currentZoom = 1;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        updateZoomControls();
      }
    }

    function closeModalFn() {
      if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }

    function changeSlide(direction) {
      if (!galleryItems.length) return;
      currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
      const imgSrc = galleryItems[currentIndex].getAttribute('data-src') ||
                     galleryItems[currentIndex].querySelector('img')?.src;
      if (imgSrc && modalImg) {
        modalImg.src = imgSrc;
        modalImg.style.transform = 'scale(1)';
        currentZoom = 1;
        updateZoomControls();
      }
    }

    function updateZoomControls() {
      if (zoomIn && zoomOut) {
        zoomIn.disabled = currentZoom >= 3;
        zoomOut.disabled = currentZoom <= 0.5;
      }
    }

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', function() {
        openModal(index);
      });
    });

    if (closeModal) closeModal.addEventListener('click', closeModalFn);
    if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(1));

    if (zoomIn) {
      zoomIn.addEventListener('click', function() {
        if (modalImg && currentZoom < 3) {
          currentZoom = Math.min(currentZoom + 0.25, 3);
          modalImg.style.transform = `scale(${currentZoom})`;
          updateZoomControls();
        }
      });
    }

    if (zoomOut) {
      zoomOut.addEventListener('click', function() {
        if (modalImg && currentZoom > 0.5) {
          currentZoom = Math.max(currentZoom - 0.25, 0.5);
          modalImg.style.transform = `scale(${currentZoom})`;
          updateZoomControls();
        }
      });
    }

    document.addEventListener('keydown', function(e) {
      if (modal && !modal.classList.contains('hidden')) {
        if (e.key === 'Escape') closeModalFn();
        if (e.key === 'ArrowLeft') changeSlide(-1);
        if (e.key === 'ArrowRight') changeSlide(1);
        if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          zoomIn?.click();
        }
        if (e.key === '-') {
          e.preventDefault();
          zoomOut?.click();
        }
      }
    });

    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === this) closeModalFn();
      });
    }

    console.log('✅ App ready with all interactions');
  }
})();