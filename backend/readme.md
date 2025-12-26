## 🗺️ Roadmap Backend — Ordre de travail conseillé

Cette roadmap décrit **par quoi commencer**, **dans quel ordre**, et **quoi faire précisément** à chaque étape.

---

###  PHASE 0 — Base technique (fondations)

- [x] Initialiser le projet Node.js
- [x] Installer Express
- [x] Installer TypeScript
- [x] Configurer `tsconfig.json`
- [x] Créer `server.ts`
- [x] Vérifier que le serveur démarre (`npm run dev`)

---

###  PHASE 1 — Architecture & structure

- [x] Créer les dossiers principaux :
  - [x] `config/`
  - [x] `contracts/`
  - [x] `controllers/`
  - [x] `service/`
  - [x] `infrastructure/`

- [x] Séparer clairement :
  - [x] HTTP (controllers)
  - [x] logique métier (service)
  - [x] accès aux données (infrastructure)
  - [x] abstractions (contracts)

---

###  PHASE 2 — Authentification (priorité)

#### Abstractions
- [ ] Créer le contrat `UserLoginInterface`
  - [ ] méthode `findByEmail`
  - [ ] méthode `create`

#### Accès aux données
- [ ] Créer `UserLoginRepository`
  - [ ] implémenter le contrat
  - [ ] simuler la base de données (temporaire)

#### Logique métier
- [ ] Créer `LoginService.ts`
  - [ ] logique d’inscription
  - [ ] logique de connexion
  - [ ] utilisation du repository via le contrat

#### Couche HTTP
- [ ] Créer `LoginController.ts`
  - [ ] endpoint register
  - [ ] endpoint login
  - [ ] validation basique des entrées

---

### 🔑 PHASE 3 — Sécurité & JWT

- [ ] Configurer `jwt.config.ts`
- [ ] Générer un token JWT au login
- [ ] Créer un middleware d’authentification
- [ ] Protéger les routes privées

---

### 🗄️ PHASE 4 — Base de données réelle

- [ ] Choisir la base de données (Postgres / autre)
- [ ] Configurer `database.config.ts`
- [ ] Connecter le repository à la DB réelle
- [ ] Tester les opérations CRUD

---

###  PHASE 5 — Robustesse & qualité

- [ ] Gestion centralisée des erreurs
- [ ] Différencier erreurs métier / erreurs techniques
- [ ] Validation des payloads
- [ ] Logs propres et lisibles

---

###  PHASE 6 — Finalisation

- [ ] Nettoyer le code
- [ ] Vérifier le respect des règles d’architecture
- [ ] Préparer l’argumentaire pour le jury
- [ ] Vérifier que le backend est prêt à être consommé par le frontend

---
