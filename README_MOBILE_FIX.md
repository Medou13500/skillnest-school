# Guide de Connexion Mobile au Backend

Ce document explique comment configurer l'application pour que le mobile (physique ou émulateur) puisse communiquer avec le backend qui tourne sur votre ordinateur.

## Le Problème
Sur un téléphone, `localhost` désigne le téléphone lui-même. Si votre backend tourne sur votre PC, le téléphone ne le trouvera pas. Il faut donc utiliser l'adresse IP locale de votre ordinateur.

---

## 1. Trouver votre adresse IP locale (Windows)
1. Ouvrez un terminal.
2. Tapez : `ipconfig`
3. Cherchez la ligne **"Adresse IPv4"** sous votre carte Wi-Fi (ex: `192.168.1.200`).

## 2. Configurer le Frontend (Angular/Ionic)
Ouvrez les fichiers suivants :
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

Remplacez `localhost` par votre adresse IP :
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://192.168.1.200:3000' // REMPLACEZ PAR VOTRE IP
};
```

> **Note pour l'Émulateur Android uniquement** : Vous pouvez utiliser `http://10.0.2.2:3000` au lieu de votre IP. Cela fonctionne sur n'importe quel Wi-Fi, mais uniquement sur l'émulateur.

## 3. Configurer le Backend (CORS)
Dans `backend/src/server.ts`, assurez-vous que votre adresse IP (ou le tunnel) est autorisée dans les `allowedOrigins` :
```typescript
const allowedOrigins = (process.env.CORS_ORIGINS ?? 
  "http://localhost:8100,http://192.168.1.200:8100,capacitor://localhost")
```

## 4. Appliquer les changements sur Mobile
À chaque fois que vous modifiez l'adresse IP dans `environment.ts`, vous devez synchroniser l'application mobile :
1. Arrêtez l'application.
2. Exécutez :
   ```bash
   ionic build
   npx cap sync android
   ```
3. Relancez l'application depuis Android Studio.

---

## Solutions pour les changements de Wi-Fi fréquents

### Option A : Tunnel Public (Recommandé pour test réel)
Utilisez un outil comme **ngrok** pour créer une URL permanente accessible de partout (même en 4G).
1. `npm install -g ngrok`
2. `ngrok http 3000`
3. Utilisez l'URL fournie par ngrok (`https://...`) dans vos fichiers `environment.ts`.

### Option B : Mise à jour manuelle
Si vous changez de Wi-Fi :
1. Refaites l'étape 1 (`ipconfig`) pour obtenir la nouvelle IP.
2. Mettez à jour `environment.ts`.
3. Refaites l'étape 4 (`sync`).

---

## Liste de vérification en cas d'erreur "Backend not connected"
- [ ] Le backend est-il bien lancé (`npm run dev`) ?
- [ ] Le téléphone est-il sur le **même Wi-Fi** que le PC ?
- [ ] L'IP dans `environment.ts` correspond-elle bien à celle de `ipconfig` ?
- [ ] Avez-vous bien fait `npx cap sync android` après avoir modifié l'IP ?
- [ ] Le pare-feu Windows bloque-t-il le port 3000 ? (Essayez de le désactiver pour tester).
