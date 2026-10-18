"""Réécoute chaque enregistrement avec Whisper et signale ceux qui ne correspondent pas au texte.
Usage : python verify_audio.py <dossier_appli> [worker i n]
Écrit verify_<i>.json : {clé: {"text", "heard", "score"}} pour les enregistrements douteux.
"""
import json, os, re, sys, difflib
import numpy as np, soundfile as sf
from faster_whisper import WhisperModel

root = sys.argv[1]
wi, wn = (int(sys.argv[3]), int(sys.argv[4])) if len(sys.argv) > 4 else (0, 1)
items = json.load(open(os.path.join(root, "speech_list.json"), encoding="utf8"))
m = WhisperModel("small.en", device="cpu", compute_type="int8", cpu_threads=2)

UK_US = {"neighbour": "neighbor", "colour": "color", "favourite": "favorite", "centre": "center", "theatre": "theater", "metres": "meters",
         "organisation": "organization", "globalisation": "globalization", "summarise": "summarize", "apologise": "apologize", "realised": "realized",
         "practise": "practice", "programme": "program", "cheque": "check", "travelling": "traveling", "cancelled": "canceled", "jewellery": "jewelry",
         "pyjamas": "pajamas", "mould": "mold", "licence": "license", "defence": "defense", "analyse": "analyze", "optimise": "optimize",
         "ok": "okay", "grey": "gray", "behaviour": "behavior", "labour": "labor", "favour": "favor", "honour": "honor", "catalogue": "catalog"}
NUM = {"1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine", "10": "ten", "12": "twelve", "15": "fifteen", "20": "twenty", "30": "thirty", "48": "forty eight"}
def norm(t):
    t = t.lower().replace("’", "'").replace("-", " ")
    t = re.sub(r"[^a-z0-9' ]+", " ", t)
    w = [UK_US.get(x, x) for x in t.split()]
    w = [NUM.get(x, x) for x in w]
    return " ".join(w)

def hear(path):
    a, sr = sf.read(path)
    if a.ndim > 1: a = a[:, 0]
    a16 = np.interp(np.arange(0, len(a), sr / 16000), np.arange(len(a)), a).astype(np.float32)
    segs, _ = m.transcribe(np.concatenate([np.zeros(4000, np.float32), a16, np.zeros(4000, np.float32)]), language="en", beam_size=5, without_timestamps=True, condition_on_previous_text=False)
    return " ".join(s.text for s in segs).strip()

bad = {}
for i, it in enumerate(items):
    if i % wn != wi: continue
    p = os.path.join(root, "clips", it["k"] + ".mp3")
    if not os.path.exists(p): continue
    heard = hear(p)
    a, b = norm(it["text"]), norm(heard)
    score = difflib.SequenceMatcher(None, a.split(), b.split()).ratio() if len(a.split()) > 1 else (1.0 if a == b else difflib.SequenceMatcher(None, a, b).ratio() * .9)
    if score < .8:
        bad[it["k"]] = {"text": it["text"], "heard": heard, "score": round(score, 2), "voice": it["voice"]}
json.dump(bad, open(os.path.join(root, f"verify_{wi}.json"), "w", encoding="utf8"), ensure_ascii=False, indent=0)
print("verify", wi, "done", len(bad), "douteux", flush=True)
