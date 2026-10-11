/** Shared carousel initializer for canvas preview and exported sites. */
export const WTO_CAROUSEL_RUNTIME = `
(function(){
  function initWtoCarousels(root){
    try {
      var scope = root && root.querySelectorAll ? root : document;
      scope.querySelectorAll('[data-wto-carousel="1"], [data-carousel], .wl-testimonial-carousel, .wl-testimonial-box[data-carousel], .wto-carousel-wrap, [data-layout="carousel"], [data-layout="slider"]').forEach(function(carousel){
        if (carousel.getAttribute('data-wto-carousel-ready') === '1') return;
        carousel.setAttribute('data-wto-carousel-ready', '1');

        var track = carousel.querySelector('[data-carousel-track], .wl-carousel-track, .wto-carousel-track');
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-carousel-slide], .wl-carousel-slide, .wto-card-item, .wto-carousel-slide'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-carousel-dot], .wl-carousel-dot, .wto-dot-btn'));
        var prevBtn = carousel.querySelector('[data-carousel-prev], .wl-carousel-prev, [data-act="prev"], .wto-prev-btn, [data-wto-carousel-btn="prev"]');
        var nextBtn = carousel.querySelector('[data-carousel-next], .wl-carousel-next, [data-act="next"], .wto-next-btn, [data-wto-carousel-btn="next"]');
        if (!track || !slides.length) return;

        var rootWidget = carousel.closest('[data-cols-desktop]') || carousel;
        var deskCols = Number(rootWidget.getAttribute('data-cols-desktop') || (slides.length > 1 && slides[0].offsetWidth && slides[0].offsetWidth < (carousel.offsetWidth || 1000) * 0.45 ? 3 : 1));
        var tabCols = Number(rootWidget.getAttribute('data-cols-tablet') || (deskCols > 1 ? 2 : 1));
        var mobCols = Number(rootWidget.getAttribute('data-cols-mobile') || 1);

        function getCols(){
          var w = carousel.clientWidth || window.innerWidth || 1000;
          if (w < 640) return mobCols;
          if (w < 1024) return tabCols;
          return deskCols;
        }

        function getMaxIndex(){
          var cols = getCols();
          return Math.max(0, slides.length - cols);
        }

        var autoplay = carousel.getAttribute('data-autoplay') === '1' || rootWidget.getAttribute('data-autoplay') === '1';
        var delay = Math.max(500, Number(carousel.getAttribute('data-autoplay-delay') || rootWidget.getAttribute('data-autoplay-delay') || 4000) || 4000);
        var loop = carousel.getAttribute('data-loop') !== '0' && rootWidget.getAttribute('data-loop') !== '0';
        var pauseHover = carousel.getAttribute('data-pause-hover') !== '0';
        var duration = Math.max(0, Number(carousel.getAttribute('data-transition') || 350) || 350);
        var keyboard = carousel.getAttribute('data-keyboard') !== '0';
        var swipe = carousel.getAttribute('data-swipe') !== '0';
        var startIndex = Math.max(0, Math.min(slides.length - 1, Number(carousel.getAttribute('data-start-index') || 0) || 0));
        var index = startIndex;
        var timer = null;
        var hovering = false;
        var touchStartX = null;
        var touchDeltaX = 0;

        track.style.transition = 'transform ' + duration + 'ms cubic-bezier(0.25, 1, 0.5, 1)';

        function update(){
          var cols = getCols();
          var maxIdx = getMaxIndex();
          if (index > maxIdx) index = maxIdx;
          if (index < 0) index = 0;

          var targetSlide = slides[index];
          var offset = 0;
          if (targetSlide && slides[0]) {
            if (targetSlide.offsetLeft !== undefined && slides[0].offsetLeft !== undefined && targetSlide.offsetLeft >= slides[0].offsetLeft && targetSlide.offsetLeft > 0) {
              offset = targetSlide.offsetLeft - slides[0].offsetLeft;
            } else {
              var cardW = slides[0].offsetWidth || (slides[0].getBoundingClientRect ? slides[0].getBoundingClientRect().width : 0) || 0;
              var gap = parseFloat(window.getComputedStyle(track).gap) || 16;
              offset = index * (cardW + gap);
            }
          }
          if (cols === 1 && !offset && index > 0) {
            track.style.transform = 'translate3d(' + (-index * 100) + '%,0,0)';
          } else {
            track.style.transform = 'translate3d(-' + offset + 'px,0,0)';
          }

          dots.forEach(function(dot, i){
            var active = i === index;
            dot.classList.toggle('is-active', active);
            dot.classList.toggle('active', active);
            dot.setAttribute('aria-current', active ? 'true' : 'false');
          });
          slides.forEach(function(slide, i){
            slide.setAttribute('aria-hidden', (i < index || i >= index + cols) ? 'true' : 'false');
          });
          if (prevBtn) {
            var prevDisabled = !loop && index <= 0;
            prevBtn.disabled = prevDisabled;
            prevBtn.setAttribute('aria-disabled', prevDisabled ? 'true' : 'false');
            prevBtn.classList.toggle('is-disabled', prevDisabled);
            prevBtn.style.opacity = prevDisabled ? '0.35' : '1';
            prevBtn.style.pointerEvents = prevDisabled ? 'none' : 'auto';
          }
          if (nextBtn) {
            var nextDisabled = !loop && index >= maxIdx;
            nextBtn.disabled = nextDisabled;
            nextBtn.setAttribute('aria-disabled', nextDisabled ? 'true' : 'false');
            nextBtn.classList.toggle('is-disabled', nextDisabled);
            nextBtn.style.opacity = nextDisabled ? '0.35' : '1';
            nextBtn.style.pointerEvents = nextDisabled ? 'none' : 'auto';
          }
        }

        function goTo(next){
          if (!slides.length) return;
          var maxIdx = getMaxIndex();
          if (loop) {
            if (next > maxIdx) { index = 0; }
            else if (next < 0) { index = maxIdx; }
            else { index = next; }
          } else {
            index = Math.max(0, Math.min(maxIdx, next));
          }
          update();
        }

        function next(){ goTo(index + 1); }
        function prev(){ goTo(index - 1); }

        function stopAutoplay(){
          if (timer) { clearInterval(timer); timer = null; }
        }

        function startAutoplay(){
          stopAutoplay();
          if (!autoplay || slides.length < 2) return;
          if (pauseHover && hovering) return;
          timer = setInterval(function(){
            var maxIdx = getMaxIndex();
            if (!loop && index >= maxIdx) { stopAutoplay(); return; }
            next();
          }, delay);
        }

        if (prevBtn) prevBtn.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); prev(); startAutoplay(); });
        if (nextBtn) nextBtn.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); next(); startAutoplay(); });
        dots.forEach(function(dot){
          dot.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            var i = Number(dot.getAttribute('data-index') || 0);
            goTo(i);
            startAutoplay();
          });
        });

        if (pauseHover) {
          carousel.addEventListener('mouseenter', function(){ hovering = true; stopAutoplay(); });
          carousel.addEventListener('mouseleave', function(){ hovering = false; startAutoplay(); });
        }

        if (keyboard) {
          carousel.setAttribute('tabindex', '0');
          carousel.addEventListener('keydown', function(e){
            if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); startAutoplay(); }
            if (e.key === 'ArrowRight') { e.preventDefault(); next(); startAutoplay(); }
          });
        }

        if (swipe) {
          var onStart = function(clientX){ touchStartX = clientX; touchDeltaX = 0; };
          var onMove = function(clientX){ if (touchStartX == null) return; touchDeltaX = clientX - touchStartX; };
          var onEnd = function(){
            if (touchStartX == null) return;
            if (Math.abs(touchDeltaX) > 40) {
              if (touchDeltaX < 0) next(); else prev();
              startAutoplay();
            }
            touchStartX = null;
            touchDeltaX = 0;
          };
          carousel.addEventListener('touchstart', function(e){ if (e.touches && e.touches[0]) onStart(e.touches[0].clientX); }, { passive: true });
          carousel.addEventListener('touchmove', function(e){ if (e.touches && e.touches[0]) onMove(e.touches[0].clientX); }, { passive: true });
          carousel.addEventListener('touchend', onEnd);
          carousel.addEventListener('mousedown', function(e){ onStart(e.clientX); });
          carousel.addEventListener('mousemove', function(e){ if (touchStartX != null) onMove(e.clientX); });
          carousel.addEventListener('mouseup', onEnd);
          carousel.addEventListener('mouseleave', function(){ if (touchStartX != null) onEnd(); });
        }

        window.addEventListener('resize', update);
        setTimeout(update, 50);
        setTimeout(update, 200);
        update();
        startAutoplay();
      });
    } catch (err) {
      console.error('Carousel init failed', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ initWtoCarousels(document); });
  } else {
    initWtoCarousels(document);
  }
  window.__wtoInitCarousels = initWtoCarousels;
})();
`;
