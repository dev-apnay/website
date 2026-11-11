// Apnay waitlist. Language first, then the sign-up form; shows place in line and the share link.
const API = 'https://tribe.moshuf.com/api/waitlist';
const SITE = 'https://apnay.app/';
const STORE_KEY = 'apnay.lang';

// [code, name in that language, name in English, direction]. Translations live in i18n/<code>.json.
const LANGS = [
  ['en', 'English', 'English'],
  ['ur', 'اردو', 'Urdu', 'rtl'],
  ['ar', 'العربية', 'Arabic', 'rtl'],
  ['hi', 'हिन्दी', 'Hindi'],
  ['bn', 'বাংলা', 'Bengali'],
  ['pa-Arab', 'پنجابی', 'Punjabi (Shahmukhi)', 'rtl'],
  ['ps', 'پښتو', 'Pashto', 'rtl'],
  ['fa', 'فارسی', 'Persian (Farsi / Dari)', 'rtl'],
  ['tr', 'Türkçe', 'Turkish'],
  ['ms', 'Bahasa Melayu', 'Malay'],
  ['id', 'Bahasa Indonesia', 'Indonesian'],
  ['so', 'Soomaali', 'Somali'],
  ['sw', 'Kiswahili', 'Swahili'],
  ['ha', 'Hausa', 'Hausa'],
  ['fr', 'Français', 'French'],
  ['es', 'Español', 'Spanish'],
  ['de', 'Deutsch', 'German'],
  ['ru', 'Русский', 'Russian'],
  ['bs', 'Bosanski', 'Bosnian'],
  ['sq', 'Shqip', 'Albanian'],
  ['ta', 'தமிழ்', 'Tamil'],
  ['ml', 'മലയാളം', 'Malayalam'],
];
const LATIN_LIKE = new Set(['en', 'tr', 'ms', 'id', 'so', 'sw', 'ha', 'fr', 'es', 'de', 'bs', 'sq', 'ru']);

