(function(){
  function getStorageWidget(id) {
    try {
      var raw = localStorage.getItem('wto_dynamic_widgets_v1');
      if (raw) {
        var all = JSON.parse(raw);
        if (all && all[id]) return all[id];
      }
    } catch(e) {}
    try {
      if (typeof window !== 'undefined' && window.location && window.location.protocol !== 'file:' && window.parent && window.parent !== window) {
        var pRaw = window.parent.localStorage.getItem('wto_dynamic_widgets_v1');
        if (pRaw) {
          var pAll = JSON.parse(pRaw);
          if (pAll && pAll[id]) return pAll[id];
        }
      }
    } catch(e) {}
    return null;
  }

  function initCountdown(root) {
    if (!root) return;
    if (root.getAttribute('data-wto-cd-active') === '1') return;
    root.setAttribute('data-wto-cd-active', '1');

    var widgetId = root.getAttribute('data-wto-widget') || 'countdown';
    var targetTimestampAttr = Number(root.getAttribute('data-target-timestamp') || 0);
    var mode = root.getAttribute('data-mode') || 'date';
    var targetDateStr = root.getAttribute('data-target-date') || '';
    var targetTimeStr = root.getAttribute('data-target-time') || '23:59';
    var durationVal = Number(root.getAttribute('data-duration-val') || 15);
    var durationUnit = root.getAttribute('data-duration-unit') || 'minutes';
    var persist = root.getAttribute('data-persist') === '1';
    var counterStart = Number(root.getAttribute('data-counter-start') || 100);
    var counterEnd = Number(root.getAttribute('data-counter-end') || 0);
    var counterDir = root.getAttribute('data-counter-dir') || 'down';
    var counterDur = Math.max(1, Number(root.getAttribute('data-counter-dur') || 60));
    var recurringHrs = Math.max(0.1, Number(root.getAttribute('data-recurring-hrs') || 24));
    var showDays = root.getAttribute('data-show-days') !== '0';
    var showHours = root.getAttribute('data-show-hours') !== '0';
    var showMinutes = root.getAttribute('data-show-minutes') !== '0';
    var showSeconds = root.getAttribute('data-show-seconds') !== '0';
    var expiryAction = root.getAttribute('data-expiry-action') || 'message';
    var expiryMsg = root.getAttribute('data-expiry-msg') || 'Offer has ended.';
    var expiryUrl = root.getAttribute('data-expiry-url') || '';

    var daysEl = root.querySelector('[data-digit-for="days"]');
    var hoursEl = root.querySelector('[data-digit-for="hours"]');
    var minsEl = root.querySelector('[data-digit-for="minutes"]');
    var secsEl = root.querySelector('[data-digit-for="seconds"]');
    var timerInner = root.querySelector('.wto-cd-inner');
    var expiryMsgEl = root.querySelector('.wto-cd-expiry-message');
    var closeBtn = root.querySelector('.wto-cd-close-btn');

    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        root.style.transition = 'opacity 0.25s, transform 0.25s';
        root.style.opacity = '0';
        root.style.transform = 'scale(0.98)';
        setTimeout(function() { root.style.display = 'none'; }, 250);
      });
    }

    var prevValues = {};
    function updateDigit(el, val) {
      if (!el) return;
      var key = el.getAttribute('data-digit-for') || '';
      if (prevValues[key] !== val) {
        prevValues[key] = val;
        el.textContent = val;
      }
    }

    var personalKey = 'wto_cd_visitor_' + widgetId;
    var personalEndTime = targetTimestampAttr > 0 ? targetTimestampAttr : 0;
    var personalDurationMs = durationVal * (durationUnit === 'days' ? 86400000 : durationUnit === 'hours' ? 3600000 : 60000);
    if (mode === 'personal') {
      if (!personalEndTime) {
        try {
          if (persist) {
            var stored = localStorage.getItem(personalKey);
            if (stored) { personalEndTime = Number(stored); }
            else { personalEndTime = Date.now() + personalDurationMs; localStorage.setItem(personalKey, String(personalEndTime)); }
          } else {
            personalEndTime = Date.now() + personalDurationMs;
          }
        } catch(e) {
          personalEndTime = Date.now() + personalDurationMs;
        }
      }
    }

    var counterStartTime = Date.now();
    var hasExpired = false;

    function handleExpiry() {
      if (hasExpired) return;
      hasExpired = true;
      if (expiryAction === 'hide') {
        root.style.display = 'none';
      } else if (expiryAction === 'message') {
        if (timerInner) timerInner.style.display = 'none';
        if (expiryMsgEl) {
          expiryMsgEl.style.display = 'block';
          var textEl = expiryMsgEl.querySelector('.wto-cd-expiry-text');
          if (textEl) textEl.textContent = expiryMsg;
        }
      } else if (expiryAction === 'redirect') {
        if (expiryUrl) {
          try { window.location.href = expiryUrl; } catch(e) {}
        }
      } else if (expiryAction === 'restart') {
        hasExpired = false;
        if (mode === 'personal' && targetTimestampAttr <= 0) {
          personalEndTime = Date.now() + personalDurationMs;
          try { if (persist) localStorage.setItem(personalKey, String(personalEndTime)); } catch(e) {}
        }
      }
    }

    function tick() {
      var now = Date.now();
      var diffMs = 0;

      if (targetTimestampAttr > 0) {
        diffMs = targetTimestampAttr - now;
      } else if (mode === 'date') {
        var targetMs = 0;
        if (targetDateStr) {
          var parts = targetDateStr.split('-').map(Number);
          var tParts = (targetTimeStr || '23:59').split(':').map(Number);
          var targetObj = new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1, tParts[0] || 0, tParts[1] || 0, 0);
          targetMs = targetObj.getTime();
        }
        diffMs = targetMs - now;
      } else if (mode === 'personal') {
        diffMs = personalEndTime - now;
      } else if (mode === 'recurring') {
        var cycleMs = recurringHrs * 3600000;
        diffMs = cycleMs - (now % cycleMs);
      } else if (mode === 'counter') {
        var elapsedSec = (now - counterStartTime) / 1000;
        var progress = Math.min(1, elapsedSec / counterDur);
        var currentCount = counterDir === 'up'
          ? Math.round(counterStart + (counterEnd - counterStart) * progress)
          : Math.round(counterStart - (counterStart - counterEnd) * progress);
        var countStr = String(currentCount).padStart(2, '0');
        updateDigit(secsEl, countStr);
        if (progress >= 1 && !hasExpired) handleExpiry();
        return;
      }

      if (diffMs <= 0) {
        updateDigit(daysEl, '00');
        updateDigit(hoursEl, '00');
        updateDigit(minsEl, '00');
        updateDigit(secsEl, '00');
        handleExpiry();
        return;
      }

      var remSec = Math.floor(diffMs / 1000);
      var remMin = Math.floor(remSec / 60);
      var remHr = Math.floor(remMin / 60);
      var remDay = Math.floor(remHr / 24);

      var finalDays = 0, finalHours = 0, finalMinutes = 0, finalSeconds = 0;
      if (showDays) {
        finalDays = remDay;
        remHr = remHr % 24;
      }
      if (showHours) {
        finalHours = remHr;
        remMin = remMin % 60;
      }
      if (showMinutes) {
        finalMinutes = remMin;
        remSec = remSec % 60;
      }
      finalSeconds = remSec;

      updateDigit(daysEl, String(finalDays).padStart(2, '0'));
      updateDigit(hoursEl, String(finalHours).padStart(2, '0'));
      updateDigit(minsEl, String(finalMinutes).padStart(2, '0'));
      updateDigit(secsEl, String(finalSeconds).padStart(2, '0'));
    }

    tick();
    setInterval(tick, 1000);
  }

  function attachInteractivity(container){
    container.querySelectorAll('.wto-readmore-btn').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        var card = btn.closest('.wto-card-inner');
        if (!card) return;
        var isExp = card.classList.contains('is-expanded');
        card.classList.toggle('is-expanded', !isExp);
        btn.textContent = isExp ? 'Read more' : 'Read less';
      });
    });

    var track = container.querySelector('.wto-carousel-track, [data-carousel-track]');
    var cards = Array.prototype.slice.call(container.querySelectorAll('.wto-card-item, .wto-carousel-slide, [data-carousel-slide]'));
    var prevBtn = container.querySelector('.wto-prev-btn, [data-carousel-prev], [data-wto-carousel-btn="prev"]');
    var nextBtn = container.querySelector('.wto-next-btn, [data-carousel-next], [data-wto-carousel-btn="next"]');
    var dots = Array.prototype.slice.call(container.querySelectorAll('.wto-dot-btn, [data-carousel-dot]'));
    var rootWidget = container.querySelector('.wto-dynamic-widget-root') || container;

    if (track && cards.length > 0) {
      var currIndex = 0;
      var deskCols = Number(rootWidget.getAttribute('data-cols-desktop') || (cards.length > 1 && cards[0].offsetWidth && cards[0].offsetWidth < (container.offsetWidth || 1000) * 0.45 ? 3 : 1));
      var tabCols = Number(rootWidget.getAttribute('data-cols-tablet') || (deskCols > 1 ? 2 : 1));
      var mobCols = Number(rootWidget.getAttribute('data-cols-mobile') || 1);
      var isAutoplay = rootWidget.getAttribute('data-autoplay') === '1';
      var autoplayDelay = Number(rootWidget.getAttribute('data-autoplay-delay') || 3500);
      var isLoop = rootWidget.getAttribute('data-loop') !== '0';

      function getVisibleCols(){
        var w = container.clientWidth || window.innerWidth || 1000;
        if (w < 640) return mobCols;
        if (w < 1024) return tabCols;
        return deskCols;
      }

      function updateSlider(){
        var cols = getVisibleCols();
        var maxIdx = Math.max(0, cards.length - cols);
        if (currIndex > maxIdx) currIndex = maxIdx;
        if (currIndex < 0) currIndex = 0;

        var targetCard = cards[currIndex];
        var offset = 0;
        if (targetCard && cards[0]) {
          if (targetCard.offsetLeft !== undefined && cards[0].offsetLeft !== undefined && targetCard.offsetLeft >= cards[0].offsetLeft && targetCard.offsetLeft > 0) {
            offset = targetCard.offsetLeft - cards[0].offsetLeft;
          } else {
            var cardWidth = (cards[0].getBoundingClientRect ? cards[0].getBoundingClientRect().width : 0) || cards[0].offsetWidth || 0;
            var trackGap = parseFloat(window.getComputedStyle(track).gap) || 16;
            offset = currIndex * (cardWidth + trackGap);
          }
        }

        track.style.transform = 'translate3d(-' + offset + 'px, 0, 0)';

        dots.forEach(function(d, i){ d.classList.toggle('active', i === currIndex); });
        if (prevBtn) {
          var canPrev = isLoop || currIndex > 0;
          prevBtn.style.opacity = canPrev ? '1' : '0.35';
          prevBtn.style.pointerEvents = canPrev ? 'auto' : 'none';
          prevBtn.disabled = !canPrev;
        }
        if (nextBtn) {
          var canNext = isLoop || currIndex < maxIdx;
          nextBtn.style.opacity = canNext ? '1' : '0.35';
          nextBtn.style.pointerEvents = canNext ? 'auto' : 'none';
          nextBtn.disabled = !canNext;
        }
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          var cols = getVisibleCols();
          var maxIdx = Math.max(0, cards.length - cols);
          if (currIndex > 0) { currIndex--; } else if (isLoop) { currIndex = maxIdx; }
          updateSlider();
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          var cols = getVisibleCols();
          var maxIdx = Math.max(0, cards.length - cols);
          if (currIndex < maxIdx) { currIndex++; } else if (isLoop) { currIndex = 0; }
          updateSlider();
        });
      }
      dots.forEach(function(dot){
        dot.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          var cols = getVisibleCols();
          var maxIdx = Math.max(0, cards.length - cols);
          var targetIdx = Number(dot.getAttribute('data-index') || 0);
          currIndex = Math.min(maxIdx, targetIdx);
          updateSlider();
        });
      });

      if (isAutoplay && cards.length > getVisibleCols()) {
        var wrap = container.querySelector('.wto-carousel-wrap') || container;
        var timer = setInterval(function(){
          var cols = getVisibleCols();
          var maxIdx = Math.max(0, cards.length - cols);
          if (currIndex < maxIdx) { currIndex++; } else if (isLoop) { currIndex = 0; }
          updateSlider();
        }, autoplayDelay);
        if (wrap) {
          wrap.addEventListener('mouseenter', function(){ clearInterval(timer); });
          wrap.addEventListener('mouseleave', function(){
            timer = setInterval(function(){
              var cols = getVisibleCols();
              var maxIdx = Math.max(0, cards.length - cols);
              if (currIndex < maxIdx) { currIndex++; } else if (isLoop) { currIndex = 0; }
              updateSlider();
            }, autoplayDelay);
          });
        }
      }

      updateSlider();
      window.addEventListener('resize', updateSlider);
      setTimeout(updateSlider, 100);
    }
  }

  function initAnnouncementPopup(root) {
    if (!root) return;
    var scope = root.querySelectorAll ? root : document;
    scope.querySelectorAll('.wto-announcement-bar-root, .wto-popup-backdrop, [data-ap-mode]').forEach(function(ap){
      if (ap.getAttribute('data-ap-init') === '1') return;
      ap.setAttribute('data-ap-init', '1');

      var widgetId = ap.getAttribute('data-wto-widget') || '';
      var mode = ap.getAttribute('data-ap-mode') || 'bar';
      var trigger = ap.getAttribute('data-ap-trigger') || 'immediate';
      var delaySec = Number(ap.getAttribute('data-ap-delay') || 2);
      var scrollPct = Number(ap.getAttribute('data-ap-scroll') || 40);
      var freq = ap.getAttribute('data-ap-frequency') || 'always';
      var schedEnabled = ap.getAttribute('data-ap-schedule-enabled') === '1';
      var startStr = ap.getAttribute('data-ap-start-time') || '';
      var endStr = ap.getAttribute('data-ap-end-time') || '';
      var isCd = ap.getAttribute('data-ap-countdown') === '1';
      var targetTs = Number(ap.getAttribute('data-ap-target-timestamp') || 0);
      var pageTargeting = ap.getAttribute('data-ap-page-targeting') || 'all';
      var targetedPaths = ap.getAttribute('data-ap-targeted-paths') || '';
      var reappearOnHomeReturn = ap.getAttribute('data-ap-home-return') === '1';
      var dismissScope = ap.getAttribute('data-ap-dismiss-scope') || 'session';

      var isStudioMockup = Boolean(
        typeof window !== 'undefined' && (
          window.location.pathname.indexOf('/widgets/announcement-popup/') !== -1 ||
          (ap.closest && ap.closest('[data-wto-mock-canvas]'))
        )
      );

      // In studio mockup, clean up previous seen flags so refreshes never hide the widget
      if (isStudioMockup && widgetId) {
        try {
          sessionStorage.removeItem('wto_ap_seen_' + widgetId);
          localStorage.removeItem('wto_ap_seen_' + widgetId);
        } catch(e) {}
      }

      // Page Targeting and Home detection
      var rawPath = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : '/';
      var urlParams = (typeof window !== 'undefined' && window.location && window.location.search) ? new URLSearchParams(window.location.search) : null;
      var pageParam = urlParams ? (urlParams.get('page') || '').toLowerCase().replace(/^[./]+/, '').replace(/\.html$/i, '') : '';
      var isDemo = rawPath.indexOf('/demo/') !== -1 || rawPath.indexOf('/preview') !== -1;
      var isDemoHome = isDemo && (pageParam === 'home' || pageParam === 'index' || !pageParam);
      var isHome = rawPath === '/' || rawPath === '' || rawPath.indexOf('/index.html') !== -1 || isDemoHome;
      var currentPath = isDemo ? (pageParam ? '/' + pageParam : '/') : rawPath;

      if (!isStudioMockup) {
        if (pageTargeting === 'homepage_only' && !isHome) {
          ap.style.display = 'none';
          return;
        }
        if (pageTargeting === 'custom' && targetedPaths) {
          var paths = targetedPaths.split(',').map(function(p){ return p.trim().toLowerCase(); }).filter(Boolean);
          var matched = paths.some(function(p){
            return p.endsWith('*') ? currentPath.indexOf(p.slice(0, -1)) === 0 : currentPath === p;
          });
          if (!matched) {
            ap.style.display = 'none';
            return;
          }
        }
      }

      // Scheduling check (only if live production mode, NEVER in studio mockup)
      if (!isStudioMockup && schedEnabled) {
        var now = Date.now();
        if (startStr && now < new Date(startStr).getTime()) { ap.style.display = 'none'; return; }
        if (endStr && now > new Date(endStr).getTime()) { ap.style.display = 'none'; return; }
      }

      // Dismissal Persistence & Frequency check
      var allowHomeBypass = isHome && (reappearOnHomeReturn || freq === 'home_return');
      if (!isStudioMockup && mode === 'popup' && !allowHomeBypass && freq !== 'always' && widgetId) {
        var key = 'wto_ap_seen_' + widgetId;
        if ((freq === 'session' || dismissScope === 'session') && sessionStorage.getItem(key)) { ap.style.display = 'none'; return; }
        if (freq === 'once' && localStorage.getItem(key)) { ap.style.display = 'none'; return; }
        var cooldownMap = { '1day': 86400000, 'daily': 86400000, '7days': 604800000, 'weekly': 604800000, '30days': 2592000000, 'monthly': 2592000000 };
        var cdMs = cooldownMap[freq] || 0;
        var last = Number(localStorage.getItem(key) || 0);
        if (last > 0 && (Date.now() - last) < cdMs) { ap.style.display = 'none'; return; }
      }

      function markSeen() {
        if (!widgetId || isStudioMockup || mode !== 'popup') return;
        var key = 'wto_ap_seen_' + widgetId;
        var nowStr = String(Date.now());
        try {
          if (freq === 'session' || dismissScope === 'session') sessionStorage.setItem(key, nowStr);
          else localStorage.setItem(key, nowStr);
        } catch(e) {}
      }

      function updateBarOffset() {
        if (mode === 'bar') {
          var barPos = ap.getAttribute('data-ap-bar-pos') || '';
          var isFixedTop = barPos === 'fixed_top' || barPos === 'top_fixed';
          var barInner = ap.querySelector('.wto-bar-inner');
          var isClosed = ap.classList.contains('wto-closed') || ap.getAttribute('data-wto-closed') === '1' || ap.style.display === 'none';
          var isVisible = !isClosed && (!barInner || (barInner.style.display !== 'none' && !barInner.classList.contains('wto-closed')));
          if (isFixedTop && isVisible) {
            var h = (barInner ? barInner.offsetHeight : ap.offsetHeight) || 44;
            var isContained = ap.getAttribute('data-ap-contained') === '1';
            var offset = isContained ? h + 16 : h;
            document.documentElement.style.setProperty('--wto-header-top', offset + 'px');
          } else {
            document.documentElement.style.setProperty('--wto-header-top', '0px');
          }
        }
      }
      if (mode === 'bar') {
        setTimeout(updateBarOffset, 60);
        window.addEventListener('resize', updateBarOffset);
      }

      // Hoist elements to document.body on live storefronts & demo
      var studioPreview = ap.closest ? ap.closest('[data-wto-mock-canvas], .relative.flex-1.flex.flex-col') : null;
      if (!studioPreview && !isStudioMockup && mode === 'popup') {
        var hoistTarget = ap.ownerDocument ? ap.ownerDocument.body : document.body;
        if (hoistTarget && ap.parentElement !== hoistTarget) {
          var existingOld = hoistTarget.querySelector('.wto-popup-backdrop[data-wto-widget="' + widgetId + '"]');
          if (existingOld && existingOld !== ap) {
            existingOld.remove();
          }
          hoistTarget.appendChild(ap);
        }
      } else if (!studioPreview && !isStudioMockup && mode === 'bar') {
        var barPosVal = ap.getAttribute('data-ap-bar-pos') || 'fixed_top';
        var isTop = barPosVal === 'fixed_top' || barPosVal === 'flow_top' || barPosVal === 'top_fixed' || barPosVal === 'top_flow';
        var isBottom = barPosVal === 'fixed_bottom' || barPosVal === 'flow_bottom' || barPosVal === 'bottom_fixed' || barPosVal === 'bottom_flow';

        var hoistTarget = ap.ownerDocument ? ap.ownerDocument.body : document.body;
        if (hoistTarget) {
          var existingOld = hoistTarget.querySelector('[data-wto-widget="' + widgetId + '"]');
          if (existingOld && existingOld !== ap) {
            existingOld.remove();
          }
          if (isTop && ap.parentElement !== hoistTarget) {
            hoistTarget.prepend(ap);
          } else if (isBottom && ap.parentElement !== hoistTarget) {
            hoistTarget.appendChild(ap);
          }
        }
      }

      // Triggering & Initial Visibility
      if (mode === 'bar') {
        if (!ap.classList.contains('wto-closed') && ap.getAttribute('data-wto-closed') !== '1') {
          ap.style.display = 'block';
        }
      } else if (isStudioMockup) {
        // In studio mockup canvas, keep popups visible for visual editing
        ap.style.display = 'flex';
      } else {
        // Live production popup triggering
        if (trigger === 'delay') {
          ap.style.display = 'none';
          setTimeout(function(){ ap.style.display = 'flex'; markSeen(); }, delaySec * 1000);
        } else if (trigger === 'scroll') {
          ap.style.display = 'none';
          var triggered = false;
          window.addEventListener('scroll', function onScr(){
            if (triggered) return;
            var docH = document.documentElement.scrollHeight - window.innerHeight;
            if (docH > 0 && (window.scrollY / docH) * 100 >= scrollPct) {
              triggered = true;
              ap.style.display = 'flex';
              markSeen();
              window.removeEventListener('scroll', onScr);
            }
          });
        } else if (trigger === 'exit_intent') {
          ap.style.display = 'none';
          var triggeredExit = false;
          document.addEventListener('mouseleave', function onLeave(e){
            if (triggeredExit) return;
            if (e.clientY <= 10 && window.innerWidth >= 768) {
              triggeredExit = true;
              ap.style.display = 'flex';
              markSeen();
              document.removeEventListener('mouseleave', onLeave);
            }
          });
        } else {
          ap.style.display = 'flex';
          markSeen();
        }
      }

      // Close & Reopen buttons
      var reopenBtn = ap.querySelector('.wto-bar-reopen-btn');

      function closeAp(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        ap.classList.add('wto-closed');
        ap.setAttribute('data-wto-closed', '1');

        if (reopenBtn) {
          var barInner = ap.querySelector('.wto-bar-inner');
          if (barInner) barInner.style.setProperty('display', 'none', 'important');
          ap.style.setProperty('height', '0px', 'important');
          ap.style.setProperty('min-height', '0px', 'important');
          ap.style.setProperty('padding', '0px', 'important');
          ap.style.setProperty('margin', '0px', 'important');
          ap.style.setProperty('pointer-events', 'none', 'important');
          ap.style.setProperty('background', 'transparent', 'important');
          ap.style.setProperty('box-shadow', 'none', 'important');
          ap.style.setProperty('border', 'none', 'important');
          reopenBtn.style.setProperty('display', 'inline-flex', 'important');
          reopenBtn.style.setProperty('pointer-events', 'auto', 'important');
        } else {
          ap.style.setProperty('display', 'none', 'important');
          ap.style.setProperty('height', '0px', 'important');
          ap.style.setProperty('min-height', '0px', 'important');
          ap.style.setProperty('padding', '0px', 'important');
          ap.style.setProperty('margin', '0px', 'important');
          ap.style.setProperty('visibility', 'hidden', 'important');
          ap.style.setProperty('pointer-events', 'none', 'important');
          var barInner = ap.querySelector('.wto-bar-inner');
          if (barInner) barInner.style.setProperty('display', 'none', 'important');

          var widgetRoot = ap.closest && ap.closest('[data-wto-widget-root], [data-widget-id]');
          if (widgetRoot && widgetRoot !== ap) {
            widgetRoot.style.setProperty('display', 'none', 'important');
            widgetRoot.style.setProperty('height', '0px', 'important');
            widgetRoot.classList.add('wto-closed');
          }
        }
        updateBarOffset();
        markSeen();
      }

      function reopenAp(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        ap.classList.remove('wto-closed');
        ap.removeAttribute('data-wto-closed');

        var barInner = ap.querySelector('.wto-bar-inner');
        if (barInner) barInner.style.removeProperty('display');
        ap.style.removeProperty('display');
        ap.style.removeProperty('height');
        ap.style.removeProperty('min-height');
        ap.style.removeProperty('padding');
        ap.style.removeProperty('margin');
        ap.style.removeProperty('pointer-events');
        ap.style.removeProperty('background');
        ap.style.removeProperty('box-shadow');
        ap.style.removeProperty('border');
        ap.style.removeProperty('visibility');

        if (reopenBtn) {
          reopenBtn.style.setProperty('display', 'none', 'important');
        }

        var widgetRoot = ap.closest && ap.closest('[data-wto-widget-root], [data-widget-id]');
        if (widgetRoot && widgetRoot !== ap) {
          widgetRoot.style.removeProperty('display');
          widgetRoot.style.removeProperty('height');
          widgetRoot.classList.remove('wto-closed');
        }

        setTimeout(updateBarOffset, 30);
      }

      ap.querySelectorAll('.wto-bar-close-btn, .wto-popup-close-btn, [data-ap-close], .wto-close-btn').forEach(function(btn){
        btn.addEventListener('click', closeAp);
      });

      ap.addEventListener('click', function(e){
        var target = e.target;
        var btn = target && target.closest ? target.closest('.wto-bar-close-btn, .wto-popup-close-btn, [data-ap-close], .wto-close-btn') : null;
        if (btn && ap.contains(btn)) {
          closeAp(e);
        }
      }, true);

      if (reopenBtn) {
        reopenBtn.addEventListener('click', reopenAp);
      }

      if (mode === 'popup') {
        ap.addEventListener('click', function(e){
          if (e.target === ap) { ap.style.display = 'none'; markSeen(); }
        });
        window.addEventListener('keydown', function(e){
          if (e.key === 'Escape' && ap.style.display !== 'none') {
            ap.style.display = 'none'; markSeen();
          }
        });
      }

      // Coupon copy
      ap.querySelectorAll('.wto-coupon-copy-btn').forEach(function(btn){
        btn.addEventListener('click', function(e){
          e.preventDefault(); e.stopPropagation();
          var code = btn.getAttribute('data-code') || '';
          var orig = btn.textContent || 'Copy';
          if (code && navigator.clipboard) {
            navigator.clipboard.writeText(code).then(function(){
              btn.textContent = 'Copied!';
              setTimeout(function(){ btn.textContent = orig; }, 2000);
            });
          }
        });
      });

      // Countdown ticker
      if (isCd && targetTs > 0) {
        var dEl = ap.querySelector('.wto-cd-days .wto-cd-val');
        var hEl = ap.querySelector('.wto-cd-hours .wto-cd-val');
        var mEl = ap.querySelector('.wto-cd-minutes .wto-cd-val');
        var sEl = ap.querySelector('.wto-cd-seconds .wto-cd-val');
        var expEl = ap.querySelector('.wto-cd-expired-note');
        function updateCd(){
          var diff = targetTs - Date.now();
          if (diff <= 0) {
            if (dEl) dEl.textContent = '00';
            if (hEl) hEl.textContent = '00';
            if (mEl) mEl.textContent = '00';
            if (sEl) sEl.textContent = '00';
            if (expEl) expEl.style.display = 'inline-block';
            return;
          }
          var tot = Math.floor(diff / 1000);
          var d = Math.floor(tot / 86400);
          var h = Math.floor((tot % 86400) / 3600);
          var m = Math.floor((tot % 3600) / 60);
          var s = tot % 60;
          if (dEl) dEl.textContent = String(d).padStart(2, '0');
          if (hEl) hEl.textContent = String(h).padStart(2, '0');
          if (mEl) mEl.textContent = String(m).padStart(2, '0');
          if (sEl) sEl.textContent = String(s).padStart(2, '0');
        }
        updateCd();
        setInterval(updateCd, 1000);
      }
    });
  }

  function autoAdaptFaqContrast(root) {
    if (!root || typeof window === 'undefined') return;
    function getEffectiveBg(el) {
      var curr = el;
      while (curr && curr !== document.documentElement) {
        var comp = window.getComputedStyle(curr);
        var bg = comp.backgroundColor;
        if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
          return bg;
        }
        curr = curr.parentElement;
      }
      return 'rgb(255, 255, 255)';
    }
    function parseRgb(colorStr) {
      if (!colorStr) return [255, 255, 255];
      var nums = colorStr.replace(/[^0-9,]/g, '').split(',');
      if (nums.length >= 3) {
        return [parseInt(nums[0], 10) || 0, parseInt(nums[1], 10) || 0, parseInt(nums[2], 10) || 0];
      }
      return [255, 255, 255];
    }
    function isLight(colorStr) {
      if (!colorStr || colorStr === 'transparent' || colorStr === 'inherit') return true;
      var rgb = parseRgb(colorStr);
      var lum = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
      return lum > 0.52;
    }
    var effectiveRootBg = getEffectiveBg(root);
    var isRootLight = isLight(effectiveRootBg);
    var items = root.querySelectorAll('.wto-faq-item, .wto-faq-row');
    items.forEach(function(item) {
      var itemComp = window.getComputedStyle(item);
      var itemBg = (itemComp.backgroundColor && itemComp.backgroundColor !== 'transparent' && itemComp.backgroundColor !== 'rgba(0, 0, 0, 0)')
        ? itemComp.backgroundColor
        : effectiveRootBg;
      var isItemLight = isLight(itemBg);
      var btn = item.querySelector('.wto-faq-question-btn');
      if (btn) {
        var btnComp = window.getComputedStyle(btn);
        if (isItemLight && isLight(btnComp.color)) {
          btn.style.setProperty('color', '#0f172a', 'important');
        }
      }
      var ans = item.querySelector('.wto-faq-answer-inner, .wto-faq-answer-panel');
      if (ans) {
        var ansComp = window.getComputedStyle(ans);
        if (isItemLight && isLight(ansComp.color)) {
          ans.style.setProperty('color', '#334155', 'important');
        }
      }
      if (isItemLight) {
        var borderComp = window.getComputedStyle(item);
        var bColor = borderComp.borderColor;
        if (bColor && (bColor === 'rgba(255, 255, 255, 0.1)' || bColor.indexOf('255, 255, 255') !== -1)) {
          item.style.setProperty('border-color', '#e2e8f0', 'important');
        }
      }
    });
    var heading = root.querySelector('.wto-faq-heading, h2, h3');
    if (heading && isRootLight && isLight(window.getComputedStyle(heading).color)) {
      heading.style.setProperty('color', '#0f172a', 'important');
    }
    var desc = root.querySelector('.wto-faq-description');
    if (desc && isRootLight && isLight(window.getComputedStyle(desc).color)) {
      desc.style.setProperty('color', '#64748b', 'important');
    }
    var banner = root.querySelector('.wto-faq-support-banner');
    if (banner) {
      var bannerComp = window.getComputedStyle(banner);
      var bannerBg = (bannerComp.backgroundColor && bannerComp.backgroundColor !== 'transparent' && bannerComp.backgroundColor !== 'rgba(0, 0, 0, 0)')
        ? bannerComp.backgroundColor
        : effectiveRootBg;
      if (isLight(bannerBg)) {
        var sp = banner.querySelector('span');
        if (sp && isLight(window.getComputedStyle(sp).color)) {
          sp.style.setProperty('color', '#0f172a', 'important');
        }
        banner.style.setProperty('border-color', '#e2e8f0', 'important');
      }
    }
    var searchInput = root.querySelector('.wto-faq-search-input');
    if (searchInput && isRootLight) {
      var sComp = window.getComputedStyle(searchInput);
      if (isLight(sComp.backgroundColor) && isLight(sComp.color)) {
        searchInput.style.setProperty('color', '#0f172a', 'important');
        searchInput.style.setProperty('border-color', '#e2e8f0', 'important');
      }
    }
  }

  function initFaq(root) {
    if (!root) return;
    var scope = root.querySelectorAll ? root : document;
    scope.querySelectorAll('.wto-faq-container, .wto-faq-root').forEach(function(container){
      autoAdaptFaqContrast(container);
      if (container.getAttribute('data-wto-faq-init') === '1') return;
      container.setAttribute('data-wto-faq-init', '1');

      var mode = container.getAttribute('data-mode') || (container.getAttribute('data-allow-multiple') === '1' ? 'multiple' : 'single');
      var rows = Array.prototype.slice.call(container.querySelectorAll('.wto-faq-row, .wto-faq-item'));

      function toggleRow(row, forceOpen) {
        var isOpen = row.classList.contains('is-open');
        var willOpen = typeof forceOpen === 'boolean' ? forceOpen : !isOpen;
        var btn = row.querySelector('.wto-faq-question-btn');
        var ans = row.querySelector('.wto-faq-answer-panel');

        if (willOpen && mode === 'single') {
          rows.forEach(function(other){
            if (other !== row && other.classList.contains('is-open')) {
              other.classList.remove('is-open');
              var oBtn = other.querySelector('.wto-faq-question-btn');
              var oAns = other.querySelector('.wto-faq-answer-panel');
              if (oBtn) oBtn.setAttribute('aria-expanded', 'false');
              if (oAns) oAns.style.maxHeight = '0px';
            }
          });
        }

        row.classList.toggle('is-open', willOpen);
        if (btn) btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        if (ans) {
          if (willOpen) {
            ans.style.maxHeight = ans.scrollHeight + 40 + 'px';
          } else {
            ans.style.maxHeight = '0px';
          }
        }
      }

      rows.forEach(function(row){
        var btn = row.querySelector('.wto-faq-question-btn');
        if (btn) {
          btn.addEventListener('click', function(e){
            e.preventDefault();
            toggleRow(row);
          });
        }
      });

      var expandAllBtn = container.querySelector('.wto-faq-expand-all, .wto-faq-expand-all-btn');
      var collapseAllBtn = container.querySelector('.wto-faq-collapse-all, .wto-faq-collapse-all-btn');
      if (expandAllBtn) {
        expandAllBtn.addEventListener('click', function(e){
          e.preventDefault();
          rows.forEach(function(r){ toggleRow(r, true); });
        });
      }
      if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', function(e){
          e.preventDefault();
          rows.forEach(function(r){ toggleRow(r, false); });
        });
      }

      var searchInput = container.querySelector('.wto-faq-search-input');
      var noRes = container.querySelector('.wto-faq-no-results, .wto-faq-empty-search');
      if (searchInput) {
        searchInput.addEventListener('input', function(){
          var q = searchInput.value.toLowerCase().trim();
          var visibleCount = 0;
          rows.forEach(function(r){
            var qText = (r.getAttribute('data-question') || (r.querySelector('.wto-faq-question-btn')?.textContent || '')).toLowerCase();
            var aText = (r.getAttribute('data-answer') || (r.querySelector('.wto-faq-answer-panel')?.textContent || '')).toLowerCase();
            var matches = !q || qText.indexOf(q) !== -1 || aText.indexOf(q) !== -1;
            r.style.display = matches ? '' : 'none';
            if (matches) visibleCount++;
          });
          if (noRes) noRes.style.display = visibleCount === 0 ? 'block' : 'none';
        });
      }

      var catBtns = container.querySelectorAll('.wto-faq-cat-btn, .wto-faq-cat-tag');
      catBtns.forEach(function(cb){
        cb.addEventListener('click', function(e){
          e.preventDefault();
          catBtns.forEach(function(b){ b.classList.remove('is-active'); });
          cb.classList.add('is-active');
          var cat = cb.getAttribute('data-cat') || 'all';
          var visibleCount = 0;
          rows.forEach(function(r){
            var rCat = r.getAttribute('data-category') || '';
            var matches = cat === 'all' || rCat === cat;
            r.style.display = matches ? '' : 'none';
            if (matches) visibleCount++;
          });
          if (noRes) noRes.style.display = visibleCount === 0 ? 'block' : 'none';
        });
      });

      var showMoreBtn = container.querySelector('.wto-faq-show-more-btn');
      if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function(e){
          e.preventDefault();
          rows.forEach(function(r){ r.classList.remove('wto-faq-row-hidden'); r.style.display = ''; });
          showMoreBtn.style.display = 'none';
        });
      }
    });
  }

  function initWhatsAppChat(scope) {
    if (!scope) return;
    var roots = scope.querySelectorAll ? scope.querySelectorAll('.wto-wa-root, [data-wto-wa="1"]') : [];
    roots.forEach(function(root){
      if (root.getAttribute('data-wto-wa-ready') === '1') return;
      root.setAttribute('data-wto-wa-ready', '1');

      var card = root.querySelector('[data-wa-card="1"]');
      var bubble = root.querySelector('.wto-wa-bubble');
      var toggleBtn = root.querySelector('[data-wa-action="toggle-card"]');
      var closeCardBtn = root.querySelector('[data-wa-action="close-card"]');
      var dismissBubbleBtn = root.querySelector('[data-wa-action="dismiss-bubble"]');
      var waLinks = root.querySelectorAll('[data-wa-action="open-wa"], [data-wa-action="start-chat"]');

      if (card && toggleBtn) {
        toggleBtn.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          var isHidden = card.classList.contains('wto-wa-hidden');
          if (isHidden) {
            card.classList.remove('wto-wa-hidden');
            if (bubble) bubble.classList.add('wto-wa-hidden');
          } else {
            card.classList.add('wto-wa-hidden');
          }
        });
      }

      if (card && closeCardBtn) {
        closeCardBtn.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          card.classList.add('wto-wa-hidden');
        });
      }

      if (bubble && dismissBubbleBtn) {
        dismissBubbleBtn.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          bubble.classList.add('wto-wa-hidden');
        });
      }

      var delay = Number(root.getAttribute('data-greeting-delay') || 0);
      var autoDismiss = Number(root.getAttribute('data-auto-dismiss') || 0);
      if (bubble && delay > 0) {
        bubble.classList.add('wto-wa-hidden');
        setTimeout(function(){
          if (!card || card.classList.contains('wto-wa-hidden')) {
            bubble.classList.remove('wto-wa-hidden');
          }
        }, delay * 1000);
      }
      if (bubble && autoDismiss > 0) {
        setTimeout(function(){
          bubble.classList.add('wto-wa-hidden');
        }, (delay + autoDismiss) * 1000);
      }

      waLinks.forEach(function(link){
        link.addEventListener('click', function(e){
          var phone = root.getAttribute('data-phone') || '';
          var isValid = root.getAttribute('data-valid') === '1';
          if (!isValid || !phone) {
            e.preventDefault();
            alert('Please configure a valid WhatsApp phone number with country code in the widget settings.');
            return;
          }
          var href = link.href || link.getAttribute('href') || '';
          if (!href || href === '#') {
            e.preventDefault();
            return;
          }
          var isInsideIframe = typeof window !== 'undefined' && window.self !== window.top;
          if (isInsideIframe) {
            e.preventDefault();
            e.stopPropagation();
            try {
              var opened = window.open(href, '_blank', 'noopener,noreferrer');
              if (!opened || opened.closed) {
                try {
                  if (window.top && window.top !== window) {
                    window.top.open(href, '_blank', 'noopener,noreferrer');
                    return;
                  }
                } catch(_) {}
                var detached = document.createElement('a');
                detached.href = href;
                detached.target = '_blank';
                detached.rel = 'noopener noreferrer';
                document.body.appendChild(detached);
                detached.click();
                setTimeout(function(){ try { detached.remove(); } catch(_) {} }, 100);
              }
            } catch(err) {
              window.open(href, '_blank', 'noopener,noreferrer');
            }
          }
        });
      });
    });
  }

  function unwrapFirestoreValue(v) {
    if (!v || typeof v !== 'object') return v;
    if ('stringValue' in v) return v.stringValue;
    if ('booleanValue' in v) return v.booleanValue;
    if ('integerValue' in v) return Number(v.integerValue);
    if ('doubleValue' in v) return Number(v.doubleValue);
    if ('timestampValue' in v) return v.timestampValue;
    if ('nullValue' in v) return null;
    if ('arrayValue' in v) {
      var arr = v.arrayValue && v.arrayValue.values ? v.arrayValue.values : [];
      return arr.map(unwrapFirestoreValue);
    }
    if ('mapValue' in v) {
      var res = {};
      var f = v.mapValue && v.mapValue.fields ? v.mapValue.fields : {};
      for (var k in f) {
        if (Object.prototype.hasOwnProperty.call(f, k)) {
          res[k] = unwrapFirestoreValue(f[k]);
        }
      }
      return res;
    }
    return v;
  }

  function unwrapFirestoreDoc(doc) {
    if (!doc || !doc.fields) return null;
    var res = {};
    for (var k in doc.fields) {
      if (Object.prototype.hasOwnProperty.call(doc.fields, k)) {
        res[k] = unwrapFirestoreValue(doc.fields[k]);
      }
    }
    return res;
  }

  function createFallbackWidget(widgetId) {
    if (widgetId.indexOf('wgt_acc') === 0) {
      return {
        id: widgetId,
        type: 'accessibility',
        name: 'Accessibility Toolbar',
        status: 'published',
        enabled: true,
        config: {
          appearance: {
            theme: 'modern_floating',
            displayStyle: 'floating_icon',
            buttonLabel: 'Accessibility',
            position: 'right',
            offsetY: 24,
            offsetX: 24,
            buttonSize: 56,
            iconSize: 26,
            panelWidth: 380,
            primaryColor: '#3b82f6',
            backgroundColor: '#0f172a',
            textColor: '#f8fafc',
            cardBgColor: 'rgba(30, 41, 59, 0.7)',
            borderRadius: 16,
            shadowIntensity: 'high',
            showTooltip: true,
            tooltipText: 'Accessibility Tools (Alt+A)',
            panelAnimation: 'slide',
            visibleOnDesktop: true,
            visibleOnMobile: true,
          },
          features: {
            textResize: true,
            textResizeStep: 10,
            maxTextScale: 150,
            minTextScale: 90,
            lineSpacing: true,
            letterSpacing: true,
            readableFont: true,
            highlightHeadings: true,
            highlightLinks: true,
            readingGuide: true,
            largeCursor: true,
            highContrast: true,
            invertColors: true,
            monochrome: true,
            reducedMotion: true,
            resetAll: true,
          },
          behavior: {
            defaultTextScale: 100,
            defaultContrast: 'normal',
            rememberPreferences: true,
            scopeSelector: 'body',
            enableKeyboardShortcut: true,
            shortcutKey: 'a',
            announceChanges: true,
          }
        }
      };
    }

    if (widgetId.indexOf('wgt_wa') === 0) {
      return {
        id: widgetId,
        type: 'whatsapp_chat',
        name: 'WhatsApp Live Chat',
        status: 'published',
        enabled: true,
        config: {
          content: {
            phoneNumber: '',
            buttonLabel: 'Chat with Us',
            greetingText: 'Hello! How can we help you today?',
            prefilledMessage: 'Hi! I have a question about your website.',
            agentName: 'Customer Support',
            agentAvatarUrl: '',
            statusLabel: 'Usually replies in minutes',
            workingHoursNotice: 'Mon - Fri, 9:00 AM - 6:00 PM',
            showWorkingHoursNotice: true,
          },
          appearance: {
            template: 'classic_whatsapp',
            layoutStyle: 'contact_card',
            buttonColor: '#25d366',
            buttonTextColor: '#ffffff',
            iconSize: 28,
            buttonDiameter: 60,
            borderRadius: 50,
            greetingBgColor: '#ffffff',
            greetingTextColor: '#111827',
            position: 'bottom_right',
            offsetX: 20,
            offsetY: 20,
            showTooltip: true,
            customTooltipText: 'Chat on WhatsApp',
            entranceAnimation: 'slide_up',
            attentionAnimation: 'subtle_pulse',
            theme: 'light',
          },
          behavior: {
            openInNewTab: true,
            prefillMessage: true,
            showGreetingBubble: true,
            greetingDelaySec: 2,
            autoDismissGreetingSec: 0,
            visibleOnDesktop: true,
            visibleOnMobile: true,
          }
        }
      };
    }

    if (widgetId.indexOf('wgt_lang') === 0) {
      return {
        id: widgetId,
        type: 'language_switcher',
        name: 'Language Switcher',
        status: 'published',
        enabled: true,
        config: {
          languages: [
            { id: 'en', code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', url: '/', enabled: true, isDefault: true },
            { id: 'es', code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', url: '/es', enabled: true },
            { id: 'fr', code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', url: '/fr', enabled: true },
            { id: 'de', code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', url: '/de', enabled: true }
          ],
          appearance: {
            template: 'classic_globe',
            layout: 'floating_selector',
            buttonFormat: 'flag_and_name',
            showGlobeIcon: true,
            showFlags: true,
            showNativeNames: true,
            showSearchInDropdown: false,
            preSelectionLabel: '',
            fontSize: 13,
            paddingX: 14,
            paddingY: 8,
            borderRadius: 10,
            dropdownBorderRadius: 12,
            dropdownWidth: 220,
            theme: 'dark',
            backgroundColor: '#18181b',
            textColor: '#f4f4f5',
            borderColor: 'rgba(255,255,255,0.12)',
            hoverBackgroundColor: '#27272a',
            hoverTextColor: '#ffffff',
            activeItemBackgroundColor: 'rgba(59,130,246,0.15)',
            activeItemTextColor: '#60a5fa',
            accentColor: '#3b82f6',
            dropdownBackgroundColor: '#18181b',
            dropdownTextColor: '#f4f4f5',
            dropdownBorderColor: 'rgba(255,255,255,0.12)',
            dropdownShadow: 'medium',
            dropdownPosition: 'auto',
            floatingPosition: 'bottom_right',
            floatingOffsetX: 24,
            floatingOffsetY: 24,
            zIndex: 99997,
            visibleOnDesktop: true,
            visibleOnMobile: true,
            showTooltip: true,
            tooltipText: 'Select Language',
            animation: 'fade'
          },
          behavior: {
            mode: 'custom_links',
            detectBrowserLanguage: true,
            rememberVisitorPreference: true,
            autoRedirect: false,
            openInNewTab: false,
            storageKeyPrefix: 'wto_lang_pref_',
            defaultFallbackCode: 'en',
            autoTranslateProvider: 'none'
          }
        }
      };
    }
    return null;
  }

  function getOrFetchWidget(widgetId, callback) {
    var local = getStorageWidget(widgetId);
    if (local) {
      callback(local);
      return;
    }
    if (typeof fetch !== 'undefined') {
      var url = 'https://firestore.googleapis.com/v1/projects/webtoolocean-builder/databases/(default)/documents/publishedWidgets/' + encodeURIComponent(widgetId);
      fetch(url)
        .then(function(res){
          if (!res.ok) throw new Error('Not found');
          return res.json();
        })
        .then(function(json){
          var unwrapped = unwrapFirestoreDoc(json);
          if (unwrapped && unwrapped.id) {
            try {
              var raw = localStorage.getItem('wto_dynamic_widgets_v1') || '{}';
              var all = JSON.parse(raw);
              all[widgetId] = unwrapped;
              localStorage.setItem('wto_dynamic_widgets_v1', JSON.stringify(all));
            } catch(e){}
            callback(unwrapped);
          } else {
            callback(createFallbackWidget(widgetId));
          }
        })
        .catch(function(){
          callback(createFallbackWidget(widgetId));
        });
    } else {
      callback(createFallbackWidget(widgetId));
    }
  }

  function renderAccessibilityStandalone(widget) {
    if (!widget || widget.enabled === false) return;
    var widgetId = widget.id || 'wgt_acc_' + Math.random().toString(36).slice(2, 8);
    var cleanId = widgetId.replace(/[^a-zA-Z0-9_-]/g, '');
    var cls = 'wto-a11y-' + cleanId;

    if (document.querySelector('.' + cls)) {
      return; // Already in DOM
    }

    var cfg = widget.config || {};
    var appearance = cfg.appearance || {};
    var features = cfg.features || {};
    var behavior = cfg.behavior || {};

    var pos = appearance.position || 'bottom_right';
    var isLeft = pos === 'bottom_left' || pos === 'top_left' || pos === 'left';
    var isTop = pos === 'top_left' || pos === 'top_right' || pos === 'top';
    var offsetX = Number(appearance.offsetX) || 24;
    var offsetY = Number(appearance.offsetY) || 24;
    var btnSize = Number(appearance.buttonSize) || 58;
    var iconSize = Number(appearance.iconSize) || 26;
    var panelWidth = Number(appearance.panelWidth) || 420;
    var primColor = appearance.primaryColor || '#3b82f6';
    var bgColor = appearance.backgroundColor || '#0f172a';
    var textColor = appearance.textColor || '#f8fafc';
    var cardBg = appearance.cardBgColor || 'rgba(30, 41, 59, 0.7)';
    var borderRadius = Number(appearance.borderRadius) !== undefined ? Number(appearance.borderRadius) : 16;
    var tooltipText = appearance.tooltipText || 'Accessibility Tools (Alt+A)';
    var btnLabel = appearance.buttonLabel || 'Accessibility';
    var isPill = appearance.displayStyle === 'floating_icon_with_label';

    var a11ySvg = '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:block;"><circle cx="12" cy="4.5" r="2.5"/><path d="m18 8.5-6 1-6-1"/><path d="M12 9.5v7"/><path d="m9 21.5 3-5 3 5"/></svg>';
    var closeSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
    var resetSvg = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>';

    var styleEl = document.createElement('style');
    styleEl.textContent = [
      '.' + cls + '.wto-a11y-root {',
      '  position: fixed !important;',
      '  ' + (isTop ? 'top: ' + offsetY + 'px !important;' : 'bottom: ' + offsetY + 'px !important;'),
      '  ' + (isLeft ? 'left: ' + offsetX + 'px !important;' : 'right: ' + offsetX + 'px !important;'),
      '  z-index: 2147483647 !important;',
      '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;',
      '  direction: ltr !important;',
      '  pointer-events: none !important;',
      '}',
      '.' + cls + ' * { box-sizing: border-box; }',
      '.' + cls + ' .wto-a11y-hidden { display: none !important; }',
      '.' + cls + ' .wto-a11y-launcher-btn {',
      '  pointer-events: auto !important;',
      '  z-index: 2147483647 !important;',
      '  display: inline-flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  gap: 10px;',
      '  min-width: ' + (isPill ? 'auto' : btnSize + 'px') + ';',
      '  height: ' + btnSize + 'px;',
      '  padding: ' + (isPill ? '0 20px 0 16px' : '0') + ';',
      '  border-radius: ' + (isPill ? '9999px' : borderRadius + 'px') + ';',
      '  background-color: ' + primColor + ';',
      '  color: #ffffff;',
      '  border: 2px solid rgba(255,255,255,0.25);',
      '  box-shadow: 0 8px 28px rgba(0,0,0,0.35);',
      '  cursor: pointer;',
      '  transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s ease;',
      '  position: relative;',
      '}',
      '.' + cls + ' .wto-a11y-launcher-btn:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 12px 36px rgba(0,0,0,0.45); }',
      '.' + cls + ' .wto-a11y-launcher-btn:active { transform: translateY(1px) scale(0.96); }',
      '.' + cls + ' .wto-a11y-launcher-icon { width: ' + iconSize + 'px; height: ' + iconSize + 'px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }',
      '.' + cls + ' .wto-a11y-launcher-label { font-weight: 700; font-size: 14px; white-space: nowrap; }',
      '.' + cls + ' .wto-a11y-tooltip {',
      '  position: absolute;',
      '  bottom: calc(100% + 10px);',
      '  ' + (isLeft ? 'left: 0;' : 'right: 0;'),
      '  padding: 6px 12px;',
      '  background: #090d16;',
      '  color: #ffffff;',
      '  border: 1px solid rgba(255,255,255,0.15);',
      '  border-radius: 8px;',
      '  font-size: 11px;',
      '  font-weight: 600;',
      '  white-space: nowrap;',
      '  opacity: 0;',
      '  pointer-events: none;',
      '  transition: opacity 0.15s ease;',
      '  box-shadow: 0 4px 14px rgba(0,0,0,0.4);',
      '}',
      '.' + cls + ' .wto-a11y-launcher-btn:hover .wto-a11y-tooltip { opacity: 1; }',
      '.' + cls + ' .wto-a11y-panel {',
      '  pointer-events: auto !important;',
      '  position: fixed !important;',
      '  ' + (isTop ? 'top: ' + (offsetY + btnSize + 14) + 'px !important;' : 'bottom: ' + (offsetY + btnSize + 14) + 'px !important;'),
      '  ' + (isLeft ? 'left: ' + offsetX + 'px !important;' : 'right: ' + offsetX + 'px !important;'),
      '  width: ' + Math.max(380, panelWidth || 420) + 'px;',
      '  max-width: calc(100vw - 28px);',
      '  max-height: calc(100vh - ' + (offsetY + btnSize + 32) + 'px);',
      '  background: ' + bgColor + ';',
      '  color: ' + textColor + ';',
      '  border: 1px solid ' + (bgColor === '#ffffff' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)') + ';',
      '  border-radius: ' + borderRadius + 'px;',
      '  box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06);',
      '  display: flex;',
      '  flex-direction: column;',
      '  overflow: hidden;',
      '  z-index: 2147483647 !important;',
      '  animation: wtoA11yFadeIn 0.2s cubic-bezier(0.16,1,0.3,1);',
      '}',
      '@keyframes wtoA11yFadeIn { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }',
      '.' + cls + ' .wto-a11y-header { padding: 16px 20px; border-bottom: 1px solid ' + (bgColor === '#ffffff' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)') + '; display: flex; align-items: center; justify-content: space-between; background: ' + (bgColor === '#ffffff' ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.2)') + '; }',
      '.' + cls + ' .wto-a11y-title-wrap { display: flex; align-items: center; gap: 10px; }',
      '.' + cls + ' .wto-a11y-title { font-size: 16px; font-weight: 800; color: ' + textColor + '; margin: 0; }',
      '.' + cls + ' .wto-a11y-btn-close { background: transparent; border: none; color: ' + textColor + '; opacity: 0.75; cursor: pointer; padding: 6px; border-radius: 8px; display: flex; }',
      '.' + cls + ' .wto-a11y-btn-close:hover { opacity: 1; background: rgba(125,125,125,0.15); }',
      '.' + cls + ' .wto-a11y-btn-reset-header { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 8px; background: ' + (bgColor === '#ffffff' ? '#ffffff' : 'rgba(255,255,255,0.08)') + '; border: 1px solid rgba(125,125,125,0.25); color: ' + textColor + '; cursor: pointer; }',
      '.' + cls + ' .wto-a11y-btn-reset-header:hover { border-color: ' + primColor + '; color: ' + primColor + '; }',
      '.' + cls + ' .wto-a11y-body { padding: 18px 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 18px; max-height: calc(80vh - 120px); }',
      '.' + cls + ' .wto-a11y-section-title { font-size: 11px; font-weight: 800; color: ' + primColor + '; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }',
      '.' + cls + ' .wto-a11y-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }',
      '.' + cls + ' .wto-a11y-scale-bar { grid-column: span 2; display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: ' + cardBg + '; border: 1.5px solid rgba(125,125,125,0.15); border-radius: 12px; }',
      '.' + cls + ' .wto-a11y-scale-btn { width: 34px; height: 34px; border-radius: 8px; background: ' + (bgColor === '#ffffff' ? '#ffffff' : 'rgba(255,255,255,0.1)') + '; border: 1px solid rgba(125,125,125,0.25); color: ' + textColor + '; font-weight: 700; font-size: 16px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }',
      '.' + cls + ' .wto-a11y-scale-btn:hover { background: ' + primColor + '; color: #ffffff; }',
      '.' + cls + ' .wto-a11y-tool-btn { padding: 13px 14px; background: ' + cardBg + '; border: 1.5px solid rgba(125,125,125,0.15); border-radius: 12px; color: ' + textColor + '; text-align: left; cursor: pointer; display: flex; flex-direction: column; gap: 8px; transition: all 0.15s ease; }',
      '.' + cls + ' .wto-a11y-tool-btn:hover { border-color: rgba(125,125,125,0.35); transform: translateY(-1px); }',
      '.' + cls + ' .wto-a11y-tool-btn[aria-pressed="true"], .' + cls + ' .wto-a11y-tool-btn.wto-a11y-active { border-color: ' + primColor + ' !important; background: rgba(59,130,246,0.18) !important; color: ' + textColor + ' !important; box-shadow: 0 0 14px rgba(59,130,246,0.3) !important; }',
      '.' + cls + ' .wto-a11y-tool-top { display: flex; align-items: center; justify-content: space-between; width: 100%; }',
      '.' + cls + ' .wto-a11y-badge-status { font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 5px; background: rgba(125,125,125,0.15); color: inherit; }',
      '.' + cls + ' .wto-a11y-tool-btn[aria-pressed="true"] .wto-a11y-badge-status { background: ' + primColor + '; color: #ffffff; }',
      '.' + cls + ' .wto-a11y-tool-label { font-size: 13px; font-weight: 700; line-height: 1.35; color: ' + textColor + ' !important; }',
      '.' + cls + ' .wto-a11y-footer { padding: 12px 18px; border-top: 1px solid rgba(125,125,125,0.2); background: ' + (bgColor === '#ffffff' ? '#f1f5f9' : 'rgba(0,0,0,0.32)') + '; flex-shrink: 0; }',
      '.' + cls + ' .wto-a11y-footer-actions { display: flex; align-items: center; gap: 10px; width: 100%; }',
      '.' + cls + ' .wto-a11y-btn-save-full { flex: 1; height: 44px; background: ' + primColor + '; color: #ffffff; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s ease; box-shadow: 0 4px 14px rgba(0,0,0,0.25); user-select: none; }',
      '.' + cls + ' .wto-a11y-btn-save-full:hover { filter: brightness(1.1); transform: translateY(-1px); }',
      '.' + cls + ' .wto-a11y-btn-save-full.wto-a11y-saved { background: #10b981 !important; }',
      '.' + cls + ' .wto-a11y-btn-clear-footer { height: 44px; padding: 0 16px; background: ' + (bgColor === '#ffffff' ? '#ffffff' : 'rgba(255,255,255,0.08)') + '; border: 1.5px solid rgba(125,125,125,0.25); color: ' + textColor + '; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.15s ease; white-space: nowrap; user-select: none; }',
      '.' + cls + ' .wto-a11y-btn-clear-footer:hover { background: rgba(125,125,125,0.15); }',
      /* Global scoped classes */
      'body.wto-a11y-active-line-spacing *:not(.wto-a11y-root, .wto-a11y-root *) { line-height: 1.85 !important; }',
      'body.wto-a11y-active-letter-spacing *:not(.wto-a11y-root, .wto-a11y-root *) { letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }',
      'body.wto-a11y-active-readable-font *:not(.wto-a11y-root, .wto-a11y-root *) { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important; }',
      'body.wto-a11y-active-highlight-headings :is(h1,h2,h3,h4,h5,h6,[role="heading"]):not(.wto-a11y-root, .wto-a11y-root *) { outline: 2px dashed #f59e0b !important; outline-offset: 3px !important; background-color: rgba(245,158,11,0.12) !important; }',
      'body.wto-a11y-active-highlight-links :is(a,[role="link"]):not(.wto-a11y-root, .wto-a11y-root *) { text-decoration: underline 3px #38bdf8 !important; text-underline-offset: 4px !important; background-color: rgba(56,189,248,0.14) !important; font-weight: 600 !important; }',
      'body.wto-a11y-active-high-contrast { background-color: #000000 !important; color: #ffffff !important; }',
      'body.wto-a11y-active-high-contrast *:not(.wto-a11y-root, .wto-a11y-root *) { background-color: #000000 !important; color: #ffff00 !important; border-color: #ffffff !important; box-shadow: none !important; }',
      'body.wto-a11y-active-inverted { filter: invert(1) hue-rotate(180deg) !important; background-color: #ffffff !important; }',
      'body.wto-a11y-active-inverted .wto-a11y-root { filter: invert(1) hue-rotate(180deg) !important; }',
      'body.wto-a11y-active-monochrome { filter: grayscale(100%) !important; }',
      'body.wto-a11y-active-monochrome .wto-a11y-root { filter: none !important; }',
      'body.wto-a11y-active-large-cursor, body.wto-a11y-active-large-cursor * { cursor: url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2738%27 height=%2738%27 viewBox=%270 0 24 24%27 fill=%27%23000000%27 stroke=%27%23ffffff%27 stroke-width=%272%27%3E%3Cpath d=%27M3 3l7 18 3-7 7-3L3 3z%27/%3E%3C/svg%3E"), auto !important; }',
      'body.wto-a11y-active-reduced-motion *, body.wto-a11y-active-reduced-motion *::before, body.wto-a11y-active-reduced-motion *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }',
      '.wto-a11y-reading-ruler { position: fixed; left: 0; right: 0; width: 100vw; height: 4px; background: linear-gradient(90deg, #38bdf8, #f59e0b, #38bdf8); box-shadow: 0 0 16px rgba(56,189,248,0.6); z-index: 2147483630; pointer-events: none; }'
    ].join('');
    document.head.appendChild(styleEl);

    var rootEl = document.createElement('div');
    rootEl.id = 'wto-a11y-' + cleanId;
    rootEl.className = 'wto-a11y-root ' + cls;
    rootEl.setAttribute('data-wto-widget', widgetId);
    rootEl.setAttribute('data-wto-a11y', '1');
    rootEl.setAttribute('data-default-scale', String(behavior.defaultTextScale || 100));
    rootEl.setAttribute('data-default-contrast', behavior.defaultContrast || 'normal');
    rootEl.setAttribute('data-remember', behavior.rememberPreferences !== false ? '1' : '0');
    rootEl.setAttribute('role', 'region');
    rootEl.setAttribute('aria-label', 'Website Accessibility Toolbar');

    var markup = [
      '<button type="button" class="wto-a11y-launcher-btn" data-a11y-action="toggle-panel" aria-expanded="false" aria-haspopup="dialog" aria-label="Open Accessibility Toolbar">',
      '  <span class="wto-a11y-launcher-icon">' + a11ySvg + '</span>',
      (isPill ? '  <span class="wto-a11y-launcher-label">' + btnLabel + '</span>' : ''),
      '  <span class="wto-a11y-tooltip">' + tooltipText + '</span>',
      '</button>',
      '<div class="wto-a11y-panel wto-a11y-hidden" role="dialog" aria-modal="false" aria-label="Accessibility Settings">',
      '  <div class="wto-a11y-header">',
      '    <div class="wto-a11y-title-wrap">',
      '      <span style="width:20px;height:20px;display:flex;color:' + primColor + ';">' + a11ySvg + '</span>',
      '      <h3 class="wto-a11y-title">Accessibility Tools</h3>',
      '    </div>',
      '    <div style="display:flex;align-items:center;gap:8px;">',
      '      <button type="button" class="wto-a11y-btn-reset-header" data-a11y-action="reset-all" title="Reset all settings">',
      '        ' + resetSvg + '<span>Reset</span>',
      '      </button>',
      '      <button type="button" class="wto-a11y-btn-close" data-a11y-action="close-panel" aria-label="Close">' + closeSvg + '</button>',
      '    </div>',
      '  </div>',
      '  <div class="wto-a11y-body">',
      '    <div>',
      '      <div class="wto-a11y-section-title">Text &amp; Readability</div>',
      '      <div class="wto-a11y-grid">',
      '        <div class="wto-a11y-scale-bar">',
      '          <div><span style="font-size:11px;font-weight:700;">Text Size</span> <span data-a11y-scale-val style="font-size:11px;color:' + primColor + ';font-weight:700;">100%</span></div>',
      '          <div style="display:flex;gap:6px;">',
      '            <button type="button" class="wto-a11y-scale-btn" data-a11y-action="text-decrease">−</button>',
      '            <button type="button" class="wto-a11y-scale-btn" data-a11y-action="text-reset">A</button>',
      '            <button type="button" class="wto-a11y-scale-btn" data-a11y-action="text-increase">+</button>',
      '          </div>',
      '        </div>',
      '        <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="line-spacing" aria-pressed="false"><div class="wto-a11y-tool-top"><span>↕</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">Line Spacing</span></button>',
      '        <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="letter-spacing" aria-pressed="false"><div class="wto-a11y-tool-top"><span>↔</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">Letter Spacing</span></button>',
      '        <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="readable-font" aria-pressed="false"><div class="wto-a11y-tool-top"><span>F</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">Readable Font</span></button>',
      '        <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="highlight-headings" aria-pressed="false"><div class="wto-a11y-tool-top"><span>H</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">Highlight Headings</span></button>',
      '        <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="highlight-links" aria-pressed="false"><div class="wto-a11y-tool-top"><span>🔗</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">Highlight Links</span></button>',
      '        <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="reading-guide" aria-pressed="false"><div class="wto-a11y-tool-top"><span>📏</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">Reading Guide</span></button>',
      '        <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="large-cursor" aria-pressed="false"><div class="wto-a11y-tool-top"><span>👆</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">Large Cursor</span></button>',
      '        <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="reduced-motion" aria-pressed="false"><div class="wto-a11y-tool-top"><span>⏸</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">Reduce Motion</span></button>',
      '      </div>',
      '    </div>',
      '    <div>',
      '      <div class="wto-a11y-section-title">Color &amp; Contrast</div>',
      '      <div class="wto-a11y-grid">',
      '        <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="high-contrast" aria-pressed="false"><div class="wto-a11y-tool-top"><span>☀️</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">High Contrast</span></button>',
      '        <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="inverted" aria-pressed="false"><div class="wto-a11y-tool-top"><span>🔄</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">Invert Colors</span></button>',
      '        <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="monochrome" aria-pressed="false"><div class="wto-a11y-tool-top"><span>⚫</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">Monochrome</span></button>',
      '        <button type="button" class="wto-a11y-tool-btn" data-a11y-action="reset-contrast"><div class="wto-a11y-tool-top"><span>↺</span><span class="wto-a11y-badge-status">NORMAL</span></div><span class="wto-a11y-tool-label">Reset Contrast</span></button>',
      '      </div>',
      '    </div>',
      '  </div>',
      '  <div class="wto-a11y-footer">',
      '    <div class="wto-a11y-footer-actions">',
      '      <button type="button" class="wto-a11y-btn-save-full" data-a11y-action="save-preferences" aria-label="Save Settings"><span class="wto-a11y-save-icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg></span><span class="wto-a11y-save-label">Save</span></button>',
      '      <button type="button" class="wto-a11y-btn-clear-footer" data-a11y-action="reset-all" title="Clear all settings">' + resetSvg + '<span>Clear</span></button>',
      '    </div>',
      '  </div>',
      '</div>',
      '<div class="wto-a11y-reading-ruler" style="display:none;" aria-hidden="true"></div>',
      '<div class="wto-a11y-sr-announcements" aria-live="polite" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);"></div>'
    ].join('');

    rootEl.innerHTML = markup;
    document.body.appendChild(rootEl);
    initAccessibility(rootEl);
  }

  function initAccessibility(scope) {
    var root = scope && scope.classList && scope.classList.contains('wto-a11y-root')
      ? scope
      : (scope ? scope.querySelector('.wto-a11y-root') : document.querySelector('.wto-a11y-root'));
    if (!root) return;
    if (document.body && root.parentNode !== document.body) {
      document.body.appendChild(root);
    }
    if (root.getAttribute('data-wto-a11y-init') === '1') return;
    root.setAttribute('data-wto-a11y-init', '1');

    var launcher = root.querySelector('[data-a11y-action="toggle-panel"]');
    var panel = root.querySelector('.wto-a11y-panel');
    var closeBtn = root.querySelector('[data-a11y-action="close-panel"]');
    var ruler = root.querySelector('.wto-a11y-reading-ruler');
    var scaleVal = root.querySelector('[data-a11y-scale-val]');
    var srLive = root.querySelector('.wto-a11y-sr-announcements');

    var currentScale = Number(root.getAttribute('data-default-scale')) || 100;

    function announce(msg) {
      if (srLive) srLive.textContent = msg;
    }

    function togglePanel(open) {
      if (!panel) return;
      var isOpen = !panel.classList.contains('wto-a11y-hidden');
      var next = typeof open === 'boolean' ? open : !isOpen;
      if (next) {
        panel.classList.remove('wto-a11y-hidden');
        if (launcher) launcher.setAttribute('aria-expanded', 'true');
        announce('Accessibility settings panel opened');
      } else {
        panel.classList.add('wto-a11y-hidden');
        if (launcher) launcher.setAttribute('aria-expanded', 'false');
      }
    }

    if (launcher) {
      launcher.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        togglePanel();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        togglePanel(false);
      });
    }

    function applyScale(scale) {
      currentScale = Math.max(80, Math.min(160, scale));
      if (scaleVal) scaleVal.textContent = currentScale + '%';
      if (currentScale === 100) {
        document.body.style.fontSize = '';
      } else {
        document.body.style.fontSize = currentScale + '%';
      }
      announce('Text size set to ' + currentScale + '%');
    }

    root.querySelectorAll('[data-a11y-action="text-increase"]').forEach(function(btn){
      btn.addEventListener('click', function(){ applyScale(currentScale + 10); });
    });
    root.querySelectorAll('[data-a11y-action="text-decrease"]').forEach(function(btn){
      btn.addEventListener('click', function(){ applyScale(currentScale - 10); });
    });
    root.querySelectorAll('[data-a11y-action="text-reset"]').forEach(function(btn){
      btn.addEventListener('click', function(){ applyScale(100); });
    });

    var toolMap = {
      'line-spacing': 'wto-a11y-active-line-spacing',
      'letter-spacing': 'wto-a11y-active-letter-spacing',
      'readable-font': 'wto-a11y-active-readable-font',
      'highlight-headings': 'wto-a11y-active-highlight-headings',
      'highlight-links': 'wto-a11y-active-highlight-links',
      'large-cursor': 'wto-a11y-active-large-cursor',
      'reduced-motion': 'wto-a11y-active-reduced-motion'
    };

    root.querySelectorAll('[data-a11y-tool]').forEach(function(btn){
      var toolKey = btn.getAttribute('data-a11y-tool');
      if (toolKey === 'reading-guide') {
        btn.addEventListener('click', function(e){
          e.preventDefault();
          var isActive = btn.getAttribute('aria-pressed') === 'true';
          var next = !isActive;
          btn.setAttribute('aria-pressed', next ? 'true' : 'false');
          btn.classList.toggle('wto-a11y-active', next);
          var badge = btn.querySelector('.wto-a11y-badge-status');
          if (badge) badge.textContent = next ? 'ON' : 'OFF';
          if (ruler) ruler.style.display = next ? 'block' : 'none';
          announce('Reading guide ' + (next ? 'enabled' : 'disabled'));
        });
        return;
      }

      if (['high-contrast', 'inverted', 'monochrome'].indexOf(toolKey) !== -1) {
        btn.addEventListener('click', function(e){
          e.preventDefault();
          var isActive = btn.getAttribute('aria-pressed') === 'true';
          document.body.classList.remove('wto-a11y-active-high-contrast', 'wto-a11y-active-inverted', 'wto-a11y-active-monochrome');
          root.querySelectorAll('[data-a11y-tool="high-contrast"], [data-a11y-tool="inverted"], [data-a11y-tool="monochrome"]').forEach(function(b){
            b.setAttribute('aria-pressed', 'false');
            b.classList.remove('wto-a11y-active');
            var bd = b.querySelector('.wto-a11y-badge-status');
            if (bd) bd.textContent = 'OFF';
          });
          if (!isActive) {
            btn.setAttribute('aria-pressed', 'true');
            btn.classList.add('wto-a11y-active');
            var bd = btn.querySelector('.wto-a11y-badge-status');
            if (bd) bd.textContent = 'ON';
            document.body.classList.add('wto-a11y-active-' + toolKey);
            announce(toolKey + ' mode enabled');
          } else {
            announce('Contrast reset');
          }
        });
        return;
      }

      var clsName = toolMap[toolKey];
      if (!clsName) return;
      btn.addEventListener('click', function(e){
        e.preventDefault();
        var isActive = btn.getAttribute('aria-pressed') === 'true';
        var next = !isActive;
        btn.setAttribute('aria-pressed', next ? 'true' : 'false');
        btn.classList.toggle('wto-a11y-active', next);
        var badge = btn.querySelector('.wto-a11y-badge-status');
        if (badge) badge.textContent = next ? 'ON' : 'OFF';
        document.body.classList.toggle(clsName, next);
        announce(toolKey + ' ' + (next ? 'enabled' : 'disabled'));
      });
    });

    root.querySelectorAll('[data-a11y-action="reset-contrast"]').forEach(function(btn){
      btn.addEventListener('click', function(){
        document.body.classList.remove('wto-a11y-active-high-contrast', 'wto-a11y-active-inverted', 'wto-a11y-active-monochrome');
        root.querySelectorAll('[data-a11y-tool="high-contrast"], [data-a11y-tool="inverted"], [data-a11y-tool="monochrome"]').forEach(function(b){
          b.setAttribute('aria-pressed', 'false');
          b.classList.remove('wto-a11y-active');
          var bd = b.querySelector('.wto-a11y-badge-status');
          if (bd) bd.textContent = 'OFF';
        });
        announce('Contrast reset');
      });
    });

    function resetAll() {
      applyScale(100);
      document.body.classList.remove(
        'wto-a11y-active-line-spacing',
        'wto-a11y-active-letter-spacing',
        'wto-a11y-active-readable-font',
        'wto-a11y-active-highlight-headings',
        'wto-a11y-active-highlight-links',
        'wto-a11y-active-high-contrast',
        'wto-a11y-active-inverted',
        'wto-a11y-active-monochrome',
        'wto-a11y-active-large-cursor',
        'wto-a11y-active-reduced-motion'
      );
      root.querySelectorAll('[data-a11y-tool]').forEach(function(b){
        b.setAttribute('aria-pressed', 'false');
        b.classList.remove('wto-a11y-active');
        var bd = b.querySelector('.wto-a11y-badge-status');
        if (bd) bd.textContent = 'OFF';
      });
      if (ruler) ruler.style.display = 'none';
      announce('All accessibility settings reset');
    }

    root.querySelectorAll('[data-a11y-action="reset-all"]').forEach(function(btn){
      btn.addEventListener('click', function(){ resetAll(); });
    });

    root.querySelectorAll('[data-a11y-action="save-preferences"]').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        btn.classList.add('wto-a11y-saved');
        var lbl = btn.querySelector('.wto-a11y-save-label');
        var icn = btn.querySelector('.wto-a11y-save-icon');
        if (lbl) lbl.textContent = 'Saved';
        if (icn) icn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        announce('Accessibility settings saved');
        setTimeout(function(){
          btn.classList.remove('wto-a11y-saved');
          if (lbl) lbl.textContent = 'Save';
          if (icn) icn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>';
        }, 2500);
      });
    });

    if (ruler) {
      window.addEventListener('mousemove', function(e){
        if (ruler.style.display !== 'none') {
          ruler.style.top = (e.clientY + 12) + 'px';
        }
      }, { passive: true });
    }

    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && panel && !panel.classList.contains('wto-a11y-hidden')) {
        togglePanel(false);
      }
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        togglePanel();
      }
    });
  }

  function renderWhatsAppChatStandalone(widget) {
    if (!widget || widget.enabled === false) return;
    var widgetId = widget.id || 'wgt_wa_' + Math.random().toString(36).slice(2, 8);
    var cleanId = widgetId.replace(/[^a-zA-Z0-9_-]/g, '');
    var cls = 'wto-wa-' + cleanId;

    if (document.querySelector('.' + cls)) {
      return; // Already rendered in DOM
    }

    var cfg = widget.config || {};
    var content = cfg.content || {};
    var appearance = cfg.appearance || {};
    var behavior = cfg.behavior || {};

    var phone = content.phoneNumber || '';
    var cleanPhone = phone.replace(/[^0-9]/g, '');
    var validPhone = cleanPhone.length >= 7 && cleanPhone.length <= 15;
    var prefill = behavior.prefillMessage !== false ? (content.prefilledMessage || '') : '';
    var waUrl = validPhone ? 'https://wa.me/' + cleanPhone + (prefill ? '?text=' + encodeURIComponent(prefill) : '') : '#';

    var btnLabel = content.buttonLabel || 'Chat with Us';
    var greetingText = content.greetingText || 'Hello! How can we help you today?';
    var agentName = content.agentName || 'Customer Support';
    var statusLabel = content.statusLabel || 'Usually replies in minutes';
    var workingHours = content.workingHoursNotice || 'Mon - Fri, 9:00 AM - 6:00 PM';
    var showWorkingHours = content.showWorkingHoursNotice !== false;

    var layoutStyle = appearance.layoutStyle || 'contact_card';
    var btnColor = appearance.buttonColor || '#25d366';
    var btnTextColor = appearance.buttonTextColor || '#ffffff';
    var iconSize = Number(appearance.iconSize) || 28;
    var btnDiameter = Number(appearance.buttonDiameter) || 60;
    var borderRadius = Number(appearance.borderRadius) !== undefined ? Number(appearance.borderRadius) : 50;
    var isLeft = appearance.position === 'bottom_left';
    var offsetX = Number(appearance.offsetX) || 20;
    var offsetY = Number(appearance.offsetY) || 20;
    var isDark = appearance.theme === 'dark';
    var showGreetingBubble = behavior.showGreetingBubble !== false && (layoutStyle === 'contact_card' || layoutStyle === 'button_with_greeting');
    var openInNewTab = behavior.openInNewTab !== false;

    var cardBg = isDark ? '#18181b' : '#ffffff';
    var cardText = isDark ? '#f4f4f5' : '#111827';
    var cardBorder = isDark ? '#27272a' : '#e4e4e7';
    var bubbleBg = appearance.greetingBgColor || (isDark ? '#27272a' : '#ffffff');
    var bubbleText = appearance.greetingTextColor || (isDark ? '#f4f4f5' : '#111827');

    var waIconSvg = '<svg viewBox="0 0 32 32" width="100%" height="100%" fill="currentColor" aria-hidden="true" style="display:block;"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 0C7.163 0 0 7.163 0 16c0 2.825.736 5.48 2.025 7.78L.667 30.667l7.098-1.328A15.932 15.932 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.01 22.614c-.332.935-1.642 1.716-2.696 1.944-.72.155-1.662.28-4.82-1.03-4.04-1.674-6.643-5.787-6.845-6.056-.195-.268-1.62-2.155-1.62-4.11 0-1.954 1.026-2.915 1.39-3.315.363-.4.792-.5 1.057-.5.265 0 .53.003.762.014.246.012.576-.093.901.688.332.8 1.13 2.723 1.23 2.946.098.223.164.484.032.748-.131.264-.197.43-.393.662-.196.23-.414.514-.59.69-.197.195-.403.407-.174.802.23.394 1.022 1.685 2.193 2.73 1.507 1.344 2.778 1.762 3.172 1.957.394.197.625.165.856-.1.23-.264.986-1.147 1.25-1.542.264-.395.527-.33.888-.198.363.132 2.298 1.083 2.693 1.28.396.198.66.297.758.462.099.165.099.957-.233 1.892z"/></svg>';
    var closeIconSvg = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    var sendIconSvg = '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';

    var styleEl = document.createElement('style');
    styleEl.textContent = [
      '.' + cls + ' {',
      '  position: fixed;',
      '  bottom: ' + offsetY + 'px;',
      '  ' + (isLeft ? 'left: ' + offsetX + 'px;' : 'right: ' + offsetX + 'px;'),
      '  z-index: 99999;',
      '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;',
      '  font-size: 14px;',
      '  line-height: 1.4;',
      '  color: #111827;',
      '  direction: ltr;',
      '  display: flex;',
      '  flex-direction: column;',
      '  align-items: ' + (isLeft ? 'flex-start' : 'flex-end') + ';',
      '  gap: 12px;',
      '  pointer-events: auto;',
      '}',
      '.' + cls + ' * { box-sizing: border-box; margin: 0; padding: 0; }',
      '.' + cls + ' .wto-wa-hidden { display: none !important; }',
      '.' + cls + ' .wto-wa-btn {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  gap: 10px;',
      '  background-color: ' + btnColor + ';',
      '  color: ' + btnTextColor + ';',
      '  min-width: ' + btnDiameter + 'px;',
      '  height: ' + btnDiameter + 'px;',
      '  border-radius: ' + borderRadius + 'px;',
      '  padding: ' + (borderRadius >= 30 ? '0 18px 0 16px' : '0 14px') + ';',
      '  box-shadow: 0 4px 16px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.12);',
      '  text-decoration: none;',
      '  cursor: pointer;',
      '  border: none;',
      '  outline: none;',
      '  transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s ease;',
      '  user-select: none;',
      '  position: relative;',
      '}',
      '.' + cls + ' .wto-wa-btn:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 24px rgba(0,0,0,0.28); }',
      '.' + cls + ' .wto-wa-btn:active { transform: translateY(1px) scale(0.97); }',
      '.' + cls + ' .wto-wa-btn-icon { width: ' + iconSize + 'px; height: ' + iconSize + 'px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }',
      '.' + cls + ' .wto-wa-btn-label { font-weight: 600; font-size: 14px; white-space: nowrap; }',
      '.' + cls + ' .wto-wa-card {',
      '  width: 320px;',
      '  max-width: calc(100vw - 32px);',
      '  background-color: ' + cardBg + ';',
      '  color: ' + cardText + ';',
      '  border-radius: 16px;',
      '  border: 1px solid ' + cardBorder + ';',
      '  box-shadow: 0 12px 36px rgba(0,0,0,0.24), 0 4px 12px rgba(0,0,0,0.12);',
      '  overflow: hidden;',
      '  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16,1,0.3,1);',
      '  transform-origin: ' + (isLeft ? 'bottom left' : 'bottom right') + ';',
      '}',
      '.' + cls + ' .wto-wa-card-header { background: #075e54; color: #ffffff; padding: 16px 18px; display: flex; align-items: center; justify-content: space-between; }',
      '.' + cls + ' .wto-wa-card-title { font-weight: 700; font-size: 15px; }',
      '.' + cls + ' .wto-wa-card-subtitle { font-size: 11px; opacity: 0.85; margin-top: 2px; }',
      '.' + cls + ' .wto-wa-card-close { background: transparent; border: none; color: #ffffff; cursor: pointer; padding: 4px; border-radius: 6px; display: flex; opacity: 0.8; }',
      '.' + cls + ' .wto-wa-card-close:hover { opacity: 1; background: rgba(255,255,255,0.15); }',
      '.' + cls + ' .wto-wa-card-body { padding: 18px; display: flex; flex-direction: column; gap: 14px; background: ' + (isDark ? '#18181b' : '#f0f2f5') + '; }',
      '.' + cls + ' .wto-wa-chat-bubble { background: ' + (isDark ? '#27272a' : '#ffffff') + '; padding: 12px 14px; border-radius: 12px 12px 12px 2px; font-size: 13px; color: ' + cardText + '; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }',
      '.' + cls + ' .wto-wa-cta-btn { display: flex; align-items: center; justify-content: center; gap: 8px; background: #25d366; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 16px; border-radius: 10px; text-decoration: none; box-shadow: 0 3px 10px rgba(37,211,102,0.35); transition: opacity 0.15s ease; }',
      '.' + cls + ' .wto-wa-cta-btn:hover { opacity: 0.92; }',
      '.' + cls + ' .wto-wa-bubble {',
      '  background-color: ' + bubbleBg + ';',
      '  color: ' + bubbleText + ';',
      '  padding: 12px 14px;',
      '  border-radius: 12px;',
      '  border: 1px solid ' + cardBorder + ';',
      '  box-shadow: 0 6px 20px rgba(0,0,0,0.15);',
      '  max-width: 260px;',
      '  font-size: 13px;',
      '  position: relative;',
      '  display: flex;',
      '  align-items: flex-start;',
      '  gap: 8px;',
      '}',
      '.' + cls + ' .wto-wa-bubble-close { background: transparent; border: none; color: #9ca3af; cursor: pointer; padding: 2px; }',
      '.' + cls + ' .wto-wa-bubble-close:hover { color: #111827; }'
    ].join('');
    document.head.appendChild(styleEl);

    var rootEl = document.createElement('div');
    rootEl.className = 'wto-wa-root ' + cls;
    rootEl.setAttribute('data-wto-wa', '1');
    rootEl.setAttribute('data-wto-widget', widgetId);
    rootEl.setAttribute('data-phone', cleanPhone);
    rootEl.setAttribute('data-valid', validPhone ? '1' : '0');
    rootEl.setAttribute('data-greeting-delay', String(behavior.greetingDelaySec || 2));
    rootEl.setAttribute('data-auto-dismiss', String(behavior.autoDismissGreetingSec || 0));

    var innerHtml = '';
    function safeTxt(s){ return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

    // Contact card markup
    if (layoutStyle === 'contact_card') {
      innerHtml += [
        '<div class="wto-wa-card wto-wa-hidden" data-wa-card="1">',
        '  <div class="wto-wa-card-header">',
        '    <div>',
        '      <div class="wto-wa-card-title">' + safeTxt(agentName) + '</div>',
        '      <div class="wto-wa-card-subtitle">' + safeTxt(statusLabel) + '</div>',
        '    </div>',
        '    <button class="wto-wa-card-close" data-wa-action="close-card" aria-label="Close">' + closeIconSvg + '</button>',
        '  </div>',
        '  <div class="wto-wa-card-body">',
        '    <div class="wto-wa-chat-bubble">' + safeTxt(greetingText) + '</div>',
        (showWorkingHours && workingHours ? '    <div style="font-size:11px;color:#9ca3af;text-align:center;">' + safeTxt(workingHours) + '</div>' : ''),
        '    <a href="' + waUrl + '" class="wto-wa-cta-btn" data-wa-action="open-wa" target="_blank" rel="noopener noreferrer">',
        '      <span>Start Chat</span>' + sendIconSvg,
        '    </a>',
        '  </div>',
        '</div>'
      ].join('');
    }

    // Greeting bubble markup
    if (showGreetingBubble && layoutStyle !== 'contact_card') {
      innerHtml += [
        '<div class="wto-wa-bubble">',
        '  <div style="flex:1;">' + safeTxt(greetingText) + '</div>',
        '  <button class="wto-wa-bubble-close" data-wa-action="dismiss-bubble" aria-label="Close">' + closeIconSvg + '</button>',
        '</div>'
      ].join('');
    }

    // Button markup
    if (layoutStyle === 'contact_card') {
      innerHtml += [
        '<button type="button" class="wto-wa-btn" data-wa-action="toggle-card" aria-label="WhatsApp Chat">',
        '  <span class="wto-wa-btn-icon">' + waIconSvg + '</span>',
        (borderRadius < 30 || btnLabel !== 'Chat with Us' ? '  <span class="wto-wa-btn-label">' + safeTxt(btnLabel) + '</span>' : ''),
        '</button>'
      ].join('');
    } else {
      innerHtml += [
        '<a href="' + waUrl + '" class="wto-wa-btn" data-wa-action="open-wa" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Chat">',
        '  <span class="wto-wa-btn-icon">' + waIconSvg + '</span>',
        (borderRadius < 30 || btnLabel !== 'Chat with Us' ? '  <span class="wto-wa-btn-label">' + safeTxt(btnLabel) + '</span>' : ''),
        '</a>'
      ].join('');
    }

    rootEl.innerHTML = innerHtml;
    document.body.appendChild(rootEl);
    initWhatsAppChat(rootEl);
  }

  function initLanguageSwitcher(scope) {
    if (!scope) return;
    var roots = scope.querySelectorAll ? scope.querySelectorAll('.wto-lang-switcher-root, [data-wto-lang="1"]') : [];
    if (scope.classList && scope.classList.contains('wto-lang-switcher-root')) {
      roots = [scope];
    }
    roots.forEach(function(root){
      if (root.getAttribute('data-wto-lang-ready') === '1') return;
      root.setAttribute('data-wto-lang-ready', '1');

      var trigger = root.querySelector('.wto-lang-trigger');
      var items = root.querySelectorAll('.wto-lang-item');

      if (trigger) {
        trigger.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          root.classList.toggle('wto-open');
        });
      }

      items.forEach(function(item){
        item.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          var code = item.getAttribute('data-lang-code');
          var url = item.getAttribute('data-lang-url');
          var widgetId = root.getAttribute('data-wto-lang-id') || '';
          try {
            if (widgetId) {
              localStorage.setItem('wto_lang_pref_' + widgetId.replace(/[^a-zA-Z0-9_-]/g, ''), code);
            }
          } catch(_) {}
          root.classList.remove('wto-open');
          if (url && url !== '#' && url !== window.location.href && url !== window.location.pathname) {
            window.location.href = url;
          }
        });
      });

      document.addEventListener('click', function(e){
        if (!root.contains(e.target)) {
          root.classList.remove('wto-open');
        }
      });
    });
  }

  function renderLanguageSwitcherStandalone(widget, targetEl) {
    if (!widget || widget.enabled === false) return;
    var widgetId = widget.id || 'wgt_lang_' + Math.random().toString(36).slice(2, 8);
    var cleanId = widgetId.replace(/[^a-zA-Z0-9_-]/g, '');
    var cls = 'wto-lang-inst-' + cleanId;

    if (document.querySelector('.' + cls)) {
      return;
    }

    var cfg = widget.config || {};
    var app = cfg.appearance || {};
    var beh = cfg.behavior || {};
    var languages = Array.isArray(cfg.languages) && cfg.languages.length > 0 ? cfg.languages.filter(function(l){ return l.enabled !== false; }) : [
      { id: 'en', code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', url: '/', enabled: true, isDefault: true },
      { id: 'es', code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', url: '/es', enabled: true },
      { id: 'fr', code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', url: '/fr', enabled: true }
    ];

    var storageKey = (beh.storageKeyPrefix || 'wto_lang_pref_') + cleanId;
    var currentCode = null;
    try {
      if (beh.rememberVisitorPreference) {
        currentCode = localStorage.getItem(storageKey);
      }
    } catch(e) {}

    var activeLang = null;
    if (currentCode) {
      for (var i = 0; i < languages.length; i++) {
        if (languages[i].code === currentCode) { activeLang = languages[i]; break; }
      }
    }
    if (!activeLang) {
      for (var j = 0; j < languages.length; j++) {
        if (languages[j].isDefault) { activeLang = languages[j]; break; }
      }
    }
    if (!activeLang) activeLang = languages[0] || { code: 'en', name: 'English', flag: '🌐' };

    var isFloating = app.layout === 'floating_selector';
    var isTop = (app.floatingPosition || 'bottom_right').indexOf('top') !== -1;
    var isLeft = (app.floatingPosition || 'bottom_right').indexOf('left') !== -1;
    var posX = isLeft ? 'left: ' + (Number(app.floatingOffsetX) || 24) + 'px;' : 'right: ' + (Number(app.floatingOffsetX) || 24) + 'px;';
    var posY = isTop ? 'top: ' + (Number(app.floatingOffsetY) || 24) + 'px;' : 'bottom: ' + (Number(app.floatingOffsetY) || 24) + 'px;';

    var btnFormat = app.buttonFormat || 'flag_and_name';
    var showFlags = app.showFlags !== false;
    var showNative = app.showNativeNames !== false;
    var showGlobe = app.showGlobeIcon !== false;

    var globeSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:middle;"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>';
    var chevronSvg = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:middle;"><path d="m6 9 6 6 6-6"/></svg>';
    var checkSvg = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

    var styleEl = document.createElement('style');
    styleEl.textContent = [
      '.' + cls + ' { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; box-sizing: border-box !important; position: ' + (isFloating ? 'fixed' : 'relative') + ' !important; ' + (isFloating ? posX + ' ' + posY + ' z-index: ' + (app.zIndex || 99997) + ' !important;' : '') + ' text-align: left !important; display: inline-block !important; }',
      '.' + cls + ' * { box-sizing: border-box !important; }',
      '.' + cls + ' .wto-lang-trigger { display: inline-flex !important; align-items: center !important; gap: 7px !important; font-size: ' + (app.fontSize || 13) + 'px !important; padding: ' + (app.paddingY || 8) + 'px ' + (app.paddingX || 14) + 'px !important; border-radius: ' + (app.borderRadius || 10) + 'px !important; background-color: ' + (app.backgroundColor || '#18181b') + ' !important; color: ' + (app.textColor || '#ffffff') + ' !important; border: 1px solid ' + (app.borderColor || 'rgba(255,255,255,0.15)') + ' !important; cursor: pointer !important; transition: all 0.18s ease !important; user-select: none !important; line-height: 1 !important; box-shadow: 0 4px 14px rgba(0,0,0,0.2) !important; }',
      '.' + cls + ' .wto-lang-trigger:hover { background-color: ' + (app.hoverBackgroundColor || '#27272a') + ' !important; color: ' + (app.hoverTextColor || '#ffffff') + ' !important; border-color: ' + (app.accentColor || '#3b82f6') + ' !important; transform: translateY(-1px) !important; }',
      '.' + cls + ' .wto-lang-dropdown { position: absolute !important; ' + (isTop ? 'top: calc(100% + 8px) !important;' : 'bottom: calc(100% + 8px) !important;') + ' ' + (isLeft ? 'left: 0 !important;' : 'right: 0 !important;') + ' min-width: ' + (app.dropdownWidth || 200) + 'px !important; background-color: ' + (app.dropdownBackgroundColor || '#18181b') + ' !important; border: 1px solid ' + (app.dropdownBorderColor || 'rgba(255,255,255,0.15)') + ' !important; border-radius: ' + (app.dropdownBorderRadius || 12) + 'px !important; padding: 6px !important; box-shadow: 0 10px 25px -3px rgba(0,0,0,0.3) !important; display: none !important; flex-direction: column !important; gap: 2px !important; z-index: 2147483647 !important; }',
      '.' + cls + '.wto-open .wto-lang-dropdown { display: flex !important; }',
      '.' + cls + ' .wto-lang-item { display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 8px 12px !important; border-radius: 8px !important; color: ' + (app.dropdownTextColor || '#f4f4f5') + ' !important; cursor: pointer !important; font-size: ' + (app.fontSize || 13) + 'px !important; text-decoration: none !important; transition: background 0.15s ease !important; }',
      '.' + cls + ' .wto-lang-item:hover { background-color: ' + (app.hoverBackgroundColor || '#27272a') + ' !important; color: ' + (app.hoverTextColor || '#ffffff') + ' !important; }',
      '.' + cls + ' .wto-lang-item.wto-active { background-color: ' + (app.activeItemBackgroundColor || 'rgba(59,130,246,0.15)') + ' !important; color: ' + (app.activeItemTextColor || '#60a5fa') + ' !important; font-weight: 600 !important; }'
    ].join('');
    document.head.appendChild(styleEl);

    var rootEl = document.createElement('div');
    rootEl.className = cls + ' wto-lang-switcher-root';
    rootEl.setAttribute('data-wto-lang', '1');
    rootEl.setAttribute('data-wto-lang-id', widgetId);

    var triggerText = '';
    if (btnFormat === 'flag_only') triggerText = activeLang.flag || '🌐';
    else if (btnFormat === 'code_only') triggerText = (activeLang.code || 'en').toUpperCase();
    else if (btnFormat === 'flag_and_code') triggerText = (activeLang.flag || '🌐') + ' ' + (activeLang.code || 'en').toUpperCase();
    else triggerText = (showFlags ? (activeLang.flag || '🌐') + ' ' : '') + (showNative ? activeLang.nativeName || activeLang.name : activeLang.name);

    var itemsHtml = languages.map(function(l){
      var isActive = l.code === activeLang.code;
      return '<div class="wto-lang-item' + (isActive ? ' wto-active' : '') + '" data-lang-code="' + safeTxt(l.code) + '" data-lang-url="' + safeTxt(l.url || '/') + '">' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          (showFlags ? '<span>' + (l.flag || '🌐') + '</span>' : '') +
          '<span>' + safeTxt(showNative ? (l.nativeName || l.name) : l.name) + '</span>' +
          '<span style="font-size:10px;opacity:0.6;text-transform:uppercase;">' + safeTxt(l.code) + '</span>' +
        '</div>' +
        (isActive ? checkSvg : '') +
      '</div>';
    }).join('');

    rootEl.innerHTML = [
      '<button type="button" class="wto-lang-trigger" aria-haspopup="true" aria-expanded="false">',
      (showGlobe ? globeSvg : ''),
      '<span>' + triggerText + '</span>',
      chevronSvg,
      '</button>',
      '<div class="wto-lang-dropdown">',
      itemsHtml,
      '</div>'
    ].join('');

    if (isFloating || !targetEl) {
      document.body.appendChild(rootEl);
    } else {
      targetEl.appendChild(rootEl);
    }

    initLanguageSwitcher(rootEl);
  }

  function initDynamicWidgets(root){
    try {
      var scope = root && root.querySelectorAll ? root : document;

      // 1. Initialize any standalone countdown widgets
      scope.querySelectorAll('.wto-countdown-root, [data-wto-countdown="1"]').forEach(function(cd){
        initCountdown(cd);
      });

      // 2. Initialize any announcement bars or popups
      initAnnouncementPopup(scope);

      // 3. Initialize any FAQ accordion widgets
      initFaq(scope);

      // 4. Initialize any WhatsApp Chat widgets
      initWhatsAppChat(scope);

      // 5. Initialize any Accessibility widgets
      initAccessibility(scope);

      // 6. Initialize any widgets with data-wto-widget
      scope.querySelectorAll('[data-wto-widget]').forEach(function(el){
        var widgetId = el.getAttribute('data-wto-widget');
        if (!widgetId) return;

        // Check storage for widget definition and enabled state
        var widgetData = getStorageWidget(widgetId);
        if (widgetData && widgetData.enabled === false) {
          el.style.display = 'none';
          el.innerHTML = '';
          var parentWrapper = el.closest && el.closest('.wto-embedded-widget-container, .wto-custom-html-wrapper');
          if (parentWrapper) {
            parentWrapper.style.display = 'none';
            parentWrapper.innerHTML = '';
          }
          return;
        }

        // If countdown inside or matches:
        var cd = el.matches && el.matches('.wto-countdown-root, [data-wto-countdown="1"]') ? el : el.querySelector('.wto-countdown-root, [data-wto-countdown="1"]');
        if (cd) {
          initCountdown(cd);
          return;
        }

        // If announcement or popup inside or matches:
        var ap = el.matches && el.matches('.wto-announcement-bar-root, .wto-popup-backdrop, [data-ap-mode]') ? el : el.querySelector('.wto-announcement-bar-root, .wto-popup-backdrop, [data-ap-mode]');
        if (ap) {
          initAnnouncementPopup(el);
          return;
        }

        // If FAQ inside or matches:
        var faq = el.matches && el.matches('.wto-faq-container, .wto-faq-root') ? el : el.querySelector('.wto-faq-container, .wto-faq-root');
        if (faq) {
          initFaq(el);
          return;
        }

        // If WhatsApp inside or matches:
        var wa = el.matches && el.matches('.wto-wa-root, [data-wto-wa="1"]') ? el : el.querySelector('.wto-wa-root, [data-wto-wa="1"]');
        if (wa) {
          initWhatsAppChat(el);
          return;
        }

        // If Accessibility inside or matches:
        var a11y = el.matches && el.matches('.wto-a11y-root, [data-wto-a11y="1"]') ? el : el.querySelector('.wto-a11y-root, [data-wto-a11y="1"]');
        if (a11y) {
          initAccessibility(el);
          return;
        }

        // If reviews inside:
        if (el.querySelector('.wto-widget-container, .wto-card-inner, .wto-carousel-track')) {
          attachInteractivity(el);
          return;
        }

        // If element is empty or pending:
        if (widgetId.indexOf('wgt_acc') === 0) {
          getOrFetchWidget(widgetId, function(data){
            if (data) {
              renderAccessibilityStandalone(data);
            }
          });
          return;
        }

        if (widgetId.indexOf('wgt_wa') === 0) {
          getOrFetchWidget(widgetId, function(data){
            if (data) {
              renderWhatsAppChatStandalone(data);
            }
          });
          return;
        }

        if (widgetId.indexOf('wgt_lang') === 0) {
          getOrFetchWidget(widgetId, function(data){
            if (data) {
              renderLanguageSwitcherStandalone(data, el);
              el.setAttribute('data-wto-rendered', '1');
            }
          });
          return;
        }

        // If pending or empty other widget, request render
        if (widgetData) {
          window.dispatchEvent(new CustomEvent('wto-render-widget-request', { detail: { el: el, widget: widgetData } }));
        }
      });
    } catch(err) {
      console.warn('[WTOWidgetRuntime] error:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ initDynamicWidgets(); });
  } else {
    initDynamicWidgets();
  }

  // Fail-safe global capture-phase close listener so clicking any close button anywhere in the page always dismisses the widget
  document.addEventListener('click', function(e){
    var target = e.target;
    var btn = target && target.closest ? target.closest('.wto-bar-close-btn, .wto-popup-close-btn, [data-ap-close], .wto-close-btn') : null;
    if (!btn) return;
    var root = btn.closest('.wto-announcement-bar-root, .wto-popup-backdrop, [data-ap-mode]');
    if (root) {
      e.preventDefault();
      e.stopPropagation();
      root.classList.add('wto-closed');
      root.setAttribute('data-wto-closed', '1');
      var reopenBtn = root.querySelector('.wto-bar-reopen-btn');
      var barInner = root.querySelector('.wto-bar-inner');
      if (reopenBtn) {
        if (barInner) barInner.style.setProperty('display', 'none', 'important');
        root.style.setProperty('height', '0px', 'important');
        root.style.setProperty('min-height', '0px', 'important');
        root.style.setProperty('padding', '0px', 'important');
        root.style.setProperty('margin', '0px', 'important');
        root.style.setProperty('pointer-events', 'none', 'important');
        root.style.setProperty('background', 'transparent', 'important');
        reopenBtn.style.setProperty('display', 'inline-flex', 'important');
        reopenBtn.style.setProperty('pointer-events', 'auto', 'important');
      } else {
        root.style.setProperty('display', 'none', 'important');
        root.style.setProperty('height', '0px', 'important');
        root.style.setProperty('min-height', '0px', 'important');
        root.style.setProperty('padding', '0px', 'important');
        root.style.setProperty('margin', '0px', 'important');
        root.style.setProperty('visibility', 'hidden', 'important');
        root.style.setProperty('pointer-events', 'none', 'important');
        if (barInner) barInner.style.setProperty('display', 'none', 'important');
        var widgetRoot = root.closest('[data-wto-widget-root], [data-widget-id]');
        if (widgetRoot && widgetRoot !== root) {
          widgetRoot.style.setProperty('display', 'none', 'important');
          widgetRoot.style.setProperty('height', '0px', 'important');
          widgetRoot.classList.add('wto-closed');
        }
      }
      document.documentElement.style.setProperty('--wto-header-top', '0px');
    }
  }, true);

  window.addEventListener('wto-preview-ready', function(){ initDynamicWidgets(); });
  window.addEventListener('wto-widget-saved', function(){ initDynamicWidgets(); });
  setInterval(function(){ initDynamicWidgets(); }, 1500);
})();
