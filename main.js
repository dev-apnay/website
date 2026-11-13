// Apnay waitlist (designs WL3k, WL3l). English by default; the small language menu at the top right switches the page.
const API = 'https://api.apnay.app/api/waitlist';
const SITE = 'https://apnay.app/';
const STORE_KEY = 'apnay.lang';
// Your own details for the share pictures, kept in this browser only between signing up and tapping
// the confirm link (which, on purpose, tells the page nothing personal). Removed once used.
const MINE_KEY = 'apnay.mine';

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
  otherLanguage: 'Other language…',
  otherHint: 'Your phone can translate this page into any language. In Chrome, tap ⋮ then Translate. In Safari, tap the aA button then Translate to your language.',
  changeLanguage: 'Change language',
  h1a: 'Done swiping?', h1b: 'Ready for a real recommendation?',
  lede: "Leave your details and you'll hear before anyone else.", invited: 'A friend saved you a place',
  // desktop: the line under the headline on the later steps (WL3l)
  ledeInbox: 'Almost there. Check your inbox to confirm.',
  ledeAboutConfirmed: "You're confirmed. One last question, and it's optional.",
  ledeAbout: "You're on the list. One last question, and it's optional.",
  ledeDone: "You're on the list. Share your link to move up.",
  formTitle: 'Join the waitlist', whoLegend: 'Who are you signing up for?',
  self: 'Myself', selfSub: "I'm looking to get married.", family: 'Someone I care about', familySub: 'A son, daughter, sister, friend…',
  firstName: 'First name', lastName: 'Last name', email: 'Email', phone: 'Phone or WhatsApp', optional: '(optional)', code: 'Code',
  city: 'City', state: 'State', country: 'Country', choose: 'Select', allCountries: 'All countries',
  yourGender: 'Your gender', male: 'Male', female: 'Female', yourAgeRange: 'Your age range',
  adultB: "I'm 21 or older.", adultRest: 'Apnay is for people 21 and over.',
  emailB: 'Send me updates and early access from Apnay.', emailRest: 'Unsubscribe anytime.',
  smsB: 'Text or WhatsApp me updates from Apnay.', smsRest: 'Msg & data rates may apply. Reply STOP to opt out. Not required to sign up.',
  submit: 'Sign up for launch updates', sending: 'Signing up…',
  fine: 'We never sell your details.', fineLink: 'How we use them', privacyNote: 'Privacy note',
  eWho: "Choose who you're signing up for.", eFirst: 'Enter your first name.', eLast: 'Enter your last name.',
  eEmail: 'Enter a valid email address, like name@example.com.',
  eCode: 'Choose your country code, or leave the number blank.',
  ePhone: 'That number looks too short. Include your country code, or leave it blank.',
  eCountry: 'Choose your country.', eState: 'Choose your state.', eCity: 'Enter your city.',
  eGender: 'Choose Male or Female.', eAge: 'Choose your age range.',
  eAdult: "Tick the box to confirm you're 21 or older.",
  eEmailOptIn: "Tick the box so we can email you — that's how you'll hear about launch.",
  eNetwork: "We couldn't reach the server. Check your connection and try again.",
  eBusy: 'Too many sign-ups from here. Please try again later.',
  oneMore: 'One more step.', onList: "You're on the list.", already: "You're already on the list.",
  inboxKicker: 'CHECK YOUR INBOX', inboxSent: "We've sent a confirmation to {email}. Tap the link in it and you're in.",
  inboxHelp: 'Nothing there? Look in spam or promotions, or write to {mail}.',
  placeLabel: 'Your place in line', placeOf: 'of {total} on the waitlist',
  moveUp: 'Move up the list', moveUpText: 'Every friend who joins with your link moves you up {n} places.',
  pickPicture: 'Pick a picture to send with your link', sharePicture: 'Share with this picture', savePicture: 'Save the picture instead',
  pictureSaved: 'Picture saved. Attach it to your message with your link.',
  shareWa: 'Share on WhatsApp', copy: 'Copy link', copied: 'Copied',
  friendsNone: 'No friends have joined with your link yet.',
  friendsOne: '{n} friend has joined with your link.', friendsOther: '{n} friends have joined with your link.',
  waText: "Done swiping? Ready for a real recommendation? I'm on the Apnay waitlist — join with my link: {link}",
  follow: 'Until then, follow along at {handle} on Instagram and TikTok.',
  confirmedPill: "You're confirmed. You're on the list.",
  linkUsed: "This link has already been used. If you confirmed before, you're all set.",
  aboutTitle: 'Would you like to tell us a little about them?',
  aboutText: "Completely optional. It helps us get things ready for the person you're signing up for. We don't ask for their name or contact details, and we never contact them.",
  theyAreMy: 'They are my', theirGender: 'Their gender', theirAgeRange: 'Their age range', whereTheyLive: 'Where do they live?',
  saveContinue: 'Save and continue', skipForNow: 'Skip for now',
  unsubTitle: "You're unsubscribed.", unsubText: "You won't get any more emails or texts from Apnay. Changed your mind? Write to hello@apnay.app.",
  relSON: 'Son', relDAUGHTER: 'Daughter', relBROTHER: 'Brother', relSISTER: 'Sister', relNEPHEW: 'Nephew', relNIECE: 'Niece',
  relGRANDSON: 'Grandson', relGRANDDAUGHTER: 'Granddaughter', relCOUSIN: 'Cousin', relFRIEND: 'Friend', relOTHER: 'Someone else',
};
const RELATIONS = ['DAUGHTER', 'SON', 'SISTER', 'BROTHER', 'NIECE', 'NEPHEW', 'GRANDDAUGHTER', 'GRANDSON', 'COUSIN', 'FRIEND', 'OTHER'];
const AGE_RANGES = [['21-24', '21–24'], ['25-29', '25–29'], ['30-34', '30–34'], ['35-39', '35–39'], ['40-44', '40–44'], ['45-49', '45–49'], ['50+', '50+']];

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const form = $('#join');
const topEl = $('#top');
const done = $('.done');
const about = $('.about');
const errorBox = $('.error', form);
const submit = $('button[type="submit"]', form);
const params = new URLSearchParams(location.search);
const DATA = window.APNAY_DATA || { calling: {}, states: {} };