// English is the design's exact wording, and the fallback for anything a translation lacks.
const EN = {
  chooseTitle: 'Choose your language', otherLanguage: 'Other language',
  otherHint: 'Your phone can translate this page into any language. In Chrome, tap ⋮ then Translate. In Safari, tap the aA button then Translate to your language.',
  continueEnglish: 'Continue in English', changeLanguage: 'Change language',
  h1a: 'Done swiping?', h1b: 'Ready for a real recommendation?',
  lede: "Leave your details and you'll hear before anyone else.", invited: 'A friend saved you a place',
  formTitle: 'Join the waitlist', whoLegend: 'Who are you signing up for?',
  self: 'Myself', selfSub: "I'm looking to get married.", family: 'Someone I care about', familySub: 'A son, daughter, sister, friend…',
  firstName: 'First name', email: 'Email', phone: 'Phone or WhatsApp', optional: '(optional)', phoneHint: 'Include your country code.',
  city: 'City', country: 'Country', choose: 'Choose…', allCountries: 'All countries',
  gender: 'Gender', theirGender: 'Their gender', male: 'Male', female: 'Female',
  ageRange: 'Age range', theirAgeRange: 'Their age range', age46: '46 or over',
  adultB: "I'm 21 or older.", adultRest: 'Apnay is for people 21 and over.',
  emailB: 'Send me updates and early access from Apnay.', emailRest: 'Unsubscribe anytime.',
  smsB: 'Text or WhatsApp me updates from Apnay.', smsRest: 'Msg & data rates may apply. Reply STOP to opt out. Not required to sign up.',
  submit: 'Sign up for launch updates', sending: 'Signing up…',
  fine: 'We never sell your details.', fineLink: 'How we use them', privacyNote: 'Privacy note',
  eWho: "Choose who you're signing up for.", eFirst: 'Enter your first name.',
  eEmail: 'Enter a valid email address, like name@example.com.',
  ePhone: 'That number looks too short. Include your country code, or leave it blank.',
  eCity: 'Enter your city.', eCountry: 'Choose your country.', eGender: 'Choose Male or Female.', eAge: 'Choose an age range.',
  eAdult: "Tick the box to confirm you're 21 or older.",
  eEmailOptIn: "Tick the box so we can email you — that's how you'll hear about launch.",
  eNetwork: "We couldn't reach the server. Check your connection and try again.",
  eBusy: 'Too many sign-ups from here. Please try again later.',
  oneMore: 'One more step.', onList: "You're on the list.", already: "You're already on the list.",
  inboxKicker: 'CHECK YOUR INBOX', inboxSent: "We've sent a confirmation to {email}. Tap the link in it and you're in.",
  inboxHelp: 'Nothing there? Look in spam or promotions, or write to {mail}.',
  placeLabel: 'Your place in line', placeOf: 'of {total} on the waitlist',
  moveUp: 'Move up the list', moveUpText: 'Every friend who joins with your link moves you up {n} places.',
  shareWa: 'Share on WhatsApp', copy: 'Copy link', copied: 'Copied',
  friendsNone: 'No friends have joined with your link yet.',
  friendsOne: '{n} friend has joined with your link.', friendsOther: '{n} friends have joined with your link.',
  waText: "Done swiping? Ready for a real recommendation? I'm on the Apnay waitlist — join with my link: {link}",
  follow: 'Until then, follow along at {handle} on Instagram and TikTok.',
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const form = $('#join');
const topEl = $('#top');
const done = $('.done');
const footer = $('footer');
const picker = $('#lang');
const errorBox = $('.error', form);
const submit = $('button[type="submit"]', form);
const params = new URLSearchParams(location.search);

let lang = 'en';
let dict = EN;
let errorKey = null; // the error on screen, kept as a key so it can be re-translated
let lastDone = null; // what the after-sign-up screen shows, for re-translating
let started = false;

if (params.get('layout') === 'desktop') document.documentElement.classList.add('desktop');

const store = {
  get() { try { return localStorage.getItem(STORE_KEY); } catch { return null; } },
  set(v) { try { localStorage.setItem(STORE_KEY, v); } catch { /* private mode */ } },
};
const supported = (code) => LANGS.find(([c]) => c === code);
const t = (key) => dict[key] ?? EN[key] ?? key;

/** Puts a translated template into an element, with {placeholders} filled by elements or text. */
function fill(el, template, vars = {}) {
  el.replaceChildren(...template.split(/(\{\w+\})/).filter(Boolean).map((part) => {
    const m = part.match(/^\{(\w+)\}$/);
    if (!m || !(m[1] in vars)) return document.createTextNode(part);
    const v = vars[m[1]];
    return typeof v === 'string' ? document.createTextNode(v) : v;
  }));
}
const el = (tag, text, attrs = {}) => Object.assign(document.createElement(tag), { textContent: text }, attrs);

async function loadDict(code) {
  if (code === 'en') return EN;
  try {
    const res = await fetch(`i18n/${code}.json`);
    if (res.ok) return await res.json();
  } catch { /* offline */ }
  return EN;
}

// ---- language -------------------------------------------------------------------------------
async function setLang(code) {
  const entry = supported(code) || LANGS[0];
  dict = await loadDict(entry[0]);
  lang = entry[0];
  const root = document.documentElement;
  root.lang = lang;
  root.dir = entry[3] || 'ltr';
  root.classList.toggle('nonlatin', !LATIN_LIKE.has(lang));
  $$('[data-i18n]').forEach((node) => { node.textContent = t(node.dataset.i18n); });
  $$('.lang-current').forEach((node) => { node.textContent = entry[1]; });
  $$('.lang-switch').forEach((node) => node.setAttribute('aria-label', t('changeLanguage')));
  document.title = `Apnay — ${t('formTitle')}`;
  buildCountries();
  updateWhoLabels();
  if (errorKey) showError(errorKey);
  if (lastDone) renderDone();
}

function showPicker() {
  [topEl, form, done, footer].forEach((n) => { n.hidden = true; });
  picker.hidden = false;
  window.scrollTo(0, 0);
}

function hidePicker() {
  picker.hidden = true;
  footer.hidden = false;
  if (lastDone) { done.hidden = false; } else { topEl.hidden = false; form.hidden = false; }
}

async function choose(code) {
  store.set(code);
  await setLang(code);
  hidePicker();
  if (!started) start();
}

async function buildPicker() {
  const browser = (navigator.languages || [navigator.language || 'en']).map((l) => l.toLowerCase());
  const suggested = LANGS.find(([c]) => browser.some((b) => b === c.toLowerCase() || b.split('-')[0] === c.split('-')[0]));
  const ordered = suggested ? [suggested, ...LANGS.filter((l) => l !== suggested)] : LANGS;
  const list = $('.lang-list', picker);
  ordered.forEach(([code, name, english, dir]) => {
    const button = el('button', '', { type: 'button', className: 'lang-btn' + (code === suggested?.[0] ? ' suggested' : '') });
    button.setAttribute('role', 'listitem');
    button.lang = code;
    button.append(el('span', name, { className: 'native', dir: dir || 'ltr' }), el('span', english, { className: 'english' }));
    button.addEventListener('click', () => choose(code));
    list.append(button);
  });
  const other = el('button', 'Other language', { type: 'button', className: 'lang-btn other' });
  other.addEventListener('click', () => { $('.lang-other', picker).hidden = false; other.hidden = true; });
  list.append(other);
  $('.lang-continue', picker).addEventListener('click', () => choose('en'));
  // Say "Choose your language" in the browser's language too, when it isn't English.
  if (suggested && suggested[0] !== 'en') {
    const d = await loadDict(suggested[0]);
    if (d.chooseTitle) {
      const sub = $('.lang-sub', picker);
      sub.textContent = d.chooseTitle;
      sub.lang = suggested[0];
      sub.dir = suggested[3] || 'ltr';
      sub.hidden = false;
    }
  }
}
$$('.lang-switch').forEach((b) => b.addEventListener('click', showPicker));

// ---- countries: the most likely ones first, then everyone else A–Z, named in the chosen language
const FIRST = ['US', 'CA', 'GB', 'PK', 'IN', 'BD', 'AE', 'SA', 'QA', 'AU'];
const ALL = ('AD AE AF AG AL AM AO AR AT AU AZ BA BB BD BE BF BG BH BI BJ BN BO BR BS BT BW BY BZ CA CD CF CG CH CI ' +
  'CL CM CN CO CR CU CV CY CZ DE DJ DK DM DO DZ EC EE EG ER ES ET FI FJ FM FR GA GB GD GE GH GM GN GQ GR GT GW GY ' +
  'HK HN HR HT HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KI KM KN KR KW KZ LA LB LC LI LK LR LS LT LU LV LY MA ' +
  'MC MD ME MG MH MK ML MM MN MR MT MU MV MW MX MY MZ NA NE NG NI NL NO NP NR NZ OM PA PE PG PH PK PL PS PT PW PY ' +
  'QA RO RS RU RW SA SB SC SD SE SG SI SK SL SM SN SO SR SS ST SV SY SZ TD TG TH TJ TL TM TN TO TR TT TV TW TZ UA ' +
  'UG UY UZ VA VC VE VN VU WS XK YE ZA ZM ZW').split(' ');
function regionNames(code) {
  try { return new Intl.DisplayNames([code === 'pa-Arab' ? 'ur' : code, 'en'], { type: 'region' }); } catch { return { of: (c) => c }; }
}
const EN_NAMES = regionNames('en');
function buildCountries() {
  const select = form.country;
  const chosen = select.value;
  const names = regionNames(lang);
  // The stored value is always the English name, whatever language the page is in.
  const option = (c) => new Option(names.of(c), EN_NAMES.of(c));
  select.replaceChildren(new Option(t('choose'), ''));
  FIRST.forEach((c) => select.append(option(c)));
  const rest = document.createElement('optgroup');
  rest.label = t('allCountries');
  const collator = new Intl.Collator(lang === 'pa-Arab' ? 'ur' : lang);
  ALL.filter((c) => !FIRST.includes(c)).sort((a, b) => collator.compare(names.of(a), names.of(b))).forEach((c) => rest.append(option(c)));
  select.append(rest);
  select.value = chosen;
}

// ---- form behaviour -------------------------------------------------------------------------
const ref = (params.get('ref') || '').trim().toUpperCase().slice(0, 12);
if (ref) $('.invited').hidden = false;

const smsTick = $('#f-smsOptIn');
form.phone.addEventListener('input', () => {
  const hasNumber = form.phone.value.trim() !== '';
  smsTick.hidden = !hasNumber;
  if (!hasNumber) form.smsOptIn.checked = false;
});

function updateWhoLabels() {
  const other = radio('who') === 'FAMILY';
  $('.gender-label').textContent = t(other ? 'theirGender' : 'gender');
  $('.age-label').textContent = t(other ? 'theirAgeRange' : 'ageRange');
}

form.addEventListener('change', (e) => {
  if (e.target.name === 'who') updateWhoLabels();
  clearError(e.target.closest('.field, .tick'));
});
form.addEventListener('input', (e) => clearError(e.target.closest('.field, .tick')));

function clearError(field) {
  if (field && field.classList.contains('invalid')) {
    field.classList.remove('invalid');
    errorBox.hidden = true;
    errorKey = null;
  }
}

function showError(key) {
  errorKey = key;
  errorBox.textContent = t(key);
  errorBox.hidden = false;
}

function fail(id, key) {
  $$('.invalid', form).forEach((n) => n.classList.remove('invalid'));
  const field = id && document.getElementById(id);
  if (field) {
    field.classList.add('invalid');
    const input = field.querySelector('input, select');
    if (input) input.focus({ preventScroll: true });
    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  showError(key);
}

const value = (name) => (form[name] && form[name].value ? String(form[name].value).trim() : '');
const radio = (name) => (form.querySelector(`input[name="${name}"]:checked`) || {}).value || '';

// One message at a time, in Design's order.
function firstProblem() {
  if (!radio('who')) return ['f-who', 'eWho'];
  if (!value('firstName')) return ['f-firstName', 'eFirst'];
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value('email'))) return ['f-email', 'eEmail'];
  const phone = value('phone');
  if (phone && phone.replace(/\D/g, '').length < 8) return ['f-phone', 'ePhone'];
  if (!value('city')) return ['f-city', 'eCity'];
  if (!value('country')) return ['f-country', 'eCountry'];
  if (!radio('gender')) return ['f-gender', 'eGender'];
  if (!value('ageRange')) return ['f-ageRange', 'eAge'];
  if (!form.adult.checked) return ['f-adult', 'eAdult'];
  if (!form.emailOptIn.checked) return ['f-emailOptIn', 'eEmailOptIn'];
  return null;
}

