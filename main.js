// Sends waitlist sign-ups to the Apnay server. Change API_URL if the server moves.
const API_URL = 'https://tribe.moshuf.com/api/waitlist';

const form = document.getElementById('join');
const done = document.querySelector('.done');
const status = form.querySelector('.status');
const button = form.querySelector('button[type="submit"]');

// "Join as a matchmaker" pre-selects the matchmaker option.
document.querySelectorAll('[data-role]').forEach((link) =>
  link.addEventListener('click', () => {
    const radio = form.querySelector(`input[name="role"][value="${link.dataset.role}"]`);
    if (radio) radio.checked = true;
  })
);

// Where the visitor came from: ?ref= or ?utm_source=, else the referring site.
const params = new URLSearchParams(location.search);
let source = params.get('ref') || params.get('utm_source') || '';
if (!source && document.referrer) {
  try { source = new URL(document.referrer).hostname; } catch { /* ignore */ }
}

const show = (text, isError) => {
  status.textContent = text;
  status.classList.toggle('err', Boolean(isError));
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const email = String(data.get('email') || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    show('Please enter a valid e-mail address.', true);
    form.email.focus();
    return;
  }
  button.disabled = true;
  show('Adding you to the list…');
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name: data.get('name'),
        role: data.get('role'),
        city: data.get('city'),
        source: source.slice(0, 60) || 'apnay.app',
        website: data.get('website'),
      }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || !body.ok) throw new Error(body.message || 'Something went wrong. Please try again.');
    form.hidden = true;
    done.hidden = false;
    done.focus();
  } catch (err) {
    show(err instanceof TypeError ? 'Could not reach Apnay. Check your connection and try again.' : err.message, true);
    button.disabled = false;
  }
});
