// ====== AUDIO ENREGISTRÉ : clés partagées entre l'appli et le générateur ======
function hash32(s) { let h = 5381; for (const c of s) h = ((h << 5) + h + c.charCodeAt(0)) | 0; return h >>> 0; }
// Ce qui est réellement prononcé : sans parenthèses ni guillemets français
function speakable(t) { return String(t || "").replace(/\([^)]*\)/g, " ").replace(/[«»]/g, "").replace(/\s+/g, " ").trim(); }
// Découpage en phrases (Chrome coupe les énoncés longs, et chaque phrase a son enregistrement)
function splitSpeech(t) { return (speakable(t).match(/[^.!?]+[.!?]*["')]*\s*/g) || []).map(x => x.trim()).filter(x => /[A-Za-z0-9]/.test(x)); }
function clipKey(voice, text) { return hash32(voice + "|" + text).toString(36); }

// Tout le contenu intégré qui peut être lu à voix haute, regroupé par paquet (chargé à la demande)
function collectSpeech() {
  const out = [], seen = new Set();
  const add = (group, text, voice = "a") => { splitSpeech(text).forEach(p => { const k = clipKey(voice, p); if (!seen.has(k)) { seen.add(k); out.push({k, group, voice, text: p}); } }); };
  const first = s => String(s).split(" / ")[0].trim();
  add("misc", "Hello! This is how I sound. Let's practise together.");
  THEMES.forEach(t => t.words.forEach(w => { add("v_" + t.id, first(w.en)); if (w.ex) add("v_" + t.id, w.ex[0]); }));
  UNITS.forEach(u => u.items.forEach(it => {
    const g = "u_" + u.id;
    if (it.t === "mcq" && /^[A-Za-z]/.test(it.o[it.a])) add(g, it.o[it.a]);
    if (it.t === "gap") add(g, it.s.replace("___", it.a[0]));
    if (it.t === "tr") add(g, it.a[0]);
    if (it.t === "ls" || it.t === "sp") add(g, it.en);
  }));
  SHADOW.forEach(c => c[1].forEach(p => add("shadow", p[0])));
  TEXTS.forEach(t => {
    const g = "t_" + t.id;
    add(g, t.text.replace(/\n+/g, " "));
    Object.keys(t.gloss).forEach(k => add(g, k));
    t.text.split(/\s+/).forEach(w => { const c = w.replace(/[’]/g, "'").replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, "").replace(/^'+|'+$/g, ""); if (c) { add(g, c.toLowerCase()); if (/^[A-Z]/.test(c)) add(g, c); } });
  });
  DIALOGS.forEach(d => { const sp = [...new Set(d.lines.map(l => l[0]))]; d.lines.forEach(l => add("d_" + d.id, l[1], sp.indexOf(l[0]) === 0 ? "a" : "b")); });
  WRITE.forEach(w => add("write", w.model.replace(/\n+/g, " ")));
  if (typeof BANK !== "undefined") BANK.forEach(b => add("bank_" + b.part + "_" + b.lvl, b.en));
  // exemples affichés sous chaque règle (3 premières phrases, corrigées)
  RULES.forEach(r => r.ex.slice(0, 4).forEach(([s, f]) => { const [pre, post = ""] = s.split(/\*[^*]+\*/); add("rules_" + r.lvl, f == null ? s : (pre + f + post).replace(/\s+/g, " ").replace(/\s([.,!?])/g, "$1")); }));
  return out;
}
if (typeof module !== "undefined") module.exports = {hash32, speakable, splitSpeech, clipKey, collectSpeech};
