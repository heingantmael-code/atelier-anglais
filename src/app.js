// ====== OUTILS ======
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const DAY = 864e5;
const today = (t = Date.now()) => { const d = new Date(t); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
const hash = s => hash32(s).toString(36);
const BOX = [0, 1, 3, 7, 16, 35];          // carnet d'erreurs (jours)
const LV = ["A1.1", "A1.2", "A2.1", "A2.2", "B1.1", "B1.2", "B2.1", "B2.2", "C1.1", "C1.2"];
const LVNAME = {A1: "Débutant", A2: "Élémentaire", B1: "Intermédiaire", B2: "Avancé", C1: "Autonome"};
const CEFR = ["A1", "A2", "B1", "B2", "C1"];
const SKILLS = [["gram", "Grammaire"], ["voc", "Vocabulaire"], ["lis", "Écoute"], ["read", "Lecture"], ["oral", "Oral"]];
const WIN = 15, UP = .85, DOWN = .5;       // palier : 15 points de réponses pondérées, ≥ 85 % on monte, < 50 % on descend

const CONTR = {"i'm":"i am","you're":"you are","he's":"he is","she's":"she is","it's":"it is","we're":"we are","they're":"they are","don't":"do not","doesn't":"does not","didn't":"did not","isn't":"is not","aren't":"are not","wasn't":"was not","weren't":"were not","can't":"cannot","won't":"will not","haven't":"have not","hasn't":"has not","hadn't":"had not","i've":"i have","you've":"you have","we've":"we have","they've":"they have","i'll":"i will","you'll":"you will","he'll":"he will","she'll":"she will","it'll":"it will","we'll":"we will","they'll":"they will","i'd":"i would","you'd":"you would","he'd":"he would","she'd":"she would","we'd":"we would","they'd":"they would","shouldn't":"should not","wouldn't":"would not","couldn't":"could not","mustn't":"must not","needn't":"need not","let's":"let us","that's":"that is","there's":"there is","what's":"what is","who's":"who is","'s":"is","'re":"are","'ll":"will","'ve":"have","'d":"would","'m":"am","ok":"okay","six":"6","ten":"10","two":"2","three":"3"};
function norm(s) {
  s = String(s || "").toLowerCase().replace(/[’‘`´]/g, "'").replace(/\(.*?\)/g, " ").replace(/[^a-z0-9àâäçéèêëîïôöùûüœ' ]+/g, " ").replace(/\s+/g, " ").trim();
  return s.split(" ").map(w => CONTR[w] || w).join(" ").replace(/\bcan not\b/g, "cannot").replace(/\bmovie\b/g, "film");
}
function lev(a, b) {
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let prev = Array.from({length: n + 1}, (_, j) => j);
  for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; }
  return prev[n];
}
function matchAnswer(user, answers, tolerant, minLen = 10) {
  const u = norm(user); if (!u) return {ok: false};
  for (const a of answers) if (norm(a) === u) return {ok: true};
  if (tolerant) for (const a of answers) { const n = norm(a); if (n.length >= minLen && lev(u, n) <= Math.max(1, Math.floor(n.length / (S.li >= 6 ? 24 : 18)))) return {ok: true, typo: a}; }
  return {ok: false};
}
function wordDiff(target, said) {
  const t = norm(target).split(" ").filter(Boolean), s = norm(said).split(" ").filter(Boolean);
  let j = 0, hit = 0; const marks = t.map(w => { const k = s.indexOf(w, j); if (k >= 0 && k - j <= 3) { j = k + 1; hit++; return [w, 1]; } return [w, 0]; });
  return {score: t.length ? hit / t.length : 0, marks};
}
const alts = s => String(s).split(" / ").map(x => x.trim()).filter(Boolean);
const show = s => alts(s).join(", ");
const stripTo = s => s.replace(/^to /i, "");

// ====== ÉTAT ======
const KEY = "atelier-anglais-v1";
const newSkills = li => Object.fromEntries(SKILLS.map(([k]) => [k, {li, n: 0, ok: 0}]));
const defaults = () => ({v: 3, li: 2, sk: newSkills(2), accent: "en-US", focus: "both", lvlLog: [], placed: false, days: {}, hist: {}, units: {}, rules: {}, bilan: {}, mist: [], sec: 0, answered: 0, correct: 0, spoken: 0, ts: {}, voc: {}, mine: [], exs: {}, read: {}, writing: {}, dlg: {}, dict: {}, trs: {}, extra: {}, aitexts: [], updatedAt: 0});
function migrate(o) {
  const s = Object.assign(defaults(), o);
  if (o && o.level && o.li == null) s.li = Math.max(0, CEFR.indexOf(o.level)) * 2;
  if (!o || !o.sk) s.sk = newSkills(s.li);
  SKILLS.forEach(([k]) => { if (!s.sk[k]) s.sk[k] = {li: s.li, n: 0, ok: 0}; });
  delete s.level; delete s.win; s.v = 3;
  s.mist = (s.mist || []).filter(m => !String(m.k).startsWith("r:"));
  Object.keys(s.extra || {}).forEach(k => { s.extra[k] = s.extra[k].slice(0, 60); });
  return s;
}
let S = defaults();
try { const raw = localStorage.getItem(KEY); if (raw) S = migrate(JSON.parse(raw)); } catch (e) {}
const skLi = sk => sk ? S.sk[sk].li : S.li;
const cefr = sk => LV[skLi(sk)].slice(0, 2);
const cefrIdx = sk => Math.floor(skLi(sk) / 2);
const levelPrompt = sk => `${LV[skLi(sk)]} sur l'échelle CECRL (${LVNAME[cefr(sk)].toLowerCase()}${skLi(sk) % 2 ? ", fin du niveau" : ", début du niveau"})`;
const IN_CLAUDE = !!(window.claude && window.claude.use);

// --- sauvegarde : navigateur + compte (3 documents)
let cloudCol = null, cloudBusy = false, cloudAgain = false, cloudTimer = 0, cloudOn = false;
const pushed = {};
const parts = () => { const {voc, extra, aitexts, mine, exs, trs, ...core} = S; return {progress: core, vocab: {voc, mine, exs}, extra: {extra, aitexts, trs}}; };
function save() {
  S.updatedAt = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  if (cloudCol) { clearTimeout(cloudTimer); cloudTimer = setTimeout(pushCloud, 2000); }
  if (ACC.id) { clearTimeout(ACC.timer); ACC.timer = setTimeout(accPush, 6000); }   // une sauvegarde au plus toutes les ~6 s (offre gratuite)
}
// --- compte : un simple identifiant ; la progression est enregistrée sur le serveur de l'appli
const ACC = {id: null, timer: 0, busy: false, again: false, last: 0, err: ""};
try { ACC.id = localStorage.getItem("atelier-account") || null; } catch (e) {}
const accClean = id => String(id || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9_-]/g, "").slice(0, 40);
const ACC_OK = () => !IN_CLAUDE && /^https?:/.test(location.protocol);
const API_BASE = /\.vercel\.app$/.test(location.hostname) ? "" : "https://atelier-anglais-mauve.vercel.app";
const apiUrl = id => API_BASE + "/api/progress?id=" + encodeURIComponent(id);
async function accPush(keepalive) {
  if (!ACC.id || !ACC_OK()) return;
  if (ACC.busy) { ACC.again = true; return; }
  ACC.busy = true;
  try {
    const r = await fetch(apiUrl(ACC.id), {method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify({updatedAt: S.updatedAt, data: S}), keepalive: !!keepalive});
    if (r.ok) { ACC.last = Date.now(); ACC.err = ""; }
    else if (r.status === 409) { ACC.err = ""; await accPull(true); }       // un autre appareil a plus récent : on le récupère
    else if (r.status === 429) { clearTimeout(ACC.timer); ACC.timer = setTimeout(accPush, 6000); }   // trop rapproché : nouvel envoi dans quelques secondes
    else ACC.err = "La sauvegarde en ligne a échoué (" + r.status + "). Ta progression reste gardée sur cet appareil.";
  } catch (e) { ACC.err = "Pas de connexion : la progression sera envoyée dès que possible."; }
  ACC.busy = false;
  if (ACC.again) { ACC.again = false; accPush(); }
}
// Récupère la progression du compte ; garde la plus récente des deux (appareil / serveur)
async function accPull(silent) {
  if (!ACC.id || !ACC_OK()) return;
  try {
    const r = await fetch(apiUrl(ACC.id), {cache: "no-store"});
    if (r.status === 404) { await accPush(); return "new"; }
    if (!r.ok) throw new Error(r.status);
    const j = await r.json();
    if ((j.updatedAt || 0) > (S.updatedAt || 0)) {
      S = migrate(j.data); S.updatedAt = j.updatedAt;
      try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
      ACC.last = Date.now();
      if (!silent && idle()) render();
      return "loaded";
    }
    if ((S.updatedAt || 0) > (j.updatedAt || 0)) await accPush();
    ACC.last = Date.now();
    return "same";
  } catch (e) { ACC.err = "Impossible de joindre le serveur de sauvegarde pour l'instant."; return "error"; }
}
// Connexion : l'identifiant doit exister. Création : l'identifiant doit être libre (la progression de cet appareil y est enregistrée).
async function accEnter(raw, create) {
  const id = accClean(raw);
  const msg = t => { const m = $("#loginmsg"); if (m) { m.hidden = false; m.textContent = t; } };
  if (id.length < 3) { msg("L'identifiant doit faire au moins 3 caractères (lettres, chiffres, - ou _)."); return; }
  const btn = $("#loginbtn"); if (btn) { btn.disabled = true; btn.textContent = create ? "Création…" : "Connexion…"; }
  let r;
  try { r = await fetch(apiUrl(id), {cache: "no-store"}); }
  catch (e) { msg("Impossible de joindre le serveur. Vérifie ta connexion internet et réessaie."); if (btn) { btn.disabled = false; btn.textContent = create ? "Créer mon compte" : "Se connecter"; } return; }
  if (!create && r.status === 404) { msg("Cet identifiant n'existe pas. Vérifie l'orthographe, ou crée un compte."); if (btn) { btn.disabled = false; btn.textContent = "Se connecter"; } return; }
  if (create && r.ok) { msg("Cet identifiant est déjà pris. Choisis-en un autre, ou connecte-toi s'il est à toi."); if (btn) { btn.disabled = false; btn.textContent = "Créer mon compte"; } return; }
  ACC.id = id; try { localStorage.setItem("atelier-account", id); } catch (e) {}
  if (create) { S.updatedAt = Date.now(); await accPush(); }
  else { const j = await r.json(); S = migrate(j.data); S.updatedAt = j.updatedAt; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  ACC.last = Date.now(); TAB = "home";
  render();
  toast(create ? "Compte « " + id + " » créé. Ta progression y est enregistrée automatiquement." : "Bon retour, " + id + " ! Ta progression est chargée.");
}
// Quitter : on envoie une dernière fois la progression, puis on vide l'appareil (le prochain compte repart de sa propre sauvegarde)
async function accLogout() {
  if (ACC.id) { clearTimeout(ACC.timer); await accPush(); }
  ACC.id = null; ACC.err = "";
  try { localStorage.removeItem("atelier-account"); localStorage.removeItem(KEY); } catch (e) {}
  S = defaults();
  render();
}
function renderLogin(create) {
  renderTabs(false);
  app.innerHTML = `<div class="wrap login">
    <div class="loginbox">
      <span class="eyebrow">Atelier d'anglais</span>
      <h1>${create ? "Créer un compte" : "Connexion"}</h1>
      <label for="loginid" class="small muted">${create ? "Choisis ton identifiant" : "Notez votre identifiant"}</label>
      <input id="loginid" class="field" autocomplete="username" autocapitalize="off" spellcheck="false" placeholder="${create ? "Ex. : maelhingant" : "Votre identifiant"}">
      <button class="btn primary block" id="loginbtn">${create ? "Créer mon compte" : "Se connecter"}</button>
      <p class="small loginmsg" id="loginmsg" hidden></p>
      <p class="small muted">${create ? "Juste un identifiant, sans mot de passe : garde-le pour toi." : "Pas encore de compte ?"} <button class="toggle" id="loginswap" type="button">${create ? "J'ai déjà un compte" : "Créer un compte"}</button></p>
    </div></div>`;
  const go2 = () => accEnter($("#loginid").value, create);
  $("#loginbtn").onclick = go2;
  $("#loginid").onkeydown = e => { if (e.key === "Enter") go2(); };
  $("#loginswap").onclick = () => renderLogin(!create);
  setTimeout(() => $("#loginid")?.focus(), 50);
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden" && ACC.id) { clearTimeout(ACC.timer); accPush(true); } });
async function pushCloud() {
  if (!cloudCol) return;
  if (cloudBusy) { cloudAgain = true; return; }
  cloudBusy = true;
  const p = parts();
  for (const k of Object.keys(p)) {
    const js = JSON.stringify(p[k]); if (pushed[k] === js) continue;
    try { await cloudCol.doc(k).set({json: js, updatedAt: S.updatedAt}); pushed[k] = js; } catch (e) { console.warn("sauvegarde", k, e); }
  }
  cloudBusy = false;
  if (cloudAgain) { cloudAgain = false; pushCloud(); }
}
async function initCloud() {
  if (!IN_CLAUDE) return;
  try {
    const [db, user] = await Promise.all([claude.use("db"), claude.use("user")]);
    if (!db || !user) return;
    const id = await user.id(); if (!id) return;
    cloudCol = db.collection("data/users/" + id);
    const [pr, vo, ex] = await Promise.all(["progress", "vocab", "extra"].map(k => cloudCol.doc(k).get()));
    if (pr.exists) {
      const core = JSON.parse(pr.data().json || "{}");
      if ((core.updatedAt || 0) > S.updatedAt) {
        const v = vo.exists ? JSON.parse(vo.data().json || "{}") : {};
        const x = ex.exists ? JSON.parse(ex.data().json || "{}") : {};
        S = migrate(Object.assign({}, core, v, x));
        const p = parts(); Object.keys(p).forEach(k => pushed[k] = JSON.stringify(p[k]));
        try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
        if (idle()) render();
      } else if (S.updatedAt > (core.updatedAt || 0)) pushCloud();
    } else if (S.updatedAt) pushCloud();
    cloudOn = true; if (idle() && TAB === "home") render();
  } catch (e) { console.warn("cloud", e); }
}

// ====== IA (Claude) ======
let sample = null, aiDenied = false;
const aiReady = () => !!sample && !aiDenied;
async function initAI() {
  if (!IN_CLAUDE) return;
  try { sample = await claude.use("sample"); } catch (e) { sample = null; }
  refreshAI();
}
function refreshAI() { $$(".ai-only").forEach(e => e.hidden = !aiReady()); $$(".ai-off").forEach(e => e.hidden = aiReady()); }
function aiErr(e) {
  const c = e && e.code;
  if (c === "not_granted") { aiDenied = true; refreshAI(); return "Accès à Claude refusé pour cette page. Les exercices intégrés restent disponibles."; }
  if (c === "rate_limited") return "Trop de demandes d'un coup. Attends une minute puis réessaie.";
  if (c === "cancelled") return "";
  if (c === "invalid_json") return "La réponse de l'IA était mal formée. Réessaie.";
  return "L'IA n'a pas pu répondre (" + (c || "erreur") + "). Réessaie dans un instant.";
}

// ====== AUDIO : enregistrements anglais, voix anglaise de l'appareil en secours, jamais de voix française ======
const AUD = {idx: null, idxP: null, packs: {}, packP: {}, el: new Audio(), seq: 0, unlocked: false};
AUD.el.preload = "auto";
function loadIndex() {
  if (!AUD.idxP) AUD.idxP = fetch("audio/index.json", {cache: "no-cache"}).then(r => r.ok ? r.json() : null).catch(() => null).then(j => {
    if (j && j.k) { AUD.idx = j; AUD.idxFailed = false; if (idle() && (TAB === "home" || TAB === "oral")) render(); }
    else { AUD.idxFailed = true; setTimeout(() => { AUD.idxP = null; loadIndex(); }, 20000); }  // on réessaie
    return j && j.k ? j : null;
  });
  return AUD.idxP;
}
function loadPack(g) {
  if (!AUD.packP[g]) AUD.packP[g] = fetch("audio/" + g + ".json").then(r => r.ok ? r.json() : {}).catch(() => ({})).then(j => AUD.packs[g] = j);
  return AUD.packP[g];
}
async function clipSrc(text, voice) {
  const idx = AUD.idx || await loadIndex(); if (!idx) return null;
  const k = clipKey(voice, text), g = idx.k[k]; if (!g) return null;
  const pack = AUD.packs[g] || await loadPack(g);
  return pack[k] ? "data:audio/mpeg;base64," + pack[k] : null;
}
function prefetchAudio(texts) {
  loadIndex().then(idx => { if (!idx) return; const gs = new Set(); texts.forEach(t => splitSpeech(t).forEach(p => { const g = idx.k[clipKey("a", p)] || idx.k[clipKey("b", p)]; if (g) gs.add(g); })); gs.forEach(loadPack); });
}
let voices = [], voicesReady = false, warned = false;
function loadVoices() { try { voices = speechSynthesis.getVoices(); } catch (e) {} if (voices.length) voicesReady = true; }
if ("speechSynthesis" in window) { speechSynthesis.onvoiceschanged = loadVoices; setTimeout(loadVoices, 0); setTimeout(loadVoices, 1500); }
const englishVoices = () => voices.filter(v => /^en/i.test(v.lang));
function pickVoice(second) {
  const all = englishVoices(); if (!all.length) return null;
  const pref = all.filter(v => v.lang.replace("_", "-").toLowerCase() === S.accent.toLowerCase());
  const pool = (pref.length ? pref : all).slice().sort((a, b) => /natural|neural|google|premium|enhanced|samantha|daniel|aria|jenny|sonia|libby/i.test(b.name) - /natural|neural|google|premium|enhanced|samantha|daniel|aria|jenny|sonia|libby/i.test(a.name));
  return second && pool.length > 1 ? pool[1] : pool[0];
}
const baseRate = () => S.li < 2 ? .9 : S.li < 4 ? .95 : 1;
function hush() { AUD.seq++; try { AUD.el.pause(); } catch (e) {} try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {} }
// iPhone : le son doit être débloqué une première fois par un geste
document.addEventListener("pointerdown", () => {
  if (AUD.unlocked) return; AUD.unlocked = true;
  loadIndex().then(idx => { if (idx && idx.silence && !AUD.el.src) { AUD.el.src = "data:audio/mpeg;base64," + idx.silence; AUD.el.play().catch(() => {}); } });
  try { if (englishVoices().length) { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; speechSynthesis.speak(u); } } catch (e) {}
}, true);
function playSrc(src, rate, seq) {
  return new Promise(res => {
    if (seq !== AUD.seq) return res(false);
    const el = AUD.el; el.onended = () => res(true); el.onerror = () => res(false);
    el.src = src; el.playbackRate = rate; try { el.preservesPitch = true; } catch (e) {}
    el.play().catch(() => res(false));
  });
}
function deviceSay(text, rate, second, seq) {
  return new Promise(res => {
    const v = pickVoice(second);
    if (!v || seq !== AUD.seq) return res(false);
    const u = new SpeechSynthesisUtterance(text); u.voice = v; u.lang = v.lang; u.rate = rate;
    u.onend = () => res(true); u.onerror = () => res(false);
    speechSynthesis.speak(u);
  });
}
// Peut-on entendre ce texte ? (enregistrement disponible ou voix anglaise sur l'appareil)
function canHear(text, voice = "a") {
  if (englishVoices().length) return true;
  if (!AUD.idx) return !AUD.idxFailed;  // index pas encore chargé : on suppose que oui
  return splitSpeech(text).every(p => AUD.idx.k[clipKey(voice, p)]);
}
function noAudio() {
  const msg = "Cette phrase n'a pas encore d'enregistrement anglais, et ton appareil n'a pas de voix anglaise : rien n'est lu (jamais de voix française). Solution immédiate : ouvre l'appli dans Microsoft Edge.";
  const box = $("#audiowarn"); if (box) { box.hidden = false; box.textContent = msg; } else toast(msg);
}
async function speak(text, rate = 1, voice = "a") {
  hush(); const seq = AUD.seq;
  const parts = splitSpeech(text); if (!parts.length) return;
  for (const p of parts) {
    if (seq !== AUD.seq) return;
    const src = await clipSrc(p, voice);
    if (seq !== AUD.seq) return;
    if (src) { await playSrc(src, rate * baseRate(), seq); continue; }
    if (englishVoices().length) { await deviceSay(p, rate * baseRate(), voice === "b", seq); continue; }
    noAudio();
    return;
  }
}
// --- micro (reconnaissance vocale) et enregistrement de sa propre voix
const APP_URL = "https://atelier-anglais-mauve.vercel.app";
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
// Dans claude.ai, la page n'a pas le droit d'utiliser le micro : on le dit au lieu d'afficher un bouton muet
const MIC_OK = !!SR && !IN_CLAUDE && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
let micBlocked = !MIC_OK, rec = null, micAllowed = false;
async function askMic() {
  if (micAllowed) return true;
  try {
    const st = await navigator.mediaDevices.getUserMedia({audio: true});
    st.getTracks().forEach(t => t.stop()); micAllowed = true; return true;
  } catch (e) {
    toast(e && e.name === "NotAllowedError"
      ? "Micro refusé. Pour l'autoriser : touche le cadenas à gauche de l'adresse (ou Réglages du site) › Micro › Autoriser, puis recharge la page."
      : "Aucun micro n'a été trouvé sur cet appareil.");
    return false;
  }
}
// Démarre l'écoute : le texte reconnu s'affiche au fur et à mesure ; onFinal reçoit la phrase complète
async function startListening(onText, onStop, onFinal) {
  if (!MIC_OK) return false;
  if (!(await askMic())) { onStop(); return false; }
  try {
    hush();
    rec = new SR(); rec.lang = "en-US"; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
    let finalText = "";
    rec.onresult = e => { let t = ""; for (const r of e.results) t += r[0].transcript; onText(t); if (e.results[e.results.length - 1].isFinal) finalText = t; };
    rec.onerror = e => {
      const m = {"no-speech": "Je n'ai rien entendu. Touche le micro et parle tout de suite après le signal.", "network": "La reconnaissance vocale a besoin d'une connexion internet.", "not-allowed": "Micro refusé : autorise-le dans les réglages du site, puis recharge la page.", "service-not-allowed": "Micro refusé : autorise-le dans les réglages du site, puis recharge la page.", "audio-capture": "Aucun micro n'a été trouvé sur cet appareil."}[e.error];
      if (m) toast(m);
      if (/not-allowed|audio-capture/.test(e.error)) micAllowed = false;
    };
    rec.onend = () => { rec = null; onStop(); if (finalText && onFinal) onFinal(finalText); };
    rec.start(); return true;
  } catch (e) { toast("Le micro n'a pas pu démarrer. Réessaie."); onStop(); return false; }
}
function stopListening() { try { rec && rec.stop(); } catch (e) {} }
// Bouton micro réutilisable pour toute zone où l'on répond en anglais
function micHTML(id) {
  if (MIC_OK) return `<button class="round mic" id="${id}" type="button" aria-label="Parler">${IC.mic}</button>`;
  return "";
}
function micNote() {
  if (MIC_OK) return `<p class="small muted" id="micstate">Touche le micro, autorise-le la première fois, puis parle en anglais : ta phrase s'écrit toute seule.</p>`;
  if (IN_CLAUDE) return `<p class="small micnote">Micro : claude.ai ne laisse pas cette page utiliser le micro. Pour parler à l'appli, ouvre la version installable : <a href="${APP_URL}" target="_blank" rel="noopener">${APP_URL.replace("https://", "")}</a>. Ici, tu peux dicter avec le micro de ton clavier.</p>`;
  return `<p class="small micnote">Ton navigateur ne reconnaît pas la voix : utilise Chrome, Edge ou Safari. Tu peux aussi dicter avec le micro de ton clavier.</p>`;
}
function wireMic(btnId, input, onFinal) {
  const btn = $("#" + btnId); if (!btn) return;
  btn.onclick = async () => {
    if (rec) { stopListening(); return; }
    btn.classList.add("live"); btn.innerHTML = IC.stop;
    const st = $("#micstate"); if (st) st.textContent = "J'écoute… parle en anglais.";
    const ok = await startListening(t => { input.value = t; },
      () => { btn.classList.remove("live"); btn.innerHTML = IC.mic; const s2 = $("#micstate"); if (s2) s2.textContent = "Touche le micro pour recommencer, ou valide."; },
      onFinal);
    if (!ok) { btn.classList.remove("live"); btn.innerHTML = IC.mic; }
  };
}
const canRecord = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder) && !IN_CLAUDE;
let recorder = null;
async function recordVoice(btn, playBtn) {
  if (recorder) { recorder.stop(); return; }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    const chunks = []; recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => { stream.getTracks().forEach(t => t.stop()); recorder = null; btn.textContent = "Enregistrer ma voix";
      const url = URL.createObjectURL(new Blob(chunks, {type: chunks[0]?.type || "audio/webm"})); playBtn.hidden = false; playBtn.onclick = () => { hush(); const a = new Audio(url); a.play(); }; };
    recorder.start(); btn.textContent = "Arrêter l'enregistrement";
    setTimeout(() => recorder && recorder.stop(), 12000);
  } catch (e) { btn.remove(); toast("Le micro n'est pas accessible ici."); }
}

const IC = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>',
  slow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 16c0-4 3-7 7-7s6 3 6 6"/><path d="M17 15h2a2 2 0 0 0 0-4"/><path d="M6 16v2M14 16v2M3 16h15"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11h-2z"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5 21 12 3 3.5 3 10l12 2-12 2z"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 11 12 4l9 7v9h-6v-6H9v6H3z"/></svg>',
  words: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="5" width="13" height="15" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v13"/><path d="M7 10h5M7 14h3" stroke-linecap="round"/></svg>',
  pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M15 4l5 5L9 20H4v-5z"/><path d="M3 21c3-1 5-1 8 0" stroke-linecap="round"/></svg>',
  read: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 6c-2-1.5-5-2-9-2v14c4 0 7 .5 9 2 2-1.5 5-2 9-2V4c-4 0-7 .5-9 2z"/><path d="M12 6v14"/></svg>',
  talk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5" stroke-linecap="round"/></svg>',
  path: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6H15a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h6.5"/></svg>'
};
const ic = (name, size = 18) => IC[name].replace("<svg", `<svg width="${size}" height="${size}"`);
const TABS = [["home", "Accueil", IC.home], ["words", "Mots", IC.words], ["spot", "Fautes", IC.pen], ["read", "Lire", IC.read], ["oral", "Oral", IC.talk], ["path", "Leçons", IC.path]];
let TAB = "home";
try { const t = sessionStorage.getItem("tab"); if (t && (TABS.some(x => x[0] === t) || t === "book" || t === "progress")) TAB = t; } catch (e) {}

let toastT = 0;
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 3800); }

