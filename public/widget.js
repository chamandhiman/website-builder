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
            var animType = root.getAttribute('data-anim') || 'none';
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

            // Scheduling
            if (schedEnabled) {
              var now = Date.now();
              if (startStr && now < new Date(startStr).getTime()) { ap.style.display = 'none'; return; }
              if (endStr && now > new Date(endStr).getTime()) { ap.style.display = 'none'; return; }
            }

            // Frequency
            if (freq !== 'always' && widgetId) {
              var key = 'wto_ap_seen_' + widgetId;
              if (freq === 'session' && sessionStorage.getItem(key)) { ap.style.display = 'none'; return; }
              if (freq === 'once' && localStorage.getItem(key)) { ap.style.display = 'none'; return; }
              var cdMap = { '1day': 86400000, '7days': 604800000, '30days': 2592000000 };
              var cdDur = cdMap[freq] || 0;
              var last = Number(localStorage.getItem(key) || 0);
              if (last > 0 && (Date.now() - last) < cdDur) { ap.style.display = 'none'; return; }
            }

            function markSeen() {
              if (!widgetId) return;
              var key = 'wto_ap_seen_' + widgetId;
              var nowStr = String(Date.now());
              try {
                if (freq === 'session') sessionStorage.setItem(key, nowStr);
                else localStorage.setItem(key, nowStr);
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

        // If content already rendered, attach interactivity
        if (el.querySelector('.wto-widget-container, .wto-countdown-root, .wto-announcement-bar-root, .wto-popup-backdrop, [data-ap-mode], .wto-faq-container, .wto-faq-root')) {
          el.setAttribute('data-wto-rendered', '1');
          attachInteractivity(el);
          return;
        }

        // Otherwise load from localStorage cache or API
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
})();
