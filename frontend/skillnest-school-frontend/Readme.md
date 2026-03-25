#  SkillNest School — Frontend Compréhension de l'Architecture

Ce projet frontend est développé avec **Angular + Ionic en mode standalone**.

L’architecture a été conçue pour :
- être **simple à comprendre**
- éviter que les développeurs se perdent
- savoir immédiatement **où écrire le code**
- séparer clairement la **technique**, le **métier** et l’**interface**

 **Si tu hésites où mettre ton code, c’est que tu n’es pas au bon endroit.**

---


##  Objectif de l’architecture

- Travailler efficacement en équipe
- Garder un projet lisible et maintenable
- Faciliter l’évolution du front sans le casser
- Appliquer des règles simples et constantes

---
##  Ajouter une nouvelle fonctionnalité (workflow conseillé)

Quand tu dois ajouter une nouvelle fonctionnalité :

1. Créer un dossier dans `features/` (un dossier = une feature)
2. Créer la page (component standalone)
3. Ajouter la route correspondante dans `app.routes.ts`
4. Si nécessaire, créer ou utiliser un service dans `core/`
5. Utiliser des composants depuis `ui-components/` pour l’affichage

 Ne jamais créer de page ailleurs que dans `features/`.
 Ne jamais appeler un service directement depuis un composant UI.

---

##  Lancer le projet en local

**Important**

Le projet frontend doit être lancé **depuis le bon dossier**.

```bash
cd frontend/skillnest-school-frontend
ionic serve


##  Vue d’ensemble

src/
└── app/
├── core/
├── features/
├── layouts/
├── ui-components/
├── app.component.ts
└── app.routes.ts


---

##  `core/` — Technique & transversal

Contient **tout le code technique partagé** dans l’application.

core/
├── authentication/
├── api/
└── models/


### Rôle
- gestion de l’authentification (guards, interceptors)
- services de communication (HTTP)
- modèles TypeScript (User, Subject, Question, etc.)

### Règles
-  pas de HTML
-  pas de logique d’interface
-  uniquement de la logique technique

---

##  `features/` — Le métier (le plus important)

 **Tout ce que l’utilisateur voit et utilise se trouve ici.**

features/
├── public-access/
│ └── home/
├── user-authentication/
│ ├── login-user/
│ └── register-user/
├── student-dashboard/
├── placement-test/
├── learning-progress/
└── user-profile/


### Rôle
- chaque dossier = une fonctionnalité
- chaque page = un écran de l’application

### Règles
-  logique métier autorisée
-  appels aux services du `core`
-  pas de logique technique bas niveau
-  pas de composants UI complexes

 **Si la fonctionnalité est visible à l’écran, elle est dans `features/`.**

---

##  `ui-components/` — Composants d’interface (DUMB)

Contient **uniquement des composants visuels réutilisables**.

ui-components/
├── app-header/
├── app-footer/
├── subject-card/
├── question-card/
├── progress-bar/
└── primary-button/



### Rôle
- afficher des données
- émettre des événements (`@Input` / `@Output`)

### Règles strictes
-  aucun appel HTTP
-  aucune logique métier
-  aucun accès aux services
-  affichage uniquement

 Ces composants **ne décident jamais**, ils affichent.

---

##  `layouts/` — Structure des pages

Définit la **structure globale des écrans**.
layouts/
├── public-layout/
└── authenticated-layout/


### Rôle
- éviter la répétition du header / footer
- structurer les pages publiques et privées
- poser un cadre clair pour l’UI

---

##  Fichiers racine Angular (à ne pas déplacer)
app.component.ts
app.routes.ts


### Rôle
- `app.component.ts` : composant racine Angular
- `app.routes.ts` : routing global de l’application

**Ces fichiers doivent rester à la racine de `src/app/`.**

---

##  Fonctionnement global du frontend

1. L’utilisateur navigue vers une page (`features`)
2. La page gère la logique métier
3. La page appelle un service (`core`)
4. Les données sont reçues et traitées
5. Les composants UI affichent les données

---

##  Séparation des responsabilités

| Élément | Rôle |
|------|-----|
| Page (`features`) | Logique métier |
| Service (`core`) | Accès aux données |
| UI Component | Affichage |
| Layout | Structure |
| Guard | Sécurité côté front |

---

##  Règles à respecter absolument

-  pas d’appel HTTP dans les composants UI
-  pas de logique métier dans `core`
-  pas de pages directement dans `src/app`
-  pas de logique complexe dans le HTML
-  une fonctionnalité = un dossier dans `features`

---

##  Conseil pour l’équipe

> **Si tu te demandes “où mettre ce code”, relis ce README.**  
> La réponse est ici dans 99 % des cas.

---

##  Conclusion

Cette architecture frontend est :
- simple
- pédagogique
- scalable
- adaptée à une équipe junior

 Toute contribution qui ne respecte pas ces règles devra être corrigée.


 Elle permet de se concentrer sur **l’interface et le métier**, sans confusion.

---