// ====== NIVEAUX PAR COMPÉTENCE ======
function typeStat(t, ok) { const s = (S.ts[t] || "") + (ok ? "1" : "0"); S.ts[t] = s.slice(-15); }
function hard(t) { const s = S.ts[t] || ""; return s.length >= 10 && s.split("").filter(c => c === "1").length / s.length >= .9; }
function skillOf(it) {
  if (it.skill) return it.skill;
  if (it.t === "v") return /listen|dictate/.test(it.mode) ? "lis" : "voc";
  if (it.t === "ls" || it.t === "dic") return "lis";
  if (it.t === "sp") return "oral";
  return "gram";
}
function weightOf(it, info) {
  let w = 1;
  if (it.t === "v") w = /type|ctx|dictate/.test(it.mode) ? 1.2 : .6;
  else if (it.t === "mcq") w = .7;
  else if (it.t === "tr") w = info.kb ? 1.4 : .8;
  else if (it.t === "ls" || it.t === "fix" || it.t === "sp") w = 1.2;
  else if (it.t === "dic") w = 1.3;
  const sk = skillOf(it), li = cefrIdx(sk), il = it.lvl ? CEFR.indexOf(it.lvl) : -1;
  if (il >= 0 && il < li - 1) w *= .5; else if (il > li) w *= 1.2;
  return w;
}
function recomputeGlobal() { S.li = Math.round(SKILLS.reduce((a, [k]) => a + S.sk[k].li, 0) / SKILLS.length); }
function levelTick(it, ok, info) {
  const sk = skillOf(it), s = S.sk[sk], w = weightOf(it, info);
  s.n += w; if (ok) s.ok += w;
  if (s.n < WIN) return null;
  const r = s.ok / s.n; s.n = 0; s.ok = 0;
  let dir = null;
  if (r >= UP && s.li < LV.length - 1) { s.li++; dir = "up"; }
  else if (r < DOWN && s.li > 0) { s.li--; dir = "down"; }
  if (!dir) return null;
  recomputeGlobal();
  S.lvlLog.unshift({t: Date.now(), sk, li: s.li, up: dir === "up" ? 1 : 0}); S.lvlLog.length = Math.min(S.lvlLog.length, 40);
  return {sk, dir, li: s.li};
}
const skName = k => SKILLS.find(s => s[0] === k)[1];

