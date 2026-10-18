# Atelier d'anglais

Application d'apprentissage de l'anglais pour francophones : progresser vite, parler au quotidien et maîtriser l'anglais du commerce.

## Ce qu'il y a dedans

- **Évaluation complète** (54 questions adaptatives, 5 compétences) qui donne le niveau exact (A1.1 → C1.2), une analyse détaillée et ajuste toute l'appli.
- **Vocabulaire** : 1 809 mots (vie quotidienne et commerce) avec répétition espacée adaptative, collocations et exemples.
- **Fautes, façon Projet Voltaire** : 135 règles, une erreur fait revenir la règle avec une autre phrase.
- **Phrases** : plus de 1 500 phrases traduites (dictée, traduction, oral), 144 leçons de dictée.
- **Lecture** avec traduction au toucher, **dialogues** à deux voix, **rédaction**, **leçons de grammaire** A1 → C1.
- **Audio** : tous les contenus sont enregistrés avec une vraie voix anglaise (Kokoro), jamais de voix française.
- **Compte par identifiant** : la progression est enregistrée en ligne et se retrouve sur tous les appareils.

## Organisation

| Dossier / fichier | Rôle |
|---|---|
| `src/` | Code et contenu de l'application (`app.js`, règles, vocabulaire, textes, traductions, banque de phrases) |
| `build.sh` | Assemble `src/` en un seul `index.html` |
| `index.html` | Application construite (servie telle quelle) |
| `audio/` | Enregistrements (paquets JSON base64 + `index.json`) |
| `api/progress.js` | Sauvegarde de la progression par identifiant (Vercel Blob privé) |
| `tools/` | Génération (`gen_audio.py`, Kokoro) et vérification (`verify_audio.py`, Whisper) de l'audio |
| `sw.js`, `manifest.webmanifest` | Application installable, fonctionnement hors ligne |

## Construire

```bash
bash build.sh
```

## Régénérer l'audio

```bash
node tools/export_speech.js src          # liste de tout ce qui doit être lu
python tools/gen_audio.py src worker 0 1 # enregistrements (Kokoro)
python tools/verify_audio.py src         # réécoute par Whisper
python tools/gen_audio.py src pack       # paquets dans src/audio/
cp src/audio/*.json audio/               # puis les copier à la racine
```

Les enregistrements intermédiaires (`src/clips/`) ne sont pas versionnés.
