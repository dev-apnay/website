// Apnay waitlist. Sends sign-ups to the Apnay server; shows place in line and the share link.
const API = 'https://tribe.moshuf.com/api/waitlist';
const SITE = 'https://apnay.app/';
const SHARE_TEXT = "Done swiping? Ready for a real recommendation? I'm on the Apnay waitlist — join with my link: ";

const $ = (sel, root = document) => root.querySelector(sel);
const form = $('#join');
const topEl = $("#top");
const done = $('.done');
const errorBox = $('.error', form);
const submit = $('button[type="submit"]', form);
const params = new URLSearchParams(location.search);

// Design's desktop layout (D1–D4) is proposed, not approved: preview it with ?layout=desktop.
if (params.get('layout') === 'desktop') document.documentElement.classList.add('desktop');

// ---- countries: the most likely ones first, then everyone else A–Z -------------------------
const FIRST = ['US', 'CA', 'GB', 'PK', 'IN', 'BD', 'AE', 'SA', 'QA', 'AU'];
const ALL = ('AD AE AF AG AL AM AO AR AT AU AZ BA BB BD BE BF BG BH BI BJ BN BO BR BS BT BW BY BZ CA CD CF CG CH CI ' +
  'CL CM CN CO CR CU CV CY CZ DE DJ DK DM DO DZ EC EE EG ER ES ET FI FJ FM FR GA GB GD GE GH GM GN GQ GR GT GW GY ' +
  'HK HN HR HT HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KI KM KN KR KW KZ LA LB LC LI LK LR LS LT LU LV LY MA ' +
  'MC MD ME MG MH MK ML MM MN MR MT MU MV MW MX MY MZ NA NE NG NI NL NO NP NR NZ OM PA PE PG PH PK PL PS PT PW PY ' +
  'QA RO RS RU RW SA SB SC SD SE SG SI SK SL SM SN SO SR SS ST SV SY SZ TD TG TH TJ TL TM TN TO TR TT TV TW TZ UA ' +
  'UG UY UZ VA VC VE VN VU WS XK YE ZA ZM ZW').split(' ');
(() => {
  let names;
  try { names = new Intl.DisplayNames(['en'], { type: 'region' }); } catch { names = { of: (c) => c }; }
  const select = form.country;
  const add = (parent, code) => parent.append(new Option(names.of(code), names.of(code)));
  FIRST.forEach((c) => add(select, c));
  const rest = document.createElement('optgroup');
  rest.label = 'All countries';
  ALL.filter((c) => !FIRST.includes(c)).sort((a, b) => names.of(a).localeCompare(names.of(b))).forEach((c) => add(rest, c));
  select.append(rest);
})();

// ---- form behaviour -------------------------------------------------------------------------
const ref = (params.get('ref') || '').trim().toUpperCase().slice(0, 12);
if (ref) $('.invited').hidden = false;

const smsTick = $('#f-smsOptIn');
form.phone.addEventListener('input', () => {
  const hasNumber = form.phone.value.trim() !== '';
  smsTick.hidden = !hasNumber;
  if (!hasNumber) form.smsOptIn.checked = false;
});

form.addEventListener('change', (e) => {
  if (e.target.name === 'who') {
    const other = e.target.value === 'FAMILY';
    $('.gender-label').textContent = other ? 'Their gender' : 'Gender';
    $('.age-label').textContent = other ? 'Their age range' : 'Age range';
  }
  clearError(e.target.closest('.field, .tick'));
});
form.addEventListener('input', (e) => clearError(e.target.closest('.field, .tick')));

function clearError(field) {
  if (field && field.classList.contains('invalid')) {
    field.classList.remove('invalid');
    errorBox.hidden = true;
  }
}

function fail(id, message) {
  form.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));
  const field = id && document.getElementById(id);
  if (field) {
    field.classList.add('invalid');
    const input = field.querySelector('input, select');
    if (input) input.focus({ preventScroll: true });
    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  errorBox.textContent = message;
  errorBox.hidden = false;
}

const value = (name) => (form[name] && form[name].value ? String(form[name].value).trim() : '');
const radio = (name) => (form.querySelector(`input[name="${name}"]:checked`) || {}).value || '';