let lang = 'en';
let dict = EN;
let errorKey = null; // the error on screen, kept as a key so it can be re-translated
let view = null; // { body, email, via } of the screen after signing up, for re-translating
let picked = 0; // which share picture is chosen


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
  $$('.lang-current').forEach((node) => { node.textContent = lang.split('-')[0].toUpperCase(); });
  $$('.lang-select').forEach((select) => {
    select.value = lang;
    select.setAttribute('aria-label', t('changeLanguage'));
    select.querySelector('option[value="other"]').textContent = t('otherLanguage');
  });
  document.title = `Apnay — ${t('formTitle')}`;
  buildCountries();
  buildAges();
  buildRelations();
  if (errorKey) showError(errorKey);
  if (view) render();
}

// The language menu: the phone's own list, opened from the small button at the top right.
function buildMenus() {
  $$('.lang-select').forEach((select) => {
    LANGS.forEach(([code, name, english]) => select.append(new Option(code === 'en' ? name : `${name} · ${english}`, code)));
    select.append(new Option(EN.otherLanguage, 'other'));
    select.addEventListener('change', async () => {
      if (select.value === 'other') {
        $('.lang-other').hidden = false;
        select.value = lang;
        window.scrollTo(0, 0);
        return;
      }
      $('.lang-other').hidden = true;
      store.set(select.value);
      await setLang(select.value);
    });
  });
}

// ---- countries, states, calling codes, ages, relations ---------------------------------------
const FIRST = ['US', 'CA', 'GB', 'PK', 'IN', 'BD', 'AE', 'SA', 'QA', 'AU'];
const ALL = Object.keys(DATA.calling);
function regionNames(code) {
  try { return new Intl.DisplayNames([code === 'pa-Arab' ? 'ur' : code, 'en'], { type: 'region' }); } catch { return { of: (c) => c }; }
}
const EN_NAMES = regionNames('en');
const isoOf = (englishName) => ALL.find((c) => EN_NAMES.of(c) === englishName);

