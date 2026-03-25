import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./features/public_access/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'inscription',
    loadComponent: () => import('./features/public_access/inscription/inscription.page').then(m => m.InscriptionPage)
  },
  {
    path: 'mot-de-passe-oublie',
    loadComponent: () => import('./features/public_access/mot-de-passe-oublie/mot-de-passe-oublie.page').then(m => m.MotDePasseOubliePage)
  },
  {
    path: 'connexion',
    loadComponent: () => import('./features/public_access/connexion/connexion.page').then(m => m.ConnexionPage)
  },
  {
    path: 'liste-matiere',
    loadComponent: () => import('./features/public_access/liste-matiere/liste-matiere.page').then(m => m.ListeMatierePage)
  },
  {
    path: 'menu-navigation',
    loadComponent: () => import('./features/public_access/menu-navigation/menu-navigation.page').then(m => m.MenuNavigationPage)
  },
  {
    path: 'contenu-matiere',
    loadComponent: () => import('./features/public_access/contenu-matiere/contenu-matiere.page').then(m => m.ContenuMatierePage)
  },
  {
    path: 'compte',
    loadComponent: () => import('./features/public_access/compte/compte.page').then(m => m.ComptePage)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./features/public_access/notifications/notifications.page').then(m => m.NotificationsPage)
  },
  {
    path: 'abonnement',
    loadComponent: () => import('./features/public_access/abonnement/abonnement.page').then(m => m.AbonnementPage)
  },
  {
    path: 'modif-info-perso',
    loadComponent: () => import('./features/public_access/modif-info-perso/modif-info-perso.page').then(m => m.ModifInfoPersoPage)
  },
  {
    path: 'modif-mdp',
    loadComponent: () => import('./features/public_access/modif-mdp/modif-mdp.page').then(m => m.ModifMdpPage)
  },
  {
    path: 'historique-etudiant',
    loadComponent: () => import('./features/public_access/historique-etudiant/historique-etudiant.page').then(m => m.HistoriqueEtudiantPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/public_access/dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
    path: 'notions',
    loadComponent: () => import('./features/public_access/notions/notions.page').then(m => m.NotionsPage)
  },
  {
    path: 'historique-dashboard',
    loadComponent: () => import('./features/public_access/historique-dashboard/historique-dashboard.page').then(m => m.HistoriqueDashboardPage)
  },
  {
    path: 'reset-mot-de-passe',
    loadComponent: () => import('./features/public_access/reset-mot-de-passe/reset-mot-de-passe.page').then(m => m.ResetMotDePassePage)
  },
  {
    path: 'suppression-compte',
    loadComponent: () => import('./features/public_access/suppression-compte/suppression-compte.page').then(m => m.SuppressionComptePage)
  },


];