// One message at a time, in Design's order.
function firstProblem() {
  if (!radio('who')) return ['f-who', "Choose who you're signing up for."];
  if (!value('firstName')) return ['f-firstName', 'Enter your first name.'];
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value('email'))) return ['f-email', 'Enter a valid email address, like name@example.com.'];
  const phone = value('phone');
  if (phone && phone.replace(/\D/g, '').length < 8) return ['f-phone', 'That number looks too short. Include your country code, or leave it blank.'];
  if (!value('city')) return ['f-city', 'Enter your city.'];
  if (!value('country')) return ['f-country', 'Choose your country.'];
  if (!radio('gender')) return ['f-gender', 'Choose Male or Female.'];
  if (!value('ageRange')) return ['f-ageRange', 'Choose an age range.'];
  if (!form.adult.checked) return ['f-adult', "Tick the box to confirm you're 21 or older."];
  if (!form.emailOptIn.checked) return ['f-emailOptIn', "Tick the box so we can email you — that's how you'll hear about launch."];
  return null;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const problem = firstProblem();
  if (problem) return fail(...problem);
  errorBox.hidden = true;
  submit.disabled = true;
  submit.textContent = 'Signing up…';
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        who: radio('who'),
        firstName: value('firstName'),
        email: value('email'),
        phone: value('phone') || null,
        city: value('city'),
        country: value('country'),
        gender: radio('gender'),
        ageRange: value('ageRange'),
        adult: form.adult.checked,
        emailOptIn: form.emailOptIn.checked,
        smsOptIn: Boolean(value('phone')) && form.smsOptIn.checked,
        ref: ref || null,
        source: (params.get('utm_source') || params.get('src') || (document.referrer ? hostOf(document.referrer) : '') || '').slice(0, 60) || null,
        website: value('website'),
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.ok) {
      const field = { 'Enter a valid email address, like name@example.com.': 'f-email' }[body.message];
      return fail(field || null, body.message || "We couldn't reach the server. Check your connection and try again.");
    }
    showDone(body, value('email'));
  } catch {
    fail(null, "We couldn't reach the server. Check your connection and try again.");
  } finally {
    submit.disabled = false;
    submit.textContent = 'Sign up for launch updates';
  }
});

function hostOf(url) {
  try { return new URL(url).hostname; } catch { return ''; }
}

// ---- after signing up -----------------------------------------------------------------------
function showDone(body, email) {
  topEl.hidden = true;
  form.hidden = true;
  done.hidden = false;
  const status = body.status;
  $('.done-title').textContent = body.already
    ? "You're already on the list."
    : body.confirmationSent ? 'One more step.' : "You're on the list.";

  $('.inbox').hidden = !body.confirmationSent;
  if (body.confirmationSent) $('.inbox-email').textContent = email;

  $('.place').hidden = !status;
  $('.share').hidden = !status;
  if (status) {
    $('.place-n').textContent = status.place.toLocaleString('en-US');
    $('.place-total').textContent = status.total.toLocaleString('en-US');
    const link = `${SITE}?ref=${status.code}`;
    $('.share-url').textContent = link;
    $('.wa').href = `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + link)}`;
    const n = status.friends;
    $('.friends').innerHTML = n === 0
      ? 'No friends have joined with your link yet.'
      : `<b>${n} ${n === 1 ? 'friend has' : 'friends have'}</b> joined with your link.`;
    // Coming back to this address shows the same screen.
    history.replaceState(null, '', `/?me=${status.code}`);
  }
  window.scrollTo(0, 0);
  done.focus({ preventScroll: true });
}

$('.copy').addEventListener('click', async (e) => {
  const link = $('.share-url').textContent;
  try {
    await navigator.clipboard.writeText(link);
  } catch {
    const range = document.createRange();
    range.selectNodeContents($('.share-url'));
    getSelection().removeAllRanges();
    getSelection().addRange(range);
    document.execCommand('copy');
  }
  e.target.textContent = 'Copied';
  setTimeout(() => { e.target.textContent = 'Copy link'; }, 2000);
});

// ---- arriving with ?me=CODE (coming back) or ?confirm=TOKEN (from the e-mail) ---------------
(async () => {
  const me = (params.get('me') || '').trim();
  const confirm = (params.get('confirm') || '').trim();
  if (!me && !confirm) return;
  try {
    const res = confirm
      ? await fetch(`${API}/confirm`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: confirm }) })
      : await fetch(`${API}/status/${encodeURIComponent(me)}`);
    if (!res.ok) return; // unknown code or used link: show the form
    showDone(await res.json(), '');
  } catch { /* offline: leave the form */ }
})();
