# Angolo Rosso — Studio (pannello redazione)

Sanity Studio v6. Pannello di pubblicazione delle recensioni. Si distribuisce su
`https://angolo-rosso.sanity.studio` (area riservata, non fa parte del sito pubblico).

Il sito Astro vive nella cartella padre e legge i contenuti da questo progetto Sanity.

## Modello dati

- **category** — Categoria: `title`, `slug`, `tagline`, `description`, `accent` (HEX),
  `atmo` (CSS gradient di fallback), `cover` (immagine), `order`.
- **review** — Recensione: `title`, `slug`, `category` (ref), `excerpt`, `publishedAt`,
  `highlight` (consigliata/popolare/importante), `body` (testo ricco),
  scheda tecnica (`originalTitle`, `year`, `director`, `cast[]`, `runtime`, `country`,
  `genres[]`), media (`poster`, `gallery[]`, `trailer`), `ratings` (jumpscare · splatter ·
  musiche · trucco · effetti · costumi · **votoFinale**).

Le 5 categorie definitive (Splatter · Occulto · Indipendenti · Dark Comedy · Classici)
sono in `seed/categories.ndjson`.

## Primo setup (una sola volta) — richiede l'invito Sanity accettato

> Prerequisito: aver accettato l'invito come collaboratore `Administrator` sul
> progetto, con l'account **xerocool36@gmail.com**.

1. **Project ID** — apri <https://www.sanity.io/manage>, seleziona il progetto
   Angolo Rosso, copia il **Project ID**.
2. **Configura l'ambiente**

   ```bash
   cd studio
   cp .env.example .env
   # poi apri .env e incolla il Project ID in SANITY_STUDIO_PROJECT_ID
   ```

3. **Installa e accedi**

   ```bash
   npm install
   npx sanity login        # accedi con xerocool36@gmail.com
   ```

4. **Carica le 5 categorie**

   ```bash
   npm run import:categories
   ```

5. **Pubblica lo Studio**

   ```bash
   npm run deploy          # -> https://angolo-rosso.sanity.studio
   ```

## Uso quotidiano

```bash
npm run dev                # studio locale su http://localhost:3333
```

La redazione lavora online su `https://angolo-rosso.sanity.studio`: scrive una
recensione, preme **Publish**, e (una volta agganciato il webhook → Netlify) il
sito si ricostruisce da solo in 1–3 minuti.

## Ancora da fare (fase 2, lato sito)

- [ ] Collegare Astro a Sanity (`@sanity/client` + query GROQ) al posto di `src/data/sample.js`.
- [ ] Build hook su Netlify + webhook su Sanity (publish → rebuild).
- [ ] Migrazione hosting da GitHub Pages a Netlify (togliere `base: '/angolo-rosso'` in `astro.config.mjs`).
