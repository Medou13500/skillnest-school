import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'test-positionnement',
    pathMatch: 'full',
  },
  {
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
    path: 'quiz-test-positionnement',
    loadComponent: () => import('./quiz-test-positionnement/quiz-test-positionnement.component').then( m => m.QuizTestPositionnementComponent)
  },
  {
    path: 'test-positionnement',
    loadComponent: () => import('./test-positionnement/test-positionnement.component').then(m => m.TestPositionnementComponent)
  }

];
