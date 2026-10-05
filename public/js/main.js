/**
 * WebToolOcean Main Website Runtime Script
 * Handles smooth scrolling, mobile navigation, FAQ accordions,
 * counter animations, and interactive carousels.
 */
(function () {
  'use strict';

  // 1. Initialize Carousels & Testimonials
  function initAllCarousels() {
    if (typeof window.__wtoInitCarousels === 'function') {
      window.__wtoInitCarousels(document);
    }
  }

  // 2. FAQ Accordion Handler
  function initFaqAccordions() {
    document.querySelectorAll('[data-wto-faq="1"], .wl-faq-list').forEach(function (faqContainer) {
      if (faqContainer.getAttribute('data-wto-faq-ready') === '1') return;
      faqContainer.setAttribute('data-wto-faq-ready', '1');

      var items = faqContainer.querySelectorAll('[data-faq-item], .wl-faq-item');
      items.forEach(function (item) {
        var trigger = item.querySelector('[data-faq-trigger], .wl-faq-header, .wl-faq-question');
        var content = item.querySelector('[data-faq-content], .wl-faq-body, .wl-faq-answer');
        var icon = item.querySelector('.wl-faq-icon, [data-faq-icon]');

        if (!trigger || !content) return;

        trigger.addEventListener('click', function (e) {
          e.preventDefault();
          var isOpen = item.classList.contains('is-open') || item.getAttribute('data-state') === 'open';

          // Close other items if accordion behavior
          items.forEach(function (other) {
            if (other !== item) {
              other.classList.remove('is-open');
              other.setAttribute('data-state', 'closed');
              var otherBody = other.querySelector('[data-faq-content], .wl-faq-body, .wl-faq-answer');
              var otherIcon = other.querySelector('.wl-faq-icon, [data-faq-icon]');
              if (otherBody) otherBody.style.maxHeight = '0px';
              if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
            }
          });

          if (isOpen) {
            item.classList.remove('is-open');
            item.setAttribute('data-state', 'closed');
            content.style.maxHeight = '0px';
            if (icon) icon.style.transform = 'rotate(0deg)';
          } else {
            item.classList.add('is-open');
            item.setAttribute('data-state', 'open');
            content.style.maxHeight = content.scrollHeight + 'px';
            if (icon) icon.style.transform = 'rotate(180deg)';
          }
        });
      });
    });
  }

  // 3. Smooth Scrolling for Anchor Links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = anchor.getAttribute('href');
        if (!href || href === '#' || href === '#!') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // 4. Mobile Menu Toggle
  function initMobileMenu() {
    var toggleBtn = document.querySelector('[data-nav-toggle], .wl-nav-toggle, #navToggle');
    var navMenu = document.querySelector('[data-nav-menu], .wl-nav-menu, #navMenu');
    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-active');
    });
  }

  // 5. Scroll Animations (IntersectionObserver)
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('wto-in');
          if (entry.target.getAttribute('data-anim-repeat') !== '1') {
            observer.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('[data-anim], .wl-fade-in').forEach(function (el) {
      observer.observe(el);
    });
  }

  // 6. Running Counters
  function initCounters() {
    if (!('IntersectionObserver' in window)) return;

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          counterObserver.unobserve(el);
          var text = el.textContent.trim();
          var match = text.match(/^(\d+)(\+?|%?|K\+?|M\+?)$/);
          if (!match) return;

          var targetNum = parseInt(match[1], 10);
          var suffix = match[2] || '';
          var start = 0;
          var duration = 1500;
          var startTime = null;

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var current = Math.floor(progress * targetNum);
            el.textContent = current + suffix;
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              el.textContent = targetNum + suffix;
            }
          }
          window.requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.wl-stat-number').forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  // Master Initializer
  function init() {
    initAllCarousels();
    initFaqAccordions();
    initSmoothScroll();
    initMobileMenu();
    initScrollAnimations();
    initCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('load', init);
  window.__wtoSiteInit = init;
})();
