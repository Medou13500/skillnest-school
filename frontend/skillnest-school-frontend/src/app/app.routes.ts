import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    // On pointe vers .page.ts et on cherche la classe HomePage
    loadComponent: () => import('./features/public-access/home/home.page').then(m => m.HomePage),
  },
  {
    path: 'inscription',
    loadComponent: () => import('./features/public-access/inscription/inscription.page').then(m => m.InscriptionPage)
  },
  {
    path: 'mot-de-passe-oublie',
    loadComponent: () => import('./features/public-access/mot-de-passe-oublie/mot-de-passe-oublie.page').then(m => m.MotDePasseOubliePage)
  },
  {
    path: 'connexion',
    loadComponent: () => import('./features/public-access/connexion/connexion.page').then(m => m.ConnexionPage)
  },
];