/** Country lists in the chosen language; the stored value is always the English name. */
function buildCountries() {
  const names = regionNames(lang);
  const collator = new Intl.Collator(lang === 'pa-Arab' ? 'ur' : lang);
  const sorted = ALL.filter((c) => !FIRST.includes(c)).sort((a, b) => collator.compare(names.of(a), names.of(b)));
  for (const select of [form.country, $('#aboutCountry')]) {
    const chosen = select.value;
    select.replaceChildren(new Option(t('choose'), ''));
    FIRST.forEach((c) => select.append(new Option(names.of(c), EN_NAMES.of(c))));
    const rest = document.createElement('optgroup');
    rest.label = t('allCountries');
    sorted.forEach((c) => rest.append(new Option(names.of(c), EN_NAMES.of(c))));
    select.append(rest);
    select.value = chosen;
  }
  // calling codes: "United States (+1)" in the list, "+1" on the button
  const code = form.phoneCode;
  const chosenCode = code.value;
  code.replaceChildren(new Option(t('code'), ''));
  [...FIRST, ...sorted].forEach((c) => code.append(new Option(`${names.of(c)} (+${DATA.calling[c]})`, c)));
  code.value = chosenCode;
  showCode();
}

function showCode() {
  const iso = form.phoneCode.value;
  $('.code-shown').textContent = iso ? `+${DATA.calling[iso]}` : t('code');
  $('.code-box').classList.toggle('empty', !iso);
}

function buildStates() {
  const iso = isoOf(form.country.value);
  const list = DATA.states[iso];
  $('#f-state').hidden = !list;
  const chosen = form.state.value;
  form.state.replaceChildren(new Option(t('choose'), ''), ...(list || []).map((s) => new Option(s, s)));
  form.state.value = list && list.includes(chosen) ? chosen : '';
}

function buildAges() {
  $$('.age-select').forEach((select) => {
    const chosen = select.value;
    select.replaceChildren(new Option(t('choose'), ''), ...AGE_RANGES.map(([v, label]) => new Option(label, v)));
    select.value = chosen;
  });
}

function buildRelations() {
  const select = $('#aboutRelation');
  const chosen = select.value;
  select.replaceChildren(new Option(t('choose'), ''), ...RELATIONS.map((r) => new Option(t(`rel${r}`), r)));
  select.value = chosen;
}

form.phoneCode.addEventListener('change', showCode);
form.country.addEventListener('change', () => {
  buildStates();
  // a sensible calling code, unless one was already chosen
  const iso = isoOf(form.country.value);
  if (iso && !form.phoneCode.value) { form.phoneCode.value = iso; showCode(); }
});

// ---- form behaviour -------------------------------------------------------------------------
const ref = (params.get('ref') || '').trim().toUpperCase().slice(0, 12);
if (ref) $('.invited').hidden = false;

const smsTick = $('#f-smsOptIn');
form.phone.addEventListener('input', () => {
  const hasNumber = form.phone.value.trim() !== '';
  smsTick.hidden = !hasNumber;
  if (!hasNumber) form.smsOptIn.checked = false;
});

form.addEventListener('change', (e) => clearError(e.target.closest('.field, .tick')));
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
    const input = field.querySelector('input:not([type=hidden]), select');
    if (input) input.focus({ preventScroll: true });
    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  showError(key);
}

const value = (name, root = form) => (root[name] && root[name].value ? String(root[name].value).trim() : '');
const radio = (name, root = form) => (root.querySelector(`input[name="${name}"]:checked`) || {}).value || '';

// One message at a time, in the form's order.
function firstProblem() {
  if (!radio('who')) return ['f-who', 'eWho'];
  if (!value('firstName')) return ['f-firstName', 'eFirst'];
  if (!value('lastName')) return ['f-lastName', 'eLast'];
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value('email'))) return ['f-email', 'eEmail'];
  const phone = value('phone');
  if (phone && !form.phoneCode.value) return ['f-phone', 'eCode'];
  if (phone && phone.replace(/\D/g, '').length < 6) return ['f-phone', 'ePhone'];
  if (!value('country')) return ['f-country', 'eCountry'];
  if (!$('#f-state').hidden && !value('state')) return ['f-state', 'eState'];
  if (!value('city')) return ['f-city', 'eCity'];
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

