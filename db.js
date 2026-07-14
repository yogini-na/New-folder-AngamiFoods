/**
 * db.js — Angami Foods Local Database Client
 * Posts contact form data to the local Express API → data/inquiries.json
 */

document.addEventListener('DOMContentLoaded', function () {

  var form = document.getElementById('contactForm');
  if (!form) {
    console.warn('[db.js] contactForm not found');
    return;
  }

  console.log('[db.js] contactForm found, attaching submit handler');

  form.addEventListener('submit', async function (e) {
    // CRITICAL: prevent the browser's default GET-reload behaviour
    e.preventDefault();
    e.stopImmediatePropagation();

    var btn    = document.getElementById('submitBtn');
    var status = document.getElementById('formStatus');

    var name    = (document.getElementById('name').value    || '').trim();
    var email   = (document.getElementById('email').value   || '').trim();
    var company = (document.getElementById('company').value || '').trim();
    var message = (document.getElementById('message').value || '').trim();

    if (!name || !email || !message) {
      showStatus('Please fill in all required fields.', 'error', status);
      return;
    }

    // Loading state
    if (btn) { btn.disabled = true; btn.textContent = 'SENDING…'; }

    try {
      var res = await fetch('/api/inquiries', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email, company: company, message: message })
      });

      var data = await res.json();

      if (res.ok && data.success) {
        showStatus('✅ Thank you! Your inquiry has been saved. We\'ll be in touch soon.', 'success', status);
        form.reset();
      } else {
        showStatus('❌ ' + (data.error || 'Something went wrong. Please try again.'), 'error', status);
      }
    } catch (err) {
      showStatus('❌ Could not reach the server. Make sure you ran: node server.js', 'error', status);
      console.error('[db.js] fetch error:', err);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'SUBMIT INQUIRY'; }
    }
  }, true); // use capture phase to run BEFORE any other listeners

  function showStatus(msg, type, el) {
    if (!el) return;
    el.textContent    = msg;
    el.style.display  = 'block';
    el.style.padding  = '12px 16px';
    el.style.borderRadius = '8px';
    el.style.fontSize = '14px';
    el.style.marginTop = '12px';
    if (type === 'success') {
      el.style.background = 'rgba(39,174,96,0.15)';
      el.style.color      = '#27ae60';
      el.style.border     = '1px solid #27ae60';
    } else {
      el.style.background = 'rgba(231,76,60,0.15)';
      el.style.color      = '#e74c3c';
      el.style.border     = '1px solid #e74c3c';
    }
    setTimeout(function () { el.style.display = 'none'; }, 8000);
  }

});