// The server answers in English; these are the messages it can send back.
const SERVER_ERRORS = {
  'Enter a valid email address, like name@example.com.': ['f-email', 'eEmail'],
  'That number looks too short. Include your country code, or leave it blank.': ['f-phone', 'ePhone'],
  "Tick the box to confirm you're 21 or older.": ['f-adult', 'eAdult'],
  "Tick the box so we can email you — that's how you'll hear about launch.": ['f-emailOptIn', 'eEmailOptIn'],
  'Too many sign-ups from here. Please try again later.': [null, 'eBusy'],
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const problem = firstProblem();
  if (problem) return fail(...problem);
  errorBox.hidden = true;
  errorKey = null;
  submit.disabled = true;
  submit.textContent = t('sending');
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
        language: lang,
        ref: ref || null,
        source: (params.get('utm_source') || params.get('src') || (document.referrer ? hostOf(document.referrer) : '') || '').slice(0, 60) || null,
        website: value('website'),
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.ok) return fail(...(SERVER_ERRORS[body.message] || [null, 'eNetwork']));
    showDone(body, value('email'));
  } catch {
    fail(null, 'eNetwork');
  } finally {
    submit.disabled = false;
    submit.textContent = t('submit');
  }
});

function hostOf(url) {
  try { return new URL(url).hostname; } catch { return ''; }
}

