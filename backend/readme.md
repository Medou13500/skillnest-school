# ACTION : demander une réinitialisation de mot de passe avec un email

1. Recevoir l’email fourni par l’appelant

2. Chercher l’utilisateur correspondant à cet email
   - SI aucun utilisateur n’est trouvé
       → arrêter le flux
       → signaler un échec métier (utilisateur inexistant)
       → FIN

3. Créer une nouvelle demande de réinitialisation
   - associer la demande à l’utilisateur trouvé

4. Générer un token unique
   - lier ce token à la demande

5. Définir une date d’expiration
   - calculer une date future fixe
   - stocker cette date dans la demande

6. Initialiser le statut de la demande
   - statut = non consommée

7. Persister la demande de réinitialisation en base

8. Déclencher l’envoi de l’email
   - l’email contient le token de la demande

9. Terminer le flux avec une confirmation générique
