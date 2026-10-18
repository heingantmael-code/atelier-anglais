// Sauvegarde de la progression par identifiant (stockage privé Vercel Blob, offre gratuite).
// GET  /api/progress?id=xxx  → la progression enregistrée (404 si l'identifiant est nouveau)
// PUT  /api/progress?id=xxx  → enregistre {updatedAt, data}
//
// Garde-fous pour rester dans l'offre gratuite (Vercel Hobby + Blob) :
//  - taille maximale d'une sauvegarde : 1,5 Mo ;
//  - nombre maximal de comptes : MAX_ACCOUNTS (au-delà, plus de création) ;
//  - un même compte n'est pas réécrit plus d'une fois toutes les 5 secondes ;
//  - un appareil (IP) ne crée pas plus de 3 comptes par heure.
import { get, put, list } from "@vercel/blob";

const MAX_BYTES = 1_500_000;
const MAX_ACCOUNTS = 200;
const MIN_WRITE_MS = 5000;
const lastWrite = new Map();      // id → date de la dernière écriture (par instance)
const creations = new Map();      // ip → [dates de création]

const clean = id => String(id || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9_-]/g, "").slice(0, 40);

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  // l'appli est aussi servie par GitHub Pages : on autorise les appels depuis une autre adresse
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  const id = clean(req.query.id);
  if (id.length < 3) return res.status(400).json({error: "Identifiant invalide (3 caractères minimum : lettres, chiffres, - ou _)."});
  const path = `progress/${id}.json`;
  try {
    if (req.method === "GET") {
      const r = await get(path, {access: "private", useCache: false});
      if (!r) return res.status(404).json({exists: false});
      const text = await new Response(r.stream).text();
      res.setHeader("Content-Type", "application/json");
      return res.status(200).send(text);
    }
    if (req.method === "PUT" || req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!body || typeof body !== "object" || !body.data || typeof body.updatedAt !== "number") return res.status(400).json({error: "Données invalides."});
      const text = JSON.stringify({updatedAt: body.updatedAt, data: body.data});
      if (text.length > MAX_BYTES) return res.status(413).json({error: "Progression trop volumineuse."});
      const now = Date.now();
      if (now - (lastWrite.get(id) || 0) < MIN_WRITE_MS) return res.status(429).json({error: "Trop d'enregistrements rapprochés.", retryAfter: MIN_WRITE_MS});
      const cur = await get(path, {access: "private", useCache: false});
      if (cur) {
        const old = JSON.parse(await new Response(cur.stream).text());
        if ((old.updatedAt || 0) > body.updatedAt) return res.status(409).json({error: "Une sauvegarde plus récente existe.", updatedAt: old.updatedAt});
      } else {
        // création d'un compte : limites anti-abus
        const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "?";
        const recent = (creations.get(ip) || []).filter(t => now - t < 3600_000);
        if (recent.length >= 3) return res.status(429).json({error: "Trop de comptes créés depuis cet appareil. Réessaie dans une heure."});
        const all = await list({prefix: "progress/", limit: MAX_ACCOUNTS + 1});
        if (all.blobs.length >= MAX_ACCOUNTS) return res.status(403).json({error: "Le nombre maximal de comptes est atteint."});
        creations.set(ip, recent.concat(now));
      }
      await put(path, text, {access: "private", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json"});
      lastWrite.set(id, now);
      return res.status(200).json({ok: true, updatedAt: body.updatedAt});
    }
    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({error: "Méthode non autorisée."});
  } catch (e) {
    return res.status(500).json({error: "Erreur du serveur de sauvegarde."});
  }
}
