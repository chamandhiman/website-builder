(function(){
  function initDynamicWidgets(root){
    try {
      var scope = root && root.querySelectorAll ? root : document;
      scope.querySelectorAll('[data-wto-widget]').forEach(function(el){
        if (el.getAttribute('data-wto-rendered') === '1') return;
        var widgetId = el.getAttribute('data-wto-widget');
        if (!widgetId) return;

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

          // Countdown Timer Interactivity
          var countdownRoots = container.querySelectorAll('.wto-countdown-root, [data-wto-countdown="1"]');
          countdownRoots.forEach(function(root){
            if (root.getAttribute('data-cd-active') === '1') return;
            root.setAttribute('data-cd-active', '1');
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
            var animType = root.getAttribute('data-cd-anim') || root.getAttribute('data-anim') || 'none';
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
              closeBtn.addEventListener('click', function(e){
                e.preventDefault();
                root.style.opacity = '0';
                setTimeout(function(){ root.style.display = 'none'; }, 250);
              });
            }

            var personalKey = 'wto_cd_visitor_' + widgetId;
            var personalDurationMs = durationVal * (durationUnit === 'days' ? 86400000 : durationUnit === 'hours' ? 3600000 : 60000);
            var personalEndTime = targetTimestampAttr > 0 ? targetTimestampAttr : 0;
            if (mode === 'personal' && !personalEndTime) {
              if (persist) {
                var stored = localStorage.getItem(personalKey);
                if (stored) { personalEndTime = Number(stored); }
                else { personalEndTime = Date.now() + personalDurationMs; localStorage.setItem(personalKey, String(personalEndTime)); }
              } else {
                personalEndTime = Date.now() + personalDurationMs;
              }
            }

            var counterStartTime = Date.now();
            var prevVals = {};
            function setDigit(el, val){
              if (!el) return;
              var key = el.getAttribute('data-digit-for') || '';
              if (prevVals[key] !== val) {
                prevVals[key] = val;
                el.textContent = val;
                if (animType !== 'none') {
                  var c = 'wto-anim-' + animType + '-run';
                  el.classList.remove(c);
                  void el.offsetWidth;
                  el.classList.add(c);
                  setTimeout(function(){ el.classList.remove(c); }, 350);
                }
              }
            }

            var hasExpired = false;
            function onExpire(){
              if (hasExpired) return;
              hasExpired = true;
              if (expiryAction === 'hide') { root.style.display = 'none'; }
              else if (expiryAction === 'message') {
                if (timerInner) timerInner.style.display = 'none';
                if (expiryMsgEl) { expiryMsgEl.style.display = 'block'; var p = expiryMsgEl.querySelector('.wto-cd-expiry-text'); if (p) p.textContent = expiryMsg; }
              } else if (expiryAction === 'redirect') {
                if (expiryUrl) { window.location.href = expiryUrl; }
              }
            }

            function tickCd(){
              var now = Date.now();
              var diff = 0;

              if (targetTimestampAttr > 0) {
                diff = targetTimestampAttr - now;
              } else if (mode === 'date') {
                if (targetDateStr) {
                  var p = targetDateStr.split('-');
                  var t = (targetTimeStr || '23:59').split(':');
                  var d = new Date(Number(p[0]), Number(p[1])-1, Number(p[2]), Number(t[0]||0), Number(t[1]||0), 0);
                  diff = d.getTime() - now;
                }
              } else if (mode === 'personal') {
                diff = personalEndTime - now;
              } else if (mode === 'recurring') {
                var cMs = recurringHrs * 3600000;
                diff = cMs - (now % cMs);
              } else if (mode === 'counter') {
                var elSec = (now - counterStartTime) / 1000;
                var prog = Math.min(1, elSec / counterDur);
                var cur = counterDir === 'up' ? Math.round(counterStart + (counterEnd - counterStart)*prog) : Math.round(counterStart - (counterStart - counterEnd)*prog);
                setDigit(secsEl, String(cur).padStart(2, '0'));
                if (prog >= 1 && !hasExpired) onExpire();
                return;
              }

              if (diff <= 0) {
                setDigit(daysEl, '00'); setDigit(hoursEl, '00'); setDigit(minsEl, '00'); setDigit(secsEl, '00');
                onExpire();
                return;
              }

              var remS = Math.floor(diff / 1000);
              var remM = Math.floor(remS / 60);
              var remH = Math.floor(remM / 60);
              var remD = Math.floor(remH / 24);

              var fD = 0, fH = 0, fM = 0, fS = 0;
              if (showDays) { fD = remD; remH = remH % 24; }
              if (showHours) { fH = remH; remM = remM % 60; }
              if (showMinutes) { fM = remM; remS = remS % 60; }
              fS = remS;

              setDigit(daysEl, String(fD).padStart(2, '0'));
              setDigit(hoursEl, String(fH).padStart(2, '0'));
              setDigit(minsEl, String(fM).padStart(2, '0'));
              setDigit(secsEl, String(fS).padStart(2, '0'));
            }

            tickCd();
            setInterval(tickCd, 1000);
          });

          // Announcement Bar & Popup Runtime Handler
          container.querySelectorAll('.wto-announcement-bar-root, .wto-popup-backdrop, [data-ap-mode]').forEach(function(ap){
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
            var dismissScope = ap.getAttribute('data-ap-dismiss-scope') || 'permanent';

            // Page Targeting Validation
            var rawPath = (window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : '/';
            var urlParams = (window.location && window.location.search) ? new URLSearchParams(window.location.search) : null;
            var pageParam = urlParams ? (urlParams.get('page') || '').toLowerCase().replace(/^[./]+/, '').replace(/\.html$/i, '') : '';
            var isDemo = rawPath.indexOf('/demo/') !== -1 || rawPath.indexOf('/preview') !== -1;
            var isDemoHome = isDemo && (pageParam === 'home' || pageParam === 'index' || !pageParam);
            var isHomePage = rawPath === '/' || rawPath === '' || rawPath.indexOf('/index.html') !== -1 || isDemoHome;
            var currentPath = isDemo ? (pageParam ? '/' + pageParam : '/') : rawPath;

            if (pageTargeting === 'homepage_only' && !isHomePage) {
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

            // Hoist popup modals to document.body so they are NEVER trapped inside headers or navbars
            if (mode === 'popup') {
              var hoistTarget = ap.ownerDocument ? ap.ownerDocument.body : document.body;
              if (hoistTarget && ap.parentElement !== hoistTarget) {
                var existingOld = hoistTarget.querySelector('.wto-popup-backdrop[data-wto-widget="' + widgetId + '"]');
                if (existingOld && existingOld !== ap) {
                  existingOld.remove();
                }
                hoistTarget.appendChild(ap);
              }
            }

            // Scheduling
            if (schedEnabled) {
              var now = Date.now();
              if (startStr && now < new Date(startStr).getTime()) { ap.style.display = 'none'; return; }
              if (endStr && now > new Date(endStr).getTime()) { ap.style.display = 'none'; return; }
            }

            // Frequency & Home Return Bypass
            var allowHomeBypass = isHomePage && (reappearOnHomeReturn || freq === 'home_return');
            if (!allowHomeBypass && freq !== 'always' && widgetId) {
              var key = 'wto_ap_seen_' + widgetId;
              if ((freq === 'session' || dismissScope === 'session') && sessionStorage.getItem(key)) {
                ap.style.display = 'none';
                return;
              }
              if (freq === 'once' && localStorage.getItem(key)) {
                ap.style.display = 'none';
                return;
              }
              var cdMap = {
                daily: 86400000,
                '1day': 86400000,
                weekly: 604800000,
                '7days': 604800000,
                monthly: 2592000000,
                '30days': 2592000000
              };
              var cdDur = cdMap[freq] || 0;
              var last = Number(localStorage.getItem(key) || 0);
              if (cdDur > 0 && last > 0 && (Date.now() - last) < cdDur) {
                ap.style.display = 'none';
                return;
              }
            }

            function markSeen() {
              if (!widgetId) return;
              var key = 'wto_ap_seen_' + widgetId;
              var nowStr = String(Date.now());
              try {
                if (freq === 'session' || dismissScope === 'session') {
                  sessionStorage.setItem(key, nowStr);
                } else {
                  localStorage.setItem(key, nowStr);
                }
              } catch(e) {}
            }

            // Triggering
            if (mode === 'popup') {
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
            var closeBtn = ap.querySelector('.wto-bar-close-btn, .wto-popup-close-btn');
            var reopenBtn = ap.querySelector('.wto-bar-reopen-btn');
            if (closeBtn) {
              closeBtn.addEventListener('click', function(e){
                e.preventDefault(); e.stopPropagation();
                ap.style.display = 'none';
                if (reopenBtn) reopenBtn.style.display = 'block';
                markSeen();
              });
            }
            if (reopenBtn) {
              reopenBtn.addEventListener('click', function(e){
                e.preventDefault(); e.stopPropagation();
                ap.style.display = 'block';
                reopenBtn.style.display = 'none';
              });
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
              var m = (colorStr || '').match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
              if (m) return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
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
          }

          // FAQ Accordion interactivity
          container.querySelectorAll('.wto-faq-container, .wto-faq-root').forEach(function(faqRoot){
            autoAdaptFaqContrast(faqRoot);
            if (faqRoot.getAttribute('data-wto-faq-init') === '1') return;
            faqRoot.setAttribute('data-wto-faq-init', '1');

            var mode = faqRoot.getAttribute('data-mode') || (faqRoot.getAttribute('data-allow-multiple') === '1' ? 'multiple' : 'single');
            var rows = Array.prototype.slice.call(faqRoot.querySelectorAll('.wto-faq-row, .wto-faq-item'));

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

            var expandAllBtn = faqRoot.querySelector('.wto-faq-expand-all, .wto-faq-expand-all-btn');
            var collapseAllBtn = faqRoot.querySelector('.wto-faq-collapse-all, .wto-faq-collapse-all-btn');
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

            var searchInput = faqRoot.querySelector('.wto-faq-search-input');
            var noRes = faqRoot.querySelector('.wto-faq-no-results, .wto-faq-empty-search');
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

            var catBtns = faqRoot.querySelectorAll('.wto-faq-cat-btn, .wto-faq-cat-tag');
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

            var showMoreBtn = faqRoot.querySelector('.wto-faq-show-more-btn');
            if (showMoreBtn) {
              showMoreBtn.addEventListener('click', function(e){
                e.preventDefault();
                rows.forEach(function(r){ r.classList.remove('wto-faq-row-hidden'); r.style.display = ''; });
                showMoreBtn.style.display = 'none';
              });
            }
          });
        }


        // Accessibility Widget Interactivity
        function initAccessibility(scope) {
          if (!scope) return;
          var roots = scope.querySelectorAll ? scope.querySelectorAll('.wto-a11y-root, [data-wto-a11y="1"]') : [];
          roots.forEach(function(root){
            if (root.getAttribute('data-wto-a11y-ready') === '1') return;
            root.setAttribute('data-wto-a11y-ready', '1');

            var widgetId = root.getAttribute('data-wto-widget') || 'default';
            var remember = root.getAttribute('data-remember') === '1';
            var hotkeyEnabled = root.getAttribute('data-hotkey') === '1';
            var storageKey = 'wto_a11y_prefs_' + (typeof window !== 'undefined' ? window.location.hostname || 'site' : 'site');

            var launcherBtn = root.querySelector('[data-a11y-action="toggle-panel"]');
            var panel = root.querySelector('.wto-a11y-panel');
            var closeBtn = root.querySelector('[data-a11y-action="close-panel"]');
            var resetBtns = root.querySelectorAll('[data-a11y-action="reset-all"]');
            var liveAnnouncer = root.querySelector('.wto-a11y-sr-announcements');
            var readingRuler = root.querySelector('.wto-a11y-reading-ruler');

            var state = {
              isOpen: false,
              textScale: Number(root.getAttribute('data-default-scale') || 100),
              activeTools: {},
              activeContrast: 'none'
            };

            function announce(msg) {
              if (liveAnnouncer) {
                liveAnnouncer.textContent = '';
                setTimeout(function(){ liveAnnouncer.textContent = msg; }, 50);
              }
            }

            function persistState() {
              if (!remember || typeof localStorage === 'undefined') return;
              try {
                var toolKeys = [];
                for (var k in state.activeTools) { if (state.activeTools[k]) toolKeys.push(k); }
                localStorage.setItem(storageKey, JSON.stringify({
                  textScale: state.textScale,
                  tools: toolKeys,
                  contrast: state.activeContrast
                }));
              } catch(_) {}
            }

            function loadPersistedState() {
              if (!remember || typeof localStorage === 'undefined') return;
              try {
                var raw = localStorage.getItem(storageKey);
                if (raw) {
                  var p = JSON.parse(raw);
                  if (typeof p.textScale === 'number') state.textScale = p.textScale;
                  if (Array.isArray(p.tools)) {
                    state.activeTools = {};
                    p.tools.forEach(function(t){ state.activeTools[t] = true; });
                  }
                  if (typeof p.contrast === 'string') state.activeContrast = p.contrast;
                }
              } catch(_) {}
            }

            function applyState() {
              var docBody = document.body;
              if (!docBody) return;

              // 1. Text Scale
              var scaleValEl = root.querySelector('[data-a11y-scale-val]');
              if (scaleValEl) scaleValEl.textContent = state.textScale + '%';

              if (state.textScale !== 100) {
                docBody.style.fontSize = state.textScale + '%';
              } else {
                docBody.style.fontSize = '';
              }

              // 2. Standard Toggles
              var toggleMap = {
                'line-spacing': 'wto-a11y-active-line-spacing',
                'letter-spacing': 'wto-a11y-active-letter-spacing',
                'readable-font': 'wto-a11y-active-readable-font',
                'highlight-headings': 'wto-a11y-active-highlight-headings',
                'highlight-links': 'wto-a11y-active-highlight-links',
                'large-cursor': 'wto-a11y-active-large-cursor',
                'reduced-motion': 'wto-a11y-active-reduced-motion'
              };

              for (var toolKey in toggleMap) {
                var className = toggleMap[toolKey];
                var isActive = !!state.activeTools[toolKey];
                if (isActive) docBody.classList.add(className);
                else docBody.classList.remove(className);

                var btn = root.querySelector('[data-a11y-tool="' + toolKey + '"]');
                if (btn) {
                  btn.classList.toggle('wto-a11y-active', isActive);
                  btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
                  var badge = btn.querySelector('.wto-a11y-badge-status');
                  if (badge) badge.textContent = isActive ? 'ON' : 'OFF';
                }
              }

              // 3. Reading Guide
              var hasGuide = !!state.activeTools['reading-guide'];
              if (readingRuler) {
                readingRuler.style.display = hasGuide ? 'block' : 'none';
              }
              var guideBtn = root.querySelector('[data-a11y-tool="reading-guide"]');
              if (guideBtn) {
                guideBtn.classList.toggle('wto-a11y-active', hasGuide);
                guideBtn.setAttribute('aria-pressed', hasGuide ? 'true' : 'false');
                var gBadge = guideBtn.querySelector('.wto-a11y-badge-status');
                if (gBadge) gBadge.textContent = hasGuide ? 'ON' : 'OFF';
              }

              // 4. Contrast Modes
              docBody.classList.remove('wto-a11y-active-high-contrast', 'wto-a11y-active-inverted', 'wto-a11y-active-monochrome');
              if (state.activeContrast === 'high-contrast') docBody.classList.add('wto-a11y-active-high-contrast');
              if (state.activeContrast === 'inverted') docBody.classList.add('wto-a11y-active-inverted');
              if (state.activeContrast === 'monochrome') docBody.classList.add('wto-a11y-active-monochrome');

              ['high-contrast', 'inverted', 'monochrome'].forEach(function(m){
                var cBtn = root.querySelector('[data-a11y-contrast="' + m + '"]');
                if (cBtn) {
                  var isC = state.activeContrast === m;
                  cBtn.classList.toggle('wto-a11y-active', isC);
                  cBtn.setAttribute('aria-pressed', isC ? 'true' : 'false');
                  var cBadge = cBtn.querySelector('.wto-a11y-badge-status');
                  if (cBadge) cBadge.textContent = isC ? 'ON' : 'OFF';
                }
              });
            }

            function setPanelOpen(open) {
              state.isOpen = open;
              if (panel) panel.classList.toggle('wto-a11y-hidden', !open);
              if (launcherBtn) launcherBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
              if (open) {
                var first = panel ? panel.querySelector('button, [tabindex="0"]') : null;
                if (first) first.focus();
                announce('Accessibility menu opened.');
              } else {
                if (launcherBtn) launcherBtn.focus();
                announce('Accessibility menu closed.');
              }
            }

            function resetAll() {
              state.textScale = 100;
              state.activeTools = {};
              state.activeContrast = 'none';
              applyState();
              persistState();
              announce('All accessibility adjustments reset to default.');
            }

            if (launcherBtn) {
              launcherBtn.addEventListener('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                setPanelOpen(!state.isOpen);
              });
            }

            if (closeBtn) {
              closeBtn.addEventListener('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                setPanelOpen(false);
              });
            }

            resetBtns.forEach(function(btn){
              btn.addEventListener('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                resetAll();
              });
            });

            root.querySelectorAll('[data-a11y-action="save-preferences"]').forEach(function(btn){
              btn.addEventListener('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                persistState();
                btn.classList.add('wto-a11y-saved');
                var lbl = btn.querySelector('.wto-a11y-save-label');
                var icn = btn.querySelector('.wto-a11y-save-icon');
                if (lbl) lbl.textContent = 'Saved';
                if (icn) icn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
                announce('Preferences saved successfully');
                setTimeout(function(){
                  btn.classList.remove('wto-a11y-saved');
                  if (lbl) lbl.textContent = 'Save';
                  if (icn) icn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>';
                }, 2500);
              });
            });

            var incBtn = root.querySelector('[data-a11y-action="text-increase"]');
            if (incBtn) {
              incBtn.addEventListener('click', function(e){
                e.preventDefault();
                if (state.textScale < 160) {
                  state.textScale = Math.min(160, state.textScale + 10);
                  applyState();
                  persistState();
                  announce('Text size increased to ' + state.textScale + ' percent');
                }
              });
            }

            var decBtn = root.querySelector('[data-a11y-action="text-decrease"]');
            if (decBtn) {
              decBtn.addEventListener('click', function(e){
                e.preventDefault();
                if (state.textScale > 80) {
                  state.textScale = Math.max(80, state.textScale - 10);
                  applyState();
                  persistState();
                  announce('Text size decreased to ' + state.textScale + ' percent');
                }
              });
            }

            var resTextBtn = root.querySelector('[data-a11y-action="text-reset"]');
            if (resTextBtn) {
              resTextBtn.addEventListener('click', function(e){
                e.preventDefault();
                state.textScale = 100;
                applyState();
                persistState();
                announce('Text size reset to 100 percent');
              });
            }

            root.querySelectorAll('[data-a11y-tool]').forEach(function(btn){
              btn.addEventListener('click', function(e){
                e.preventDefault();
                var toolKey = btn.getAttribute('data-a11y-tool');
                if (!toolKey) return;
                if (state.activeTools[toolKey]) {
                  delete state.activeTools[toolKey];
                  announce(toolKey.replace('-', ' ') + ' disabled.');
                } else {
                  state.activeTools[toolKey] = true;
                  announce(toolKey.replace('-', ' ') + ' enabled.');
                }
                applyState();
                persistState();
              });
            });

            root.querySelectorAll('[data-a11y-contrast]').forEach(function(btn){
              btn.addEventListener('click', function(e){
                e.preventDefault();
                var cMode = btn.getAttribute('data-a11y-contrast');
                if (!cMode) return;
                if (state.activeContrast === cMode) {
                  state.activeContrast = 'none';
                  announce('Normal contrast restored.');
                } else {
                  state.activeContrast = cMode;
                  announce(cMode.replace('-', ' ') + ' enabled.');
                }
                applyState();
                persistState();
              });
            });

            window.addEventListener('mousemove', function(e){
              if (state.activeTools['reading-guide'] && readingRuler) {
                readingRuler.style.top = e.clientY + 'px';
              }
            }, { passive: true });

            window.addEventListener('keydown', function(e){
              if (e.key === 'Escape' && state.isOpen) {
                e.preventDefault();
                setPanelOpen(false);
              }
              if (hotkeyEnabled && e.altKey && (e.key === 'a' || e.key === 'A')) {
                e.preventDefault();
                setPanelOpen(!state.isOpen);
              }
            });

            document.addEventListener('click', function(e){
              if (!state.isOpen) return;
              if (root && !root.contains(e.target)) {
                setPanelOpen(false);
              }
            });

            loadPersistedState();
            applyState();
          });
        }

        // Render standalone Accessibility Widget
        function renderAccessibilityStandalone(widget) {
          if (!widget || widget.enabled === false) return;
          var widgetId = widget.id || 'wgt_acc_' + Math.random().toString(36).slice(2, 8);
          var cleanId = widgetId.replace(/[^a-zA-Z0-9_-]/g, '');
          var cls = 'wto-a11y-' + cleanId;

          if (document.querySelector('.' + cls)) return;

          var cfg = widget.config || {};
          var app = cfg.appearance || {};
          var feat = cfg.features || {};
          var beh = cfg.behavior || {};

          var isLeft = app.position === 'bottom_left' || app.position === 'top_left';
          var isTop = app.position === 'top_left' || app.position === 'top_right';
          var offsetX = Number(app.offsetX) || 24;
          var offsetY = Number(app.offsetY) || 24;
          var btnSize = Number(app.buttonSize) || 56;
          var iconSize = Number(app.iconSize) || 28;
          var panelWidth = Number(app.panelWidth) || 360;
          var bg = app.backgroundColor || '#0f172a';
          var text = app.textColor || '#f8fafc';
          var accent = app.accentColor || '#38bdf8';
          var cardBg = app.cardBgColor || '#1e293b';
          var bRadius = Number(app.borderRadius) !== undefined ? Number(app.borderRadius) : 16;
          var btnLabel = app.buttonLabel || 'Accessibility';
          var isPill = app.displayStyle === 'floating_icon_with_label';

          var a11ySvg = '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:block;"><circle cx="12" cy="4.5" r="2.5"/><path d="m18 8.5-6 1-6-1"/><path d="M12 9.5v7"/><path d="m9 21.5 3-5 3 5"/></svg>';
          var resetSvg = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>';
          var closeSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

          var styleEl = document.createElement('style');
          styleEl.textContent = [
            '.' + cls + '.wto-a11y-root { position: fixed !important; ' + (isTop ? 'top:' + offsetY + 'px !important;' : 'bottom:' + offsetY + 'px !important;') + ' ' + (isLeft ? 'left:' + offsetX + 'px !important;' : 'right:' + offsetX + 'px !important;') + ' z-index: 2147483647 !important; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; font-size: 13px; line-height: 1.4; color: ' + text + '; opacity: 1 !important; display: block !important; pointer-events: none !important; }',
            '.' + cls + ' * { box-sizing: border-box; margin: 0; padding: 0; font-family: inherit; }',
            '.' + cls + ' .wto-a11y-launcher-btn { pointer-events: auto !important; z-index: 2147483647 !important; display: inline-flex; align-items: center; justify-content: center; gap: 10px; background-color: ' + bg + '; color: ' + text + '; border: 1.5px solid ' + accent + '; border-radius: ' + (isPill ? '9999px' : bRadius + 'px') + '; min-width: ' + btnSize + 'px; height: ' + btnSize + 'px; padding: ' + (isPill ? '0 18px' : '0') + '; cursor: pointer; box-shadow: 0 8px 28px rgba(0,0,0,0.28); transition: transform 0.2s cubic-bezier(0.16,1,0.3,1); outline: none; position: relative; user-select: none; }',
            '.' + cls + ' .wto-a11y-launcher-btn:hover { transform: scale(1.05); filter: brightness(1.1); }',
            '.' + cls + ' .wto-a11y-launcher-btn:focus-visible { outline: 3px solid ' + accent + ' !important; outline-offset: 3px !important; }',
            '.' + cls + ' .wto-a11y-launcher-icon { width: ' + iconSize + 'px; height: ' + iconSize + 'px; color: ' + accent + '; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }',
            '.' + cls + ' .wto-a11y-launcher-label { font-size: 13px; font-weight: 700; color: ' + text + '; white-space: nowrap; }',
            '.' + cls + ' .wto-a11y-panel { pointer-events: auto !important; z-index: 2147483647 !important; position: absolute; ' + (isTop ? 'top: calc(100% + 12px);' : 'bottom: calc(100% + 12px);') + ' ' + (isLeft ? 'left: 0;' : 'right: 0;') + ' width: min(calc(100vw - 28px), ' + Math.max(380, panelWidth || 420) + 'px); max-height: min(calc(100vh - 90px), 640px) !important; background-color: ' + bg + '; color: ' + text + '; border: 1px solid ' + (bg === '#ffffff' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.14)') + '; border-radius: ' + bRadius + 'px; box-shadow: 0 14px 44px rgba(0,0,0,0.45); display: flex; flex-direction: column; overflow: hidden; transform-origin: ' + (isTop ? (isLeft ? 'top left' : 'top right') : (isLeft ? 'bottom left' : 'bottom right')) + '; transition: opacity 0.22s cubic-bezier(0.16,1,0.3,1), transform 0.22s cubic-bezier(0.16,1,0.3,1), visibility 0.22s; }',
            '.' + cls + ' .wto-a11y-panel.wto-a11y-hidden { opacity: 0; visibility: hidden; pointer-events: none; transform: scale(0.94) translateY(' + (isTop ? '-10px' : '10px') + '); }',
            '.' + cls + ' .wto-a11y-header { padding: 16px 20px; border-bottom: 1px solid ' + (bg === '#ffffff' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)') + '; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: ' + (bg === '#ffffff' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)') + '; flex-shrink: 0; }',
            '.' + cls + ' .wto-a11y-title-wrap { display: flex; align-items: center; gap: 10px; }',
            '.' + cls + ' .wto-a11y-header-icon { width: 24px; height: 24px; color: ' + accent + '; }',
            '.' + cls + ' .wto-a11y-title { font-size: 16px; font-weight: 800; color: ' + text + '; }',
            '.' + cls + ' .wto-a11y-btn-reset-header { background: ' + (bg === '#ffffff' ? '#ffffff' : 'rgba(255,255,255,0.08)') + '; border: 1px solid ' + (bg === '#ffffff' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.18)') + '; color: ' + text + '; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }',
            '.' + cls + ' .wto-a11y-btn-close { background: transparent; border: none; color: ' + text + '; opacity: 0.75; cursor: pointer; padding: 6px; border-radius: 8px; display: flex; }',
            '.' + cls + ' .wto-a11y-body { padding: 18px 20px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 18px; }',
            '.' + cls + ' .wto-a11y-section-title { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ' + accent + '; margin-bottom: 10px; }',
            '.' + cls + ' .wto-a11y-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }',
            '.' + cls + ' .wto-a11y-tool-btn { background: ' + cardBg + '; border: 1.5px solid ' + (bg === '#ffffff' ? 'rgba(0,0,0,0.09)' : 'rgba(255,255,255,0.1)') + '; border-radius: 12px; padding: 13px 14px; color: ' + text + '; text-align: left; cursor: pointer; display: flex; flex-direction: column; gap: 8px; }',
            '.' + cls + ' .wto-a11y-tool-btn:hover { border-color: ' + (bg === '#ffffff' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.3)') + '; }',
            '.' + cls + ' .wto-a11y-tool-btn.wto-a11y-active { background: ' + accent + '22; border-color: ' + accent + '; color: ' + accent + '; }',
            '.' + cls + ' .wto-a11y-tool-top { display: flex; align-items: center; justify-content: space-between; width: 100%; }',
            '.' + cls + ' .wto-a11y-badge-status { font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 5px; background: ' + (bg === '#ffffff' ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.12)') + '; color: ' + (bg === '#ffffff' ? '#475569' : '#e2e8f0') + '; }',
            '.' + cls + ' .wto-a11y-tool-btn.wto-a11y-active .wto-a11y-badge-status { background: ' + accent + '; color: #0f172a; }',
            '.' + cls + ' .wto-a11y-tool-label { font-size: 13px; font-weight: 700; line-height: 1.35; color: ' + text + ' !important; }',
            '.' + cls + ' .wto-a11y-scale-bar { grid-column: 1 / -1; background: ' + cardBg + '; border: 1.5px solid ' + (bg === '#ffffff' ? 'rgba(0,0,0,0.09)' : 'rgba(255,255,255,0.1)') + '; border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; }',
            '.' + cls + ' .wto-a11y-scale-title { font-size: 13px; font-weight: 700; color: ' + text + '; }',
            '.' + cls + ' .wto-a11y-scale-value { font-size: 12px; color: ' + accent + '; font-weight: 800; font-family: monospace; }',
            '.' + cls + ' .wto-a11y-scale-controls { display: flex; align-items: center; gap: 8px; }',
            '.' + cls + ' .wto-a11y-scale-btn { width: 34px; height: 34px; border-radius: 8px; background: ' + (bg === '#ffffff' ? '#ffffff' : 'rgba(255,255,255,0.1)') + '; border: 1px solid ' + (bg === '#ffffff' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)') + '; color: ' + text + '; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; cursor: pointer; }',
            '.' + cls + ' .wto-a11y-footer { padding: 12px 18px; border-top: 1px solid ' + (bg === '#ffffff' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.09)') + '; background: ' + (bg === '#ffffff' ? '#f1f5f9' : 'rgba(0,0,0,0.32)') + '; flex-shrink: 0; }',
            '.' + cls + ' .wto-a11y-footer-actions { display: flex; align-items: center; gap: 10px; width: 100%; }',
            '.' + cls + ' .wto-a11y-btn-save-full { flex: 1; height: 44px; background: ' + accent + '; color: #ffffff; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s ease; box-shadow: 0 4px 14px rgba(0,0,0,0.25); user-select: none; }',
            '.' + cls + ' .wto-a11y-btn-save-full:hover { filter: brightness(1.1); transform: translateY(-1px); }',
            '.' + cls + ' .wto-a11y-btn-save-full.wto-a11y-saved { background: #10b981 !important; }',
            '.' + cls + ' .wto-a11y-btn-clear-footer { height: 44px; padding: 0 16px; background: ' + (bg === '#ffffff' ? '#ffffff' : 'rgba(255,255,255,0.08)') + '; border: 1.5px solid ' + (bg === '#ffffff' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.18)') + '; color: ' + text + '; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.15s ease; white-space: nowrap; user-select: none; }',
            '.' + cls + ' .wto-a11y-btn-clear-footer:hover { background: rgba(125,125,125,0.15); }',
            '.' + cls + ' .wto-a11y-sr-announcements { position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }',
            'body.wto-a11y-active-line-spacing *:not(.wto-a11y-root, .wto-a11y-root *) { line-height: 1.85 !important; }',
            'body.wto-a11y-active-letter-spacing *:not(.wto-a11y-root, .wto-a11y-root *) { letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }',
            'body.wto-a11y-active-readable-font *:not(.wto-a11y-root, .wto-a11y-root *) { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; }',
            'body.wto-a11y-active-highlight-headings :is(h1,h2,h3,h4,h5,h6,[role="heading"]):not(.wto-a11y-root, .wto-a11y-root *) { outline: 2px dashed #f59e0b !important; outline-offset: 3px !important; background-color: rgba(245,158,11,0.12) !important; }',
            'body.wto-a11y-active-highlight-links :is(a,[role="link"]):not(.wto-a11y-root, .wto-a11y-root *) { text-decoration: underline 3px #38bdf8 !important; text-underline-offset: 4px !important; background-color: rgba(56,189,248,0.14) !important; font-weight: 600 !important; }',
            'body.wto-a11y-active-high-contrast { background-color: #000000 !important; color: #ffffff !important; }',
            'body.wto-a11y-active-high-contrast *:not(.wto-a11y-root, .wto-a11y-root *) { background-color: #000000 !important; color: #ffff00 !important; border-color: #ffffff !important; box-shadow: none !important; }',
            'body.wto-a11y-active-inverted { filter: invert(1) hue-rotate(180deg) !important; background-color: #ffffff !important; }',
            'body.wto-a11y-active-inverted .wto-a11y-root { filter: invert(1) hue-rotate(180deg) !important; }',
            'body.wto-a11y-active-monochrome { filter: grayscale(100%) !important; }',
            'body.wto-a11y-active-monochrome .wto-a11y-root { filter: none !important; }',
            'body.wto-a11y-active-large-cursor, body.wto-a11y-active-large-cursor * { cursor: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'38\' height=\'38\' viewBox=\'0 0 24 24\' fill=\'%23000000\' stroke=\'%23ffffff\' stroke-width=\'2\'%3E%3Cpath d=\'M3 3l7 18 3-7 7-3L3 3z\'/%3E%3C/svg%3E"), auto !important; }',
            'body.wto-a11y-active-reduced-motion *, body.wto-a11y-active-reduced-motion *::before, body.wto-a11y-active-reduced-motion *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }',
            '.wto-a11y-reading-ruler { position: fixed; left: 0; right: 0; width: 100vw; height: 4px; background: linear-gradient(90deg, #38bdf8, #f59e0b, #38bdf8); box-shadow: 0 0 16px rgba(56,189,248,0.6), 0 2px 8px rgba(0,0,0,0.4); z-index: 2147483630; pointer-events: none; }'
          ].join('\n');
          document.head.appendChild(styleEl);

          var rootEl = document.createElement('div');
          rootEl.className = 'wto-a11y-root ' + cls;
          rootEl.setAttribute('data-wto-a11y', '1');
          rootEl.setAttribute('data-wto-widget', widgetId);
          rootEl.setAttribute('data-default-scale', String(beh.defaultTextScale || 100));
          rootEl.setAttribute('data-default-contrast', beh.defaultContrast || 'none');
          rootEl.setAttribute('data-remember', beh.rememberPreferences !== false ? '1' : '0');
          rootEl.setAttribute('data-hotkey', beh.hotkeyEnabled !== false ? '1' : '0');
          rootEl.setAttribute('role', 'region');
          rootEl.setAttribute('aria-label', 'Website Accessibility Toolbar');

          rootEl.innerHTML = [
            '<button type="button" class="wto-a11y-launcher-btn" data-a11y-action="toggle-panel" aria-expanded="false" aria-haspopup="dialog" aria-label="Open Accessibility Toolbar">',
            '  <span class="wto-a11y-launcher-icon">' + a11ySvg + '</span>',
            (isPill ? '  <span class="wto-a11y-launcher-label">' + btnLabel + '</span>' : ''),
            '</button>',
            '<div class="wto-a11y-panel wto-a11y-hidden" role="dialog" aria-label="Accessibility Settings">',
            '  <div class="wto-a11y-header">',
            '    <div class="wto-a11y-title-wrap"><span class="wto-a11y-header-icon">' + a11ySvg + '</span><h3 class="wto-a11y-title">Accessibility Tools</h3></div>',
            '    <div style="display:flex;align-items:center;gap:8px;">',
            '      <button type="button" class="wto-a11y-btn-reset-header" data-a11y-action="reset-all" title="Reset all">' + resetSvg + '<span>Reset</span></button>',
            '      <button type="button" class="wto-a11y-btn-close" data-a11y-action="close-panel" aria-label="Close">' + closeSvg + '</button>',
            '    </div>',
            '  </div>',
            '  <div class="wto-a11y-body">',
            '    <div>',
            '      <div class="wto-a11y-section-title">Text &amp; Readability</div>',
            '      <div class="wto-a11y-grid">',
            '        <div class="wto-a11y-scale-bar">',
            '          <div><div class="wto-a11y-scale-title">Text Size</div><div class="wto-a11y-scale-value" data-a11y-scale-val>100%</div></div>',
            '          <div class="wto-a11y-scale-controls">',
            '            <button type="button" class="wto-a11y-scale-btn" data-a11y-action="text-decrease" aria-label="Decrease font size">−</button>',
            '            <button type="button" class="wto-a11y-scale-btn" data-a11y-action="text-reset" aria-label="Reset font size">A</button>',
            '            <button type="button" class="wto-a11y-scale-btn" data-a11y-action="text-increase" aria-label="Increase font size">+</button>',
            '          </div>',
            '        </div>',
            '        <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="line-spacing"><div class="wto-a11y-tool-top"><span>↕</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">Line Spacing</span></button>',
            '        <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="letter-spacing"><div class="wto-a11y-tool-top"><span>↔</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">Letter Spacing</span></button>',
            '        <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="readable-font"><div class="wto-a11y-tool-top"><span>Aa</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">Readable Font</span></button>',
            '        <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="highlight-headings"><div class="wto-a11y-tool-top"><span>H</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">Highlight Headings</span></button>',
            '        <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="highlight-links"><div class="wto-a11y-tool-top"><span>🔗</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">Highlight Links</span></button>',
            '        <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="reading-guide"><div class="wto-a11y-tool-top"><span>―</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">Reading Guide</span></button>',
            '        <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="large-cursor"><div class="wto-a11y-tool-top"><span>↗</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">Large Cursor</span></button>',
            '      </div>',
            '    </div>',
            '    <div>',
            '      <div class="wto-a11y-section-title">Contrast &amp; Colors</div>',
            '      <div class="wto-a11y-grid">',
            '        <button type="button" class="wto-a11y-tool-btn" data-a11y-contrast="high-contrast"><div class="wto-a11y-tool-top"><span>◐</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">High Contrast</span></button>',
            '        <button type="button" class="wto-a11y-tool-btn" data-a11y-contrast="inverted"><div class="wto-a11y-tool-top"><span>◑</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">Invert Colors</span></button>',
            '        <button type="button" class="wto-a11y-tool-btn" data-a11y-contrast="monochrome"><div class="wto-a11y-tool-top"><span>●</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">Monochrome</span></button>',
            '        <button type="button" class="wto-a11y-tool-btn" data-a11y-tool="reduced-motion"><div class="wto-a11y-tool-top"><span>⏸</span><span class="wto-a11y-badge-status">OFF</span></div><span class="wto-a11y-tool-label">Stop Motion</span></button>',
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
            '<div class="wto-a11y-sr-announcements" aria-live="polite" aria-atomic="true"></div>',
            '<div class="wto-a11y-reading-ruler" aria-hidden="true" style="display:none;"></div>'
          ].join('\n');

          document.body.appendChild(rootEl);
          initAccessibility(rootEl);
        }

        // WhatsApp Chat Interactivity
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
          var local = null;
          try {
            var raw = localStorage.getItem('wto_dynamic_widgets_v1');
            if (!raw && typeof window !== 'undefined' && window.parent && window.parent !== window) {
              try { raw = window.parent.localStorage.getItem('wto_dynamic_widgets_v1'); } catch(ep) {}
            }
            if (raw) {
              var all = JSON.parse(raw);
              if (all && all[widgetId]) local = all[widgetId];
            }
          } catch(elocal) {}

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
                    var r = localStorage.getItem('wto_dynamic_widgets_v1') || '{}';
                    var a = JSON.parse(r);
                    a[widgetId] = unwrapped;
                    localStorage.setItem('wto_dynamic_widgets_v1', JSON.stringify(a));
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

          var pos = appearance.position === 'left' ? 'left' : 'right';
          var isLeft = pos === 'left';
          var offsetX = Number(appearance.offsetX) || 24;
          var offsetY = Number(appearance.offsetY) || 24;
          var btnSize = Number(appearance.buttonSize) || 56;
          var iconSize = Number(appearance.iconSize) || 26;
          var panelWidth = Number(appearance.panelWidth) || 380;
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
            '  bottom: ' + offsetY + 'px !important;',
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
            '  bottom: ' + (offsetY + btnSize + 14) + 'px !important;',
            '  ' + (isLeft ? 'left: ' + offsetX + 'px !important;' : 'right: ' + offsetX + 'px !important;'),
            '  width: ' + panelWidth + 'px;',
            '  max-width: calc(100vw - 32px);',
            '  max-height: calc(100vh - ' + (offsetY + btnSize + 32) + 'px);',
            '  background: ' + bgColor + ';',
            '  color: ' + textColor + ';',
            '  border: 1px solid rgba(255,255,255,0.12);',
            '  border-radius: ' + borderRadius + 'px;',
            '  box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06);',
            '  display: flex;',
            '  flex-direction: column;',
            '  overflow: hidden;',
            '  z-index: 2147483647 !important;',
            '  animation: wtoA11yFadeIn 0.2s cubic-bezier(0.16,1,0.3,1);',
            '}',
            '@keyframes wtoA11yFadeIn { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }',
            '.' + cls + ' .wto-a11y-header { padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.2); }',
            '.' + cls + ' .wto-a11y-title-wrap { display: flex; align-items: center; gap: 10px; }',
            '.' + cls + ' .wto-a11y-title { font-size: 15px; font-weight: 700; color: #ffffff; margin: 0; }',
            '.' + cls + ' .wto-a11y-btn-close { background: transparent; border: none; color: #94a3b8; cursor: pointer; padding: 6px; border-radius: 8px; display: flex; }',
            '.' + cls + ' .wto-a11y-btn-close:hover { color: #ffffff; background: rgba(255,255,255,0.1); }',
            '.' + cls + ' .wto-a11y-btn-reset-header { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; padding: 5px 10px; border-radius: 6px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; cursor: pointer; }',
            '.' + cls + ' .wto-a11y-btn-reset-header:hover { background: rgba(255,255,255,0.15); color: #ffffff; }',
            '.' + cls + ' .wto-a11y-body { padding: 18px 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 18px; max-height: calc(80vh - 120px); }',
            '.' + cls + ' .wto-a11y-section-title { font-size: 12px; font-weight: 700; color: ' + primColor + '; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }',
            '.' + cls + ' .wto-a11y-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }',
            '.' + cls + ' .wto-a11y-scale-bar { grid-column: span 2; display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: ' + cardBg + '; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; }',
            '.' + cls + ' .wto-a11y-scale-btn { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: #ffffff; font-weight: 700; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }',
            '.' + cls + ' .wto-a11y-scale-btn:hover { background: ' + primColor + '; }',
            '.' + cls + ' .wto-a11y-tool-btn { padding: 10px 12px; background: ' + cardBg + '; border: 1.5px solid rgba(255,255,255,0.08); border-radius: 10px; color: ' + textColor + '; text-align: left; cursor: pointer; display: flex; flex-direction: column; gap: 6px; transition: all 0.15s ease; }',
            '.' + cls + ' .wto-a11y-tool-btn:hover { border-color: rgba(255,255,255,0.25); transform: translateY(-1px); }',
            '.' + cls + ' .wto-a11y-tool-btn[aria-pressed="true"], .' + cls + ' .wto-a11y-tool-btn.wto-a11y-active { border-color: ' + primColor + ' !important; background: rgba(59,130,246,0.18) !important; color: #ffffff !important; box-shadow: 0 0 14px rgba(59,130,246,0.3) !important; }',
            '.' + cls + ' .wto-a11y-tool-top { display: flex; align-items: center; justify-content: space-between; width: 100%; }',
            '.' + cls + ' .wto-a11y-badge-status { font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: rgba(0,0,0,0.3); color: #94a3b8; }',
            '.' + cls + ' .wto-a11y-tool-btn[aria-pressed="true"] .wto-a11y-badge-status { background: ' + primColor + '; color: #ffffff; }',
            '.' + cls + ' .wto-a11y-tool-label { font-size: 11px; font-weight: 600; line-height: 1.2; }',
            '.' + cls + ' .wto-a11y-footer { padding: 12px 18px; border-top: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.2); font-size: 10px; color: #64748b; line-height: 1.4; }',
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
            'body.wto-a11y-active-large-cursor, body.wto-a11y-active-large-cursor * { cursor: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'38\' height=\'38\' viewBox=\'0 0 24 24\' fill=\'%23000000\' stroke=\'%23ffffff\' stroke-width=\'2\'%3E%3Cpath d=\'M3 3l7 18 3-7 7-3L3 3z\'/%3E%3C/svg%3E"), auto !important; }',
            'body.wto-a11y-active-reduced-motion *, body.wto-a11y-active-reduced-motion *::before, body.wto-a11y-active-reduced-motion *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }',
            '.wto-a11y-reading-ruler { position: fixed; left: 0; right: 0; width: 100vw; height: 4px; background: linear-gradient(90deg, #38bdf8, #f59e0b, #38bdf8); box-shadow: 0 0 16px rgba(56,189,248,0.6); z-index: 2147483630; pointer-events: none; }'
          ].join('\n');
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
            '    <p style="margin:0;">Assistive toolbar for personalized visual and reading comfort.</p>',
            '  </div>',
            '</div>',
            '<div class="wto-a11y-reading-ruler" style="display:none;" aria-hidden="true"></div>',
            '<div class="wto-a11y-sr-announcements" aria-live="polite" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);"></div>'
          ].join('\n');

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
          ].join('\n');
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
            ].join('\n');
          }

          // Greeting bubble markup
          if (showGreetingBubble && layoutStyle !== 'contact_card') {
            innerHtml += [
              '<div class="wto-wa-bubble">',
              '  <div style="flex:1;">' + safeTxt(greetingText) + '</div>',
              '  <button class="wto-wa-bubble-close" data-wa-action="dismiss-bubble" aria-label="Close">' + closeIconSvg + '</button>',
              '</div>'
            ].join('\n');
          }

          // Button markup
          if (layoutStyle === 'contact_card') {
            innerHtml += [
              '<button type="button" class="wto-wa-btn" data-wa-action="toggle-card" aria-label="WhatsApp Chat">',
              '  <span class="wto-wa-btn-icon">' + waIconSvg + '</span>',
              (borderRadius < 30 || btnLabel !== 'Chat with Us' ? '  <span class="wto-wa-btn-label">' + safeTxt(btnLabel) + '</span>' : ''),
              '</button>'
            ].join('\n');
          } else {
            innerHtml += [
              '<a href="' + waUrl + '" class="wto-wa-btn" data-wa-action="open-wa" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Chat">',
              '  <span class="wto-wa-btn-icon">' + waIconSvg + '</span>',
              (borderRadius < 30 || btnLabel !== 'Chat with Us' ? '  <span class="wto-wa-btn-label">' + safeTxt(btnLabel) + '</span>' : ''),
              '</a>'
            ].join('\n');
          }

          rootEl.innerHTML = innerHtml;
          document.body.appendChild(rootEl);
          initWhatsAppChat(rootEl);
        }

        function initLanguageSwitcher(scope) {
          var root = scope && scope.classList && scope.classList.contains('wto-lang-root')
            ? scope
            : (scope ? scope.querySelector('.wto-lang-root') : document.querySelector('.wto-lang-root'));
          if (!root) return;
          if (root.getAttribute('data-wto-lang-init') === '1') return;
          root.setAttribute('data-wto-lang-init', '1');

          var widgetId = root.getAttribute('data-widget-id') || '';
          var trigger = root.querySelector('.wto-lang-trigger');
          var searchInput = root.querySelector('.wto-lang-search-input');
          var items = Array.prototype.slice.call(root.querySelectorAll('.wto-lang-item, .wto-lang-pill-btn'));
          var storageKey = 'wto_lang_pref_' + widgetId;

          function toggle(open) {
            var isOpen = root.classList.contains('wto-open');
            var next = typeof open === 'boolean' ? open : !isOpen;
            root.classList.toggle('wto-open', next);
            if (trigger) trigger.setAttribute('aria-expanded', next ? 'true' : 'false');
            if (next && searchInput) {
              setTimeout(function(){ searchInput.focus(); }, 60);
            }
          }

          if (trigger) {
            trigger.addEventListener('click', function(e){
              e.preventDefault();
              e.stopPropagation();
              toggle();
            });
          }

          document.addEventListener('click', function(e){
            if (!root.contains(e.target)) {
              toggle(false);
            }
          });

          document.addEventListener('keydown', function(e){
            if (e.key === 'Escape' && root.classList.contains('wto-open')) {
              toggle(false);
              if (trigger) trigger.focus();
            }
          });

          if (searchInput) {
            searchInput.addEventListener('input', function(){
              var q = searchInput.value.toLowerCase().trim();
              items.forEach(function(item){
                var name = (item.getAttribute('data-lang-name') || '').toLowerCase();
                var nativeName = (item.getAttribute('data-lang-native') || '').toLowerCase();
                var code = (item.getAttribute('data-lang-code') || '').toLowerCase();
                var match = !q || name.indexOf(q) !== -1 || nativeName.indexOf(q) !== -1 || code.indexOf(q) !== -1;
                item.style.display = match ? 'flex' : 'none';
              });
            });
          }

          items.forEach(function(item){
            item.addEventListener('click', function(e){
              e.preventDefault();
              var code = item.getAttribute('data-lang-code');
              var url = item.getAttribute('data-lang-url');
              if (code && typeof localStorage !== 'undefined') {
                try { localStorage.setItem(storageKey, code); } catch(err){}
              }
              toggle(false);
              if (url && url !== '#' && url !== '') {
                window.location.href = url;
              }
            });
          });

          // Browser language detection and preference checking
          try {
            var detectBrowser = root.getAttribute('data-detect-browser') === '1';
            var autoRedirect = root.getAttribute('data-auto-redirect') === '1';
            var remember = root.getAttribute('data-remember-pref') === '1';
            var storedCode = remember && typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : null;
            var targetUrl = null;

            if (storedCode) {
              var matchItem = root.querySelector('[data-lang-code="' + storedCode + '"]');
              if (matchItem) {
                targetUrl = matchItem.getAttribute('data-lang-url');
              }
            } else if (detectBrowser && navigator.languages) {
              for (var i = 0; i < navigator.languages.length; i++) {
                var bl = navigator.languages[i].toLowerCase();
                var bSimple = bl.split('-')[0];
                var found = root.querySelector('[data-lang-code="' + bl + '"], [data-lang-code="' + bSimple + '"]');
                if (found) {
                  targetUrl = found.getAttribute('data-lang-url');
                  break;
                }
              }
            }

            if (autoRedirect && targetUrl && targetUrl !== '#' && targetUrl !== '') {
              var curHref = window.location.href;
              var curPath = window.location.pathname;
              var loop = curHref === targetUrl || curPath === targetUrl || (targetUrl.indexOf('/') === 0 && curPath.indexOf(targetUrl) === 0);
              if (!loop) {
                window.location.href = targetUrl;
              }
            }
          } catch(err){}
        }

        function renderLanguageSwitcherStandalone(widget, targetContainer) {
          if (!widget || widget.enabled === false) return;
          var widgetId = widget.id || 'wgt_lang_' + Math.random().toString(36).slice(2, 8);
          var cleanId = widgetId.replace(/[^a-zA-Z0-9_-]/g, '');
          var cls = 'wto-lang-' + cleanId;

          if (document.querySelector('.' + cls)) {
            return;
          }

          var cfg = widget.config || {};
          var app = cfg.appearance || {};
          var beh = cfg.behavior || {};
          var langs = (Array.isArray(cfg.languages) && cfg.languages.length > 0) ? cfg.languages.filter(function(l){ return l.enabled !== false; }) : [
            { id: 'en', code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', url: '/', isDefault: true }
          ];

          var defaultLang = langs[0];
          for (var i = 0; i < langs.length; i++) {
            if (langs[i].isDefault) { defaultLang = langs[i]; break; }
          }

          var layout = app.layout || 'globe_dropdown';
          var isFloating = layout === 'floating_selector';
          var isPills = layout === 'horizontal_pills';
          var isBottomSheet = layout === 'compact_bottom_sheet';
          var isMinimalText = layout === 'minimal_text';

          var fontSize = Number(app.fontSize) || 14;
          var paddingX = Number(app.paddingX) || 14;
          var paddingY = Number(app.paddingY) || 8;
          var borderRadius = Number.isFinite(app.borderRadius) ? app.borderRadius : 10;
          var dropdownRadius = Number.isFinite(app.dropdownBorderRadius) ? app.dropdownBorderRadius : 12;
          var dropdownWidth = Number(app.dropdownWidth) || 220;

          var bgColor = app.backgroundColor || '#18181b';
          var textColor = app.textColor || '#f4f4f5';
          var borderColor = app.borderColor || '#27272a';
          var hoverBg = app.hoverBackgroundColor || '#27272a';
          var activeItemBg = app.activeItemBackgroundColor || 'rgba(56,189,248,0.12)';
          var activeItemText = app.activeItemTextColor || '#38bdf8';
          var accentColor = app.accentColor || '#38bdf8';
          var dropdownBg = app.dropdownBackgroundColor || '#18181b';
          var dropdownText = app.dropdownTextColor || '#f4f4f5';
          var dropdownBorder = app.dropdownBorderColor || '#27272a';
          var dropdownShadow = app.dropdownShadow || '0 10px 25px -5px rgba(0,0,0,0.5)';

          var isLeft = (app.floatingPosition || 'bottom_right') === 'bottom_left';
          var offsetX = Number(app.floatingOffsetX) || 20;
          var offsetY = Number(app.floatingOffsetY) || 20;

          var globeSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:middle;"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>';
          var chevronSvg = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:middle;"><path d="m6 9 6 6 6-6"/></svg>';
          var checkSvg = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

          function safe(s){ return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

          var css = [
            '.' + cls + ' {',
            '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;',
            '  font-size: ' + fontSize + 'px;',
            '  box-sizing: border-box;',
            '  user-select: none;',
            (isFloating ? '  position: fixed; bottom: ' + offsetY + 'px; ' + (isLeft ? 'left: ' + offsetX + 'px;' : 'right: ' + offsetX + 'px;') + ' z-index: 99999;' : '  position: relative; display: inline-block;'),
            '}',
            '.' + cls + ' * { box-sizing: border-box; }',
            '.' + cls + ' .wto-lang-trigger {',
            '  display: inline-flex; align-items: center; justify-content: center; gap: 8px;',
            '  background: ' + bgColor + '; color: ' + textColor + '; border: 1px solid ' + borderColor + ';',
            '  padding: ' + paddingY + 'px ' + paddingX + 'px; border-radius: ' + borderRadius + 'px;',
            '  cursor: pointer; font-weight: 600; font-size: inherit; outline: none; transition: all 0.2s ease;',
            (isFloating ? '  box-shadow: 0 4px 16px rgba(0,0,0,0.24);' : ''),
            '}',
            '.' + cls + ' .wto-lang-trigger:hover { background: ' + hoverBg + '; }',
            '.' + cls + ' .wto-lang-dropdown {',
            '  position: absolute; display: none; min-width: ' + dropdownWidth + 'px;',
            (app.dropdownPosition === 'top' || isFloating ? '  bottom: calc(100% + 8px); top: auto;' : '  top: calc(100% + 8px); bottom: auto;'),
            (isLeft ? '  left: 0; right: auto;' : '  right: 0; left: auto;'),
            '  background: ' + dropdownBg + '; border: 1px solid ' + dropdownBorder + '; border-radius: ' + dropdownRadius + 'px;',
            '  box-shadow: ' + dropdownShadow + '; z-index: 999999; padding: 6px; max-height: 320px; overflow-y: auto;',
            '}',
            '.' + cls + '.wto-open .wto-lang-dropdown { display: block; animation: wtoLangFadeIn 0.15s ease-out; }',
            '@keyframes wtoLangFadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }',
            '.' + cls + ' .wto-lang-item {',
            '  display: flex; align-items: center; justify-content: space-between; gap: 10px;',
            '  padding: 8px 10px; border-radius: ' + Math.max(4, borderRadius - 2) + 'px; color: ' + dropdownText + ';',
            '  text-decoration: none; font-size: inherit; cursor: pointer; transition: background 0.12s ease;',
            '}',
            '.' + cls + ' .wto-lang-item:hover { background: ' + hoverBg + '; }',
            '.' + cls + ' .wto-lang-item.wto-active { background: ' + activeItemBg + '; color: ' + activeItemText + '; font-weight: 700; }',
            '.' + cls + ' .wto-lang-flag { font-size: 1.1em; line-height: 1; margin-right: 4px; }',
            '.' + cls + ' .wto-lang-pills-wrap { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }',
            '.' + cls + ' .wto-lang-pill-btn {',
            '  display: inline-flex; align-items: center; gap: 6px; padding: ' + paddingY + 'px ' + paddingX + 'px;',
            '  background: ' + bgColor + '; color: ' + textColor + '; border: 1px solid ' + borderColor + ';',
            '  border-radius: ' + borderRadius + 'px; text-decoration: none; font-weight: 600; cursor: pointer; transition: all 0.15s ease;',
            '}',
            '.' + cls + ' .wto-lang-pill-btn:hover { background: ' + hoverBg + '; }',
            '.' + cls + ' .wto-lang-pill-btn.wto-active { background: ' + activeItemBg + '; color: ' + activeItemText + '; border-color: ' + accentColor + '; }'
          ].join('\n');

          var styleEl = document.createElement('style');
          styleEl.textContent = css;
          document.head.appendChild(styleEl);

          var rootEl = document.createElement('div');
          rootEl.id = 'wto-lang-' + cleanId;
          rootEl.className = 'wto-lang-root ' + cls;
          rootEl.setAttribute('data-wto-widget', widgetId);
          rootEl.setAttribute('data-wto-lang', '1');
          rootEl.setAttribute('data-widget-id', widgetId);
          rootEl.setAttribute('data-detect-browser', beh.detectBrowserLanguage !== false ? '1' : '0');
          rootEl.setAttribute('data-auto-redirect', beh.autoRedirect ? '1' : '0');
          rootEl.setAttribute('data-remember-pref', beh.rememberVisitorPreference !== false ? '1' : '0');

          var inner = '';
          if (isPills) {
            inner += '<div class="wto-lang-pills-wrap">';
            langs.forEach(function(l){
              var isAct = l.id === defaultLang.id;
              inner += '<a href="' + safe(l.url) + '" class="wto-lang-pill-btn ' + (isAct ? 'wto-active' : '') + '" data-lang-code="' + safe(l.code) + '" data-lang-url="' + safe(l.url) + '" data-lang-name="' + safe(l.name) + '" data-lang-native="' + safe(l.nativeName) + '">';
              if (app.showFlags !== false && l.flag) inner += '<span class="wto-lang-flag">' + safe(l.flag) + '</span>';
              inner += '<span>' + safe(app.showNativeNames ? l.nativeName : l.name) + '</span>';
              inner += '</a>';
            });
            inner += '</div>';
          } else {
            inner += '<button type="button" class="wto-lang-trigger" aria-haspopup="listbox" aria-expanded="false">';
            if (app.showGlobeIcon !== false && (layout === 'globe_dropdown' || layout === 'globe_text_dropdown' || isFloating)) {
              inner += '<span>' + globeSvg + '</span>';
            }
            if (app.showFlags !== false && defaultLang.flag && !isMinimalText) {
              inner += '<span class="wto-lang-flag">' + safe(defaultLang.flag) + '</span>';
            }
            if (app.preSelectionLabel) {
              inner += '<span style="opacity:0.8;font-size:0.9em;">' + safe(app.preSelectionLabel) + '</span>';
            }
            if (isMinimalText || app.buttonFormat === 'code_only') {
              inner += '<span>' + safe(defaultLang.code.toUpperCase()) + '</span>';
            } else {
              inner += '<span>' + safe(app.showNativeNames ? defaultLang.nativeName : defaultLang.name) + '</span>';
            }
            inner += '<span>' + chevronSvg + '</span>';
            inner += '</button>';

            inner += '<div class="wto-lang-dropdown" role="listbox">';
            langs.forEach(function(l){
              var isAct = l.id === defaultLang.id;
              inner += '<a href="' + safe(l.url) + '" class="wto-lang-item ' + (isAct ? 'wto-active' : '') + '" data-lang-code="' + safe(l.code) + '" data-lang-url="' + safe(l.url) + '" data-lang-name="' + safe(l.name) + '" data-lang-native="' + safe(l.nativeName) + '">';
              inner += '<div style="display:flex;align-items:center;gap:6px;">';
              if (app.showFlags !== false && l.flag) inner += '<span class="wto-lang-flag">' + safe(l.flag) + '</span>';
              inner += '<span>' + safe(app.showNativeNames ? l.nativeName : l.name) + '</span>';
              inner += '</div>';
              if (isAct) inner += '<span>' + checkSvg + '</span>';
              inner += '</a>';
            });
            inner += '</div>';
          }

          rootEl.innerHTML = inner;
          if (isFloating) {
            document.body.appendChild(rootEl);
          } else if (targetContainer) {
            targetContainer.innerHTML = '';
            targetContainer.appendChild(rootEl);
          } else {
            document.body.appendChild(rootEl);
          }
          initLanguageSwitcher(rootEl);
        }

        // Check if disabled/turned off first
        try {
          var rawEarly = localStorage.getItem('wto_dynamic_widgets_v1');
          if (!rawEarly && typeof window !== 'undefined' && window.location && window.location.protocol !== 'file:' && window.parent && window.parent !== window) {
            try { rawEarly = window.parent.localStorage.getItem('wto_dynamic_widgets_v1'); } catch(e0) {}
          }
          if (rawEarly) {
            var allEarly = JSON.parse(rawEarly);
            var earlyData = allEarly && allEarly[widgetId];
            if (earlyData && earlyData.enabled === false) {
              el.style.display = 'none';
              el.innerHTML = '';
              return;
            }
          }
        } catch(eEarly) {}

        // 1. If Language Switcher already rendered, attach interactivity
        var langFound = el.matches && el.matches('.wto-lang-root, [data-wto-lang="1"]') ? el : el.querySelector('.wto-lang-root, [data-wto-lang="1"]');
        if (langFound) {
          el.setAttribute('data-wto-rendered', '1');
          initLanguageSwitcher(el);
          return;
        }

        var a11yFound = el.matches && el.matches('.wto-a11y-root, [data-wto-a11y="1"]') ? el : el.querySelector('.wto-a11y-root, [data-wto-a11y="1"]');
        if (a11yFound) {
          el.setAttribute('data-wto-rendered', '1');
          initAccessibility(el);
          return;
        }

        var waFound = el.matches && el.matches('.wto-wa-root, [data-wto-wa="1"]') ? el : el.querySelector('.wto-wa-root, [data-wto-wa="1"]');
        if (waFound) {
          el.setAttribute('data-wto-rendered', '1');
          initWhatsAppChat(el);
          return;
        }

        // 2. If content already rendered for other widgets, attach interactivity
        if (el.querySelector('.wto-widget-container, .wto-countdown-root, .wto-announcement-bar-root, .wto-popup-backdrop, [data-ap-mode], .wto-faq-container, .wto-faq-root')) {
          el.setAttribute('data-wto-rendered', '1');
          attachInteractivity(el);
          return;
        }

        // 3. If element is empty or pending:
        if (widgetId.indexOf('wgt_lang') === 0) {
          getOrFetchWidget(widgetId, function(data){
            if (data) {
              renderLanguageSwitcherStandalone(data, el);
              el.setAttribute('data-wto-rendered', '1');
            }
          });
          return;
        }

        if (widgetId.indexOf('wgt_acc') === 0) {
          getOrFetchWidget(widgetId, function(data){
            if (data) {
              renderAccessibilityStandalone(data);
              el.setAttribute('data-wto-rendered', '1');
            }
          });
          return;
        }

        if (widgetId.indexOf('wgt_wa') === 0) {
          getOrFetchWidget(widgetId, function(data){
            if (data) {
              renderWhatsAppChatStandalone(data);
              el.setAttribute('data-wto-rendered', '1');
            }
          });
          return;
        }

        // 4. Otherwise load from localStorage cache or API
        try {
          var raw = localStorage.getItem('wto_dynamic_widgets_v1');
          if (!raw && typeof window !== 'undefined' && window.location && window.location.protocol !== 'file:' && window.parent && window.parent !== window) {
            try { raw = window.parent.localStorage.getItem('wto_dynamic_widgets_v1'); } catch(e2) {}
          }
          if (raw) {
            var all = JSON.parse(raw);
            var widgetData = all[widgetId];
            if (widgetData) {
              if (widgetData.enabled === false) {
                el.style.display = 'none';
                el.innerHTML = '';
                return;
              }
              window.dispatchEvent(new CustomEvent('wto-render-widget-request', { detail: { el: el, widget: widgetData } }));
            }
          }
        } catch(e) {}
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

  window.addEventListener('wto-preview-ready', function(){ initDynamicWidgets(); });
  window.addEventListener('wto-widget-saved', function(){ initDynamicWidgets(); });
  setInterval(function(){ initDynamicWidgets(); }, 1500);
})();