// ====== VOCABULAIRE ======
const MINE = () => ({id: "mine", part: "mine", lvl: "A1", name: "Mes mots (lectures)", words: S.mine});
const themeById = id => id === "mine" ? MINE() : THEMES.find(t => t.id === id);
const vkey = (th, en) => th + "|" + en;
const vstate = k => S.voc[k];  // [étape, échéance (minutes), vu, réussi, facilité, intervalle (jours)]
const DICT = {};
THEMES.forEach(t => t.words.forEach(w => alts(w.en).forEach(e => { const k = stripTo(e.toLowerCase()); if (!DICT[k]) DICT[k] = w.fr; })));
function exampleFor(th, w) { return (w && w.ex) || S.exs[vkey(th, w.en)] || null; }
function vItem(th, w, mode) {
  if (/…/.test(w.en) && /type|dictate|ctx/.test(mode)) mode = "fr2en";
  const t = themeById(th);
  if (mode === "type") { const ex = exampleFor(th, w); if (ex && new RegExp("\\b" + alts(w.en)[0].replace(/^to /i, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i").test(ex[0]) && Math.random() < .5) mode = "ctx"; }
  return {t: "v", mode, th, en: w.en, fr: w.fr, ex: w.ex, key: "v:" + vkey(th, w.en), src: t?.name || "", lvl: t?.lvl};
}
function modeFor(stage) {
  if (hard("v")) return stage <= 0 ? "fr2en" : pick(["type", "type", "dictate"]);
  return ["en2fr", "fr2en", "type", "listen", "type", "dictate", "type"][Math.min(stage, 6)];
}
function wordsDue(scope) {
  const now = Date.now() / 6e4, out = [];
  (scope || [...THEMES, MINE()]).forEach(t => t.words.forEach(w => { const st = vstate(vkey(t.id, w.en)); if (st && st[1] <= now) out.push([t.id, w, st]); }));
  return out.sort((a, b) => a[2][1] - b[2][1]);
}
function newWords(scope, n) {
  const out = [];
  for (const t of scope) for (const w of t.words) { if (!vstate(vkey(t.id, w.en))) { out.push([t.id, w]); if (out.length >= n) return out; } }
  return out;
}
function themeStats(t) { let seen = 0, got = 0; t.words.forEach(w => { const s = vstate(vkey(t.id, w.en)); if (s) { seen++; if (s[0] >= 4) got++; } }); return {seen, got, tot: t.words.length}; }
function partThemes(part) { const li = cefrIdx("voc"); return THEMES.filter(t => t.part === part).sort((a, b) => CEFR.indexOf(a.lvl) - CEFR.indexOf(b.lvl)).filter(t => CEFR.indexOf(t.lvl) <= li + 1); }
function vocabSession(scope, nNew) {
  const due = wordsDue(scope).slice(0, 12).map(([th, w, st]) => vItem(th, w, modeFor(st[0])));
  const fresh = newWords(scope, nNew);
  const dueKeys = new Set(due.map(x => x.key));
  const recall = seenWords().filter(([th, w]) => !dueKeys.has("v:" + vkey(th, w.en))).slice(0, 12);
  const recallItems = shuffle(recall).slice(0, nNew ? 4 : 0).map(([th, w, st]) => Object.assign(vItem(th, w, modeFor(Math.max(1, st[0]))), {src: "Rappel · " + (themeById(th)?.name || "")}));
  due.push(...recallItems);
  const items = [], learn = [];
  fresh.forEach(([th, w]) => { learn.push(vItem(th, w, "learn"), vItem(th, w, hard("v") ? "fr2en" : "en2fr")); });
  const mixed = shuffle(due);
  for (let i = 0; i < learn.length; i += 2) { items.push(learn[i], learn[i + 1]); if (mixed.length) items.push(mixed.shift()); }
  items.push(...mixed);
  fresh.forEach(([th, w]) => items.push(vItem(th, w, hard("v") ? "type" : "fr2en")));
  return items;
}
// Mots déjà vus (pas forcément dus), les plus fragiles d'abord : erreurs, faible facilité, vus il y a longtemps
function seenWords(scope) {
  const out = [];
  (scope || [...THEMES, MINE()]).forEach(t => t.words.forEach(w => { const st = vstate(vkey(t.id, w.en)); if (st && st[2] > 0) out.push([t.id, w, st]); }));
  const now = Date.now() / 6e4;
  const weak = ([, , st]) => (st[2] - st[3]) * 3 + (3 - (st[4] || 2.5)) * 4 + Math.min(10, Math.max(0, (now - (st[1] - (st[5] || 0) * 1440)) / 1440)) * .3 - st[0];
  return out.sort((a, b) => weak(b) - weak(a));
}
function evalItems(scope, n = 20) {
  const pool = seenWords(scope);
  const pickd = pool.slice(0, Math.ceil(n * .6)).concat(shuffle(pool.slice(Math.ceil(n * .6))).slice(0, n));
  return shuffle(pickd.slice(0, n)).map(([th, w, st]) => vItem(th, w, st[0] >= 2 ? pick(["type", "type", "dictate", "fr2en"]) : pick(["fr2en", "en2fr", "type"])));
}
function nNewWords() { return (S.sk.voc.li >= 4 ? 7 : 5) + (hard("v") ? 3 : 0); }
// Répétition espacée adaptative : chaque mot a sa propre « facilité »
function recordVocab(it, ok) {
  const k = vkey(it.th, it.en), now = Date.now();
  const st = S.voc[k] || [0, 0, 0, 0, 2.5, 0];
  if (st.length < 6) { st[4] = 2.5; st[5] = VB_OLD[st[0]] || 0; }
  st[2]++;
  if (ok) {
    st[3]++; st[0] = Math.min(st[0] + 1, 6);
    st[5] = st[5] < 1 ? 1 : Math.min(180, Math.round(st[5] * st[4]));
    st[4] = Math.min(3, st[4] + .05);
    st[1] = Math.round((now + st[5] * DAY) / 6e4);
  } else {
    st[0] = Math.max(0, st[0] - 1); st[4] = Math.max(1.3, st[4] - .2); st[5] = 0; st[1] = Math.round(now / 6e4);
  }
  S.voc[k] = st;
}
const VB_OLD = [0, 1, 2, 4, 9, 20, 45];
function markKnown(th, en, days = 20) { S.voc[vkey(th, en)] = [4, Math.round((Date.now() + days * DAY) / 6e4), 1, 1, 2.6, days]; }

// ====== RÈGLES (façon Voltaire) ======
const ruleById = id => RULES.find(r => r.id === id);
const ruleState = id => S.rules[id] || {s: 0, n: 0, ok: 0, m: 0, due: 0, p: 0};
const rulePool = r => r.ex.concat(S.extra[r.id] || []);
const ruleNeed = id => { const s = ruleState(id); return s.n > s.ok ? 4 : 3; };  // une règle déjà ratée demande 4 réussites d'affilée
function ruleItem(r, j) {
  const pool = rulePool(r), [s, f] = pool[j];
  return {t: "spot", s, f: f ?? null, x: r.x, rule: r.id, rname: r.name, rj: j, key: "r:" + r.id + ":" + j, src: r.cat + " · " + r.name, lvl: r.lvl, skill: "gram"};
}
function ruleExamples(r, n = 3) {
  const out = [];
  rulePool(r).forEach(([s, f]) => { if (out.length >= n) return; if (f == null) out.push(s); else { const [pre, post = ""] = s.split(/\*[^*]+\*/); out.push((pre + f + post).replace(/\s+/g, " ").replace(/\s([.,!?])/g, "$1")); } });
  return out;
}
function nextRuleItem(r, used) {
  const pool = rulePool(r), st = S.rules[r.id] = Object.assign(ruleState(r.id), S.rules[r.id]);
  if (aiReady() && pool.length - used.size <= 2) prefetchRule(r);
  for (let k = 0; k < pool.length; k++) { const j = (st.p + k) % pool.length; if (!used.has(j)) { st.p = j + 1; used.add(j); return ruleItem(r, j); } }
  return ruleItem(r, Math.floor(Math.random() * pool.length));
}
function activeRules(n = 4) {
  const li = cefrIdx("gram"), now = Date.now();
  const unm = RULES.filter(r => !ruleState(r.id).m).sort((a, b) => CEFR.indexOf(a.lvl) - CEFR.indexOf(b.lvl));
  let act = unm.filter(r => CEFR.indexOf(r.lvl) <= li);
  if (act.length < n) act = act.concat(unm.filter(r => CEFR.indexOf(r.lvl) > li));
  act = act.slice().sort((a, b) => (ruleState(b.id).n > 0) - (ruleState(a.id).n > 0)).slice(0, n);
  const anchor = RULES.filter(r => { const s = ruleState(r.id); return s.m && s.due && s.due <= now; }).slice(0, 2);
  const all = [...act, ...anchor];
  return all.length ? all : shuffle(RULES).slice(0, n);
}
function spotSession(n = 14, onlyRule) {
  const rules = onlyRule ? [ruleById(onlyRule)] : activeRules(S.sk.gram.li >= 4 ? 5 : 4);
  const used = {}; rules.forEach(r => used[r.id] = new Set());
  const items = [];
  for (let i = 0; items.length < n && i < n * 3; i++) { const r = rules[i % rules.length]; if (used[r.id].size >= rulePool(r).length) continue; items.push(nextRuleItem(r, used[r.id])); }
  return {items: shuffle(items), used};
}
const fetching = {};
async function prefetchRule(r) {
  if (fetching[r.id] || (S.extra[r.id] || []).length >= 60) return;
  fetching[r.id] = true;
  const avoid = rulePool(r).map(e => e[0].replace(/\*/g, "")).slice(-25).join("\n");
  const prompt = `Tu crées un entraînement façon « Projet Voltaire » en anglais pour un francophone de niveau ${levelPrompt("gram")}.
Règle : ${r.name}. ${r.x}
Écris 10 NOUVELLES phrases anglaises naturelles, de la vie courante ou du monde du travail, différentes de celles-ci :
${avoid}
Chaque phrase contient au plus UNE faute liée à cette règle, et le passage fautif (1 à 3 mots) est entouré d'astérisques. Le passage entre astérisques doit être exactement ce que la correction remplace. 3 phrases sur 10 sont correctes (sans astérisques).
Renvoie UNIQUEMENT un tableau JSON : [["phrase avec *faute*","correction du passage"],["phrase correcte"], …]
Vérifie que chaque correction est juste et que les phrases correctes le sont vraiment.`;
  try {
    const arr = await sample.json(prompt, {modelTier: "default", cache: false});
    const ok = (Array.isArray(arr) ? arr : []).filter(e => Array.isArray(e) && typeof e[0] === "string" && e[0].length < 200).map(e => {
      const n = (e[0].match(/\*/g) || []).length;
      if (n === 2 && typeof e[1] === "string") return [e[0], e[1]];
      if (n === 0) return [e[0]];
      return null;
    }).filter(Boolean);
    // on ajoute sans jamais retirer : les numéros des phrases restent stables
    if (ok.length) { S.extra[r.id] = (S.extra[r.id] || []).concat(ok).slice(0, 60); save(); }
  } catch (e) { const m = aiErr(e); if (e && e.code === "not_granted" && m) toast(m); }
  fetching[r.id] = false;
}

// ====== TRADUCTIONS ======
const trKey = t => speakable(t).replace(/\s+([.,!?;:])/g, "$1").trim();
// Traduction d'une phrase (ou de plusieurs phrases à la suite), si elle est connue
function trFR(en) {
  if (!en) return null;
  const k = trKey(en); if (FR_TR[k]) return FR_TR[k];
  const parts = splitSpeech(en).map(trKey);
  if (parts.length > 1 && parts.every(x => FR_TR[x])) return parts.map(x => FR_TR[x]).join(" ");
  return null;
}
const fixedSentence = (s, f) => { const [a, b = ""] = s.split(/\*[^*]+\*/); return (a + (f || "") + b).replace(/\s+/g, " ").replace(/\s([.,!?])/g, "$1").trim(); };
// Phrase anglaise de référence d'un exercice (celle dont on donne la traduction)
function enOf(it) {
  if (it.t === "spot") return it.s.includes("*") ? fixedSentence(it.s, it.f) : it.s;
  if (it.t === "gap" && !it.noSpeak) return it.s.replace("___", it.a[0]);
  if (it.t === "ls" || it.t === "dic" || it.t === "sp") return it.en;
  if (it.t === "mcq" && !it.noSay && /^[A-Z][a-z]/.test(it.o[it.a]) && it.o[it.a].split(" ").length > 2) return it.o[it.a];
  return null;
}
function frOf(it) { if (it.fr && (it.t === "sp" || it.t === "dic")) return it.fr; const en = enOf(it); return en ? (S.trs?.[trKey(en)] || trFR(en)) : null; }
// Bouton « Voir la traduction » (facultatif) ; sinon l'IA traduit si elle est disponible
function trToggle(ex, it) {
  const en = enOf(it); if (!en) return;
  ex.insertAdjacentHTML("beforeend", `<div><button class="toggle" id="trshow" type="button">Voir la traduction</button><p class="small muted" id="trtxt" hidden></p></div>`);
  $("#trshow").onclick = async () => {
    const box = $("#trtxt"); box.hidden = false; $("#trshow").hidden = true;
    const fr = frOf(it); if (fr) { box.textContent = fr; return; }
    if (!aiReady()) { box.textContent = "Traduction indisponible pour cette phrase."; return; }
    box.textContent = "Traduction…";
    try { const r = await sample.json(`Traduis en français naturel cette phrase anglaise (corrige-la si elle contient une faute) : « ${en} ». Réponds UNIQUEMENT en JSON : {"fr":"..."}`, {modelTier: "quick"});
      const fr2 = String(r && r.fr || "").trim(); if (fr2) { S.trs = S.trs || {}; S.trs[trKey(en)] = fr2; save(); } box.textContent = fr2 || "Traduction indisponible."; }
    catch (e) { box.textContent = aiErr(e) || "Traduction indisponible."; }
  };
}

// ====== LEÇONS DE DICTÉE (écouter l'enregistrement, réécrire la phrase) ======
const DIC_SRC = (() => {
  const out = [], seen = new Set();
  const add = (en, fr, lvl, part, src, voice = "a") => {
    en = speakable(en); const n = en.split(" ").length;
    if (n < 3 || n > 28 || seen.has(en) || /___|…|\d{4,}/.test(en)) return;
    seen.add(en); out.push({en, fr: fr || "", lvl, part, src, voice, n});
  };
  UNITS.forEach(u => { const part = u.id === "u21" ? "business" : "daily"; u.items.forEach(it => {
    if (it.t === "ls") add(it.en, "", u.lvl, part, u.title);
    if (it.t === "sp") add(it.en, it.fr, u.lvl, part, u.title);
    if (it.t === "tr") add(it.a[0], it.fr, u.lvl, part, u.title); }); });
  SHADOW.forEach(c => c[1].forEach(p => add(p[0], p[1], c[0] === "Commerce" ? "B1" : "A2", c[0] === "Commerce" ? "business" : "daily", c[0])));
  THEMES.filter(t => t.colloc).forEach(t => t.words.forEach(w => w.ex && add(w.ex[0], w.ex[1], t.lvl, t.part, t.name)));
  DIALOGS.forEach(d => { const sp = [...new Set(d.lines.map(l => l[0]))]; d.lines.forEach(l => { if (splitSpeech(l[1]).length === 1) add(l[1], "", d.lvl, d.part, d.title, sp.indexOf(l[0]) === 0 ? "a" : "b"); }); });
  TEXTS.forEach(t => splitSpeech(t.text.replace(/\n+/g, " ")).forEach(x => add(x, "", t.lvl, t.part, t.title)));
  WRITE.forEach(w => splitSpeech(w.model.replace(/\n+/g, " ")).forEach(x => add(x, "", w.lvl, w.part, w.title)));
  RULES.forEach(r => r.ex.slice(0, 4).forEach(([x, f]) => { const [pre, post = ""] = x.split(/\*[^*]+\*/); add(f == null ? x : (pre + f + post).replace(/\s+/g, " ").replace(/\s([.,!?])/g, "$1"), "", r.lvl, "daily", r.name); }));
  BANK.forEach(b => add(b.en, b.fr, b.lvl, b.part, b.part === "business" ? "Phrases du commerce" : "Phrases du quotidien"));
  return out;
})();
// Leçons de 8 phrases, de la plus courte à la plus longue, par partie et par niveau
const DIC_LESSONS = (() => {
  const out = [];
  ["daily", "business"].forEach(part => CEFR.forEach(l => {
    const pool = DIC_SRC.filter(x => x.part === part && x.lvl === l).sort((a, b) => a.n - b.n || a.en.localeCompare(b.en));
    for (let i = 0; i * 8 < pool.length; i++) { const items = pool.slice(i * 8, i * 8 + 8); if (items.length >= 4) out.push({id: "dic_" + part + "_" + l + "_" + (i + 1), part, lvl: l, num: i + 1, items}); }
  }));
  return out;
})();
function dicItem(x) { return {t: "dic", en: x.en, fr: x.fr || trFR(x.en) || "", voice: x.voice, key: "dic:" + hash(x.en), src: "Dictée · " + x.src, lvl: x.lvl, skill: "lis"}; }
function nextDicLesson(part) {
  const li = cefrIdx("lis");
  const ls = DIC_LESSONS.filter(d => (!part || d.part === part) && CEFR.indexOf(d.lvl) <= li + 1);
  return ls.find(d => (S.dict[d.id] || 0) < 90) || ls[ls.length - 1] || DIC_LESSONS[0];
}
// Alignement mot à mot entre la phrase entendue et ce qui a été écrit
function dicDiff(target, typed) {
  // chaque mot affiché peut correspondre à plusieurs mots normalisés (She's → she is)
  const T = target.split(/\s+/).filter(Boolean), groups = T.map(w => norm(w).split(" ").filter(Boolean));
  const tn = [], owner = []; groups.forEach((g, gi) => g.forEach(x => { tn.push(x); owner.push(gi); }));
  const un = norm(typed).split(" ").filter(Boolean);
  const m = tn.length, n = un.length, L = Array.from({length: m + 1}, () => new Array(n + 1).fill(0));
  const close = (a, b) => a === b ? 2 : (a.length >= 5 && lev(a, b) <= 1 ? 1 : 0);
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) L[i][j] = close(tn[i], un[j]) ? 1 + L[i + 1][j + 1] : Math.max(L[i + 1][j], L[i][j + 1]);
  const st = new Array(m).fill(0), typedAs = new Array(m).fill(""), extra = []; let i = 0, j = 0;
  while (i < m && j < n) {
    const c = close(tn[i], un[j]);
    if (c && L[i][j] === 1 + L[i + 1][j + 1]) { st[i] = c; typedAs[i] = un[j]; i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) i++;
    else { extra.push(un[j]); j++; }
  }
  while (j < n) { extra.push(un[j]); j++; }
  let pts = 0;
  const marks = T.map((w, gi) => {
    const idx = owner.map((o, k) => o === gi ? k : -1).filter(k => k >= 0);
    if (!idx.length) return [w, "ok"];
    const all2 = idx.every(k => st[k] === 2), any = idx.some(k => st[k]);
    const k = all2 ? "ok" : any ? "near" : "miss"; pts += k === "ok" ? 1 : k === "near" ? .5 : 0;
    return [w, k, idx.map(x => typedAs[x]).join(" ")];
  });
  const score = T.length ? Math.max(0, pts - extra.length * .5) / T.length : 0;
  return {marks, extra, score, perfect: marks.every(x => x[1] === "ok") && !extra.length};
}

// ====== ENTRAÎNEMENT « PHRASES » ======
function bankItem(b, mode) {
  const key = "bk:" + hash(b.en);
  if (mode === "dic") return Object.assign(dicItem({en: b.en, fr: b.fr, voice: "a", src: "Phrases", lvl: b.lvl}), {key: key + ":d", src: b.part === "business" ? "Phrases du commerce" : "Phrases du quotidien"});
  if (mode === "sp") return {t: "sp", en: b.en, fr: b.fr, key: key + ":s", src: "Phrases · à dire", lvl: b.lvl, noMist: true};
  const others = shuffle(BANK.filter(x => x !== b).flatMap(x => x.en.replace(/[.,!?;:]/g, "").split(" "))).filter(w => !b.en.includes(w)).slice(0, 3);
  return {t: "tr", fr: b.fr, a: [b.en], d: others, key: key + ":t", src: "Phrases · à traduire", lvl: b.lvl, skill: "oral"};
}
function bankPool(part, sk = "oral") {
  const li = cefrIdx(sk);
  const pool = BANK.filter(b => (!part || b.part === part) && Math.abs(CEFR.indexOf(b.lvl) - li) <= 1);
  return pool.length ? pool : BANK.filter(b => !part || b.part === part);
}
function bankSession(part, n = 12) {
  const done = S.bankSeen || (S.bankSeen = {});
  const pool = bankPool(part).slice().sort((a, b) => (done[hash(a.en)] || 0) - (done[hash(b.en)] || 0) || Math.random() - .5).slice(0, n);
  return shuffle(pool).map((b, i) => { done[hash(b.en)] = (done[hash(b.en)] || 0) + 1; return bankItem(b, ["tr", "dic", "sp"][i % 3]); });
}

// ====== AUTRES EXERCICES ======
function unitItem(u, i) { const it = u.items[i]; return Object.assign({}, it, {key: u.id + ":" + i, src: u.title, lvl: u.lvl}); }
function irregItem(v, form) {
  const [b, p, pp, fr] = v;
  return {t: "gap", s: "to " + b + " (" + fr + ") → " + (form === "p" ? "prétérit" : "participe passé") + " : ___", v: "", a: (form === "p" ? p : pp).split("/"), x: b + " – " + p + " – " + pp + " (" + fr + ")", key: "irr:" + b + ":" + form, src: "Verbes irréguliers", noSpeak: true, lvl: "A2"};
}
const IREG_MAP = Object.fromEntries(IRREG.map(v => [v[0], v]));
function irregSession(n = 12) { return shuffle(IRREG).slice(0, n).map(v => irregItem(v, Math.random() < .5 ? "p" : "pp")); }
function itemByKey(k, stored) {
  if (stored) return Object.assign({}, stored, {key: k});
  const p = k.split(":");
  if (p[0] === "irr") { const v = IREG_MAP[p[1]]; return v ? irregItem(v, p[2]) : null; }
  const u = UNITS.find(u => u.id === p[0]); return u && u.items[+p[1]] ? unitItem(u, +p[1]) : null;
}
function dueMistakes() { const now = Date.now(); return S.mist.filter(m => m.due <= now).sort((a, b) => a.due - b.due); }
function nextUnit() { const li = cefrIdx("gram"); return UNITS.find(u => (S.units[u.id]?.best || 0) < 80 && CEFR.indexOf(u.lvl) <= li) || UNITS.find(u => (S.units[u.id]?.best || 0) < 80) || pick(UNITS); }
function unitSession(u) { return u.gen === "irreg" ? irregSession() : shuffle(u.items.map((_, i) => unitItem(u, i))); }
function dailyItems() {
  const rev = dueMistakes().slice(0, 3).map(m => itemByKey(m.k, m.it)).filter(Boolean);
  const part = S.focus === "both" ? (new Date().getDate() % 2 ? "daily" : "business") : S.focus;
  const voc = vocabSession(partThemes(part).concat(S.mine.length ? [MINE()] : []), 3).slice(0, 14);
  const sp = spotSession(5);
  const u = nextUnit();
  const fromUnit = unitSession(u).filter(x => x.t !== "sp" && x.t !== "spot").slice(0, 3);
  const dl = nextDicLesson(S.focus === "both" ? null : S.focus);
  const listens = shuffle(dl.items).slice(0, 2).map(dicItem);
  const cat = pick(SHADOW), ph = pick(cat[1]);
  const bp = shuffle(bankPool(S.focus === "both" ? null : S.focus));
  const say = bp.length ? bankItem(bp[0], "sp") : {t: "sp", en: ph[0], fr: ph[1], key: "sh:" + hash(ph[0]), src: "Oral · " + cat[0], noMist: true};
  if (bp.length > 1) fromUnit.push(bankItem(bp[1], "tr"));
  const body = shuffle([...sp.items, ...fromUnit, ...listens]);
  const cuts = [0];
  for (let i = 1; i < 3; i++) { let k = Math.round(voc.length * i / 3); while (k < voc.length && voc[k - 1] && voc[k - 1].mode === "learn") k++; cuts.push(Math.max(k, cuts[i - 1])); }
  cuts.push(voc.length);
  const items = [...rev];
  for (let i = 0; i < 3; i++) { items.push(...voc.slice(cuts[i], cuts[i + 1])); items.push(...body.splice(0, Math.ceil(body.length / (3 - i)))); }
  items.push(say);
  return {items, used: sp.used};
}
function streak() { let n = 0, t = Date.now(); if (!S.days[today(t)]) t -= DAY; while (S.days[today(t)]) { n++; t -= DAY; } return n; }
const acquiredCount = () => Object.values(S.voc).filter(s => s[0] >= 4).length;

// ====== RENDU GÉNÉRAL ======
const app = $("#app");
let SES = null, CUR = null, CHAT = null, READ = null, WRITING = null, DIALOG = null, WORDLIST = null, WSEARCH = "";
const idle = () => !SES && !CHAT && !READ && !WRITING && !DIALOG;
function renderTabs(showIt) {
  const nav = $("#tabs"); nav.hidden = !showIt; if (!showIt) return;
  nav.firstElementChild.innerHTML = TABS.map(([id, label, icn]) => `<button data-tab="${id}" ${TAB === id ? 'aria-current="page"' : ""}>${icn}<span>${label}</span></button>`).join("");
}
$("#tabs").addEventListener("click", e => { const b = e.target.closest("[data-tab]"); if (!b) return; WORDLIST = null; go(b.dataset.tab); });
function go(tab) { TAB = tab; try { sessionStorage.setItem("tab", TAB); } catch (er) {} render(); window.scrollTo(0, 0); }
function render() {
  if (ACC_OK() && !ACC.id) { SES = null; CHAT = null; READ = null; WRITING = null; DIALOG = null; document.onkeydown = null; const fb0 = $("#fb"); if (fb0) fb0.remove(); return renderLogin(false); }
  SES = null; CHAT = null; READ = null; WRITING = null; DIALOG = null; document.onkeydown = null; stopListening(); hush();
  const fb = $("#fb"); if (fb) fb.remove();
  renderTabs(true);
  ({home: renderHome, words: renderWords, spot: renderSpot, read: renderRead, oral: renderOral, path: renderPath, book: renderBook, progress: renderProgress})[TAB]();
  refreshAI();
}
const pill = (txt, cls = "") => `<span class="pill ${cls}">${esc(txt)}</span>`;
const bar = pct => `<div class="bar"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>`;
const backBar = (label, fn) => { setTimeout(() => { const b = $("#back"); if (b) b.onclick = fn; }); return `<div class="topbar"><button class="x" id="back" aria-label="Retour">←</button><span class="eyebrow">${esc(label)}</span></div>`; };

function audioStatus() {
  if (AUD.idx) return {cls: "ok", txt: "voix anglaise enregistrée"};
  if (englishVoices().length) return {cls: "warn", txt: "voix de l'appareil"};
  if (!voicesReady && !AUD.idxP) return {cls: "", txt: "chargement…"};
  return {cls: "err", txt: "pas de voix anglaise"};
}
function renderHome() {
  const due = dueMistakes().length, vdue = wordsDue().length, mastered = RULES.filter(r => ruleState(r.id).m).length;
  const words = acquiredCount(), total = THEMES.reduce((a, t) => a + t.words.length, 0);
  const acc = S.answered ? Math.round(100 * S.correct / S.answered) : 0;
  const last = S.lvlLog[0], au = audioStatus();
  const acct = !ACC_OK() ? `<section class="card"><h3>Compte</h3><p class="small muted">Dans claude.ai, ta progression est enregistrée sur ton compte Claude. Pour la retrouver avec ton identifiant sur tous tes appareils (et avoir le micro), utilise l'appli installée : <a href="${APP_URL}" target="_blank" rel="noopener">${APP_URL.replace("https://", "")}</a>, puis copie ta progression ici (Sauvegarde) et colle-la là-bas.</p></section>`
    : `<section class="card acc"><button class="accname" id="accmenu" type="button" aria-expanded="false"><span class="avatar">${esc(ACC.id.slice(0, 1).toUpperCase())}</span><span style="min-width:0"><span class="eyebrow">Connecté</span><br><b class="ink">${esc(ACC.id)}</b></span>${pill(ACC.err ? "hors ligne" : "sauvegardé", ACC.err ? "warn" : "ok")}</button>
        <div id="accopts" hidden class="stack" style="gap:8px"><p class="small muted">${ACC.err ? esc(ACC.err) : "Ta progression est enregistrée automatiquement. Sur un autre appareil, connecte-toi avec le même identifiant."}</p>
        <div class="row"><button class="btn sm" id="acclogout">Quitter</button><button class="btn sm ghost" id="accsync">Synchroniser maintenant</button></div></div></section>`;
  app.innerHTML = `<div class="wrap">
  ${acct}
  <section class="card evalcard">
    <div class="row" style="justify-content:space-between"><h2>Évaluation complète</h2>${S.evals && S.evals.length ? pill("dernière : " + LV[S.evals[S.evals.length - 1].li] + " le " + new Date(S.evals[S.evals.length - 1].t).toLocaleDateString("fr-FR"), "acc") : pill("à faire", "warn")}</div>
    <p class="small">54 questions, environ 20 minutes : grammaire (16), vocabulaire (16), écoute (10), lecture (6), expression (6). Chaque partie s'adapte à tes réponses pour trouver ton niveau exact, puis tu reçois une analyse détaillée et toute l'appli s'ajuste : les mots et règles des niveaux inférieurs passent en « acquis », les séances partent de ton vrai niveau.</p>
    <p class="small muted">Conseil : refais-la toutes les 3 à 4 semaines pour mesurer tes progrès.</p>
    ${S.evalRun ? `<button class="btn primary block" id="evresume">Reprendre l'évaluation en cours (${S.evalRun.done}/54)</button>` : ""}
    ${S.evalLast ? `<button class="btn block" id="evlast">Revoir mes résultats et mes erreurs</button>` : ""}
    <button class="btn ${S.evals && S.evals.length || S.evalRun ? "ghost" : "primary"} block" id="place">${S.evalRun ? "Recommencer à zéro" : S.evals && S.evals.length ? "Refaire l'évaluation" : "Commencer l'évaluation"}</button>
  </section>
  <section class="hero">
    <span class="eyebrow" style="color:inherit;opacity:.85">Séance du jour · environ 12 minutes</span>
    <h1>Mots, fautes, grammaire, écoute et oral, dans une seule séance.</h1>
    <p style="opacity:.92">${vdue ? `${vdue} mot${vdue > 1 ? "s" : ""} à réviser, ` : ""}${due ? `${due} erreur${due > 1 ? "s" : ""} à revoir, ` : ""}3 mots nouveaux, 5 phrases à corriger, de la grammaire, 2 phrases en dictée et une phrase à dire.</p>
    <button class="btn block" id="go">Commencer la séance</button>
  </section>
  <section class="card">
    <div class="row" style="justify-content:space-between"><span class="eyebrow">Ton niveau</span>${last ? pill((last.up ? "↑ " : "↓ ") + skName(last.sk || "gram") + " " + new Date(last.t).toLocaleDateString("fr-FR"), last.up ? "ok" : "warn") : ""}</div>
    <div class="row" style="align-items:baseline;gap:12px"><b class="lvl">${LV[S.li]}</b><span class="muted">${LVNAME[cefr()]} · moyenne de tes 5 compétences</span></div>
    <div class="skills">${SKILLS.map(([k, name]) => { const s = S.sk[k]; const rate = s.n ? Math.round(100 * s.ok / s.n) : 0;
      return `<div class="skrow"><span>${name}</span><b>${LV[s.li]}</b><div class="bar" title="Palier en cours"><i style="width:${100 * Math.min(1, s.n / WIN)}%"></i></div><span class="small muted">${s.n ? rate + " %" : "—"}</span></div>`; }).join("")}</div>
    <p class="small muted">Chaque compétence monte d'un cran quand tu réussis au moins ${UP * 100} % d'un palier, et redescend sous ${DOWN * 100} %. Les exercices difficiles (écrire, traduire, dicter) comptent plus que les QCM, et les questions trop faciles pour ton niveau comptent moitié moins.</p>
    <div class="row"><button class="btn sm ghost" id="prog">Voir mes progrès</button></div>
  </section>
  <div class="stats">
    <div class="stat"><b>${streak()}</b><span>jour${streak() > 1 ? "s" : ""} d'affilée</span></div>
    <div class="stat"><b>${words}</b><span>mots acquis sur ${total}</span></div>
    <div class="stat"><b>${mastered}<small>/${RULES.length}</small></b><span>règles maîtrisées</span></div>
    <div class="stat"><b>${Math.round(S.sec / 60)}</b><span>min de pratique</span></div>
    <div class="stat"><b>${S.answered}</b><span>réponses</span></div>
    <div class="stat"><b>${acc}<small>%</small></b><span>de réussite</span></div>
  </div>
  <section class="card"><div class="row" style="justify-content:space-between"><h3>Carnet d'erreurs</h3>${pill(due + " à revoir", due ? "err" : "")}</div>
    <p class="small muted">Tes erreurs de leçons, de dictées, de rédactions et de conversations reviennent après 1, 3, 7, 16 puis 35 jours.</p>
    <div class="row"><button class="btn sm" id="book">Ouvrir le carnet</button></div></section>
  <section class="card">
    <div class="row" style="justify-content:space-between"><h3>Audio</h3>${pill(au.txt, au.cls)}</div>
    <p class="small muted">${AUD.idx ? "Tous les mots, phrases, textes et dialogues intégrés sont lus par une vraie voix anglaise enregistrée (accent américain), quel que soit ton appareil." : "Les enregistrements anglais n'ont pas pu être chargés."}
    Les textes créés par l'IA utilisent la voix anglaise de l'appareil s'il en a une. Une voix française n'est jamais utilisée : sans voix anglaise, le texte n'est pas lu.</p>
    ${!englishVoices().length && voicesReady ? `<p class="small muted">Pour entendre aussi les contenus créés par l'IA sur ce PC : Paramètres Windows › Heure et langue › Voix › Ajouter des voix › English (United States).</p>` : ""}
    <div class="row"><button class="btn sm ghost" id="testv">${ic("play")} Tester la voix</button></div>
  </section>
  <section class="card">
    <h3>Ton objectif</h3><p class="small muted">Oriente le vocabulaire de la séance du jour.</p>
    <div class="levels" id="focus">${[["both", "Les deux"], ["daily", "Vie quotidienne"], ["business", "Commerce"]].map(([k, l]) => `<button data-f="${k}" aria-pressed="${S.focus === k}">${l}</button>`).join("")}</div>
    <details><summary class="small muted" style="cursor:pointer">Régler le niveau à la main</summary>
      <div class="levels" id="lvls" style="margin-top:8px">${LV.map((l, i) => `<button data-l="${i}" aria-pressed="${S.li === i}">${l}</button>`).join("")}</div></details>
  </section>
  <section class="card">
    <div class="row" style="justify-content:space-between"><h3>Tuteur IA</h3><span class="pill ok ai-only">disponible</span><span class="pill ai-off">indisponible</span></div>
    <p class="small muted ai-only">Phrases nouvelles à l'infini pour chaque règle, textes, dialogues et leçons à ton niveau, correction de tes rédactions et traductions, exemples pour chaque mot, conversations corrigées.</p>
    <p class="small muted ai-off">${IN_CLAUDE ? "Autorise l'accès à Claude pour activer le tuteur." : "Le tuteur IA fonctionne quand l'appli est ouverte sur claude.ai. Ici, tout le contenu intégré fonctionne, avec le micro."}</p>
  </section>
  <section class="card">
    <h3>Sauvegarde</h3>
    <p class="small muted">${cloudOn ? "Progression sauvegardée sur ton compte Claude." : "Progression enregistrée dans ce navigateur."} Pour passer ta progression d'une version à l'autre (claude.ai ↔ appli installée), copie-la ici puis colle-la de l'autre côté.</p>
    <textarea id="bk" class="field" rows="3" placeholder="Colle ici une progression copiée pour l'importer"></textarea>
    <div class="row"><button class="btn sm" id="bkout">Copier ma progression</button><button class="btn sm ghost" id="bkin">Importer</button></div>
  </section></div>`;
  $("#go").onclick = () => { const d = dailyItems(); startSession("Séance du jour", d.items, {kind: "daily", used: d.used}); };
  if ($("#accmenu")) $("#accmenu").onclick = () => { const o = $("#accopts"); o.hidden = !o.hidden; $("#accmenu").setAttribute("aria-expanded", !o.hidden); };
  if ($("#acclogout")) $("#acclogout").onclick = accLogout;
  if ($("#accsync")) $("#accsync").onclick = async () => { const r = await accPull(); await accPush(); render(); toast(r === "error" ? "Le serveur ne répond pas pour l'instant." : "Progression synchronisée."); };
  $("#place").onclick = () => { delete S.evalRun; startFullEval(); };
  if ($("#evresume")) $("#evresume").onclick = () => startFullEval(S.evalRun);
  if ($("#evlast")) $("#evlast").onclick = () => renderEvalResults(S.evalLast, false);
  $("#prog").onclick = () => go("progress");
  $("#book").onclick = () => go("book");
  $("#testv").onclick = () => speak("Hello! This is how I sound. Let's practise together.");
  $("#focus").onclick = e => { const b = e.target.closest("[data-f]"); if (b) { S.focus = b.dataset.f; save(); render(); } };
  $("#lvls").onclick = e => { const b = e.target.closest("[data-l]"); if (b) { S.li = +b.dataset.l; S.sk = newSkills(S.li); save(); render(); toast("Niveau réglé sur " + LV[S.li] + " pour toutes les compétences"); } };
  $("#bkout").onclick = () => { const txt = "ATELIER1:" + JSON.stringify(S); const ta = $("#bk"); ta.value = txt; ta.select();
    try { navigator.clipboard.writeText(txt).then(() => toast("Progression copiée. Colle-la dans l'autre version."), () => toast("Sélectionne le texte et copie-le.")); } catch (e) { toast("Sélectionne le texte et copie-le."); } };
  $("#bkin").onclick = () => { const v = $("#bk").value.trim(); if (!v.startsWith("ATELIER1:")) { toast("Colle d'abord une progression copiée depuis l'appli."); return; }
    try { const o = JSON.parse(v.slice(9)); S = migrate(o); S.updatedAt = Date.now(); save(); render(); toast("Progression importée."); } catch (e) { toast("Ce texte est incomplet ou abîmé : recopie-le en entier."); } };
}

// ---------- Progrès ----------
function renderProgress() {
  const days = []; for (let i = 29; i >= 0; i--) { const d = today(Date.now() - i * DAY); days.push([d, S.hist[d] || {n: 0, ok: 0}]); }
  const max = Math.max(10, ...days.map(([, h]) => h.n));
  const W = 600, H = 170, bw = W / 30;
  const bars = days.map(([d, h], i) => { const bh = (H - 30) * h.n / max, x = i * bw + 2;
    const acc = h.n ? h.ok / h.n : 0; const cy = 10 + (H - 30) * (1 - acc);
    return `<rect x="${x}" y="${H - 20 - bh}" width="${bw - 4}" height="${bh}" rx="2" fill="var(--accent)" opacity=".35"><title>${d} : ${h.n} réponses</title></rect>${h.n ? `<circle cx="${x + (bw - 4) / 2}" cy="${cy}" r="3.2" fill="var(--ok)"><title>${Math.round(acc * 100)} % de réussite</title></circle>` : ""}`; }).join("");
  const ticks = [0, 10, 20, 29].map(i => `<text x="${i * bw + bw / 2}" y="${H - 4}" font-size="11" text-anchor="middle" fill="var(--muted)">${days[i][0].slice(8)}/${days[i][0].slice(5, 7)}</text>`).join("");
  const weeks = []; for (let w = 7; w >= 0; w--) { const end = today(Date.now() - w * 7 * DAY), start = today(Date.now() - (w * 7 + 7) * DAY); const a = (S.hist[start] || {}).w, b = (S.hist[end] || {}).w; weeks.push([end, a != null && b != null ? Math.max(0, b - a) : null]); }
  const weakRules = RULES.map(r => [r, ruleState(r.id)]).filter(([, s]) => s.n >= 3).sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n).slice(0, 6);
  const weakWords = Object.entries(S.voc).filter(([, s]) => s[2] - s[3] >= 2).sort((a, b) => (b[1][2] - b[1][3]) - (a[1][2] - a[1][3])).slice(0, 10);
  app.innerHTML = `<div class="wrap">${backBar("Mes progrès", () => go("home"))}
    <h1>Mes progrès</h1>
    <section class="card"><h3>30 derniers jours</h3><p class="small muted">Barres : nombre de réponses. Points verts : pourcentage de réussite (plus haut = mieux).</p>
      <div style="overflow-x:auto"><svg viewBox="0 0 ${W} ${H}" style="width:100%;min-width:420px;height:auto" role="img" aria-label="Activité des 30 derniers jours">${bars}${ticks}</svg></div></section>
    <section class="card"><h3>Niveau par compétence</h3>
      <div class="skills">${SKILLS.map(([k, n]) => `<div class="skrow"><span>${n}</span><b>${LV[S.sk[k].li]}</b><div class="ladder" style="grid-column:span 2">${LV.map((_, i) => `<i class="${i < S.sk[k].li ? "done" : i === S.sk[k].li ? "cur" : ""}"></i>`).join("")}</div></div>`).join("")}</div>
      ${S.lvlLog.length ? `<p class="small muted">Derniers changements : ${S.lvlLog.slice(0, 6).map(l => `${skName(l.sk || "gram")} ${l.up ? "↑" : "↓"} ${LV[l.li]} (${new Date(l.t).toLocaleDateString("fr-FR")})`).join(" · ")}</p>` : ""}</section>
    ${S.evalLast ? `<section class="card"><div class="row" style="justify-content:space-between"><h3>Dernière évaluation</h3><button class="btn sm" id="evlast2">Revoir mes erreurs</button></div></section>` : ""}
    ${S.evals && S.evals.length ? `<section class="card"><h3>Mes évaluations</h3>${S.evals.slice().reverse().map(e => `<div class="row" style="justify-content:space-between"><span>${new Date(e.t).toLocaleDateString("fr-FR")}</span><span class="small muted">${Object.entries(e.sk).map(([k, v]) => ({gram: "Gram.", voc: "Voc.", lis: "Écoute", read: "Lecture", prod: "Expr."}[k] + " " + LV[Math.round(v)])).join(" · ")}</span><b class="ink">${LV[e.li]}</b></div>`).join("")}</section>` : ""}
    <section class="card"><h3>Mots acquis par semaine</h3>
      <div class="weeks">${weeks.map(([d, n]) => `<div><b>${n == null ? "—" : n}</b><span class="small muted">sem. du ${d.slice(8)}/${d.slice(5, 7)}</span></div>`).join("")}</div>
      <p class="small muted">Total : ${acquiredCount()} mots acquis.</p></section>
    <section class="card"><h3>Règles à retravailler</h3>${weakRules.length ? weakRules.map(([r, s]) => `<div class="row" style="justify-content:space-between"><span>${esc(r.name)}</span><span class="row" style="gap:6px">${pill(Math.round(100 * s.ok / s.n) + " %", "warn")}<button class="btn sm" data-r="${r.id}">S'entraîner</button></span></div>`).join("") : `<p class="small muted">Pas encore assez de réponses.</p>`}</section>
    <section class="card"><h3>Mots qui résistent</h3>${weakWords.length ? `<div class="stack" style="gap:6px">${weakWords.map(([k, s]) => { const [th, en] = k.split("|"); const w = (themeById(th)?.words || []).find(x => x.en === en); return w ? `<div class="row" style="justify-content:space-between"><span><b>${esc(alts(en)[0])}</b> = ${esc(show(w.fr))}</span>${pill((s[2] - s[3]) + " erreurs", "err")}</div>` : ""; }).join("")}</div>` : `<p class="small muted">Aucun pour l'instant.</p>`}</section>
  </div>`;
  $$("[data-r]").forEach(b => b.onclick = () => { const r = ruleById(b.dataset.r); const s = spotSession(8, r.id); startSession(r.name, s.items, {kind: "spot", used: s.used}); });
  if ($("#evlast2")) $("#evlast2").onclick = () => renderEvalResults(S.evalLast, false);
}

// ---------- Mots ----------
function renderWords() {
  if (WORDLIST) return renderWordList(WORDLIST);
  const sec = (part, title, intro) => {
    const ths = THEMES.filter(t => t.part === part);
    const tot = ths.reduce((a, t) => a + t.words.length, 0), got = ths.reduce((a, t) => a + themeStats(t).got, 0);
    const due = wordsDue(ths).length;
    return `<section class="stack" style="gap:12px">
      <div class="card"><div class="row" style="justify-content:space-between"><h2>${title}</h2>${pill(got + " / " + tot + " acquis", "acc")}</div>
      <p class="small muted">${intro}</p>${bar(100 * got / tot)}
      <div class="row"><button class="btn primary" data-learn="${part}">Apprendre${due ? ` · ${due} à réviser` : ""}</button><button class="btn ghost" data-eval="${part}" ${seenWords(ths).length >= 5 ? "" : "disabled"}>Évaluation</button></div></div>
      <div class="list">${ths.map(t => { const s = themeStats(t); const later = CEFR.indexOf(t.lvl) > cefrIdx("voc") + 1;
        return `<article class="card" style="gap:8px"><div class="row" style="justify-content:space-between"><h3>${esc(t.name)}</h3><span class="row" style="gap:6px">${t.colloc ? pill("avec exemples", "acc") : ""}${pill(t.lvl)}${later ? pill("plus tard", "warn") : ""}</span></div>
        ${bar(100 * s.got / s.tot)}<div class="row" style="justify-content:space-between"><span class="small muted">${s.got} acquis · ${s.seen} vus · ${s.tot} mots</span>
        <span class="row" style="gap:6px"><button class="btn sm" data-th="${t.id}">Apprendre</button><button class="btn sm ghost" data-test="${t.id}" title="Valider directement le thème si tu le connais">Je connais : tester</button><button class="btn sm ghost" data-list="${t.id}">Liste</button><button class="btn sm ghost ai-only" data-ctx="${t.id}">En contexte (IA)</button></span></div></article>`; }).join("")}</div></section>`;
  };
  const vdue = wordsDue().length;
  app.innerHTML = `<div class="wrap">
    <div class="stack"><span class="eyebrow">Vocabulaire</span><h1>Apprendre les mots par cœur</h1>
    <p class="muted">Chaque mot passe par des étapes : le découvrir, le reconnaître, le retrouver, l'écrire, le comprendre à l'oral, le replacer dans une phrase. Chaque mot a son propre rythme de révision : un mot facile revient de moins en moins souvent, un mot qui résiste revient plus vite. Tu connais déjà un thème ? Fais son test : à 90 %, tout le thème est validé d'un coup.</p>
    <input id="wsearch" class="field" placeholder="Chercher un mot (anglais ou français)" value="${esc(WSEARCH)}" autocomplete="off">
    <div id="wres"></div>
    <div class="row"><button class="btn" id="vall" ${vdue ? "" : "disabled"}>Réviser tous les mots dus (${vdue})</button><button class="btn primary" id="veval" ${seenWords().length >= 5 ? "" : "disabled"}>Évaluation : 20 mots déjà vus</button></div>
    <p class="small muted">L'évaluation reprend les mots que tu as déjà vus, tous thèmes confondus, en commençant par les plus fragiles. Un mot raté revient dès le lendemain. Chaque leçon de vocabulaire glisse aussi 4 mots d'avant.</p></div>
    ${sec("daily", "Vie quotidienne", "Se présenter, demander, la maison, l'appartement, la rue, le travail, la santé, les loisirs, et les expressions toutes faites.")}
    ${sec("business", "Commerce", "Vente, négociation, marketing, finance, logistique, import-export, réunions, e-mails, service client, contrats, et les collocations du monde des affaires.")}
    <section class="card"><div class="row" style="justify-content:space-between"><h2>Mes mots</h2>${pill(S.mine.length + " mots")}</div>
      <p class="small muted">Les mots que tu touches pendant tes lectures arrivent ici et sont révisés comme les autres.</p>
      <div class="row"><button class="btn sm" data-th="mine" ${S.mine.length ? "" : "disabled"}>Réviser</button><button class="btn sm ghost" data-list="mine" ${S.mine.length ? "" : "disabled"}>Gérer la liste</button></div></section>
  </div>`;
  const doSearch = () => {
    WSEARCH = $("#wsearch").value; const q = norm(WSEARCH); const box = $("#wres");
    if (q.length < 2) { box.innerHTML = ""; return; }
    const res = [];
    [...THEMES, MINE()].forEach(t => t.words.forEach(w => { if (res.length < 40 && (norm(w.en).includes(q) || norm(w.fr).includes(q))) res.push([t, w]); }));
    box.innerHTML = res.length ? `<div class="card" style="padding:4px 0;gap:0">${res.map(([t, w], i) => { const s = vstate(vkey(t.id, w.en)); const st = s ? s[0] : 0;
      return `<button class="wordrow" data-sr="${i}"><span style="min-width:0"><b>${esc(alts(w.en)[0])}</b> <span class="muted small">· ${esc(t.name)}</span><br><span class="muted">${esc(show(w.fr))}</span></span><span class="dots">${[0, 1, 2, 3].map(k => `<i class="${st > k ? "on" : ""}"></i>`).join("")}</span></button>`; }).join("")}</div>`
      : `<p class="small muted">Aucun mot trouvé.</p>`;
    $$("[data-sr]", box).forEach(b => b.onclick = () => speak(alts(res[+b.dataset.sr][1].en)[0]));
  };
  $("#wsearch").oninput = doSearch; if (WSEARCH) doSearch();
  $("#veval").onclick = () => startSession("Évaluation · mots déjà vus", evalItems(null, 20), {kind: "eval"});
  $("#vall").onclick = () => startSession("Révision des mots", wordsDue().slice(0, 25).map(([th, w, st]) => vItem(th, w, modeFor(st[0]))), {kind: "vocab"});
  $$("[data-learn]").forEach(b => b.onclick = () => startSession(b.dataset.learn === "daily" ? "Vie quotidienne" : "Commerce", vocabSession(partThemes(b.dataset.learn), nNewWords()), {kind: "vocab"}));
  $$("[data-th]").forEach(b => b.onclick = () => { const t = themeById(b.dataset.th); const it = vocabSession([t], nNewWords()); if (!it.length) { toast("Tous les mots de ce thème sont à jour. Reviens plus tard pour les révisions."); return; } startSession(t.name, it, {kind: "vocab"}); });
  $$("[data-test]").forEach(b => b.onclick = () => themeTest(themeById(b.dataset.test)));
  $$("[data-eval]").forEach(b => b.onclick = () => startSession("Évaluation · " + (b.dataset.eval === "daily" ? "vie quotidienne" : "commerce"), evalItems(THEMES.filter(t => t.part === b.dataset.eval), 20), {kind: "eval"}));
  $$("[data-list]").forEach(b => b.onclick = () => { WORDLIST = b.dataset.list; renderWords(); window.scrollTo(0, 0); });
  $$("[data-ctx]").forEach(b => b.onclick = () => { const t = themeById(b.dataset.ctx); const ws = shuffle(t.words).slice(0, 18).map(w => alts(w.en)[0] + " (" + alts(w.fr)[0] + ")").join(", ");
    aiLesson(t.name + " en contexte", `le vocabulaire du thème « ${t.name} ». Utilise en priorité ces mots : ${ws}. Fais surtout des phrases à trous, des traductions et des QCM sur le sens des mots en contexte`, "voc"); });
}
function renderWordList(id) {
  const t = themeById(id), mine = id === "mine";
  app.innerHTML = `<div class="wrap">${backBar(t.lvl + " · " + t.words.length + " mots", () => { WORDLIST = null; renderWords(); })}<h2>${esc(t.name)}</h2>
    <p class="small muted">Touche un mot pour l'entendre. Les points indiquent l'étape d'apprentissage (4 = acquis).${mine ? " Retire les mots que tu ne veux pas réviser." : ""}</p>
    <div class="card" style="padding:4px 0;gap:0">${t.words.map((w, i) => { const s = vstate(vkey(t.id, w.en)); const st = s ? s[0] : 0;
      return `<div class="wordrow"><button class="wordplay" data-i="${i}"><b>${esc(alts(w.en)[0])}</b>${alts(w.en).length > 1 ? ` <span class="muted small">/ ${esc(alts(w.en).slice(1).join(" / "))}</span>` : ""}<br><span class="muted">${esc(show(w.fr))}</span>${w.ex ? `<br><span class="small"><i>${esc(w.ex[0])}</i></span>` : ""}</button><span class="row" style="gap:6px;flex-wrap:nowrap"><span class="dots">${[0, 1, 2, 3].map(k => `<i class="${st > k ? "on" : ""}"></i>`).join("")}</span>${mine ? `<button class="btn sm ghost" data-rm="${i}" aria-label="Retirer">✕</button>` : ""}</span></div>`; }).join("") || `<p class="small muted" style="padding:12px 16px">Aucun mot.</p>`}</div>
    <div class="row"><button class="btn primary" id="learnthis">Apprendre ce thème</button>${!mine ? `<button class="btn ghost" id="testthis">Je connais : tester</button>` : ""}</div></div>`;
  $$(".wordplay").forEach(b => b.onclick = () => { const w = t.words[+b.dataset.i]; speak(alts(w.en)[0]); });
  $$("[data-rm]").forEach(b => b.onclick = () => { const w = S.mine[+b.dataset.rm]; S.mine.splice(+b.dataset.rm, 1); delete S.voc[vkey("mine", w.en)]; save(); renderWordList("mine"); });
  $("#learnthis").onclick = () => { const it = vocabSession([t], nNewWords()); if (!it.length) { toast("Tout est à jour pour ce thème."); return; } WORDLIST = null; startSession(t.name, it, {kind: "vocab"}); };
  if ($("#testthis")) $("#testthis").onclick = () => { WORDLIST = null; themeTest(t); };
  prefetchAudio(t.words.map(w => alts(w.en)[0]));
}
function themeTest(t) {
  const words = shuffle(t.words).slice(0, Math.min(12, t.words.length));
  startSession("Test : " + t.name, words.map(w => vItem(t.id, w, cefrIdx("voc") >= 1 ? "type" : "fr2en")), {kind: "test", test: {type: "theme", id: t.id}});
  toast("Test de validation : 90 % de bonnes réponses et tout le thème est validé.");
}

// ---------- Fautes ----------
function renderSpot() {
  const mastered = RULES.filter(r => ruleState(r.id).m).length;
  const act = activeRules(S.sk.gram.li >= 4 ? 5 : 4).filter(r => !ruleState(r.id).m);
  const cats = [...new Set(RULES.map(r => r.cat))];
  const lvlBlock = CEFR.map(l => { const rs = RULES.filter(r => r.lvl === l); if (!rs.length) return ""; const m = rs.filter(r => ruleState(r.id).m).length; const b = S.bilan[l];
    return `<div class="row" style="justify-content:space-between"><span><b>${l}</b> · ${m}/${rs.length} règles ${b ? pill("bilan réussi", "ok") : ""}</span><button class="btn sm ${m / rs.length >= .8 && !b ? "primary" : "ghost"}" data-bilan="${l}">Bilan ${l}</button></div>`; }).join("");
  app.innerHTML = `<div class="wrap">
  <div class="stack"><span class="eyebrow">Chasse aux fautes</span><h1>Repère la faute, retiens la règle</h1>
  <p class="muted">Comme le Projet Voltaire : touche le mot fautif ou indique qu'il n'y a pas de faute. Si tu te trompes, la même règle revient avec une autre phrase. Une règle est maîtrisée après 3 bonnes réponses d'affilée (4 si tu t'es déjà trompé dessus), puis elle revient plus tard pour vérifier qu'elle est bien ancrée.</p></div>
  <div class="card"><div class="row" style="justify-content:space-between"><b>${mastered} / ${RULES.length} règles maîtrisées</b>${pill(RULES.reduce((a, r) => a + rulePool(r).length, 0) + " phrases")}</div>${bar(100 * mastered / RULES.length)}
  <p class="small muted">En cours : ${act.map(r => esc(r.name)).join(" · ") || "tout est maîtrisé à ton niveau"}</p>
  <button class="btn primary block" id="train">S'entraîner</button>
  <p class="small muted ai-only">Quand les phrases d'une règle s'épuisent, le tuteur en écrit de nouvelles automatiquement.</p></div>
  <section class="card"><h3>Bilans de niveau</h3><p class="small muted">Comme le test d'ancrage de Voltaire : 15 phrases mélangées sur toutes les règles d'un niveau. À 90 %, le niveau est validé ; chaque règle ratée redevient « à travailler ».</p>${lvlBlock}</section>
  ${cats.map(c => { const rs = RULES.filter(r => r.cat === c); const m = rs.filter(r => ruleState(r.id).m).length;
    return `<section class="stack" style="gap:8px"><div class="row" style="justify-content:space-between"><h2>${esc(c)}</h2>${pill(m + "/" + rs.length)}</div>
    ${rs.map(r => { const s = ruleState(r.id);
      const tag = s.m ? pill("maîtrisée", "ok") : s.n ? pill(s.s + "/" + ruleNeed(r.id), "warn") : pill(r.lvl);
      return `<details class="rule"><summary><span>${esc(r.name)}</span>${tag}</summary><p>${esc(r.x)}</p>
        <div class="examples">${ruleExamples(r).map(e => `<button class="exline" data-say="${esc(e)}">${ic("play", 14)} ${esc(e)}</button>`).join("")}</div>
        <p class="small muted" style="margin-top:6px">${rulePool(r).length} phrases · ${s.n ? Math.round(100 * s.ok / s.n) + " % de réussite sur " + s.n + " réponses" : "pas encore travaillée"}</p>
        <div class="row" style="margin-top:10px"><button class="btn sm" data-r="${r.id}">S'entraîner sur cette règle</button>${!s.m ? `<button class="btn sm ghost" data-rt="${r.id}">Je la connais : tester</button>` : ""}</div></details>`; }).join("")}</section>`; }).join("")}
  </div>`;
  $("#train").onclick = () => { const s = spotSession(S.sk.gram.li >= 4 ? 16 : 14); startSession("Chasse aux fautes", s.items, {kind: "spot", used: s.used}); };
  $$("[data-r]").forEach(b => b.onclick = () => { const r = ruleById(b.dataset.r); const s = spotSession(8, r.id); startSession(r.name, s.items, {kind: "spot", used: s.used}); });
  $$("[data-rt]").forEach(b => b.onclick = () => { const r = ruleById(b.dataset.rt); const s = spotSession(4, r.id); startSession("Test : " + r.name, s.items, {kind: "test", used: s.used, test: {type: "rule", id: r.id}}); });
  $$("[data-bilan]").forEach(b => b.onclick = () => bilan(b.dataset.bilan));
  $$("[data-say]").forEach(b => b.onclick = () => speak(b.dataset.say));
}
function bilan(l) {
  const rs = shuffle(RULES.filter(r => r.lvl === l)).slice(0, 15);
  const used = {}; const items = rs.map(r => { used[r.id] = new Set(); return nextRuleItem(r, used[r.id]); });
  while (items.length < 15 && rs.length) { const r = pick(rs); items.push(nextRuleItem(r, used[r.id])); }
  startSession("Bilan " + l, shuffle(items), {kind: "test", used, test: {type: "bilan", id: l}});
}

// ---------- Lire & écrire ----------
function allTexts() { return [...TEXTS, ...S.aitexts]; }
function renderRead() {
  const li = cefrIdx("read");
  const sec = (part, title) => {
    const ts = allTexts().filter(t => t.part === part).sort((a, b) => CEFR.indexOf(a.lvl) - CEFR.indexOf(b.lvl));
    return `<section class="stack" style="gap:10px"><div class="row" style="justify-content:space-between"><h2>${title}</h2><button class="btn sm ghost ai-only" data-gen="${part}">Nouveau texte (IA)</button></div>
      ${ts.map(t => { const sc = S.read[t.id]; const far = CEFR.indexOf(t.lvl) > li + 1;
        return `<button class="choice" data-t="${esc(t.id)}"><div class="row" style="justify-content:space-between"><b>${esc(t.title)}</b><span class="row" style="gap:6px">${t.ai ? pill("IA", "acc") : ""}${pill(t.lvl, far ? "warn" : "")}${sc != null ? pill(sc + " %", sc >= 80 ? "ok" : "") : ""}</span></div>
        <span class="small muted">${esc(t.text.slice(0, 90))}…</span></button>`; }).join("")}</section>`;
  };
  const wsec = part => WRITE.filter(w => w.part === part).map(w => { const r = S.writing[w.id];
    return `<button class="choice" data-w="${w.id}"><div class="row" style="justify-content:space-between"><b>${esc(w.title)}</b><span class="row" style="gap:6px">${pill(w.lvl)}${r ? pill(r.score + "/20", r.score >= 14 ? "ok" : "warn") : ""}</span></div><span class="small muted">${esc(w.brief.slice(0, 95))}…</span></button>`; }).join("");
  app.innerHTML = `<div class="wrap">
    <div class="stack"><span class="eyebrow">Lire et écrire</span><h1>Lire, toucher, retenir</h1>
    <p class="muted">Lis le texte et touche n'importe quel mot pour voir sa traduction et l'entendre. Ensuite viennent des questions de compréhension, et quelques questions plus loin, les mots que tu as touchés reviennent pour vérifier que tu les as retenus.</p></div>
    ${sec("daily", "Textes · vie quotidienne")}${sec("business", "Textes · commerce")}
    <div class="stack"><span class="eyebrow">Rédaction</span><h1>Écrire et se faire corriger</h1>
    <p class="muted">Messages, avis, e-mails professionnels, comptes rendus. <span class="ai-only">Le tuteur te note sur 20, corrige chaque faute et propose une version plus naturelle ; tes fautes partent dans le carnet.</span><span class="ai-off">Sans le tuteur IA, compare ton texte au modèle fourni.</span></p></div>
    <section class="stack" style="gap:10px"><h2>Vie quotidienne</h2>${wsec("daily")}</section>
    <section class="stack" style="gap:10px"><h2>Commerce</h2>${wsec("business")}</section>
  </div>`;
  $$("[data-t]").forEach(b => b.onclick = () => openReader(allTexts().find(t => t.id === b.dataset.t)));
  $$("[data-gen]").forEach(b => b.onclick = () => aiText(b.dataset.gen));
  $$("[data-w]").forEach(b => b.onclick = () => openWriting(WRITE.find(w => w.id === b.dataset.w)));
}
const FUNC = {the:"le, la, les",a:"un, une",an:"un, une",and:"et",or:"ou",but:"mais",of:"de",to:"à, pour, vers",in:"dans, en",on:"sur",at:"à",for:"pour, pendant",with:"avec",without:"sans",is:"est",are:"sont",was:"était",were:"étaient",be:"être",been:"été",i:"je",you:"tu, vous",he:"il",she:"elle",it:"il, elle, ce",we:"nous",they:"ils, elles",me:"me, moi",him:"le, lui",her:"la, lui, son, sa",us:"nous",them:"les, eux",my:"mon, ma, mes",your:"ton, ta, tes, votre",his:"son, sa, ses (à lui)",its:"son, sa (chose)",our:"notre, nos",their:"leur, leurs",this:"ce, cette, ceci",that:"ce, cela, que, qui",these:"ces",those:"ces, ceux-là",there:"là, y",here:"ici",not:"ne … pas",no:"non, aucun",very:"très",so:"donc, si, tellement",because:"parce que",when:"quand",where:"où",what:"quoi, que, ce que",who:"qui",which:"lequel, qui, que",how:"comment",why:"pourquoi",then:"ensuite, alors",also:"aussi",too:"aussi, trop",all:"tout, tous",some:"quelques, du, des",any:"du, des, aucun",more:"plus",most:"la plupart, le plus",from:"de, depuis",by:"par, d'ici",about:"à propos de, environ",up:"en haut",out:"dehors",if:"si",can:"peut, pouvoir",could:"pourrait, pouvait",will:"(futur)",would:"(conditionnel)",should:"devrait",must:"doit",have:"avoir",has:"a",had:"avait, a eu",do:"faire",does:"fait",did:"a fait (passé)",one:"un, une",two:"deux",every:"chaque",each:"chaque",other:"autre",only:"seulement",just:"juste, venir de",still:"encore, toujours",yet:"encore, déjà",before:"avant",after:"après",into:"dans",than:"que (comparaison)",as:"comme, alors que",am:"suis","it's":"c'est","i'm":"je suis","don't":"ne … pas","doesn't":"ne … pas","didn't":"n'a pas","can't":"ne peut pas","i've":"j'ai","we've":"nous avons","isn't":"n'est pas","hasn't":"n'a pas","haven't":"n'ont pas","that's":"c'est","there's":"il y a","we're":"nous sommes","they're":"ils sont","you're":"tu es, vous êtes","i'll":"je vais (futur)","we'll":"nous allons (futur)","you'll":"tu vas (futur)","couldn't":"ne pouvait pas","wasn't":"n'était pas"};
const COMMON = {man:"homme",woman:"femme",men:"hommes",women:"femmes",people:"gens, personnes",person:"personne",child:"enfant",boy:"garçon",girl:"fille",day:"jour, journée",week:"semaine",month:"mois",year:"an, année",hour:"heure",minute:"minute",morning:"matin, matinée",afternoon:"après-midi",evening:"soir, soirée",night:"nuit",time:"temps, fois, heure",last:"dernier",next:"prochain, suivant",first:"premier",same:"même",other:"autre",others:"les autres",own:"propre (à soi)",real:"vrai, réel",great:"super, génial, grand",perfect:"parfait",large:"grand, gros",much:"beaucoup",many:"beaucoup de, nombreux",lot:"beaucoup (a lot)",better:"mieux, meilleur",best:"le meilleur, le mieux",always:"toujours",never:"jamais",often:"souvent",sometimes:"parfois",together:"ensemble",down:"en bas",else:"d'autre",both:"les deux",everyone:"tout le monde",everybody:"tout le monde",everything:"tout",anything:"n'importe quoi, quelque chose",something:"quelque chose",nothing:"rien",someone:"quelqu'un",nobody:"personne",things:"choses",thing:"chose",questions:"questions",question:"question",situation:"situation",course:"cours (of course = bien sûr)",per:"par",cent:"cent (per cent = pour cent)",city:"ville",building:"bâtiment, immeuble",restaurant:"restaurant",director:"directeur",machine:"machine",address:"adresse",photos:"photos",water:"eau",coffee:"café",social:"social",media:"médias",talk:"parler, discuter",look:"regarder, avoir l'air",said:"a dit",made:"a fait",gave:"a donné",went:"est allé",bought:"a acheté",sat:"s'est assis",arrived:"est arrivé",listened:"a écouté",stop:"arrêt, arrêter",hello:"bonjour",please:"s'il vous plaît",yes:"oui",thank:"remercier (thank you = merci)",thanks:"merci",oh:"oh",three:"trois",four:"quatre",five:"cinq",six:"six",seven:"sept",eight:"huit",nine:"neuf",ten:"dix",twelve:"douze",fifteen:"quinze",twenty:"vingt",thirty:"trente",hundred:"cent",italian:"italien",german:"allemand",french:"français",english:"anglais",germany:"Allemagne",uk:"Royaume-Uni",farmers:"agriculteurs"};
IRREG.forEach(([b, p, pp, fr]) => { p.split("/").concat(pp.split("/")).forEach(f => { if (!COMMON[f] && !DICT[f]) COMMON[f] = fr + " (passé de « " + b + " »)"; }); if (!COMMON[b] && !DICT[b]) COMMON[b] = fr; });
function stems(w) { const out = [w]; if (w.endsWith("'s")) out.push(w.slice(0, -2)); if (w.endsWith("ies")) out.push(w.slice(0, -3) + "y"); if (w.endsWith("es")) out.push(w.slice(0, -2)); if (w.endsWith("s")) out.push(w.slice(0, -1)); if (w.endsWith("ied")) out.push(w.slice(0, -3) + "y"); if (w.endsWith("ed")) { out.push(w.slice(0, -2), w.slice(0, -1)); if (/(.)\1ed$/.test(w)) out.push(w.slice(0, -3)); } if (w.endsWith("ing")) { out.push(w.slice(0, -3), w.slice(0, -3) + "e"); if (/(.)\1ing$/.test(w)) out.push(w.slice(0, -4)); } return out; }
const clean = w => w.toLowerCase().replace(/[’]/g, "'").replace(/^[^a-z0-9']+|[^a-z0-9']+$/g, "").replace(/^'+|'+$/g, "");
function lookup(tokens, i, gloss) {
  const words = tokens.map(t => t.w ? clean(t.w) : null);
  for (let len = 5; len >= 2; len--) for (let s = i - len + 1; s <= i; s++) {
    if (s < 0) continue; const seq = words.slice(s, s + len);
    if (seq.length < len || seq.some(x => !x)) continue;
    const phrase = seq.join(" ");
    if (gloss[phrase]) return {term: phrase, fr: gloss[phrase]};
  }
  const w = words[i]; if (!w) return null;
  for (const c of stems(w)) if (gloss[c]) return {term: w, fr: gloss[c]};
  for (const c of stems(w)) if (DICT[c]) return {term: w, fr: DICT[c]};
  if (FUNC[w]) return {term: w, fr: FUNC[w], func: true};
  for (const c of stems(w)) if (COMMON[c]) return {term: w, fr: COMMON[c]};
  if (/-/.test(w) && w.split("-").every(p => COMMON[p] || DICT[p] || FUNC[p] || /^\d+$/.test(p))) return {term: w, fr: w.split("-").map(p => (COMMON[p] || DICT[p] || FUNC[p] || p).split(",")[0]).join("-")};
  const raw = tokens[i].w.replace(/^[^A-Za-z]+/, "").replace(/[^A-Za-z'-]+$/, "");
  if (/^[A-Z]/.test(raw) && raw.length > 1) return {term: raw, fr: "nom propre (personne, lieu ou marque)", func: true};
  return {term: w, fr: null};
}
function tokenize(text) { const toks = []; text.split(/\n+/).forEach((para, pi) => { if (pi) toks.push({br: 1}); para.split(/\s+/).filter(Boolean).forEach(w => toks.push({w})); }); return toks; }
function openReader(t) {
  READ = {t, taps: new Map(), toks: tokenize(t.text)};
  SES = null; CHAT = null; renderTabs(false); document.onkeydown = null; window.scrollTo(0, 0);
  prefetchAudio([t.text]);
  let html = "<p>";
  READ.toks.forEach((tk, i) => { html += tk.br ? "</p><p>" : `<button class="rw" data-i="${i}">${esc(tk.w)}</button> `; });
  html += "</p>";
  app.innerHTML = `<div class="wrap" style="padding-bottom:220px">
    <div class="topbar"><button class="x" id="rquit" aria-label="Quitter">✕</button><div style="flex:1;min-width:0"><span class="eyebrow">${esc(t.lvl)} · ${t.part === "business" ? "Commerce" : "Vie quotidienne"}</span><h2>${esc(t.title)}</h2></div></div>
    <div class="row"><button class="btn sm" id="rplay">${ic("play")} Écouter</button><button class="btn sm ghost" id="rslow">Lentement</button><button class="btn sm ghost" id="rstop">Stop</button></div>
    <article class="reader">${html}</article>
    <p class="small muted">Mots touchés : <b id="ntap" class="ink">0</b>. Ils sont ajoutés à « Mes mots » et reviendront dans les questions.</p>
  </div>
  <div class="actionbar"><div class="in"><button class="btn primary" id="rdone">J'ai lu, aux questions</button></div></div>
  <div class="pop" id="pop" hidden></div>`;
  $("#rquit").onclick = () => render();
  $("#rplay").onclick = () => speak(t.text.replace(/\n+/g, " "), 1);
  $("#rslow").onclick = () => speak(t.text.replace(/\n+/g, " "), .75);
  $("#rstop").onclick = hush;
  $(".reader").onclick = e => { const b = e.target.closest(".rw"); if (b) tapWord(+b.dataset.i, b); };
  $("#rdone").onclick = () => { hush(); readQuestions(); };
}
function closePop() { const p = $("#pop"); if (p) p.hidden = true; }
async function tapWord(i, btn) {
  const t = READ.t, r = lookup(READ.toks, i, t.gloss);
  if (!r) return;
  $$(".rw.sel").forEach(b => b.classList.remove("sel")); btn.classList.add("sel");
  speak(r.term, .95);
  const pop = $("#pop"); pop.hidden = false;
  const paint = (fr, note) => { pop.innerHTML = `<div class="in"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><b class="popw">${esc(r.term)}</b><button class="btn sm ghost" id="pclose" aria-label="Fermer">✕</button></div><div class="popfr">${fr ? esc(fr) : `<span class="muted">${esc(note || "Pas de traduction disponible pour ce mot.")}</span>`}</div></div>`; $("#pclose").onclick = closePop; };
  if (r.fr) { paint(r.fr); if (!r.func) addTap(r.term, r.fr); return; }
  if (!aiReady()) { paint(null); return; }
  paint(null, "Traduction en cours…");
  const sentence = READ.toks.slice(Math.max(0, i - 12), i + 12).map(x => x.w || "").join(" ");
  try {
    const res = await sample.json(`Traduis le mot anglais « ${r.term} » tel qu'il est employé dans ce passage : « ${sentence} ». Réponds UNIQUEMENT en JSON : {"fr":"traduction française courte (2 à 5 mots)"}`, {modelTier: "quick"});
    const fr = String(res && res.fr || "").trim();
    if (READ && fr) { t.gloss[r.term] = fr; paint(fr); addTap(r.term, fr); } else paint(null);
  } catch (e) { paint(null, aiErr(e) || "Pas de traduction."); }
}
function addTap(term, fr) {
  if (!READ || READ.taps.has(term)) return;
  READ.taps.set(term, fr);
  const n = $("#ntap"); if (n) n.textContent = READ.taps.size;
  if (!S.mine.some(w => w.en === term)) { S.mine.unshift({en: term, fr}); if (S.mine.length > 500) S.mine.length = 500; save(); }
}
function readQuestions() {
  const t = READ.t;
  const qs = t.q.map((q, k) => { const order = shuffle(q.o.map((o, i) => i)); return {t: "mcq", q: q.q, o: order.map(i => q.o[i]), a: order.indexOf(q.a || 0), key: "rq:" + t.id + ":" + k, src: "Compréhension · " + t.title, noMist: true, noSay: true, skill: "read", lvl: t.lvl}; });
  const glossFr = Object.values(t.gloss);
  let words = [...READ.taps.entries()];
  const extra = shuffle(Object.entries(t.gloss).filter(([en]) => !READ.taps.has(en) && en.split(" ").length <= 3)).slice(0, words.length >= 4 ? 1 : 3);
  words = words.concat(extra);
  const wItems = shuffle(words).slice(0, 8).map(([en, fr]) => {
    const isMine = READ.taps.has(en);
    return {t: "v", mode: "en2fr", th: isMine ? "mine" : "rd", en, fr, key: "v:" + vkey(isMine ? "mine" : "rd", en), src: isMine ? "Mot que tu as touché" : "Mot du texte", pool: glossFr, noVoc: !isMine, skill: "read", lvl: t.lvl};
  });
  const items = [];
  qs.forEach((q, k) => { items.push(q); if (k >= 1) items.push(...wItems.splice(0, k === 1 ? 1 : 2)); });
  items.push(...wItems);
  READ = null;
  startSession("Lecture · " + t.title, items, {kind: "read", text: t.id});
}
async function aiText(part) {
  genCtl = new AbortController(); const ctl = genCtl;
  const stop = loadingScreen("Nouveau texte à ton niveau", () => ctl.abort());
  const prompt = `Écris un texte en anglais pour un francophone de niveau ${levelPrompt("read")}, thème : ${part === "business" ? "le monde du commerce et de l'entreprise (vente, négociation, clients, fournisseurs, réunions, marketing, finances…)" : "la vie quotidienne (logement, voisins, courses, santé, transports, loisirs, travail, amis…)"}.
Le texte fait 150 à 230 mots, sur une situation concrète et réaliste, avec un vocabulaire utile, adapté au niveau (un peu au-dessus pour progresser). Évite les sujets déjà vus : ${allTexts().map(x => x.title).join(", ")}.
Renvoie UNIQUEMENT un objet JSON :
{"title":"titre court en anglais","text":"le texte, paragraphes séparés par \\n","gloss":{"mot ou expression tel qu'il apparaît, en minuscules":"traduction française dans ce contexte"},"questions":[{"q":"question de compréhension en anglais","o":["bonne réponse","mauvaise","mauvaise"],"a":0}]}
Le glossaire couvre TOUS les mots et expressions non évidents du texte (au moins 35 entrées, y compris verbes conjugués et expressions de plusieurs mots). 3 questions, la bonne réponse en position 0.`;
  try {
    const r = await sample.json(prompt, {modelTier: "default", signal: ctl.signal, cache: false});
    stop();
    if (!r || typeof r.text !== "string" || r.text.length < 80 || !Array.isArray(r.questions)) { toast("Le texte généré était incomplet. Réessaie."); render(); return; }
    const gloss = {}; Object.entries(r.gloss || {}).forEach(([k, v]) => { if (typeof v === "string") gloss[clean(k.replace(/\s+/g, " ")) || k.toLowerCase()] = v; });
    const q = r.questions.filter(x => x && x.q && Array.isArray(x.o) && x.o.length >= 2).slice(0, 4).map(x => ({q: String(x.q), o: x.o.map(String), a: Number.isInteger(x.a) && x.a < x.o.length ? x.a : 0}));
    const t = {id: "ai_" + hash(r.text), part, lvl: cefr("read"), title: String(r.title || "Text"), text: r.text.trim(), gloss, q, ai: 1};
    S.aitexts = [t, ...S.aitexts.filter(x => x.id !== t.id)].slice(0, 12); save();
    openReader(t);
  } catch (e) { stop(); if (ctl.signal.aborted) return; const m = aiErr(e); render(); if (m) toast(m); }
}
// --- Rédaction
function openWriting(w) {
  WRITING = {w}; SES = null; renderTabs(false); document.onkeydown = null; window.scrollTo(0, 0);
  const prev = S.writing[w.id];
  app.innerHTML = `<div class="wrap" style="padding-bottom:120px">
    <div class="topbar"><button class="x" id="wquit" aria-label="Quitter">✕</button><div style="flex:1;min-width:0"><span class="eyebrow">Rédaction · ${esc(w.lvl)}</span><h2>${esc(w.title)}</h2></div></div>
    <div class="card"><p>${esc(w.brief)}</p></div>
    <textarea id="wtext" class="field" rows="10" placeholder="Écris ton texte en anglais ici">${esc(prev?.text || "")}</textarea>
    <div class="row" style="justify-content:space-between"><span class="small muted" id="wcount">0 mot</span>${prev ? pill("dernière note : " + prev.score + "/20") : ""}</div>
    <div class="row"><button class="btn primary ai-only" id="wcheck">Faire corriger</button><button class="btn ghost" id="wmodel">Voir un modèle</button></div>
    <div id="wout" class="stack"></div></div>`;
  const ta = $("#wtext"), cnt = () => { const n = ta.value.trim().split(/\s+/).filter(Boolean).length; $("#wcount").textContent = n + " mot" + (n > 1 ? "s" : ""); };
  ta.oninput = cnt; cnt();
  $("#wquit").onclick = () => render();
  $("#wmodel").onclick = () => { $("#wout").insertAdjacentHTML("beforeend", `<section class="card"><div class="row" style="justify-content:space-between"><h3>Modèle</h3><button class="btn sm ghost" id="wplay">${ic("play")} Écouter</button></div><p style="white-space:pre-wrap">${esc(w.model)}</p></section>`); $("#wmodel").disabled = true; $("#wplay").onclick = () => speak(w.model.replace(/\n+/g, " ")); };
  const wc = $("#wcheck"); if (wc) wc.onclick = () => correctWriting(w, ta.value.trim());
  refreshAI();
}
async function correctWriting(w, text) {
  if (text.split(/\s+/).length < 8) { toast("Écris au moins quelques phrases avant de demander la correction."); return; }
  const btn = $("#wcheck"); btn.disabled = true; btn.textContent = "Correction en cours…";
  const prompt = `Tu es un professeur d'anglais exigeant et bienveillant. Ton élève est francophone, niveau ${levelPrompt("gram")}.
Consigne : ${w.brief}
Texte de l'élève :
"""${text}"""
Corrige ce texte. Renvoie UNIQUEMENT un objet JSON :
{"score":note sur 20 (nombre entier, tenant compte du respect de la consigne, de la grammaire, du vocabulaire et du registre),"comment":"2 à 3 phrases en français : points forts et points à améliorer","corrected":"le texte de l'élève corrigé, en gardant ses idées","errors":[{"wrong":"passage fautif exact","right":"correction","why":"explication courte en français"}],"better":"une version plus naturelle et idiomatique, du niveau visé"}
Relève toutes les vraies fautes (grammaire, orthographe, vocabulaire, registre, faux amis), au maximum 12.`;
  try {
    const r = await sample.json(prompt, {modelTier: "default", cache: false});
    const score = Math.max(0, Math.min(20, Math.round(+r.score || 0)));
    const errs = Array.isArray(r.errors) ? r.errors.filter(e => e && e.wrong && e.right) : [];
    S.writing[w.id] = {score, text, date: Date.now()};
    errs.forEach(e => { const key = "wr:" + hash(norm(e.wrong) + "|" + norm(e.right)); if (!S.mist.some(m => m.k === key)) S.mist.unshift({k: key, it: {t: "fix", wrong: e.wrong, right: e.right, x: e.why || "", src: "Rédaction · " + w.title}, box: 0, due: Date.now() + DAY / 2, n: 1}); });
    if (S.mist.length > 250) S.mist.length = 250;
    const it = {t: "fix", skill: "gram", lvl: w.lvl}; levelTick(it, score >= 14, {}); levelTick(it, score >= 12, {});
    save();
    $("#wout").innerHTML = `<section class="card"><div class="row" style="justify-content:space-between"><h3>Note</h3><b class="lvl" style="font-size:2rem">${score}/20</b></div><p>${esc(r.comment || "")}</p></section>
      ${errs.length ? `<section class="card"><h3>Corrections (${errs.length})</h3>${errs.map(e => `<div class="small"><s style="color:var(--err)">${esc(e.wrong)}</s> → <b style="color:var(--ok)">${esc(e.right)}</b>${e.why ? `<div class="muted">${esc(e.why)}</div>` : ""}</div>`).join("")}<p class="small muted">Ces fautes sont ajoutées à ton carnet d'erreurs.</p></section>` : ""}
      <section class="card"><h3>Ton texte corrigé</h3><p style="white-space:pre-wrap">${esc(r.corrected || "")}</p></section>
      ${r.better ? `<section class="card"><div class="row" style="justify-content:space-between"><h3>Version plus naturelle</h3><button class="btn sm ghost" id="bplay">${ic("play")} Écouter</button></div><p style="white-space:pre-wrap">${esc(r.better)}</p></section>` : ""}`;
    if ($("#bplay")) $("#bplay").onclick = () => speak(r.better);
  } catch (e) { const m = aiErr(e); if (m) toast(m); }
  if ($("#wcheck")) { btn.disabled = false; btn.textContent = "Faire corriger à nouveau"; }
}

// ---------- Oral ----------
function renderOral() {
  const scs = part => SCENARIOS.filter(s => s.part === part).map(s => `<button class="choice" data-sc="${s.id}"><b>${esc(s.title)}</b></button>`).join("");
  const dls = part => DIALOGS.filter(d => d.part === part).map(d => { const sc = S.dlg[d.id]; return `<button class="choice" data-dl="${d.id}"><div class="row" style="justify-content:space-between"><b>${esc(d.title)}</b><span class="row" style="gap:6px">${pill(d.lvl)}${sc != null ? pill(sc + " %", sc >= 80 ? "ok" : "") : ""}</span></div></button>`; }).join("");
  app.innerHTML = `<div class="wrap">
  <div class="stack"><span class="eyebrow">Oral</span><h1>Écouter, répéter, converser</h1>
  <p class="muted">Pour parler, il faut parler. Écoute, répète à voix haute, puis dicte : l'appli compare mot à mot ce que tu as dit${canRecord() ? ", et tu peux t'enregistrer pour comparer ta voix au modèle" : ""}.</p></div>
  <section class="card"><div class="row" style="justify-content:space-between"><h2>Phrases</h2>${pill(BANK.length + " phrases")}</div>
    <p class="small muted">Des phrases toutes différentes, de A1 à C1, choisies à ton niveau (${LV[S.sk.oral.li]}). Chaque série de 12 mélange trois exercices : traduire du français vers l'anglais (au clavier ou au micro), écrire ce que tu entends, et dire la phrase à voix haute. Les phrases déjà vues reviennent moins souvent.</p>
    <div class="row"><button class="btn primary" data-bank="">Série mixte</button><button class="btn" data-bank="daily">Vie quotidienne</button><button class="btn" data-bank="business">Commerce</button></div>
  </section>
  <section class="card"><div class="row" style="justify-content:space-between"><h2>Leçons de dictée</h2>${pill(DIC_LESSONS.length + " leçons")}</div>
    <p class="small muted">Tu écoutes l'enregistrement, tu réécris la phrase. L'appli compare mot à mot : mots justes en vert, presque justes en orange, manquants en rouge. Tu peux réécouter, ralentir, demander les premières lettres. Une leçon est validée à 90 %. Les phrases vont des plus courtes aux plus longues, niveau par niveau.</p>
    ${AUD.idx && !englishVoices().length && DIC_LESSONS.some(d => !d.items.some(x => canHear(x.en, x.voice))) ? `<p class="audiowarn">Les leçons grisées n'ont pas encore leurs enregistrements anglais (préparation en cours). En attendant, elles fonctionnent dans Microsoft Edge, qui a ses propres voix anglaises.</p>` : ""}
    <button class="btn primary" id="dicnext">Continuer : ${esc(dicTitle(nextDicLesson(S.focus === "both" ? null : S.focus)))}</button>
    <div class="dicgrid">${["daily", "business"].map(part => `<div class="stack" style="gap:6px"><span class="eyebrow">${part === "daily" ? "Vie quotidienne" : "Commerce"}</span>
      ${CEFR.map(l => { const ls = DIC_LESSONS.filter(d => d.part === part && d.lvl === l); if (!ls.length) return "";
        return `<div class="row" style="gap:6px"><b class="small" style="width:2.2em">${l}</b>${ls.map(d => { const sc = S.dict[d.id]; const ready = d.items.some(x => canHear(x.en, x.voice)); return `<button class="dicbtn ${sc >= 90 ? "done" : sc != null ? "tried" : ""} ${ready ? "" : "wait"}" data-dic="${d.id}" title="${esc(dicTitle(d))}${sc != null ? " · " + sc + " %" : ""}">${d.num}</button>`; }).join("")}</div>`; }).join("")}</div>`).join("")}</div>
  </section>
  <section class="card"><h2>Dialogues à écouter</h2><p class="small muted">Deux vraies voix anglaises, sans le texte au début : écoute, puis réponds aux questions. Affiche le texte seulement si tu bloques.</p>
    <span class="eyebrow">Vie quotidienne</span><div class="list">${dls("daily")}</div>
    <span class="eyebrow">Commerce</span><div class="list">${dls("business")}</div>
    <button class="btn sm ghost ai-only" id="dlgai">Nouveau dialogue à mon niveau (IA)</button></section>
  <section class="card"><h2>Conversation avec le tuteur</h2>
    <p class="small muted">Un échange réaliste à ton niveau (${LV[S.sk.oral.li]}). Le tuteur te répond, corrige chacune de tes fautes et propose une formulation plus naturelle. Tes fautes partent dans ton carnet.</p>
    <p class="small ai-off" style="color:var(--warn)">${IN_CLAUDE ? "Autorise l'accès à Claude pour converser avec le tuteur." : "Disponible dans la version claude.ai."}</p>
    <div class="ai-only stack"><span class="eyebrow">Vie quotidienne</span><div class="list">${scs("daily")}</div>
    <span class="eyebrow" style="margin-top:6px">Commerce</span><div class="list">${scs("business")}</div></div>
  </section>
  <section class="card"><h2>Répéter à voix haute</h2><p class="small muted">Phrases utiles, à dire jusqu'à ce qu'elles sortent toutes seules.</p>
    <div class="row">${SHADOW.map((c, i) => `<button class="btn sm" data-sh="${i}">${esc(c[0])}</button>`).join("")}</div></section>
  <section class="card"><h2>Dictée express</h2><p class="small muted">10 phrases tirées au hasard à ton niveau, toutes leçons confondues.</p>
    <div class="row"><button class="btn" id="dict">Lancer une dictée express</button></div></section>
  <section class="card"><h3>Comment parler à l'appli ?</h3><p class="small muted">${MIC_OK ? "Touche le micro dans l'exercice et autorise-le la première fois : ce que tu dis s'écrit, puis l'appli compare. " : IN_CLAUDE ? `Dans claude.ai, la page n'a pas accès au micro : ouvre la version installable (<a href="${APP_URL}" target="_blank" rel="noopener">${APP_URL.replace("https://", "")}</a>) pour parler directement à l'appli. ` : ""}Si le micro est bloqué, utilise le micro de ton clavier (Gboard, clavier iPhone) dans la zone de texte : ta voix est transcrite et la comparaison fonctionne pareil.${IN_CLAUDE ? " Dans l'appli installée sur ton téléphone, le micro de l'appli fonctionne directement." : ""}</p></section>
  </div>`;
  $$("[data-sc]").forEach(b => b.onclick = () => startChat(SCENARIOS.find(s => s.id === b.dataset.sc)));
  $$("[data-dl]").forEach(b => b.onclick = () => openDialog(DIALOGS.find(d => d.id === b.dataset.dl)));
  if ($("#dlgai")) $("#dlgai").onclick = aiDialog;
  $$("[data-sh]").forEach(b => b.onclick = () => { const c = SHADOW[+b.dataset.sh]; startSession("Oral · " + c[0], c[1].map(p => ({t: "sp", en: p[0], fr: p[1], key: "sh:" + hash(p[0]), src: "Oral · " + c[0], noMist: true})), {kind: "oral"}); });
  $("#dict").onclick = () => { const li = cefrIdx("lis"); startSession("Dictée express", shuffle(DIC_SRC.filter(x => CEFR.indexOf(x.lvl) <= li + 1)).slice(0, 10).map(dicItem), {kind: "dict"}); };
  $$("[data-bank]").forEach(b => b.onclick = () => startSession("Phrases" + (b.dataset.bank ? " · " + (b.dataset.bank === "daily" ? "quotidien" : "commerce") : ""), bankSession(b.dataset.bank || null), {kind: "bank"}));
  $("#dicnext").onclick = () => openDicLesson(nextDicLesson(S.focus === "both" ? null : S.focus));
  $$("[data-dic]").forEach(b => b.onclick = () => openDicLesson(DIC_LESSONS.find(d => d.id === b.dataset.dic)));
}
function dicTitle(d) { return "Dictée " + d.lvl + " n° " + d.num + " · " + (d.part === "business" ? "commerce" : "quotidien"); }
function openDicLesson(d) { startSession(dicTitle(d), d.items.map(dicItem), {kind: "dictee", dic: d.id}); }
function openDialog(d) {
  DIALOG = {d}; SES = null; renderTabs(false); document.onkeydown = null; window.scrollTo(0, 0);
  const sp = [...new Set(d.lines.map(l => l[0]))];
  const vo = name => sp.indexOf(name) === 0 ? "a" : "b";
  prefetchAudio(d.lines.map(l => l[1]));
  app.innerHTML = `<div class="wrap" style="padding-bottom:120px">
    <div class="topbar"><button class="x" id="dquit" aria-label="Quitter">✕</button><div style="flex:1;min-width:0"><span class="eyebrow">Dialogue · ${esc(d.lvl)}</span><h2>${esc(d.title)}</h2></div></div>
    <div class="row"><button class="btn primary" id="dplay">${ic("play")} Écouter le dialogue</button><button class="btn ghost" id="dslow">Lentement</button><button class="btn ghost" id="dstop">Stop</button></div>
    <button class="toggle" id="dshow">Afficher le texte</button>
    <div class="card dlg" id="dtext" hidden>${d.lines.map((l, i) => `<div class="dline ${vo(l[0])}"><b>${esc(l[0])}</b><button class="exline" data-li="${i}">${ic("play", 14)} ${esc(l[1])}</button>${trFR(l[1]) ? `<span class="small muted dfr" hidden>${esc(trFR(l[1]))}</span>` : ""}</div>`).join("")}<button class="toggle" id="dfrshow" type="button">Afficher la traduction</button></div>
  </div>
  <div class="actionbar"><div class="in"><button class="btn primary" id="dq">Aux questions</button></div></div>`;
  const playAll = async rate => { hush(); const seq = AUD.seq; for (const [n, txt] of d.lines) { if (seq !== AUD.seq) return; await speakWait(txt, rate, vo(n), seq); } };
  $("#dplay").onclick = () => playAll(1);
  $("#dslow").onclick = () => playAll(.75);
  $("#dstop").onclick = hush;
  $("#dfrshow").onclick = () => { const on = $$(".dfr").some(x => x.hidden); $$(".dfr").forEach(x => x.hidden = !on); $("#dfrshow").textContent = on ? "Masquer la traduction" : "Afficher la traduction"; };
  $("#dshow").onclick = () => { const t = $("#dtext"); t.hidden = !t.hidden; $("#dshow").textContent = t.hidden ? "Afficher le texte" : "Masquer le texte"; };
  $$("[data-li]").forEach(b => b.onclick = () => { const l = d.lines[+b.dataset.li]; speak(l[1], 1, vo(l[0])); });
  $("#dquit").onclick = () => render();
  $("#dq").onclick = () => { hush(); const items = d.q.map((q, k) => { const order = shuffle(q.o.map((o, i) => i)); return {t: "mcq", q: q.q, o: order.map(i => q.o[i]), a: order.indexOf(q.a || 0), key: "dq:" + d.id + ":" + k, src: "Dialogue · " + d.title, noMist: true, noSay: true, skill: "lis", lvl: d.lvl}; });
    DIALOG = null; startSession("Dialogue · " + d.title, items, {kind: "dialog", dlg: d.id}); };
}
// lit une réplique et attend la fin (pour enchaîner les voix)
async function speakWait(text, rate, voice, seq) {
  for (const p of splitSpeech(text)) {
    if (seq !== AUD.seq) return;
    const src = await clipSrc(p, voice);
    if (src) await playSrc(src, rate * baseRate(), seq);
    else if (englishVoices().length) await deviceSay(p, rate * baseRate(), voice === "b", seq);
    else { noAudio(); return; }
  }
}
async function aiDialog() {
  genCtl = new AbortController(); const ctl = genCtl;
  const stop = loadingScreen("Nouveau dialogue à ton niveau", () => ctl.abort());
  const part = S.focus === "daily" ? "daily" : S.focus === "business" ? "business" : pick(["daily", "business"]);
  const prompt = `Écris un dialogue réaliste en anglais entre deux personnes pour un francophone de niveau ${levelPrompt("lis")}, thème : ${part === "business" ? "une situation professionnelle (vente, négociation, client, fournisseur, réunion, livraison…)" : "une situation de la vie quotidienne"}. 8 à 12 répliques, langage oral naturel.
Renvoie UNIQUEMENT un objet JSON : {"title":"titre en français","lines":[["Prénom ou rôle","réplique"],…],"questions":[{"q":"question de compréhension en anglais","o":["bonne réponse","mauvaise","mauvaise"],"a":0}]} avec 3 questions, la bonne réponse en position 0.`;
  try {
    const r = await sample.json(prompt, {modelTier: "default", signal: ctl.signal, cache: false});
    stop();
    const lines = (r && Array.isArray(r.lines) ? r.lines : []).filter(l => Array.isArray(l) && l.length >= 2).map(l => [String(l[0]), String(l[1])]);
    const q = (r && Array.isArray(r.questions) ? r.questions : []).filter(x => x && x.q && Array.isArray(x.o) && x.o.length >= 2).map(x => ({q: String(x.q), o: x.o.map(String), a: Number.isInteger(x.a) && x.a < x.o.length ? x.a : 0}));
    if (lines.length < 4 || !q.length) { toast("Le dialogue généré était incomplet. Réessaie."); render(); return; }
    openDialog({id: "ai_" + hash(JSON.stringify(lines)), part, lvl: cefr("lis"), title: String(r.title || "Dialogue"), lines, q});
    if (!englishVoices().length) toast("Ce dialogue créé par l'IA n'a pas d'enregistrement : il n'est lu que si l'appareil a une voix anglaise.");
  } catch (e) { stop(); if (ctl.signal.aborted) return; const m = aiErr(e); render(); if (m) toast(m); }
}

// ---------- Leçons ----------
function renderPath() {
  app.innerHTML = `<div class="wrap">
  <div class="stack"><span class="eyebrow">Leçons de grammaire</span><h1>Une notion à la fois</h1>
  <p class="muted">Chaque leçon mélange choix, phrases à trous, traductions, fautes, écoute et oral. Vise 80 % pour valider. Tu maîtrises déjà une notion ? « Tester mes acquis » : à 90 %, elle est validée sans faire la leçon.</p></div>
  <div class="list">${UNITS.map(u => { const st = S.units[u.id] || {}, best = st.best || 0;
    return `<article class="card"><div class="unit"><div class="badge ${best >= 80 ? "done" : ""}">${best >= 80 ? "✓" : u.lvl}</div>
      <div class="stack" style="gap:6px;min-width:0"><div class="row" style="justify-content:space-between"><h3>${esc(u.title)}</h3>${pill(u.lvl)}</div>
      <p class="small muted">${esc(u.focus)}</p>${bar(best)}
      <div class="row"><button class="btn sm primary" data-u="${u.id}">${st.runs ? "Refaire" : "Commencer"}</button>${best < 80 && u.gen !== "irreg" ? `<button class="btn sm ghost" data-ut="${u.id}">Tester mes acquis</button>` : ""}<button class="btn sm ghost ai-only" data-ai="${u.id}">Nouvelle leçon IA</button>${st.runs ? `<span class="small muted">Meilleur : ${best} %</span>` : ""}</div>
      </div></div></article>`; }).join("")}</div>
  <section class="card"><h3>Une notion qui n'est pas dans la liste ?</h3>
    <p class="small muted ai-off">Disponible avec le tuteur IA.</p>
    <div class="ai-only stack"><label for="topic" class="small muted">Décris ce que tu veux travailler (ex. : « le passif », « used to », « les question tags », « les e-mails de relance client »).</label>
    <input id="topic" class="field" placeholder="Ex. : le passif"><button class="btn primary" id="gentopic">Créer la leçon</button></div></section></div>`;
  $$("[data-u]").forEach(b => b.onclick = () => { const u = UNITS.find(x => x.id === b.dataset.u); startSession(u.title, unitSession(u), {unit: u.id}); });
  $$("[data-ut]").forEach(b => b.onclick = () => { const u = UNITS.find(x => x.id === b.dataset.ut); startSession("Test : " + u.title, unitSession(u).filter(x => x.t !== "sp"), {kind: "test", forceKb: true, test: {type: "unit", id: u.id}}); });
  $$("[data-ai]").forEach(b => b.onclick = () => { const u = UNITS.find(x => x.id === b.dataset.ai); aiLesson(u.title, u.gen === "irreg" ? "verbes irréguliers anglais au prétérit et au participe passé, en contexte" : u.focus, "gram"); });
  $("#gentopic").onclick = () => { const t = $("#topic").value.trim(); if (!t) { toast("Écris d'abord la notion à travailler."); return; } aiLesson(t, t, "gram"); };
}

// ---------- Carnet ----------
function renderBook() {
  const due = dueMistakes(), list = S.mist.slice().sort((a, b) => a.due - b.due);
  app.innerHTML = `<div class="wrap">${backBar("Carnet d'erreurs", () => go("home"))}
  <div class="stack"><h1>Tes erreurs, à revoir au bon moment</h1>
  <p class="muted">Erreurs des leçons, des dictées, des rédactions et des conversations. Chacune revient après 1, 3, 7, 16 puis 35 jours. Réussie à chaque fois, elle sort du carnet. Les mots et les règles ont leur propre suivi.</p></div>
  <div class="card"><div class="row" style="justify-content:space-between"><b>${due.length} à réviser maintenant</b>${pill(S.mist.length + " au total")}</div>
  <button class="btn primary block" id="rev" ${due.length ? "" : "disabled"}>Réviser maintenant</button></div>
  <div class="list">${list.length ? list.map(m => { const it = itemByKey(m.k, m.it); if (!it) return ""; const days = Math.ceil((m.due - Date.now()) / DAY);
    return `<div class="card" style="gap:6px"><div class="row" style="justify-content:space-between"><span class="small muted">${esc(it.src || "")}</span>${pill(days <= 0 ? "à revoir" : "dans " + days + " j", days <= 0 ? "err" : "")}</div>
      <div>${describe(it)}</div><div class="row" style="justify-content:space-between"><span class="small muted">Étape ${m.box}/5 · ratée ${m.n} fois</span><button class="btn sm ghost" data-del="${esc(m.k)}">Retirer</button></div></div>`; }).join("")
    : `<div class="empty">Aucune erreur pour l'instant. Celles que tu feras arriveront ici automatiquement.</div>`}</div></div>`;
  $("#rev").onclick = () => startSession("Révision", due.slice(0, 15).map(m => itemByKey(m.k, m.it)).filter(Boolean), {kind: "review"});
  $$("[data-del]").forEach(b => b.onclick = () => { S.mist = S.mist.filter(m => m.k !== b.dataset.del); save(); render(); });
}
function describe(it) {
  if (it.t === "spot") return esc(it.s.replace(/\*/g, ""));
  if (it.t === "gap") return esc(it.s);
  if (it.t === "tr") return "« " + esc(it.fr) + " »";
  if (it.t === "mcq") return esc(it.q);
  if (it.t === "fix") return `<s>${esc(it.wrong)}</s> → <b>${esc(it.right)}</b>`;
  if (it.t === "v") return `<b>${esc(alts(it.en)[0])}</b> = ${esc(show(it.fr))}`;
  if (it.t === "dic") return "Dictée : " + esc(it.en);
  return esc(it.en || "");
}

// ====== SESSION D'EXERCICES ======
function speechOf(it) {
  if (it.t === "v") return [alts(it.en)[0]].concat(it.ex ? [it.ex[0]] : []);
  if (it.t === "gap" && !it.noSpeak) return [it.s.replace("___", it.a[0])];
  if (it.t === "tr") return [it.a[0]];
  if (it.t === "ls" || it.t === "sp" || it.t === "dic") return [it.en];
  if (it.t === "mcq" && !it.noSay) return [it.o[it.a]];
  return [];
}
function adaptForAudio(items) {
  return items.map(it => {
    if (!it) return null;
    if ((it.t === "dic" || it.t === "ls") && !canHear(it.en, it.voice || "a")) return null;
    if (it.t === "v" && /listen|dictate/.test(it.mode) && !canHear(alts(it.en)[0])) return Object.assign({}, it, {mode: it.mode === "listen" ? "en2fr" : "type"});
    return it;
  }).filter(Boolean);
}
function startSession(title, items, opts = {}) {
  const asked = items.filter(Boolean).length;
  items = adaptForAudio(items);
  if (asked && !items.length) { toast("Les enregistrements anglais de ces phrases sont en cours de préparation. Réessaie un peu plus tard, ou ouvre l'appli dans Microsoft Edge pour utiliser ses voix anglaises."); return; }
  const oldFb = $("#fb"); if (oldFb) oldFb.remove();
  if (!items.length) { toast("Rien à travailler ici pour l'instant."); return; }
  SES = Object.assign({title, items, i: 0, ok: 0, tot: 0, t0: Date.now(), retried: new Set(), errs: [], used: {}, li0: S.li, changes: []}, opts);
  CHAT = null; READ = null; WRITING = null; DIALOG = null; renderTabs(false); window.scrollTo(0, 0);
  prefetchAudio(items.flatMap(speechOf));
  showItem();
}
function quit() { hush(); finishTime(); render(); }
function finishTime() { if (SES) { S.sec += Math.min(2400, Math.round((Date.now() - SES.t0) / 1000)); save(); } }
function showItem() {
  const it = SES.items[SES.i];
  CUR = {it, answered: false};
  const pct = 100 * SES.i / SES.items.length;
  app.innerHTML = `<div class="wrap session" style="padding-bottom:300px">
    <div class="topbar"><button class="x" id="quit" aria-label="Quitter">✕</button><div class="bar" style="flex:1"><i style="width:${pct}%"></i></div><span class="small muted" style="font-variant-numeric:tabular-nums">${SES.i + 1}/${SES.items.length}</span></div>
    <div id="ex" class="stack" style="gap:18px"></div>
    <p class="audiowarn" id="audiowarn" hidden></p>
  </div>
  <div class="actionbar" id="ab"><div class="in"><button class="btn primary" id="check">Valider</button></div></div>`;
  $("#quit").onclick = quit;
  const ex = $("#ex");
  if (it.src) ex.insertAdjacentHTML("beforeend", `<span class="eyebrow">${esc(it.src)}${SES.kind === "test" ? " · test" : ""}</span>`);
  EX[it.t](it, ex);
  const ck = $("#check"); if (ck) ck.onclick = () => !CUR.answered && !CUR.busy && CUR.check && CUR.check();
  document.onkeydown = e => {
    if (e.key !== "Enter" || e.shiftKey) return;
    if (CUR.answered) { e.preventDefault(); nextItem(); }
    else if (CUR.check && !CUR.busy && (!$("#check") || !$("#check").disabled)) { e.preventDefault(); CUR.check(); }
  };
}
const playBtns = () => `<button class="round" data-say="1" aria-label="Écouter">${IC.play}</button><button class="round alt" data-say="0.7" aria-label="Écouter lentement">${IC.slow}</button>`;
function wirePlay(root, en) { $$("[data-say]", root).forEach(b => b.onclick = () => speak(en, +b.dataset.say)); }
function choiceUI(ex, prompt, opts, correctIdx, onPick) {
  ex.insertAdjacentHTML("beforeend", `${prompt}<div class="choices">${opts.map((o, i) => `<button class="choice" data-i="${i}">${esc(o)}</button>`).join("")}</div>`);
  $("#ab").hidden = true;
  $$(".choice", ex).forEach(b => b.onclick = () => { if (CUR.answered) return; const i = +b.dataset.i; b.classList.add(i === correctIdx ? "ok" : "bad"); $$(".choice", ex)[correctIdx].classList.add("ok"); onPick(i); });
}
const overlap = (a, b) => { const A = alts(a || "").map(norm); return alts(b || "").some(x => A.includes(norm(x))); };
function synonyms(it) { const t = themeById(it.th); return t ? t.words.filter(w => w.en !== it.en && overlap(w.fr, it.fr)).flatMap(w => alts(w.en)) : []; }
function distractors(it, field, n = 3) {
  let pool;
  if (it.pool) pool = it.pool.map(fr => ({fr}));
  else { const t = themeById(it.th); pool = t ? t.words : []; }
  if (pool.length < 8) pool = pool.concat(shuffle(THEMES.flatMap(x => x.words)).slice(0, 40));
  pool = pool.filter(w => !overlap(w.fr, it.fr) && !(w.en && overlap(w.en, it.en)));
  return shuffle([...new Set(pool.map(w => w[field] ? alts(w[field])[0] : null).filter(Boolean))]).slice(0, n);
}
// L'IA juge une réponse libre qui ne correspond à aucune réponse prévue
async function aiJudge(task, user, expected) {
  const prompt = `Tu corriges un exercice d'anglais pour un francophone de niveau ${levelPrompt("gram")}.
Exercice : ${task}
Réponses de référence : ${expected.map(e => "« " + e + " »").join(", ")}
Réponse de l'élève : « ${user} »
La réponse de l'élève est-elle correcte (grammaire et sens justes, formulation naturelle), même si elle diffère des références ? Une simple faute de frappe sans incidence est acceptée ; une faute de grammaire ou de vocabulaire ne l'est pas.
Renvoie UNIQUEMENT un objet JSON : {"ok":true ou false,"why":"une phrase en français qui justifie"}`;
  const r = await sample.json(prompt, {modelTier: "quick", cache: false});
  return {ok: !!(r && r.ok === true), why: String(r && r.why || "")};
}
async function freeCheck(it, v, answers, info, task) {
  let m = matchAnswer(v, answers, true);
  if (m.ok || !aiReady() || norm(v).split(" ").length < 2) return grade(m.ok, Object.assign(info, {typo: m.typo}));
  CUR.busy = true; const ck = $("#check"); if (ck) { ck.disabled = true; ck.textContent = "Vérification par le tuteur…"; }
  try { const j = await aiJudge(task, v, answers); CUR.busy = false; grade(j.ok, Object.assign(info, {ai: j.why, aiOk: j.ok})); }
  catch (e) { CUR.busy = false; grade(false, info); }
}
const EX = {
  rmcq(it, ex) {
    ex.insertAdjacentHTML("beforeend", `<div class="reader small" style="font-size:1rem;max-height:40vh;overflow:auto"><b>${esc(it.title)}</b>${it.text.split(/\n+/).map(p => `<p>${esc(p)}</p>`).join("")}</div>`);
    choiceUI(ex, `<p class="prompt">${esc(it.q)}</p>`, it.o, it.a, i => grade(i === it.a, {sol: it.o[it.a], user: it.o[i]}));
  },
  mcq(it, ex) {
    choiceUI(ex, `<p class="prompt">${esc(it.q)}</p>`, it.o, it.a, i => { if (!it.noSay && /^[A-Za-z]/.test(it.o[it.a])) speak(it.o[it.a]); grade(i === it.a, {sol: it.o[it.a], user: it.o[i]}); });
  },
  v(it, ex) {
    const en0 = alts(it.en)[0], fr0 = show(it.fr);
    if (it.mode === "learn") {
      const k = vkey(it.th, it.en);
      ex.insertAdjacentHTML("beforeend", `<span class="pill acc" style="align-self:flex-start">Nouveau mot</span>
        <div class="wordcard"><div class="row" style="flex-wrap:nowrap;gap:14px">${playBtns()}<div style="min-width:0"><div class="bigword">${esc(en0)}</div>${alts(it.en).length > 1 ? `<div class="muted">aussi : ${esc(alts(it.en).slice(1).join(", "))}</div>` : ""}</div></div><div class="frline">${esc(fr0)}</div><div id="vex"></div></div>
        <p class="small muted">Dis-le à voix haute deux fois, puis continue : il revient tout de suite en question.</p>`);
      wirePlay(ex, en0); setTimeout(() => speak(en0), 150);
      const showEx = e => { const box = $("#vex"); if (!box || !e) return; box.innerHTML = `<button class="exline" id="exsay">${ic("play", 14)} <i>${esc(e[0])}</i></button><div class="small muted">${esc(e[1] || "")}</div>`; $("#exsay").onclick = () => speak(e[0]); };
      const known = exampleFor(it.th, it);
      if (known) showEx(known);
      else if (aiReady()) { $("#vex").innerHTML = `<span class="small muted">Exemple en préparation…</span>`;
        sample.json(`Donne une phrase d'exemple courte, naturelle et courante en anglais (niveau ${cefr("voc")}) qui utilise « ${en0} » au sens de « ${fr0} », avec sa traduction. Réponds UNIQUEMENT en JSON : {"en":"...","fr":"..."}`, {modelTier: "quick"})
          .then(r => { if (r && r.en) { S.exs[k] = [String(r.en), String(r.fr || "")]; const keys = Object.keys(S.exs); if (keys.length > 1500) delete S.exs[keys[0]]; save(); if (CUR && CUR.it === it) showEx(S.exs[k]); } else if ($("#vex")) $("#vex").innerHTML = ""; })
          .catch(() => { if ($("#vex")) $("#vex").innerHTML = ""; }); }
      $("#ab").firstElementChild.innerHTML = `<button class="btn ghost" id="known">Je connais déjà</button><button class="btn primary" id="learnok">Je l'ai noté</button>`;
      $("#learnok").onclick = () => { if (!S.voc[k]) { S.voc[k] = [0, Math.round(Date.now() / 6e4), 0, 0, 2.5, 0]; save(); } nextItem(); };
      $("#known").onclick = () => { markKnown(it.th, it.en); save();
        // on retire les questions prévues pour ce mot dans cette séance
        SES.items = SES.items.filter((x, j) => j <= SES.i || x.key !== it.key); toast("« " + en0 + " » validé : il reviendra seulement en révision dans 3 semaines."); nextItem(); };
      CUR.learn = true; CUR.check = () => $("#learnok").click();
      return;
    }
    if (it.mode === "en2fr" || it.mode === "listen") {
      const fr1 = alts(it.fr)[0], ds = distractors(it, "fr"), opts = shuffle([fr1, ...ds]), a = opts.indexOf(fr1);
      const prompt = it.mode === "listen"
        ? `<p class="prompt">Qu'est-ce que tu entends ?</p><div class="row">${playBtns()}</div>`
        : `<p class="prompt">Que veut dire</p><div class="row" style="flex-wrap:nowrap;gap:12px"><button class="round alt" data-say="1" aria-label="Écouter">${IC.play}</button><span class="bigword">${esc(en0)}</span></div>`;
      choiceUI(ex, prompt, opts, a, i => grade(i === a, {sol: en0 + " = " + fr0, user: opts[i]}));
      wirePlay(ex, en0); setTimeout(() => speak(en0), 150);
      return;
    }
    if (it.mode === "fr2en") {
      const ds = distractors(it, "en"), opts = shuffle([en0, ...ds]), a = opts.indexOf(en0);
      choiceUI(ex, `<p class="prompt">Comment dit-on</p><p class="bigword frw">${esc(fr0)}</p>`, opts, a, i => { speak(en0); grade(i === a, {sol: en0 + " = " + fr0, user: opts[i]}); });
      return;
    }
    if (it.mode === "ctx") {
      const e = exampleFor(it.th, it), word = alts(it.en)[0].replace(/^to /i, "");
      const re = new RegExp("\\b" + word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
      const [pre, post] = [e[0].split(re)[0], e[0].split(re).slice(1).join(word)];
      ex.insertAdjacentHTML("beforeend", `<p class="prompt">Complète avec le mot qui veut dire <i>${esc(fr0)}</i></p>
        <p class="gapline">${esc(pre)}<input id="vin" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Mot manquant">${esc(post)}</p><p class="small muted">${esc(e[1] || "")}</p>`);
      const inp = $("#vin"); setTimeout(() => inp.focus(), 60);
      CUR.check = () => { const v = inp.value.trim(); if (!v) return; inp.disabled = true; const m = matchAnswer(v, [word], true, 6); speak(e[0]); grade(m.ok, {sol: e[0], user: v, typo: m.typo}); };
      return;
    }
    const dict = it.mode === "dictate";
    ex.insertAdjacentHTML("beforeend", (dict ? `<p class="prompt">Écris ce que tu entends</p><div class="row">${playBtns()}</div>`
      : `<p class="prompt">Écris ou dis en anglais</p><p class="bigword frw">${esc(fr0)}</p>`) + `<div class="row" style="flex-wrap:nowrap;align-items:flex-start">${dict ? "" : micHTML("vmic")}<input id="vin" class="field" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="En anglais"></div>${dict ? "" : micNote()}`);
    if (dict) { wirePlay(ex, en0); setTimeout(() => speak(en0), 150); }
    const inp = $("#vin"); if (dict || !MIC_OK) setTimeout(() => inp.focus(), 60);
    if (!dict) wireMic("vmic", inp, () => { if (!CUR.answered && CUR.it === it) CUR.check(); });
    CUR.check = () => { const v = inp.value.trim(); if (!v) return; inp.disabled = true;
      let m = matchAnswer(stripTo(v), alts(it.en).map(stripTo), true, 6);
      if (!m.ok && !dict) { const sy = matchAnswer(stripTo(v), synonyms(it).map(stripTo), false); if (sy.ok) m = {ok: true, syn: 1}; }
      speak(en0); grade(m.ok, {sol: en0 + " = " + fr0, user: v, typo: m.typo, syn: m.syn}); };
  },
  gap(it, ex) {
    const [a, b] = it.s.split("___");
    ex.insertAdjacentHTML("beforeend", `<p class="prompt">Complète${it.v ? ` avec <i>${esc(it.v)}</i>` : ""}</p>
      <p class="gapline">${esc(a)}<input id="gin" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Mot manquant">${esc(b ?? "")}</p>`);
    trToggle(ex, it);
    const inp = $("#gin"); setTimeout(() => inp.focus(), 50);
    CUR.check = () => { const v = inp.value.trim(); if (!v) return; inp.disabled = true; const m = matchAnswer(v, it.a, false);
      grade(m.ok, {sol: it.s.replace("___", it.a[0]), user: v}); if (!it.noSpeak) speak(it.s.replace("___", it.a[0])); };
  },
  tr(it, ex) {
    const toks = it.a[0].replace(/[.,!?]/g, "").split(/\s+/);
    const bank = shuffle([...toks, ...(it.d || [])]);
    ex.insertAdjacentHTML("beforeend", `<p class="prompt">Traduis en anglais</p><p class="fr">${esc(it.fr)}</p>
      <div id="trwrap"><div class="answer" id="ans"></div><div class="bank" id="bank" style="margin-top:14px">${bank.map((w, i) => `<button class="chip" data-i="${i}">${esc(w)}</button>`).join("")}</div></div>
      <div class="row" id="trkb" hidden style="flex-wrap:nowrap;align-items:flex-start">${micHTML("trmic")}<textarea id="trin" class="field" placeholder="Écris ou dis ta traduction" autocapitalize="sentences"></textarea></div>
      <div id="trnote" hidden>${micNote()}</div>
      <button class="toggle" id="mode">Utiliser le clavier ou le micro</button>`);
    const picked = [];
    const draw = () => { $("#ans").innerHTML = picked.map((i, k) => `<button class="chip" data-k="${k}">${esc(bank[i])}</button>`).join(""); $$("#bank .chip").forEach(c => c.classList.toggle("used", picked.includes(+c.dataset.i))); };
    $("#bank").onclick = e => { const c = e.target.closest(".chip"); if (!c || CUR.answered || picked.includes(+c.dataset.i)) return; picked.push(+c.dataset.i); draw(); };
    $("#ans").onclick = e => { const c = e.target.closest(".chip"); if (!c || CUR.answered) return; picked.splice(+c.dataset.k, 1); draw(); };
    let kb = false;
    const setKb = v => { kb = v; $("#trwrap").hidden = kb; $("#trkb").hidden = !kb; $("#trnote").hidden = !kb; $("#mode").textContent = kb ? "Utiliser les mots proposés" : "Utiliser le clavier ou le micro"; if (kb && !MIC_OK) setTimeout(() => { const t = $("#trin"); if (t) t.focus(); }, 50); };
    wireMic("trmic", $("#trin"));
    $("#mode").onclick = () => setKb(!kb);
    if ((S.sk.gram.li >= 4 || hard("tr") || SES.forceKb) && !(String(it.key).startsWith("bk:") && !aiReady())) setKb(true);   // sans tuteur, les phrases de la banque restent en mots proposés (une seule traduction de référence)
    CUR.check = () => { const v = kb ? $("#trin").value.trim() : picked.map(i => bank[i]).join(" "); if (!v) return;
      speak(it.a[0]);
      if (!kb) { const m = matchAnswer(v, it.a, false); return grade(m.ok, {sol: it.a[0], user: v, kb}); }
      freeCheck(it, v, it.a, {sol: it.a[0], user: v, kb: true}, "traduire en anglais « " + it.fr + " »"); };
  },
  spot(it, ex) {
    const segs = it.s.split(/(\*[^*]+\*)/).filter(Boolean), toks = [];
    segs.forEach(p => { const err = p.length > 2 && p.startsWith("*") && p.endsWith("*"); (err ? p.slice(1, -1) : p).split(/\s+/).filter(Boolean).forEach(w => { if (!err && toks.length && /^[^A-Za-z0-9]+$/.test(w) && w !== "-") toks[toks.length - 1].w += w; else toks.push({w, err}); }); });
    const hasErr = toks.some(t => t.err);
    ex.insertAdjacentHTML("beforeend", `<p class="prompt">Touche la faute</p><p class="spot">${toks.map((t, i) => `<button class="w" data-i="${i}">${esc(t.w)}</button>`).join(" ")}</p>`);
    trToggle(ex, it);
    $("#ab").firstElementChild.innerHTML = `<button class="btn ghost" id="nofault">Il n'y a pas de faute</button>`;
    const span = (it.s.match(/\*([^*]+)\*/) || [])[1], [pre, post = ""] = it.s.split(/\*[^*]+\*/);
    const corrected = !hasErr ? esc(it.s)
      : it.f ? esc(pre) + `<b class="fix">${esc(it.f)}</b>` + esc(post)
      : esc((pre + post).replace(/\s+/g, " ").replace(/\s([.,!?])/g, "$1")) + ` <span class="muted">(« ${esc(span)} » est en trop)</span>`;
    const finish = (ok, userTxt, i) => {
      if (CUR.answered) return;
      $$(".w", ex).forEach((b, k) => { if (toks[k].err) b.classList.add("isErr"); });
      if (i != null && !toks[i].err) $$(".w", ex)[i].classList.add("miss");
      grade(ok, {solHtml: (hasErr ? "Correction : " : "Phrase correcte : ") + corrected, user: userTxt});
    };
    $(".spot", ex).onclick = e => { const b = e.target.closest(".w"); if (!b) return; const i = +b.dataset.i; finish(toks[i].err, toks[i].w, i); };
    $("#nofault").onclick = () => finish(!hasErr, "pas de faute", null);
  },
  fix(it, ex) {
    ex.insertAdjacentHTML("beforeend", `<p class="prompt">Corrige ce que tu avais écrit</p><p class="sent"><s style="color:var(--err)">${esc(it.wrong)}</s></p>
      <div class="row" style="flex-wrap:nowrap;align-items:flex-start">${micHTML("fxmic")}<input id="fxin" class="field" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Version correcte (écris ou dis-la)"></div>${micNote()}`);
    const inp = $("#fxin"); if (!MIC_OK) setTimeout(() => inp.focus(), 50);
    wireMic("fxmic", inp);
    CUR.check = () => { const v = inp.value.trim(); if (!v) return; speak(it.right); freeCheck(it, v, [it.right], {sol: it.right, user: v}, "corriger la formulation fautive « " + it.wrong + " »"); };
  },
  dic(it, ex) {
    let plays = 0, hint = false;
    const words = speakable(it.en).split(/\s+/);
    ex.insertAdjacentHTML("beforeend", `<p class="prompt">Écoute et écris la phrase</p>
      <div class="row"><button class="round" id="dplay1" aria-label="Écouter">${IC.play}</button><button class="round alt" id="dslow1" aria-label="Écouter lentement">${IC.slow}</button><span class="small muted" id="dcount">${words.length} mots</span></div>
      <textarea id="dicin" class="field" rows="3" placeholder="Écris exactement ce que tu entends" autocapitalize="sentences" spellcheck="false" autocomplete="off"></textarea>
      <div class="row"><button class="btn sm ghost" id="dhint">Indice : premières lettres</button></div><p class="hint" id="dhinttxt" hidden></p>`);
    const play = r => { if (CUR.it !== it) return; plays++; const c = $("#dcount"); if (c) c.textContent = words.length + " mots · écoutée " + plays + " fois"; speak(it.en, r, it.voice || "a"); };
    $("#dplay1").onclick = () => play(1); $("#dslow1").onclick = () => play(.7);
    setTimeout(() => play(1), 250);
    $("#dhint").onclick = () => { hint = true; const h = $("#dhinttxt"); h.hidden = false; h.textContent = words.map(w => w.replace(/^([^A-Za-z]*[A-Za-z])[A-Za-z']*/, (m0, a) => a + "_".repeat(Math.max(0, m0.length - a.length)))).join(" "); $("#dhint").disabled = true; };
    setTimeout(() => $("#dicin")?.focus(), 60);
    CUR.check = () => { const v = $("#dicin").value.trim(); if (!v) return;
      const d = dicDiff(speakable(it.en), v), ok = d.score >= .9 && !hint || d.perfect;
      const html = `<div class="diff dicdiff">${d.marks.map(([w, k, u]) => k === "ok" ? `<span class="ok">${esc(w)}</span>` : k === "near" ? `<span class="near" title="tu as écrit : ${esc(u)}">${esc(w)}</span>` : `<span class="no">${esc(w)}</span>`).join(" ")}</div>
        ${d.extra.length ? `<div class="small">En trop : <s>${esc(d.extra.join(" "))}</s></div>` : ""}
        <div class="small muted">${Math.round(d.score * 100)} % des mots${hint ? " · avec indice" : ""}${plays > 3 ? " · " + plays + " écoutes" : ""}</div>${it.fr ? `<div class="small muted">${esc(it.fr)}</div>` : ""}`;
      grade(ok, {solHtml: html, user: v, oral: !ok, dic: true, missed: d.marks.filter(m => m[1] === "miss").map(m => m[0])}); };
  },
  ls(it, ex) {
    ex.insertAdjacentHTML("beforeend", `<p class="prompt">Écris ce que tu entends</p><div class="row">${playBtns()}</div>
      <textarea id="lsin" class="field" placeholder="Tape la phrase en anglais" autocapitalize="sentences" spellcheck="false"></textarea>`);
    wirePlay(ex, it.en); setTimeout(() => speak(it.en), 200);
    CUR.check = () => { const v = $("#lsin").value.trim(); if (!v) return; const m = matchAnswer(v, [it.en], true); grade(m.ok, {sol: it.en, user: v, typo: m.typo}); };
  },
  sp(it, ex) {
    ex.insertAdjacentHTML("beforeend", `<p class="prompt">Écoute, puis dis la phrase à voix haute</p>
      <div class="speakbig"><div class="row" style="flex-wrap:nowrap">${playBtns()}</div><div style="min-width:0"><button class="toggle" id="spshow" type="button">Afficher la phrase (si tu bloques)</button><p class="sent" id="sptxt" style="font-size:1.2rem" hidden>${esc(it.en)}</p></div></div>
      <div class="row" style="flex-wrap:nowrap;align-items:flex-start">${micHTML("mic")}
      <textarea id="spin" class="field" placeholder="${MIC_OK ? "Touche le micro et parle" : "Dicte avec le micro de ton clavier"}"></textarea></div>${micNote()}
      ${canRecord() ? `<div class="row"><button class="btn sm ghost" id="recme">Enregistrer ma voix</button><button class="btn sm ghost" id="playme" hidden>${ic("play")} Me réécouter</button></div>` : ""}
      <p class="small muted">Ce que tu dis s'écrit ici, puis l'appli compare avec la phrase, mot par mot.</p>`);
    wirePlay(ex, it.en); setTimeout(() => speak(it.en), 200);
    $("#spshow").onclick = () => { $("#sptxt").hidden = false; $("#spshow").hidden = true; CUR.peek = true; };
    const ta = $("#spin");
    wireMic("mic", ta, () => setTimeout(() => { if (!CUR.answered && CUR.it === it && ta.value.trim()) CUR.check(); }, 300));
    if ($("#recme")) $("#recme").onclick = () => recordVoice($("#recme"), $("#playme"));
    $("#ab").firstElementChild.insertAdjacentHTML("afterbegin", `<button class="btn ghost" id="skip">Je ne peux pas parler</button>`);
    $("#skip").onclick = () => { CUR.skipped = true; nextItem(); };
    CUR.check = () => { stopListening(); const v = ta.value.trim(); if (!v) return; const d = wordDiff(it.en, v);
      S.spoken++; grade(d.score >= (S.sk.oral.li >= 4 ? .85 : .75), {solHtml: `<div class="sent" style="font-size:1.05rem">${esc(it.en)}</div><span class="diff">${d.marks.map(([w, k]) => `<span class="${k ? "ok" : "no"}">${esc(w)}</span>`).join(" ")}</span> · ${Math.round(d.score * 100)} %${CUR.peek ? " · phrase affichée" : ""}`, user: v, oral: true}); };
  }
};

function insertLater(item, gap) { const pos = Math.min(SES.items.length, SES.i + gap); SES.items.splice(pos, 0, item); }
function grade(ok, info) {
  if (CUR.answered) return; CUR.answered = true; CUR.info = info;
  const it = CUR.it; SES.tot++; if (ok) SES.ok++;
  const change = record(it, ok, info);
  if (change) SES.changes.push(change);
  const testing = SES.kind === "test" || SES.kind === "fulleval";
  CUR.lastOk = ok;
  if (!ok) {
    SES.errs.push(it);
    if (!testing) {
      if (it.rule) {
        const r = ruleById(it.rule); const used = SES.used[it.rule] || (SES.used[it.rule] = new Set([it.rj]));
        if (SES.items.filter(x => x.rule === it.rule).length < 8) insertLater(nextRuleItem(r, used), 3);
      } else if (it.t === "v") {
        if (!SES.retried.has(it.key)) { SES.retried.add(it.key); insertLater(Object.assign({}, it, {mode: it.mode === "en2fr" ? "fr2en" : "en2fr"}), 3); }
      }   // une question ratée n'est jamais reposée telle quelle : elle revient plus tard dans le carnet d'erreurs
    }
  }
  const praise = ["Bien joué !", "Exact.", "Parfait.", "C'est ça !", "Bravo."][Math.floor(Math.random() * 5)];
  const title = info.dic ? (ok ? "Bien entendu !" : "Pas encore : compare avec la phrase") : ok ? (info.typo ? "Correct, attention à l'orthographe" : info.syn ? "Accepté : c'est un synonyme" : info.aiOk ? "Correct, validé par le tuteur" : praise) : info.oral ? "Encore un effort" : "Pas tout à fait";
  const solLine = info.solHtml ? info.solHtml : esc(info.sol || "");
  const showSol = !ok || info.typo || info.syn || info.aiOk || info.oral || it.t === "spot" || it.t === "v";
  const rs = it.rule && SES.kind !== "fulleval" ? ruleState(it.rule) : null;
  $("#ab").hidden = true;
  document.body.insertAdjacentHTML("beforeend", `<div class="fb ${ok ? "ok" : "bad"}" id="fb"><div class="in">
    <div class="row" style="justify-content:space-between"><h3>${title}</h3>${rs ? (rs.m ? pill("règle maîtrisée", "ok") : pill("série " + rs.s + "/" + ruleNeed(it.rule), ok ? "ok" : "err")) : ""}</div>
    ${showSol ? `<div>${!ok && !info.oral && !info.solHtml ? (info.aiOk === false ? "Réponse attendue : " : "Réponse : ") : ""}${solLine}</div>` : ""}
    ${(() => { const fr = info.dic ? null : frOf(it); return fr ? `<div class="small trline">${esc(fr)}</div>` : ""; })()}
    ${info.ai ? `<div class="small"><b>Tuteur :</b> ${esc(info.ai)}</div>` : ""}
    ${it.x && SES.kind !== "fulleval" ? `<div class="small explain">${it.rname ? `<b>${esc(it.rname)}.</b> ` : ""}${esc(it.x)}</div>` : ""}
    ${!ok && it.rule && !testing ? `<div class="small">Cette règle revient dans 3 questions avec une autre phrase.</div>` : ""}
    <div class="small explain" id="more" hidden></div>
    <div class="row" style="flex-wrap:nowrap">${!ok && aiReady() && SES.kind !== "fulleval" ? `<button class="btn ghost" id="why">Explique-moi</button>` : ""}<button class="btn primary" id="next" style="flex:1">Continuer</button></div>
  </div></div>`);
  $("#next").onclick = nextItem; $("#next").focus({preventScroll: true});
  const why = $("#why"); if (why) why.onclick = () => explain(it, info, why);

  if (change) toast(change.dir === "up" ? skName(change.sk) + " : niveau " + LV[change.li] + " ! Les exercices deviennent plus exigeants." : skName(change.sk) + " : niveau ajusté à " + LV[change.li] + " pour consolider.");
}
let explainCtl = null;
async function explain(it, info, btn) {
  btn.disabled = true; const more = $("#more"); more.hidden = false; more.textContent = "Réflexion…";
  explainCtl = new AbortController();
  const expected = (info.sol || info.solHtml || "").replace(/<[^>]+>/g, "");
  const prompt = `Tu es un professeur d'anglais bienveillant et très clair. Ton élève est francophone, niveau ${levelPrompt(skillOf(it))}.
Exercice : ${describePlain(it)}
Réponse de l'élève : « ${info.user || ""} »
Réponse attendue : « ${expected} »
Explique en français, en 5 phrases maximum : pourquoi sa réponse ne va pas, la règle ou le sens à retenir, une astuce pour ne plus se tromper, puis 2 exemples en anglais avec leur traduction. Texte simple, sans titres ni markdown.`;
  try { await sample(prompt, {modelTier: "quick", signal: explainCtl.signal, onText: ({text}) => { if ($("#more")) $("#more").textContent = text; }}); }
  catch (e) { if ($("#more")) $("#more").textContent = aiErr(e); }
}
function describePlain(it) {
  if (it.t === "spot") return "trouver la faute dans « " + it.s.replace(/\*/g, "") + " »" + (it.rname ? " (règle : " + it.rname + ")" : "");
  if (it.t === "gap") return "compléter « " + it.s + " »" + (it.v ? " avec " + it.v : "");
  if (it.t === "tr") return "traduire en anglais « " + it.fr + " »";
  if (it.t === "mcq") return "QCM : " + it.q + " Choix : " + it.o.join(" / ");
  if (it.t === "fix") return "corriger « " + it.wrong + " »";
  if (it.t === "ls" || it.t === "dic") return "dictée : écrire la phrase entendue « " + it.en + " »";
  if (it.t === "v") return "vocabulaire : « " + it.en + " » = « " + it.fr + " »";
  return "répéter « " + (it.en || "") + " »";
}
function nextItem() {
  if (explainCtl) { explainCtl.abort(); explainCtl = null; }
  const fb = $("#fb"); if (fb) fb.remove();
  hush(); stopListening();
  if (SES.kind === "fulleval" && CUR.answered) evalNext();
  SES.i++;
  if (SES.i >= SES.items.length) return endSession();
  window.scrollTo(0, 0); showItem();
}
function record(it, ok, info) {
  const d = today(); S.days[d] = (S.days[d] || 0) + 1;
  if (SES && SES.kind === "fulleval") { save(); return null; }
  S.answered++; if (ok) S.correct++;
  typeStat(it.t, ok);
  if (it.t === "v" && !it.noVoc) recordVocab(it, ok);
  if (it.rule) {
    const r = S.rules[it.rule] = Object.assign(ruleState(it.rule), S.rules[it.rule]);
    const need = ruleNeed(it.rule);
    r.n++;
    if (ok) { r.ok++; r.s++; if (!r.m && r.s >= need) { r.m = 1; r.due = Date.now() + 7 * DAY; setTimeout(() => toast("Règle maîtrisée : " + (it.rname || "")), 400); } else if (r.m) r.due = Date.now() + 21 * DAY; }
    else { r.s = 0; r.m = 0; r.due = 0; }
  }
  const change = levelTick(it, ok, info || {});
  const h = S.hist[d] = Object.assign({n: 0, ok: 0}, S.hist[d]); h.n++; if (ok) h.ok++; h.w = acquiredCount(); h.li = S.li;
  const hk = Object.keys(S.hist); if (hk.length > 120) delete S.hist[hk.sort()[0]];
  if (it.noMist || it.rule || it.t === "v" || (SES && SES.kind === "test")) { save(); return change; }
  const m = S.mist.find(x => x.k === it.key);
  if (!ok) {
    if (m) { m.box = 0; m.due = Date.now(); m.n++; }
    else {
      const stored = /^(irr|u\d+)$/.test(it.key.split(":")[0]) ? null : strip(it);
      S.mist.unshift({k: it.key, it: stored, box: 0, due: Date.now(), n: 1});
      if (S.mist.length > 250) S.mist.length = 250;
    }
  } else if (m) {
    m.box = Math.min(m.box + 1, 5);
    if (m.box >= 5 && SES && SES.kind === "review") S.mist = S.mist.filter(x => x !== m);
    else m.due = Date.now() + BOX[m.box] * DAY;
  }
  save(); return change;
}
function strip(it) { const o = {}; ["t", "q", "o", "a", "x", "s", "v", "f", "fr", "d", "en", "wrong", "right", "src", "voice", "lvl", "skill"].forEach(k => { if (it[k] != null) o[k] = it[k]; }); return o; }
function finishTest() {
  const t = SES.test, pct = SES.tot ? SES.ok / SES.tot : 0, pass = pct >= .9;
  let msg = "";
  if (t.type === "theme") {
    const th = themeById(t.id), failed = new Set(SES.errs.map(x => x.en));
    if (pass) { th.words.forEach(w => { if (failed.has(w.en)) return; const s = vstate(vkey(th.id, w.en)); if (!s || s[0] < 4) markKnown(th.id, w.en, 10); }); msg = `Thème « ${th.name} » validé : ses ${th.words.length} mots passent en révision espacée. ${failed.size ? "Les mots ratés restent à apprendre." : ""}`; }
    else msg = `Pas encore : ${Math.round(pct * 100)} % (il faut 90 %). Les mots ratés sont à apprendre, les autres sont notés comme vus.`;
  } else if (t.type === "rule") {
    const r = S.rules[t.id] = Object.assign(ruleState(t.id), S.rules[t.id]);
    if (pass) { r.m = 1; r.due = Date.now() + 14 * DAY; msg = `Règle « ${ruleById(t.id).name} » validée. Elle reviendra dans 2 semaines pour vérifier.`; }
    else msg = "Pas encore : la règle reste dans ton entraînement.";
  } else if (t.type === "unit") {
    const u = S.units[t.id] = Object.assign({best: 0, runs: 0}, S.units[t.id]); u.runs++;
    if (pass) { u.best = 100; msg = "Leçon validée sans la faire."; } else { u.best = Math.max(u.best, Math.round(pct * 100)); msg = `Pas encore : ${Math.round(pct * 100)} % (il faut 90 %). Fais la leçon pour combler les trous.`; }
  } else if (t.type === "bilan") {
    if (pass) { S.bilan[t.id] = Date.now(); msg = `Bilan ${t.id} réussi : ce niveau est ancré.`; }
    else { const failed = new Set(SES.errs.map(x => x.rule)); failed.forEach(id => { if (S.rules[id]) { S.rules[id].m = 0; S.rules[id].s = 0; } }); msg = `Bilan ${t.id} : ${Math.round(pct * 100)} % (il faut 90 %). ${failed.size} règle${failed.size > 1 ? "s" : ""} repasse${failed.size > 1 ? "nt" : ""} à travailler.`; }
  }
  save(); return {pass, msg};
}
function endSession() {
  finishTime();
  const pct = SES.tot ? Math.round(100 * SES.ok / SES.tot) : 0;
  if (SES.unit) { const u = S.units[SES.unit] = Object.assign({best: 0, runs: 0}, S.units[SES.unit]); u.runs++; u.best = Math.max(u.best, pct); save(); }
  if (SES.kind === "read" && SES.text) { S.read[SES.text] = Math.max(S.read[SES.text] || 0, pct); save(); }
  if (SES.kind === "dictee" && SES.dic) { S.dict[SES.dic] = Math.max(S.dict[SES.dic] || 0, pct); save(); }
  if (SES.kind === "dialog" && SES.dlg) { S.dlg[SES.dlg] = Math.max(S.dlg[SES.dlg] || 0, pct); save(); }
  if (SES.kind === "fulleval") return endFullEval();
  const test = SES.kind === "test" ? finishTest() : null;
  const errs = SES.errs.filter((x, i, a) => a.findIndex(y => y.key === x.key) === i);
  const secs = Math.round((Date.now() - SES.t0) / 1000);
  const changes = SES.changes;
  document.onkeydown = null;
  app.innerHTML = `<div class="wrap">
    <div class="stack"><span class="eyebrow">${esc(SES.title)} · terminé</span><h1>${test ? (test.pass ? "Validé !" : "Pas encore validé.") : pct >= 90 ? "Excellent travail." : pct >= 70 ? "Bonne séance." : "Séance utile : tes erreurs sont notées."}</h1></div>
    ${test ? `<section class="card"><p>${esc(test.msg)}</p></section>` : ""}
    ${SES.kind === "eval" ? `<section class="card"><p>${pct >= 90 ? "Tes mots tiennent bien : ils reviendront de moins en moins souvent." : pct >= 70 ? "La plupart des mots sont acquis. Ceux que tu as ratés reviennent dès demain." : "Beaucoup de mots ont besoin d'être revus : ils reviendront dès demain et dans tes prochaines leçons."}</p></section>` : ""}
    ${changes.length ? `<section class="hero" style="gap:6px"><span class="eyebrow" style="color:inherit;opacity:.85">Niveau</span>${changes.map(c => `<h2 style="font-size:1.35rem">${skName(c.sk)} ${c.dir === "up" ? "↑" : "↓"} ${LV[c.li]}</h2>`).join("")}<p style="opacity:.92">${changes.some(c => c.dir === "up") ? "Tu réussis largement : l'appli te propose désormais des exercices plus difficiles dans cette compétence." : "On consolide les bases avant de remonter."}</p></section>` : ""}
    <div class="stats"><div class="stat"><b>${pct}<small>%</small></b><span>de bonnes réponses</span></div>
    <div class="stat"><b>${SES.ok}/${SES.tot}</b><span>réponses justes</span></div>
    <div class="stat"><b>${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}</b><span>durée</span></div></div>
    ${errs.length ? `<section class="card"><h3>À retenir</h3><div class="stack" style="gap:8px">${errs.map(it => `<div class="small">${describe(it)}${it.x ? `<div class="muted">${esc(it.x)}</div>` : ""}</div>`).join("")}</div>
    <p class="small muted">Ces points reviendront : les règles avec de nouvelles phrases, les mots dès demain, le reste dans ton carnet.</p></section>` : ""}
    <div class="stack"><button class="btn primary block" id="home">Terminer</button></div></div>`;
  const errItems = errs.map(x => x.rule ? nextRuleItem(ruleById(x.rule), new Set([x.rj])) : Object.assign({}, x));
  SES = null;
  $("#home").onclick = () => render();

}

// ====== ÉVALUATION COMPLÈTE ======
// 5 parties adaptatives (escalier : réussite → plus dur, erreur → plus facile), puis analyse et ajustement de toute l'appli
const EVAL_SECTIONS = [
  {k: "gram", name: "Grammaire", n: 16, w: .25},
  {k: "voc", name: "Vocabulaire", n: 16, w: .25},
  {k: "lis", name: "Écoute", n: 10, w: .2},
  {k: "read", name: "Lecture", n: 6, w: .15},
  {k: "prod", name: "Expression", n: 6, w: .15}
];
const bandOf = li => CEFR[Math.min(4, Math.floor(li / 2))];
const nearBand = (pool, lvlOf, li) => { for (let d = 0; d < 5; d++) { const b = Math.floor(li / 2); for (const x of [b - d, b + d]) { if (x < 0 || x > 4) continue; const r = pool.filter(p => lvlOf(p) === CEFR[x]); if (r.length) return r; } } return pool; };
function evalItem(sec, li, used) {
  const fresh = arr => { const f = arr.filter(x => !used.has(x.key || x.en || x.s || x.q)); return f.length ? f : arr; };
  if (sec === "gram") {
    if (Math.random() < .6) {
      const r = pick(nearBand(RULES, x => x.lvl, li)); const j = Math.floor(Math.random() * r.ex.length);
      return Object.assign(ruleItem(r, j), {skill: "gram"});
    }
    const us = nearBand(UNITS.filter(u => !u.gen), u => u.lvl, li);
    const items = fresh(us.flatMap(u => u.items.map((it, i) => (it.t === "gap" || it.t === "mcq" || it.t === "spot") ? unitItem(u, i) : null)).filter(Boolean));
    return Object.assign(pick(items), {skill: "gram"});
  }
  if (sec === "voc") {
    const t = pick(nearBand(THEMES.filter(t => !t.colloc), x => x.lvl, li));
    const w = pick(t.words.filter(w => !/…/.test(w.en)));
    return Object.assign(vItem(t.id, w, li >= 3 ? "type" : "fr2en"), {skill: "voc", noVoc: true});
  }
  if (sec === "lis") {
    const pool = DIC_SRC.filter(x => canHear(x.en, x.voice));
    if (!pool.length) return null;
    return Object.assign(dicItem(pick(fresh(nearBand(pool, x => x.lvl, li)))), {skill: "lis"});
  }
  if (sec === "read") {
    const t = pick(nearBand(TEXTS, x => x.lvl, li)); const q = pick(t.q);
    const order = shuffle(q.o.map((o, i) => i));
    return {t: "rmcq", text: t.text, title: t.title, q: q.q, o: order.map(i => q.o[i]), a: order.indexOf(q.a || 0), key: "rq:" + t.id + ":" + q.q, skill: "read", lvl: t.lvl, noSay: true, noMist: true};
  }
  // expression : traduire une phrase française en anglais (clavier ou micro)
  const us = nearBand(UNITS.filter(u => !u.gen), u => u.lvl, li);
  const trs = us.flatMap(u => u.items.map((it, i) => it.t === "tr" ? unitItem(u, i) : null)).filter(Boolean);
  const bank = typeof BANK !== "undefined" && aiReady() ? nearBand(BANK, x => x.lvl, li).map(x => ({t: "tr", fr: x.fr, a: [x.en], d: [], key: "bk:" + hash(x.en), lvl: x.lvl, src: "Expression"})) : [];
  return Object.assign(pick(fresh(trs.concat(bank))), {skill: "prod"});
}
// L'évaluation est sauvegardée après chaque réponse : une page fermée ou rechargée ne perd rien
function evalSave(E) { S.evalRun = {sec: E.sec, done: E.done, li: E.li, steps: E.steps, log: E.log, est: E.est, used: [...E.used], t: E.t}; save(); }
function startFullEval(resume) {
  const R = resume || S.evalRun;
  const E = R ? {sec: R.sec, done: R.done, li: R.li, steps: R.steps, log: R.log || [], est: R.est || {}, used: new Set(R.used || []), t: R.t || Date.now()}
              : {sec: 0, done: 0, li: Math.max(2, Math.min(6, S.li)), steps: 0, log: [], used: new Set(), est: {}, t: Date.now()};
  if (E.sec >= EVAL_SECTIONS.length) { SES = {E, kind: "fulleval", t0: Date.now()}; return endFullEval(); }
  const first = evalItem(EVAL_SECTIONS[E.sec].k, E.li, E.used) || evalItem("gram", E.li, E.used);
  first.src = "Partie " + (E.sec + 1) + "/5 · " + EVAL_SECTIONS[E.sec].name;
  startSession("Évaluation complète", [first], {kind: "fulleval", E, forceKb: true});
  toast(R ? `Évaluation reprise : ${E.done}/54 réponses déjà enregistrées.` : "Évaluation : 54 questions en 5 parties. Réponds sans aide : les questions s'adaptent à ton niveau.");
}
function evalQuestion(it) {
  if (it.t === "spot") return "Trouver la faute : « " + it.s.replace(/\*/g, "") + " »";
  if (it.t === "gap") return "Compléter : « " + it.s + " »" + (it.v ? " (" + it.v + ")" : "");
  if (it.t === "mcq" || it.t === "rmcq") return (it.t === "rmcq" ? "Lecture (" + it.title + ") : " : "") + it.q;
  if (it.t === "v") return "Vocabulaire : « " + show(it.fr) + " » en anglais";
  if (it.t === "dic") return "Dictée : écrire la phrase entendue";
  if (it.t === "tr") return "Traduire : « " + it.fr + " »";
  return it.en || "";
}
function evalAnswer(it, info) {
  if (it.t === "spot") return it.s.includes("*") ? fixedSentence(it.s, it.f) + " (faute : « " + (it.s.match(/\*([^*]+)\*/) || [])[1] + " »)" : it.s + " (pas de faute)";
  if (it.t === "v") return alts(it.en)[0];
  if (it.t === "dic") return it.en;
  return String(info.sol || "").replace(/<[^>]+>/g, "");
}
function evalNext() {
  const E = SES.E;
  if (E.sec >= EVAL_SECTIONS.length) return;            // toutes les parties sont finies : on passe aux résultats
  const sec = EVAL_SECTIONS[E.sec], it = CUR.it, ok = !!CUR.lastOk, info = CUR.info || {};
  E.used.add(it.key || it.en || it.s || it.q);
  E.log.push({sec: sec.k, li: E.li, ok, lvl: it.lvl, q: evalQuestion(it), you: String(info.user || ""), sol: evalAnswer(it, info),
    x: it.x || "", rule: it.rule || null, rname: it.rname || "", cat: it.rule ? (ruleById(it.rule) || {}).cat : null, th: it.th || null, en: it.t === "v" ? it.en : null, fr: frOf(it) || "", miss: info.missed || null});
  E.steps++; E.done++;
  const step = E.steps <= 3 ? 2 : 1;
  E.li = Math.max(0, Math.min(9, E.li + (ok ? step : -step)));
  if (E.steps >= sec.n) {
    E.est[sec.k] = estimate(E.log.filter(l => l.sec === sec.k));
    E.sec++; E.steps = 0;
    if (E.sec < EVAL_SECTIONS.length) E.li = Math.max(0, Math.min(9, Math.round(E.est[sec.k])));
  }
  if (E.sec < EVAL_SECTIONS.length) {
    let nx = evalItem(EVAL_SECTIONS[E.sec].k, E.li, E.used);
    while (!nx && E.sec < EVAL_SECTIONS.length) { E.est[EVAL_SECTIONS[E.sec].k] = null; E.sec++; E.steps = 0; if (E.sec < EVAL_SECTIONS.length) nx = evalItem(EVAL_SECTIONS[E.sec].k, E.li, E.used); }
    if (nx) { if (E.steps === 0) nx.src = "Partie " + (E.sec + 1) + "/5 · " + EVAL_SECTIONS[E.sec].name; SES.items.splice(SES.i + 1); SES.items.push(nx); }
  } else SES.items.splice(SES.i + 1);                 // plus rien après la dernière question
  evalSave(E);
}
function estimate(log) {
  if (!log.length) return null;
  const tail = log.length > 4 ? log.slice(3) : log;
  const v = tail.reduce((a, l) => a + l.li + (l.ok ? .5 : -.5), 0) / tail.length;
  return Math.max(0, Math.min(9, v));
}
function applyEval(sk) {
  const changes = {words: 0, rules: 0, units: 0, dict: 0};
  Object.entries(sk).forEach(([k, v]) => { if (v != null && S.sk[k]) { S.sk[k].li = Math.round(v); S.sk[k].n = 0; S.sk[k].ok = 0; } });
  recomputeGlobal();
  const vB = Math.floor(S.sk.voc.li / 2), gB = Math.floor(S.sk.gram.li / 2), lB = Math.floor(S.sk.lis.li / 2);
  // vocabulaire des niveaux inférieurs : acquis (révision espacée longue)
  THEMES.forEach(t => { if (CEFR.indexOf(t.lvl) < vB) t.words.forEach(w => { const st = vstate(vkey(t.id, w.en)); if (!st || st[0] < 4) { S.voc[vkey(t.id, w.en)] = [4, Math.round((Date.now() + (30 + Math.random() * 30) * DAY) / 6e4), 1, 1, 2.7, 40]; changes.words++; } }); });
  // règles et leçons des niveaux inférieurs : validées (elles reviendront pour l'ancrage)
  RULES.forEach(r => { if (CEFR.indexOf(r.lvl) < gB) { const st = S.rules[r.id] = Object.assign(ruleState(r.id), S.rules[r.id]); if (!st.m) { st.m = 1; st.due = Date.now() + (14 + Math.random() * 21) * DAY; changes.rules++; } } });
  UNITS.forEach(u => { if (!u.gen && CEFR.indexOf(u.lvl) < gB) { const st = S.units[u.id] = Object.assign({best: 0, runs: 0}, S.units[u.id]); if (st.best < 80) { st.best = 100; changes.units++; } } });
  DIC_LESSONS.forEach(d => { if (CEFR.indexOf(d.lvl) < lB && (S.dict[d.id] || 0) < 90) { S.dict[d.id] = 90; changes.dict++; } });
  return changes;
}
function endFullEval() {
  const E = SES.E; SES = null;
  const est = E.est;
  const parts = EVAL_SECTIONS.filter(x => est[x.k] != null);
  const wsum = parts.reduce((a, x) => a + x.w, 0);
  const glob = parts.reduce((a, x) => a + est[x.k] * x.w, 0) / (wsum || 1);
  const sk = {gram: est.gram, voc: est.voc, lis: est.lis, read: est.read, oral: est.prod};
  const prev = (S.evals || []).slice(-1)[0];
  const changes = applyEval(sk);
  S.placed = true;
  const li = Math.round(glob);
  S.evals = (S.evals || []).concat([{t: Date.now(), li, sk: Object.fromEntries(parts.map(x => [x.k, Math.round(est[x.k] * 10) / 10])), acc: Object.fromEntries(parts.map(x => [x.k, evalAcc(E.log, x.k)]))}]).slice(-20);
  S.evalLast = {t: Date.now(), li, est, log: E.log, changes, prev: prev ? prev.li : null};
  delete S.evalRun;
  S.lvlLog.unshift({t: Date.now(), sk: "gram", li: S.li, up: 1});
  save();
  renderEvalResults(S.evalLast, true);
}
function evalAcc(log, k) { const l = log.filter(x => x.sec === k); return l.length ? Math.round(100 * l.filter(x => x.ok).length / l.length) : null; }
// Écran de résultats : niveau, analyse, et chaque question avec ta réponse et la bonne réponse
function renderEvalResults(rec, fresh) {
  renderTabs(false); SES = null; document.onkeydown = null;
  const {est, log, li, changes} = rec;
  const parts = EVAL_SECTIONS.filter(x => est[x.k] != null);
  const failedCats = {}; log.filter(l => l.sec === "gram" && !l.ok && l.cat).forEach(l => failedCats[l.cat] = (failedCats[l.cat] || 0) + 1);
  const failedRules = [...new Set(log.filter(l => l.sec === "gram" && !l.ok && l.rname).map(l => l.rname))];
  const failedThemes = {}; log.filter(l => l.sec === "voc" && !l.ok && l.th).forEach(l => { const n = themeById(l.th)?.name; if (n) failedThemes[n] = (failedThemes[n] || 0) + 1; });
  const lisMiss = log.filter(l => l.sec === "lis" && l.miss).flatMap(l => l.miss);
  const small = lisMiss.filter(w => FUNC[norm(w)]).length;
  const sorted = parts.slice().sort((a, b) => est[a.k] - est[b.k]), worst = sorted[0], best = sorted[sorted.length - 1];
  const total = log.length, good = log.filter(l => l.ok).length;
  const verdict = li <= 1 ? "Tu es au niveau débutant : les bases (présent, être/avoir, vocabulaire courant) sont la priorité."
    : li <= 3 ? "Tu as un niveau élémentaire solide : tu te débrouilles dans les situations simples. Objectif : passer au niveau intermédiaire (B1)."
    : li <= 5 ? "Tu as un niveau intermédiaire : tu comprends l'essentiel et tu peux t'exprimer sur des sujets courants. Tu n'es plus débutant."
    : li <= 7 ? "Tu as un niveau avancé : tu t'exprimes avec aisance sur la plupart des sujets, y compris professionnels."
    : "Tu as un niveau autonome : il te reste à affiner les nuances et la précision.";
  const recos = [];
  if (worst) recos.push(`Ta compétence la plus faible est <b>${worst.name.toLowerCase()}</b> (${LV[Math.round(est[worst.k])]}) : c'est là que tu progresseras le plus vite. ${{gram: "Fais la chasse aux fautes chaque jour.", voc: "Apprends 7 à 10 mots par jour dans l'onglet Mots, et fais une évaluation des mots chaque semaine.", lis: "Fais une leçon de dictée par jour et écoute les dialogues sans le texte.", read: "Lis un texte par jour en touchant les mots inconnus.", prod: "Traduis et parle : série « Phrases », phrases à répéter, rédactions."}[worst.k]}`);
  if (best && best !== worst) recos.push(`Ton point fort : <b>${best.name.toLowerCase()}</b> (${LV[Math.round(est[best.k])]}).`);
  if (Object.keys(failedCats).length) recos.push(`En grammaire, tes erreurs portent surtout sur : ${Object.entries(failedCats).sort((a, b) => b[1] - a[1]).map(([c, n]) => `${c.toLowerCase()} (${n})`).join(", ")}.`);
  if (failedRules.length) recos.push(`Règles à revoir en priorité : ${failedRules.slice(0, 8).map(esc).join(" · ")}.`);
  if (Object.keys(failedThemes).length) recos.push(`Vocabulaire à travailler : ${Object.keys(failedThemes).slice(0, 6).map(esc).join(", ")}.`);
  if (lisMiss.length && small / lisMiss.length > .4) recos.push("À l'écoute, tu rates surtout les petits mots (articles, prépositions, auxiliaires) : réécoute en vitesse lente et concentre-toi sur eux.");
  if (est.lis == null) recos.push("La partie écoute n'a pas pu être mesurée : refais l'évaluation plus tard.");
  const qcard = (l, i) => `<div class="evq ${l.ok ? "good" : "bad"}"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><span class="small muted">${i + 1}. ${esc(EVAL_SECTIONS.find(x => x.k === l.sec)?.name || "")}${l.lvl ? " · " + l.lvl : ""}</span>${pill(l.ok ? "juste" : "faux", l.ok ? "ok" : "err")}</div>
    <div>${esc(l.q || "")}</div>
    ${l.you ? `<div class="small">Ta réponse : <b class="${l.ok ? "okc" : "errc"}">${esc(l.you)}</b></div>` : ""}
    ${!l.ok && l.sol ? `<div class="small">Bonne réponse : <b class="okc">${esc(l.sol)}</b></div>` : ""}
    ${l.fr ? `<div class="small muted"><i>${esc(l.fr)}</i></div>` : ""}
    ${l.rname || l.x ? `<div class="small explain">${l.rname ? `<b>${esc(l.rname)}.</b> ` : ""}${esc(l.x || "")}</div>` : ""}
    ${!l.ok && l.rule ? `<button class="btn sm" data-rr="${esc(l.rule)}">Travailler cette règle</button>` : ""}</div>`;
  app.innerHTML = `<div class="wrap">
    <div class="topbar"><button class="x" id="back" aria-label="Retour">←</button><span class="eyebrow">Évaluation du ${new Date(rec.t).toLocaleDateString("fr-FR")}</span></div>
    <section class="hero" style="gap:8px"><span class="eyebrow" style="color:inherit;opacity:.85">Ton niveau global</span>
      <h1 style="font-size:2.6rem">${LV[li]}</h1><p>${LVNAME[LV[li].slice(0, 2)]} · ${good}/${total} bonnes réponses${rec.prev != null ? ` · évaluation précédente : ${LV[rec.prev]}` : ""}</p></section>
    <section class="card"><p><b>${verdict}</b></p></section>
    <section class="card"><h3>Niveau par compétence</h3>
      <div class="skills">${EVAL_SECTIONS.map(x => est[x.k] == null ? `<div class="skrow"><span>${x.name}</span><b>—</b><span class="small muted" style="grid-column:span 2">non mesurée</span></div>` :
        `<div class="skrow"><span>${x.name}</span><b>${LV[Math.round(est[x.k])]}</b><div class="ladder">${LV.map((_, i) => `<i class="${i < Math.round(est[x.k]) ? "done" : i === Math.round(est[x.k]) ? "cur" : ""}"></i>`).join("")}</div><span class="small muted">${evalAcc(log, x.k)} %</span></div>`).join("")}</div>
      <p class="small muted">Le pourcentage est ta réussite brute ; le niveau tient compte de la difficulté des questions réussies (les questions montent quand tu réussis).</p></section>
    <section class="card"><h3>Analyse</h3>${recos.map(r => `<p>${r}</p>`).join("")}<div id="aian" class="ai-only"></div></section>
    ${changes ? `<section class="card"><h3>Ce que l'appli a ajusté</h3><ul class="small" style="margin:0;padding-left:18px">
        <li>Tes 5 compétences partent de ces niveaux ; séances, mots nouveaux, règles et textes s'y adaptent.</li>
        <li><b>${changes.words}</b> mots des niveaux inférieurs marqués <b>acquis</b> (révision dans 1 à 2 mois).</li>
        <li><b>${changes.rules}</b> règles et <b>${changes.units}</b> leçons de base validées ; <b>${changes.dict}</b> leçons de dictée de base validées.</li></ul></section>` : ""}
    <section class="stack" style="gap:10px"><div class="row" style="justify-content:space-between"><h2>Toutes tes réponses</h2>
      <div class="levels" id="evf"><button data-f="bad" aria-pressed="true">Mes erreurs (${total - good})</button><button data-f="all" aria-pressed="false">Tout (${total})</button></div></div>
      <div class="list" id="evlist"></div></section>
    <div class="stack"><button class="btn primary block" id="home">Commencer à mon niveau</button></div></div>`;
  const draw = f => { $("#evlist").innerHTML = log.map((l, i) => (f === "all" || !l.ok) ? qcard(l, i) : "").join("") || `<div class="empty">Aucune erreur : bravo !</div>`;
    $$("[data-rr]").forEach(b => b.onclick = () => { const r = ruleById(b.dataset.rr); const ss = spotSession(8, r.id); startSession(r.name, ss.items, {kind: "spot", used: ss.used}); }); };
  draw("bad");
  $("#evf").onclick = e => { const b = e.target.closest("[data-f]"); if (!b) return; $$("#evf button").forEach(x => x.setAttribute("aria-pressed", x === b)); draw(b.dataset.f); };
  $("#home").onclick = () => go("home"); $("#back").onclick = () => go("home");
  refreshAI();
  if (fresh && aiReady()) {
    const box = $("#aian"); box.innerHTML = `<p class="small muted">Le tuteur rédige une analyse personnalisée…</p>`;
    const summary = EVAL_SECTIONS.map(x => `${x.name} : ${est[x.k] == null ? "non mesurée" : LV[Math.round(est[x.k])] + " (" + evalAcc(log, x.k) + " % de réussite)"}`).join("\n");
    const errs = log.filter(l => !l.ok).slice(0, 30).map(l => `- ${l.q} | réponse : ${l.you} | attendu : ${l.sol}`).join("\n");
    sample(`Tu es un professeur d'anglais expert. Un élève francophone vient de passer une évaluation adaptative complète. Objectifs : parler couramment au quotidien et maîtriser l'anglais du commerce.
Résultats :
${summary}
Niveau global : ${LV[li]}
Erreurs :
${errs}
Rédige en français une analyse précise (10 phrases maximum) : diagnostic, causes probables des erreurs (avec exemples tirés de ses réponses), et un plan de travail concret pour les 2 prochaines semaines. Texte simple, sans titres ni markdown.`, {modelTier: "default", onText: ({text}) => { if ($("#aian")) $("#aian").innerHTML = `<p style="white-space:pre-wrap">${esc(text)}</p>`; }})
      .then(({text}) => { if (S.evalLast && S.evalLast.t === rec.t) { S.evalLast.ai = text; save(); } }).catch(e => { if ($("#aian")) $("#aian").textContent = aiErr(e); });
  } else if (rec.ai) $("#aian").innerHTML = `<p style="white-space:pre-wrap">${esc(rec.ai)}</p>`;
}
function startPlacement() { startFullEval(); }

// ====== LEÇONS GÉNÉRÉES PAR L'IA ======
function validItems(arr, extra = {}) {
  if (!Array.isArray(arr)) arr = arr && Array.isArray(arr.items) ? arr.items : [];
  const out = [];
  for (const o of arr) {
    if (!o || typeof o !== "object") continue;
    let it = null;
    const strs = a => Array.isArray(a) ? a.filter(x => typeof x === "string" && x.trim()) : typeof a === "string" ? [a] : [];
    if (o.t === "mcq" && o.q && strs(o.o).length >= 2 && Number.isInteger(o.a) && o.a >= 0 && o.a < o.o.length) it = {t: "mcq", q: o.q, o: strs(o.o), a: o.a, x: o.x || ""};
    else if (o.t === "gap" && typeof o.s === "string" && o.s.includes("___") && strs(o.a).length) it = {t: "gap", s: o.s, v: o.v || "", a: strs(o.a), x: o.x || ""};
    else if (o.t === "tr" && o.fr && strs(o.a).length) it = {t: "tr", fr: o.fr, a: strs(o.a), d: strs(o.d).slice(0, 4), x: o.x || ""};
    else if (o.t === "spot" && typeof o.s === "string") { const n = (o.s.match(/\*/g) || []).length; if (n === 0 || (n === 2 && typeof o.f === "string")) it = {t: "spot", s: o.s, f: o.f || "", x: o.x || ""}; }
    else if (o.t === "ls" && o.en) it = {t: "ls", en: o.en};
    else if (o.t === "sp" && o.en) it = {t: "sp", en: o.en, fr: o.fr || "", noMist: true};
    if (it) out.push(Object.assign(it, extra, {key: "ai:" + hash(JSON.stringify(it))}));
  }
  return out;
}
const FORMAT = `Types possibles (respecte exactement les clés) :
{"t":"mcq","q":"consigne ou phrase (peut être en français)","o":["choix 1","choix 2","choix 3"],"a":0,"x":"explication courte en français"}   ("a" = index de la bonne réponse, varie sa position)
{"t":"gap","s":"phrase anglaise avec ___ à la place du mot manquant","v":"indice, ex. le verbe à l'infinitif, ou chaîne vide","a":["réponse","variante acceptée"],"x":"explication en français"}
{"t":"tr","fr":"phrase française naturelle","a":["traduction anglaise naturelle","autre traduction correcte"],"d":["2 ou 3 mots pièges"],"x":"explication en français"}
{"t":"spot","s":"phrase anglaise où la seule faute est entourée d'astérisques, ex. He *don't* know.","f":"correction du passage entre astérisques","x":"la règle, en français"}   (environ 1 sur 4 sans aucune faute : pas d'astérisques, "f" vide)
{"t":"ls","en":"phrase anglaise courte et naturelle à écouter puis écrire"}
{"t":"sp","en":"phrase anglaise utile à dire à voix haute","fr":"sa traduction"}`;
let genCtl = null;
function loadingScreen(title, onStop) {
  renderTabs(false);
  app.innerHTML = `<div class="wrap"><span class="eyebrow">Tuteur IA</span><h1>${esc(title)}</h1><p class="muted">Préparation… (10 à 60 secondes)</p>
    <div class="bar"><i id="gbar" style="width:8%;transition:width 1s"></i></div><div class="row"><button class="btn ghost" id="gstop">Annuler</button></div></div>`;
  let w = 8; const t = setInterval(() => { w = Math.min(92, w + (92 - w) * .08); const b = $("#gbar"); if (b) b.style.width = w + "%"; else clearInterval(t); }, 1000);
  $("#gstop").onclick = () => { clearInterval(t); onStop(); render(); };
  return () => clearInterval(t);
}
async function aiLesson(title, focus, sk = "gram") {
  genCtl = new AbortController(); const ctl = genCtl;
  const stop = loadingScreen("Nouvelle leçon : " + title, () => ctl.abort());
  const prompt = `Tu crées une leçon d'anglais pour un francophone de niveau ${levelPrompt(sk)}. Contenu travaillé : ${focus}.
Objectif : progresser vite, avec des phrases authentiques et utiles dans la vraie vie (quotidien et monde professionnel), pas de phrases scolaires artificielles. Difficulté adaptée au niveau, légèrement au-dessus pour faire progresser.
Renvoie UNIQUEMENT un tableau JSON de 12 exercices variés : 3 mcq, 3 gap, 2 tr, 2 spot, 1 ls, 1 sp.
${FORMAT}
Vérifie chaque réponse : elle doit être irréprochable, et toutes les variantes acceptées doivent être correctes.`;
  try {
    const arr = await sample.json(prompt, {modelTier: "default", signal: ctl.signal, cache: false});
    stop(); const items = validItems(arr, {src: "IA · " + title, lvl: cefr(sk)});
    if (items.length < 4) { toast("La leçon générée était incomplète. Réessaie."); render(); return; }
    startSession(title, shuffle(items), {kind: "ai"});
  } catch (e) { stop(); if (ctl.signal.aborted) return; const m = aiErr(e); render(); if (m) toast(m); }
}

// ====== CONVERSATION ======
function chatRules(sc) {
  return `You are an English conversation partner and tutor for a French speaker whose English level is ${LV[S.sk.oral.li]} (CEFR).
Role-play: ${sc.brief}
Rules:
- Stay in character. Reply in natural spoken English, 1 to 3 short sentences, adapted to the level (simple words for A1-A2, richer vocabulary and idioms for B2-C1).
- Always end with a question or prompt that keeps the conversation going.
- Check the learner's LAST message for real mistakes: grammar, tenses, vocabulary, word order, false friends, unnatural phrasing. Ignore capital letters and final punctuation (the learner may be dictating).
- If the learner writes in French or mixes French, answer in English and put the full English version of their message in "better".
Respond ONLY with a JSON object, no markdown:
{"reply":"your answer in English","corrections":[{"wrong":"exact wrong words from the learner","right":"corrected words","why":"explication courte en français"}],"better":"a more natural version of the learner's whole last message, or an empty string if it was already natural"}`;
}
function startChat(sc) {
  CHAT = {sc, turns: [], busy: false, corrections: 0};
  SES = null; READ = null; renderTabs(false); document.onkeydown = null;
  app.innerHTML = `<div class="wrap" style="padding-bottom:140px">
    <div class="topbar"><button class="x" id="cquit" aria-label="Quitter">✕</button><div style="flex:1;min-width:0"><span class="eyebrow">Conversation · ${LV[S.sk.oral.li]}</span><h3>${esc(sc.title)}</h3></div></div>
    <div class="chat" id="chat"></div></div>
    <div class="composer"><div class="in">${micHTML("cmic")}
    <textarea id="cin" class="field" placeholder="Réponds en anglais (tape ou dicte)" rows="1"></textarea>
    <button class="round" id="csend" aria-label="Envoyer">${IC.send}</button></div></div>`;
  $("#cquit").onclick = () => { if (CHAT && CHAT.ctl) CHAT.ctl.abort(); const n = CHAT.corrections; render(); if (n) toast(n + " correction" + (n > 1 ? "s ajoutées" : " ajoutée") + " au carnet"); };
  const cin = $("#cin");
  cin.onkeydown = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); chatSend(); } };
  $("#csend").onclick = chatSend;
  wireMic("cmic", cin);
  chatCall();
}
function chatAppend(html) { const c = $("#chat"); if (!c) return null; c.insertAdjacentHTML("beforeend", html); window.scrollTo(0, document.body.scrollHeight); return c.lastElementChild; }
function chatSend() {
  if (!CHAT || CHAT.busy) return;
  stopListening();
  const cin = $("#cin"), text = cin.value.trim(); if (!text) return;
  cin.value = "";
  CHAT.turns.push({role: "user", content: "Learner: " + text});
  CHAT.lastUser = chatAppend(`<div class="msg me">${esc(text)}</div>`);
  S.spoken++; S.days[today()] = (S.days[today()] || 0) + 1; save();
  chatCall();
}
async function chatCall() {
  const sc = CHAT.sc; CHAT.busy = true; $("#csend").disabled = true;
  const wait = chatAppend(`<div class="msg bot typing">…</div>`);
  const head = [{role: "user", content: chatRules(sc) + "\n\nStart the conversation now with a short greeting and a first question."}];
  const turns = CHAT.turns.length > 16 ? CHAT.turns.slice(-16) : CHAT.turns;
  if (turns.length && turns[0].role === "user") head.push({role: "assistant", content: JSON.stringify({reply: "(conversation continues)", corrections: [], better: ""})});
  CHAT.ctl = new AbortController(); const myChat = CHAT;
  try {
    const r = await sample.json([...head, ...turns], {modelTier: "quick", cache: false, signal: CHAT.ctl.signal});
    if (CHAT !== myChat) return;
    wait.remove();
    const reply = String(r && r.reply || "").trim() || "Sorry, could you say that again?";
    const corr = Array.isArray(r && r.corrections) ? r.corrections.filter(c => c && c.wrong && c.right && norm(c.wrong) !== norm(c.right)) : [];
    const better = r && typeof r.better === "string" && r.better.trim() && CHAT.turns.length ? r.better.trim() : "";
    if (corr.length || better) {
      chatAppend(`<div class="corr">${corr.map(c => `<div><s>${esc(c.wrong)}</s> → <b>${esc(c.right)}</b>${c.why ? ` <span class="muted">· ${esc(c.why)}</span>` : ""}</div>`).join("")}${better ? `<div><span class="muted">Plus naturel :</span> ${esc(better)} <button class="btn sm ghost" data-b="1" style="min-height:28px;padding:2px 8px">écouter</button></div>` : ""}</div>`);
      const bb = $$("[data-b]").pop(); if (bb) bb.onclick = () => speak(better);
      corr.forEach(c => {
        const it = {t: "fix", wrong: c.wrong, right: c.right, x: c.why || "", src: "Conversation · " + sc.title};
        const key = "chat:" + hash(norm(c.wrong) + "|" + norm(c.right));
        if (!S.mist.some(m => m.k === key)) { S.mist.unshift({k: key, it: strip(it), box: 0, due: Date.now() + DAY / 2, n: 1}); CHAT.corrections++; }
      });
      if (S.mist.length > 250) S.mist.length = 250; save();
    }
    const el = chatAppend(`<div class="msg bot">${esc(reply)} <button class="btn sm ghost" style="min-height:28px;padding:2px 8px;margin-left:4px" aria-label="Réécouter">${ic("play", 16)}</button></div>`);
    el.querySelector("button").onclick = () => speak(reply);
    speak(reply);
    CHAT.turns.push({role: "assistant", content: JSON.stringify({reply, corrections: [], better: ""})});
  } catch (e) {
    if (CHAT !== myChat) return;
    wait.remove(); const m = aiErr(e);
    if (m) chatAppend(`<div class="msg bot" style="color:var(--err)">${esc(m)}</div>`);
    if (CHAT.turns.length && CHAT.turns[CHAT.turns.length - 1].role === "user") { const last = CHAT.turns.pop(); $("#cin").value = last.content.replace(/^Learner: /, ""); if (CHAT.lastUser) CHAT.lastUser.remove(); }
  }
  CHAT.busy = false; const s = $("#csend"); if (s) s.disabled = false;
}

// ====== DÉMARRAGE ======
try {
  const rescue = localStorage.getItem("atelier-eval-rescue");
  if (rescue && !S.evalLast) {
    const R = JSON.parse(rescue);
    if (R && R.log && R.est) { const mapped = {sec: EVAL_SECTIONS.length, done: R.log.length, li: S.li, steps: 0, est: R.est, used: [], t: Date.now(),
      log: R.log.map(l => ({sec: l.sec, li: l.li, ok: l.ok, lvl: l.it && l.it.lvl, q: l.it ? (l.it.rname ? "Règle : " + l.it.rname : l.it.en ? "Vocabulaire : « " + l.it.en + " »" : (l.it.t === "dic" ? "Dictée" : "Question")) : "", you: "", sol: "", x: "", rule: l.it && l.it.rule, rname: l.it && l.it.rname || "", cat: l.it && l.it.cat, th: l.it && l.it.th, en: l.it && l.it.en, fr: "", miss: l.it && l.it.miss}))};
      const last = (S.evals || []).slice(-1)[0];
      // déjà comptée par l'ancienne version : on garde seulement le détail des réponses ; sinon on la termine normalement
      if (last && Date.now() - last.t < 3 * DAY) S.evalLast = {t: last.t, li: last.li, est: R.est, log: mapped.log, changes: null, prev: null};
      else S.evalRun = mapped;
      localStorage.removeItem("atelier-eval-rescue"); save(); }
  }
} catch (e) {}
render();
if (ACC.id) accPull();
loadIndex();
initAI();
initCloud();
// Appli installée (hors claude.ai) : fonctionnement hors ligne
if ("serviceWorker" in navigator && !IN_CLAUDE && window.top === window && /^https:|^http:\/\/localhost/.test(location.href)) navigator.serviceWorker.register("sw.js").catch(() => {});