// ---- after signing up -----------------------------------------------------------------------
function showDone(body, email) {
  lastDone = { body, email };
  topEl.hidden = true;
  form.hidden = true;
  done.hidden = false;
  footer.hidden = false;
  renderDone();
  if (body.status) history.replaceState(null, '', `/?me=${body.status.code}`); // coming back shows this again
  window.scrollTo(0, 0);
  done.focus({ preventScroll: true });
}

function renderDone() {
  const { body, email } = lastDone;
  const status = body.status;
  const number = new Intl.NumberFormat(lang === 'pa-Arab' ? 'ur' : lang);
  $('.done-title').textContent = t(body.already ? 'already' : body.confirmationSent ? 'oneMore' : 'onList');

  $('.inbox').hidden = !body.confirmationSent;
  if (body.confirmationSent) {
    fill($('.inbox-sent'), t('inboxSent'), { email: el('b', email, { dir: 'ltr' }) });
    fill($('.inbox-help'), t('inboxHelp'), { mail: el('a', 'hello@apnay.app', { href: 'mailto:hello@apnay.app', dir: 'ltr' }) });
  }

  $('.place').hidden = !status;
  $('.share').hidden = !status;
  if (status) {
    $('.place-n').textContent = number.format(status.place);
    fill($('.place-of'), t('placeOf'), { total: number.format(status.total) });
    fill($('.move-up-text'), t('moveUpText'), { n: el('b', number.format(5)) });
    const link = `${SITE}?ref=${status.code}`;
    $('.share-url').textContent = link;
    $('.wa').href = `https://wa.me/?text=${encodeURIComponent(t('waText').replace('{link}', link))}`;
    const n = status.friends;
    const key = n === 0 ? 'friendsNone' : new Intl.PluralRules(lang).select(n) === 'one' ? 'friendsOne' : 'friendsOther';
    fill($('.friends'), t(key), { n: el('b', number.format(n)) });
  }
  fill($('.follow'), t('follow'), {
    handle: el('a', '@meetapnay', { href: 'https://www.instagram.com/meetapnay', target: '_blank', rel: 'noopener', dir: 'ltr' }),
  });
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
  e.target.textContent = t('copied');
  setTimeout(() => { e.target.textContent = t('copy'); }, 2000);
});

// ---- start: language first, then the form or the ?me= / ?confirm= screen ---------------------
async function start() {
  started = true;
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
}

(async () => {
  buildCountries();
  await buildPicker();
  const wanted = params.get('lang') || store.get();
  if (wanted && supported(wanted)) {
    await setLang(wanted);
    hidePicker();
    start();
  } else {
    showPicker();
  }
})();
