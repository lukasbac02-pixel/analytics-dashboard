(function() {
  var s = document.currentScript;
  var TID = s && s.getAttribute('data-tid');
  if (!TID) return;

  var API = s.getAttribute('data-api') || (s.src ? new URL(s.src).origin + '/api/collect' : '');
  if (!API) return;

  function send(type, data) {
    data.t = TID;
    data.type = type;
    try { navigator.sendBeacon(API, JSON.stringify(data)); } catch(e) {}
  }

  function getUTM() {
    var p = new URLSearchParams(location.search);
    return {
      us: p.get('utm_source') || '',
      um: p.get('utm_medium') || '',
      uc: p.get('utm_campaign') || '',
      ux: p.get('utm_content') || '',
      ut: p.get('utm_term') || ''
    };
  }

  function trackPage() {
    var data = { p: location.pathname, r: document.referrer, sw: screen.width };
    var utm = getUTM();
    for (var k in utm) { if (utm[k]) data[k] = utm[k]; }
    send('pageview', data);
  }

  // Heartbeat every 30s while tab is visible
  var hb;
  function startHB() {
    hb = setInterval(function() {
      send('heartbeat', { p: location.pathname });
    }, 30000);
  }
  function stopHB() { clearInterval(hb); }

  document.addEventListener('visibilitychange', function() {
    document.hidden ? stopHB() : startHB();
  });

  // Track initial pageview + start heartbeat
  trackPage();
  startHB();

  // SPA support
  var origPush = history.pushState;
  history.pushState = function() {
    origPush.apply(this, arguments);
    trackPage();
  };
  window.addEventListener('popstate', trackPage);
})();
