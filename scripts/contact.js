// contact.js — form validation, mailto submit, i18n error messages

import { getString } from './i18n.js';

function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');

  function showError(fieldId, msgKey) {
    const input = document.getElementById(fieldId);
    const msgEl = document.getElementById(`${fieldId}-error`);
    if (input)  input.classList.add('error');
    if (msgEl)  msgEl.textContent = getString(msgKey);
  }

  function clearErrors() {
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.form-error-msg').forEach(el => el.textContent = '');
    if (statusEl) {
      statusEl.className = 'form-status';
      statusEl.textContent = '';
    }
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    const name    = form.querySelector('#form-name');
    const email   = form.querySelector('#form-email');
    const subject = form.querySelector('#form-subject');
    const message = form.querySelector('#form-message');

    let valid = true;

    if (!name.value.trim()) {
      showError('form-name', 'form_error_required');
      valid = false;
    }

    if (!email.value.trim()) {
      showError('form-email', 'form_error_required');
      valid = false;
    } else if (!validateEmail(email.value.trim())) {
      showError('form-email', 'form_error_email');
      valid = false;
    }

    if (!subject.value.trim()) {
      showError('form-subject', 'form_error_required');
      valid = false;
    }

    if (!message.value.trim()) {
      showError('form-message', 'form_error_required');
      valid = false;
    }

    if (!valid) return;

    const body = [
      `Name: ${name.value.trim()}`,
      `Email: ${email.value.trim()}`,
      ``,
      message.value.trim()
    ].join('\n');

    const mailto = `mailto:contact@ilaikoto.com`
      + `?subject=${encodeURIComponent(subject.value.trim())}`
      + `&body=${encodeURIComponent(body)}`;

    try {
      window.location.href = mailto;
      if (statusEl) {
        statusEl.className = 'form-status success';
        statusEl.textContent = getString('form_success');
      }
      form.reset();
    } catch (err) {
      if (statusEl) {
        statusEl.className = 'form-status error-msg';
        statusEl.textContent = getString('form_error_send');
      }
    }
  });

  // Clear error on input
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const errEl = document.getElementById(`${input.id}-error`);
      if (errEl) errEl.textContent = '';
    });
  });
}

export { initContact };