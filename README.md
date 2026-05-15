# Trip Planner

Application React + Vite + TypeScript minimale pour générer un itinéraire de voyage avec l'API Groq et l'afficher sur une carte OpenStreetMap (Leaflet).

Fonctionnalités:
- Formulaire: ville, nombre de jours, centres d'intérêt
- Stockage local de la clé Groq (localStorage)
- Génération d'itinéraire via l'endpoint Groq compatible OpenAI
- Géocodage via Nominatim (1 requête/s) avec cache local
- Carte interactive Leaflet + marqueurs + tracé des itinéraires
- Export JSON et copie texte

Installation (création et exécution locale):

```bash
npm create vite@latest trip-planner -- --template react-ts
cd trip-planner
npm install
npm install leaflet react-leaflet
npm install -D @types/leaflet
npm run dev
```

- Remarques:
- L'app peut fonctionner sans backend: renseignez votre clé Groq au premier lancement et elle sera stockée en local.
- Le modèle Groq utilisé par défaut est `llama-3.1-8b-instant`. Pour forcer un autre modèle de chat compatible, définissez `VITE_GROQ_MODEL` dans votre environnement. Exemple: `VITE_GROQ_MODEL=llama-3.1-8b-instant`.
- N'utilisez pas `llama-prompt-guard` pour générer un itinéraire: c'est un modèle de sécurité/modération, pas un modèle de chat génératif.
- Pour déployer de manière plus sûre (recommandé), créez une petite fonction serverless (Vercel/Netlify) qui stocke la clé en variable d'environnement et relaie les requêtes à `https://api.groq.com/openai/v1/chat/completions`.

- Déploiement rapide:
- GitHub Pages: build (`npm run build`) puis déployez le contenu `dist` via gh-pages ou GitHub Actions.
- Vercel/Netlify: Déployez directement le repo. Pour la clé Groq, créez une fonction serverless qui envoie la requête à Groq et configurez la clé via les variables d'environnement. Sinon, l'app stocke la clé dans localStorage (moins sûr).

Fichiers importants:
- `src/services/groq.ts`: fonction `generateItinerary(city, days, interests, apiKey)`.
- `src/services/nominatim.ts`: géocodage avec respect du rate-limit et cache.
- `src/components/TripMap.tsx`: affichage Leaflet.

Fichiers d'exemple:
- `.env.example`: variables d'environnement recommandées pour le build

Licence: MIT
