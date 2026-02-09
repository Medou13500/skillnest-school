import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'page_quiz_end',
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
    path: 'page_quiz',
    loadComponent: () => import('./page-quiz/page-quiz.component').then( m => m.PageQuizComponent)
  },
  {
    path: 'page_quiz_start',
    loadComponent: () => import('./page-quiz-start/page-quiz-start.component').then(m => m.PageQuizStartComponent)
  },
  {
    path: 'page_quiz_end',
    loadComponent: () => import('./page-quiz-end/page-quiz-end.component').then(m => m.PageQuizEndComponent)
  }

];
