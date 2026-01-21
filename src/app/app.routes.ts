import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },  {
    path: 'inscription',
    loadComponent: () => import('./inscription/inscription.page').then( m => m.InscriptionPage)
  },
  {
    path: 'mot-de-passe-oublie',
    loadComponent: () => import('./mot-de-passe-oublie/mot-de-passe-oublie.page').then( m => m.MotDePasseOubliePage)
  },
  {
    path: 'connexion',
    loadComponent: () => import('./connexion/connexion.page').then( m => m.ConnexionPage)
  },
  {
    path: 'liste-matiere',
    loadComponent: () => import('./liste-matiere/liste-matiere.page').then( m => m.ListeMatierePage)
  },
  {
    path: 'menu-navigation',
    loadComponent: () => import('./menu-navigation/menu-navigation.page').then( m => m.MenuNavigationPage)
  },
  {
    path: 'contenu-matiere',
    loadComponent: () => import('./contenu-matiere/contenu-matiere.page').then( m => m.ContenuMatierePage)
  },

];
