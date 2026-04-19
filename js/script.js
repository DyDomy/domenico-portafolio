/* ═══════════════════════════════════════
   DOMENICO TAVOLETTA — script.js
   ════════════════════════════════════════ */

'use strict';

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─── HEADER SCROLL ─── */
const header = $('#site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ─── MOBILE NAV ─── */
const menuToggle = $('#menu-toggle');
const mobileNav  = $('#mobile-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  mobileNav.setAttribute('aria-hidden', String(!isOpen));
});

$$('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  });
});

/* ─── SCROLL ANIMATIONS ─── */
const animatedEls = $$('.animate-up, .animate-left, .animate-on-scroll');

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

animatedEls.forEach(el => scrollObserver.observe(el));

/* Staggered delays for grid children */
[
  '.problems-grid .prob-card',
  '.services-grid .svc-card',
  '.projects-list .proj-card',
  '.why-points .why-point',
  '.steps-track .step',
  '.faq-list .faq-item'
].forEach(sel => {
  $$(sel).forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
  });
});

/* ─── SMOOTH SCROLL ─── */
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = $(link.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 8;
  window.scrollTo({ top, behavior: 'smooth' });
});

/* ─── FAQ ACCORDION ─── */
$$('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const answerId = btn.getAttribute('aria-controls');
    const answer   = $(`#${answerId}`);

    $$('.faq-q[aria-expanded="true"]').forEach(other => {
      if (other !== btn) {
        other.setAttribute('aria-expanded', 'false');
        $(`#${other.getAttribute('aria-controls')}`).hidden = true;
      }
    });

    btn.setAttribute('aria-expanded', String(!expanded));
    answer.hidden = expanded;
  });
});

/* ─── CONTACT FORM ─── */
const form        = $('#contact-form');
const formSuccess = $('#form-success');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    $$('.ferr').forEach(el => { el.textContent = ''; });
    $$('input, textarea', form).forEach(el => el.classList.remove('error'));

    const name  = $('#f-name');
    const email = $('#f-email');
    const msg   = $('#f-msg');
    let valid   = true;

    if (!name.value.trim()) {
      setError(name, 'Il nome è obbligatorio.'); valid = false;
    }
    if (!email.value.trim()) {
      setError(email, "L'email è obbligatoria."); valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setError(email, 'Inserisci un indirizzo email valido.'); valid = false;
    }
    if (!msg.value.trim()) {
      setError(msg, 'Il messaggio è obbligatorio.'); valid = false;
    } else if (msg.value.trim().length < 10) {
      setError(msg, 'Il messaggio è troppo breve (min. 10 caratteri).'); valid = false;
    }

    if (!valid) return;

    const btnText   = form.querySelector('.btn-text');
    const btnLoader = form.querySelector('.btn-loader');
    btnText.hidden   = true;
    btnLoader.hidden = false;

    const svcEl  = $('#f-service');
    const svcVal = svcEl && svcEl.value ? svcEl.options[svcEl.selectedIndex].text : '';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: '05f24a83-74ba-440b-a8ad-9e4968786031',
          subject: 'Richiesta Preventivo Gratuito — domenicotavoletta.it',
          from_name: name.value.trim(),
          name: name.value.trim(),
          email: email.value.trim(),
          servizio: svcVal || 'Non specificato',
          message: msg.value.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        form.classList.add('fading');
        await wait(320);
        form.hidden = true;
        form.classList.remove('fading');
        formSuccess.hidden = false;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => formSuccess.classList.add('visible'));
        });
        formSuccess.setAttribute('tabindex', '-1');
        formSuccess.focus();
      } else {
        throw new Error(data.message || 'Errore invio');
      }
    } catch {
      btnText.hidden   = false;
      btnLoader.hidden = true;
      alert('Errore nell\'invio. Scrivimi direttamente a info@domenicotavoletta.it');
    }
  });
}

function setError(input, msg) {
  input.classList.add('error');
  const err = input.parentElement.querySelector('.ferr');
  if (err) err.textContent = msg;
}

const wait = ms => new Promise(r => setTimeout(r, ms));

/* ─── COOKIE BANNER ─── */
const cookieBanner = $('#cookie-banner');
const cookieBtn    = $('#cookie-accept');

if (localStorage.getItem('dt-cookie')) {
  cookieBanner.style.display = 'none';
} else {
  setTimeout(() => cookieBanner.classList.remove('hidden'), 1500);
}

cookieBtn.addEventListener('click', () => {
  localStorage.setItem('dt-cookie', '1');
  cookieBanner.classList.add('hidden');
  setTimeout(() => { cookieBanner.style.display = 'none'; }, 500);
});

/* Initial hidden state */
cookieBanner.classList.add('hidden');