async function post(path, body) {
  const res = await fetch(`${API}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return { ok: res.ok, body: await res.json().catch(() => ({})) };
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const problem = firstProblem();
  if (problem) return fail(...problem);
  errorBox.hidden = true;
  errorKey = null;
  submit.disabled = true;
  submit.textContent = t('sending');
  const number = value('phone');
  try {
    const { ok, body } = await post('', {
      who: radio('who'),
      firstName: value('firstName'),
      lastName: value('lastName'),
      email: value('email'),
      phone: number ? `+${DATA.calling[form.phoneCode.value]} ${number}` : null,
      country: value('country'),
      state: $('#f-state').hidden ? null : value('state'),
      city: value('city'),
      gender: radio('gender'),
      ageRange: value('ageRange'),
      adult: form.adult.checked,
      emailOptIn: form.emailOptIn.checked,
      smsOptIn: Boolean(number) && form.smsOptIn.checked,
      language: lang,
      ref: ref || null,
      source: (params.get('utm_source') || params.get('src') || (document.referrer ? hostOf(document.referrer) : '') || '').slice(0, 60) || null,
      website: value('website'),
    });
    if (!ok || !body.ok) return fail(...(SERVER_ERRORS[body.message] || [null, 'eNetwork']));
    // kept only until they tap the confirm link, for their share pictures
    if (body.confirmationSent && body.status) mine.set(body.status);
    show(body, value('email'), 'signup');
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

// ---- after signing up: which screen ------------------------------------------------------------
const mine = {
  get() { try { return JSON.parse(localStorage.getItem(MINE_KEY) || 'null'); } catch { return null; } },
  set(v) { try { localStorage.setItem(MINE_KEY, JSON.stringify(v)); } catch { /* private mode */ } },
  clear() { try { localStorage.removeItem(MINE_KEY); } catch { /* private mode */ } },
};

function clearAddress() {
  try { history.replaceState(null, '', '/'); } catch { /* sandboxed preview */ }
}

// body: the server's answer. Signing up returns your details (you just typed them); the confirm link and
// the "about them" step return only your place in line, so the pictures use what this browser kept.
function show(body, email, via) {
  if (!body.status && body.place) {
    const kept = mine.get();
    const yours = kept && kept.code === body.place.code ? kept : {};
    body.status = { ...yours, ...body.place, confirmed: true };
    if (via === 'confirm') mine.clear();
  }
  view = { body, email, via, aboutKey: body.aboutKey || null };
  picked = 0;
  render();
  window.scrollTo(0, 0);
}

function render() {
  const { body } = view;
  const status = body.status;
  const showAbout = Boolean(status && view.aboutKey && !body.confirmationSent);
  [form, $('.unsubscribed')].forEach((n) => { n.hidden = true; });
  step(showAbout ? 'about' : 'done',
    showAbout ? (view.via === 'confirm' ? 'ledeAboutConfirmed' : 'ledeAbout') : body.confirmationSent ? 'ledeInbox' : 'ledeDone');
  about.hidden = !showAbout;
  done.hidden = showAbout;
  if (showAbout) renderAbout(); else renderDone();
  (showAbout ? about : done).focus({ preventScroll: true });
}

// Phones show the headline only on the form; desktops keep it on the left on every step, with a line for that step.
function step(name, ledeKey) {
  document.body.dataset.step = name;
  const lede = $('.lede', topEl);
  lede.dataset.i18n = ledeKey;
  lede.textContent = t(ledeKey);
  $('.invited').hidden = true;
}

// 7: about them
function renderAbout() {
  $('.confirmed-text').textContent = view.via === 'confirm' ? t('confirmedPill') : t('onList');
}

$('#aboutForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  await answerAbout({
    relation: $('#aboutRelation').value || null,
    gender: radio('aboutGender', $('#aboutForm')) || null,
    ageRange: $('#aboutAgeRange').value || null,
    country: $('#aboutCountry').value || null,
  });
});
$('.skip-about').addEventListener('click', () => answerAbout({ skip: true }));

async function answerAbout(answers) {
  const buttons = $$('#aboutForm button');
  buttons.forEach((b) => { b.disabled = true; });
  try {
    const { ok, body } = await post('/about', { token: view.aboutKey, ...answers });
    if (ok && body.place) {
      const status = { ...view.body.status, ...body.place, aboutRelation: answers.relation || null };
      show({ ...view.body, status, place: null, aboutKey: null }, view.email, 'about');
      return;
    }
  } catch { /* fall through */ }
  // the answer is optional: if it can't be saved, carry on to the list anyway
  view.aboutKey = null;
  render();
  buttons.forEach((b) => { b.disabled = false; });
}

// 5, 8, 9: one more step / you're on the list / pick a picture
function renderDone() {
  const { body, email } = view;
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
    // the pictures come once they're confirmed (step 8), not while the e-mail is still to be opened,
    // and only where this browser knows the details they're made from
    const pictures = !body.confirmationSent && Boolean(status.firstName);
    $('.pictures').hidden = !pictures;
    if (pictures) drawPictures(status);
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

// ---- share pictures: 1080×1080 cards (four for someone you care about, three for yourself) made from the person's own details --------------------
const C = { pink: '#FF2D78', deep: '#c4185a', tint: '#FFF0F5', ink: '#17171A', grey: '#6b6670', white: '#ffffff', night: '#1c1a1f' };
const DISPLAY = '"Bricolage Grotesque", "Avenir Next", system-ui, sans-serif';
const BODY = '"DM Sans", -apple-system, "Segoe UI", system-ui, sans-serif';
let canvases = [];

function cardWords(status) {
  const name = status.firstName || 'Someone';
  const pron = status.gender === 'FEMALE' ? 'her' : status.gender === 'MALE' ? 'his' : 'their';
  const obj = status.gender === 'FEMALE' ? 'her' : status.gender === 'MALE' ? 'him' : 'them';
  const rel = status.aboutRelation && status.aboutRelation !== 'OTHER' ? EN[`rel${status.aboutRelation}`].toLowerCase() : null;
  const place = [status.city, status.state || status.country].filter(Boolean).join(', ');
  const subj = status.gender === 'FEMALE' ? 'she loves' : status.gender === 'MALE' ? 'he loves' : 'they love';
  // only for someone they care about: "Shahida saved a place for her daughter." / "…for someone she loves."
  const savedFor = rel ? ` for ${pron} ${rel}.` : ` for someone ${subj}.`;
  const savedLead = `${name} saved a place`;
  return { name, obj, place, city: status.city, savedLead, savedFor, number: status.place };
}

function logo(ctx, x, y, size, color) {
  // APNAY in spaced letters, at a set width (4.79 × the letter size)
  ctx.fillStyle = color;
  ctx.font = `800 ${size}px ${DISPLAY}`;
  const letters = 'APNAY'.split('');
  const logoWidth = size * 4.79;
  const gap = (logoWidth - letters.reduce((w, l) => w + ctx.measureText(l).width, 0)) / (letters.length - 1);
  let cx = x;
  letters.forEach((l) => { ctx.fillText(l, cx, y); cx += ctx.measureText(l).width + gap; });
}

/** Writes wrapped text; returns the y below the last line. */
function wrap(ctx, text, x, y, width, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > width && line) { ctx.fillText(line, x, y); y += lineHeight; line = word; } else line = test;
  }
  if (line) { ctx.fillText(line, x, y); y += lineHeight; }
  return y;
}

/** How many lines wrap() would use. */
function countLines(ctx, text, width) {
  let lines = 1, line = '';
  for (const word of text.split(' ')) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > width && line) { lines += 1; line = word; } else line = test;
  }
  return lines;
}

/** Two-colour headline that wraps across both parts (lead in one colour, tail in another). */
function twoTone(ctx, lead, tail, x, y, width, lineHeight, leadColor, tailColor) {
  const words = [...lead.split(' ').map((w) => [w, leadColor]), ...tail.trim().split(' ').map((w) => [w, tailColor])];
  let lines = [[]];
  let lineWidth = 0;
  const space = ctx.measureText(' ').width;
  for (const [w, c] of words) {
    const ww = ctx.measureText(w).width;
    if (lineWidth + ww > width && lines[lines.length - 1].length) { lines.push([]); lineWidth = 0; }
    lines[lines.length - 1].push([w, c]);
    lineWidth += ww + space;
  }
  for (const line of lines) {
    let cx = x;
    for (const [w, c] of line) { ctx.fillStyle = c; ctx.fillText(w, cx, y); cx += ctx.measureText(w).width + space; }
    y += lineHeight;
  }
  return y;
}

function drawCard(kind, w) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'alphabetic';
  const M = 84;
  if (kind === 0) { // light: "Shahida saved a place for her daughter."
    ctx.fillStyle = C.tint; ctx.fillRect(0, 0, 1080, 1080);
    ctx.fillStyle = C.pink; ctx.beginPath(); ctx.arc(1010, 70, 260, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(880, 250, 34, 0, Math.PI * 2); ctx.fill();
    logo(ctx, M, 150, 64, C.pink);
    const subline = 'Ready for a real recommendation? Save a place for someone you love.';
    ctx.font = `800 96px ${DISPLAY}`;
    const headLines = countLines(ctx, `${w.savedLead}${w.savedFor}`, 860);
    ctx.font = `400 36px ${BODY}`;
    const subLines = countLines(ctx, subline, 820);
    // last line of the small text sits above the footer, whatever the name and relation
    const top = Math.min(640, 920 - headLines * 104 - 28 - (subLines - 1) * 50);
    ctx.font = `800 96px ${DISPLAY}`;
    const y = twoTone(ctx, w.savedLead, w.savedFor, M, top, 860, 104, C.ink, C.pink);
    ctx.fillStyle = C.grey; ctx.font = `400 36px ${BODY}`;
    wrap(ctx, subline, M, y + 28, 820, 50);
    ctx.fillStyle = C.pink; ctx.font = `600 36px ${BODY}`; ctx.fillText('apnay.app', M, 1000);
  } else if (kind === 1) { // dark: early access pass
    ctx.fillStyle = C.night; ctx.fillRect(0, 0, 1080, 1080);
    logo(ctx, M, 150, 64, C.pink);
    ctx.fillStyle = C.white; roundRect(ctx, M, 300, 912, 480, 36); ctx.fill();
    ctx.fillStyle = C.pink; roundRect(ctx, 700, 340, 236, 400, 28); ctx.fill();
    ctx.fillStyle = C.white; ctx.textAlign = 'center';
    ctx.font = `600 30px ${BODY}`; ctx.fillText('PLACE', 818, 470);
    let size = 84; // shrink until the number fits inside the tag
    do { ctx.font = `800 ${size}px ${DISPLAY}`; size -= 4; } while (ctx.measureText(`#${w.number}`).width > 196 && size > 30);
    ctx.fillText(`#${w.number}`, 818, 570);
    ctx.textAlign = 'left';
    ctx.fillStyle = C.pink; ctx.font = `600 32px ${BODY}`; ctx.fillText('Early access', M + 48, 390);
    ctx.fillStyle = C.ink; ctx.font = `800 88px ${DISPLAY}`; wrap(ctx, w.name, M + 48, 620, 540, 92);
    ctx.fillStyle = C.grey; ctx.font = `400 34px ${BODY}`; wrap(ctx, w.place, M + 48, 700, 540, 44);
    ctx.fillStyle = C.white; ctx.font = `500 36px ${BODY}`; ctx.fillText('Something different is coming.', M, 980);
    ctx.fillStyle = C.pink; ctx.font = `600 36px ${BODY}`; ctx.textAlign = 'right'; ctx.fillText('apnay.app', 1080 - M, 980); ctx.textAlign = 'left';
  } else if (kind === 2) { // pink: talking stage / the real thing
    ctx.fillStyle = C.pink; ctx.fillRect(0, 0, 1080, 1080);
    logo(ctx, M, 150, 64, C.white);
    ctx.font = `800 104px ${DISPLAY}`;
    ctx.fillStyle = 'rgba(255,255,255,.62)'; ctx.fillText('Talking stage.', M, 560);
    const strike = ctx.measureText('Talking stage.').width;
    ctx.fillRect(M, 524, strike, 10);
    ctx.fillStyle = C.white; ctx.fillText('The real thing.', M, 676);
    ctx.font = `400 36px ${BODY}`;
    wrap(ctx, `${w.name}${w.city ? ` from ${w.city}` : ''} is on the list for what's next.`, M, 760, 860, 50);
    ctx.font = `600 36px ${BODY}`; ctx.fillText(`Join ${w.obj} → apnay.app`, M, 1000);
  } else { // pink: big place number
    ctx.fillStyle = C.pink; ctx.fillRect(0, 0, 1080, 1080);
    logo(ctx, M, 150, 64, C.white);
    ctx.fillStyle = C.white; ctx.font = `800 ${w.number > 99999 ? 200 : 260}px ${DISPLAY}`; ctx.fillText(`#${w.number}`, M - 8, 600);
    ctx.font = `800 64px ${DISPLAY}`; let y = wrap(ctx, `${w.name} is on the list.`, M, 700, 900, 72);
    ctx.font = `400 36px ${BODY}`; wrap(ctx, 'Done swiping? Ready for a real recommendation?', M, y + 10, 860, 50);
    ctx.font = `600 36px ${BODY}`; ctx.fillText(`Join ${w.obj} → apnay.app`, M, 1000);
  }
  return canvas;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

async function drawPictures(status) {
  try {
    await Promise.all([`800 64px ${DISPLAY}`, `400 36px ${BODY}`, `600 36px ${BODY}`, `500 36px ${BODY}`].map((f) => document.fonts.load(f)));
  } catch { /* draw with fallbacks */ }
  const words = cardWords(status);
  const kinds = status.who === 'FAMILY' ? [0, 1, 2, 3] : [1, 2, 3];
  canvases = kinds.map((k) => drawCard(k, words));
  const grid = $('.picture-grid');
  grid.classList.toggle('three', kinds.length === 3);
  grid.replaceChildren(...canvases.map((c, i) => {
    const b = el('button', '', { type: 'button', className: 'picture' + (i === picked ? ' picked' : '') });
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', String(i === picked));
    b.append(el('img', '', { src: c.toDataURL('image/png'), alt: '' }));
    b.addEventListener('click', () => {
      picked = i;
      $$('.picture', grid).forEach((p, j) => { p.classList.toggle('picked', j === i); p.setAttribute('aria-checked', String(j === i)); });
    });
    return b;
  }));
}

const pictureFile = () => new Promise((resolve) => canvases[picked].toBlob((blob) => resolve(new File([blob], 'apnay.png', { type: 'image/png' })), 'image/png'));

function savePicture(file) {
  const url = URL.createObjectURL(file);
  const a = el('a', '', { href: url, download: 'apnay.png' });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  const note = $('.picture-note');
  note.textContent = t('pictureSaved');
  note.hidden = false;
}

$('.share-picture').addEventListener('click', async () => {
  const file = await pictureFile();
  const link = $('.share-url').textContent;
  const text = t('waText').replace('{link}', link);
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], text }); return; } catch (err) { if (err && err.name === 'AbortError') return; }
  }
  savePicture(file); // no picture sharing here (most desktops): save it to attach by hand
});
$('.save-picture').addEventListener('click', async () => savePicture(await pictureFile()));

// ---- start: the form, or a link from the e-mail / your own link --------------------------------
// The e-mail's keys each do one thing; neither stays in the address bar once used.
async function start() {
  const confirm = (params.get('confirm') || '').trim();
  const unsubscribe = (params.get('unsubscribe') || '').trim();
  if (params.has('me')) clearAddress(); // the old private links are retired
  try {
    if (unsubscribe) {
      const { ok } = await post('/unsubscribe', { token: unsubscribe });
      clearAddress();
      if (ok) {
        mine.clear();
        form.hidden = true;
        step('unsubscribed', 'lede');
        $('.unsubscribed').hidden = false;
      }
      return;
    }
    if (confirm) {
      const { ok, body } = await post('/confirm', { token: confirm });
      clearAddress();
      if (ok && body.place) show(body, '', 'confirm');
      else $('.link-used').hidden = false;
      return;
    }
  } catch { /* offline: leave the form */ }
}

(async () => {
  // English only at launch (decided 10 Nov). The translations stay in i18n/ for later; the menu is gone.
  await setLang('en');
  buildStates();
  start();
})();
