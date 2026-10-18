"""Génère les enregistrements anglais (Kokoro) de tout le contenu de l'appli.
Usage : python gen_audio.py <dossier_appli>
Lit speech_list.json, écrit clips/<clé>.mp3 (cache), puis audio/<paquet>.json et audio/index.json.
"""
import base64, io, json, os, sys, time
import numpy as np
import soundfile as sf
from kokoro import KPipeline

root = sys.argv[1]
mode = sys.argv[2] if len(sys.argv) > 2 else "all"          # all | worker | pack
wi, wn = (int(sys.argv[3]), int(sys.argv[4])) if mode == "worker" else (0, 1)
import torch; torch.set_num_threads(2 if mode == "worker" else 4)
items = json.load(open(os.path.join(root, "speech_list.json"), encoding="utf8"))
clips = os.path.join(root, "clips"); os.makedirs(clips, exist_ok=True)
outdir = os.path.join(root, "audio"); os.makedirs(outdir, exist_ok=True)
VOICES = {"a": "af_heart", "b": "am_michael"}
SR = 24000

pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M") if mode != "pack" else None

def trim_start(a):
    idx = np.where(np.abs(a) > 0.004)[0]
    return a[max(0, idx[0] - int(0.06 * SR)):] if len(idx) else a

def synth(text, voice):
    text = text.strip()
    words = text.rstrip(".!?").split()
    # Mot ou expression courte : prononcé en début de phrase (« age. That is the word. ») puis découpé
    # juste après, au point le plus silencieux. Seul, un mot court est souvent mal articulé.
    if len(words) <= 3 and not any(c in text.rstrip(".!?") for c in ".!?"):
        core = text.rstrip(".!?") + ("?" if text.endswith("?") else ".")
        for r in pipe(core + " That is the word.", voice=VOICES[voice], speed=0.9):
            audio = r.audio.cpu().numpy()
            toks = [t for t in r.tokens if t.end_ts is not None and t.text.strip() and t.text.strip() not in ".,!?"]
            if len(toks) >= len(words):
                end = toks[len(words) - 1].end_ts
                lo, hi = int((end - 0.02) * SR), min(len(audio), int((end + 0.35) * SR))
                env = np.convolve(np.abs(audio[lo:hi]), np.ones(240) / 240, mode="same")
                a = trim_start(audio[:lo + int(np.argmin(env))])
                return np.concatenate([a, np.zeros(int(0.15 * SR), dtype=np.float32)])
            break
    if not text.endswith((".", "!", "?")): text += "."
    parts = [x.cpu().numpy() for _, _, x in pipe(text, voice=VOICES[voice], speed=0.95)]
    audio = np.concatenate(parts) if parts else np.zeros(SR // 10, dtype=np.float32)
    # on ne retire que le silence du début (jamais la fin : les consonnes finales sont faibles)
    return np.concatenate([trim_start(audio), np.zeros(int(0.15 * SR), dtype=np.float32)])

def to_mp3(audio, path):
    sf.write(path, audio, SR, format="MP3")

t0 = time.time(); done = 0
for i, it in enumerate(items):
    if mode == "pack": break
    if i % wn != wi: continue
    p = os.path.join(clips, it["k"] + ".mp3")
    if os.path.exists(p) and os.path.getsize(p) > 0:
        continue
    to_mp3(synth(it["text"], it["voice"]), p)
    done += 1
    if done % 50 == 0:
        el = time.time() - t0
        print(f"{i + 1}/{len(items)} clips, {el:.0f}s", flush=True)

if mode == "worker":
    print("worker", wi, "done", flush=True); sys.exit(0)
# silence de déblocage (iPhone)
sil = os.path.join(clips, "_silence.mp3")
to_mp3(np.zeros(int(0.15 * SR), dtype=np.float32), sil)

groups, index = {}, {}
for it in items:
    cp = os.path.join(clips, it["k"] + ".mp3")
    if not os.path.exists(cp) or os.path.getsize(cp) == 0 or time.time() - os.path.getmtime(cp) < 5:
        continue  # pas encore enregistré (paquet partiel)
    with open(cp, "rb") as f:
        groups.setdefault(it["group"], {})[it["k"]] = base64.b64encode(f.read()).decode()
    index[it["k"]] = it["group"]
total = 0
for g, d in groups.items():
    s = json.dumps(d, separators=(",", ":"))
    total += len(s)
    open(os.path.join(outdir, g + ".json"), "w", encoding="utf8").write(s)
with open(sil, "rb") as f:
    silence = base64.b64encode(f.read()).decode()
json.dump({"v": int(time.time()), "silence": silence, "k": index}, open(os.path.join(outdir, "index.json"), "w", encoding="utf8"), separators=(",", ":"))
print(f"OK {len(index)}/{len(items)} clips, {len(groups)} paquets, {total / 1e6:.1f} Mo, {time.time() - t0:.0f}s")
