# Repository ResetPassword

- enregistrer une demande
    reçoit : user_id, token, expiration
    fait : persister ces informations
    renvoie : confirmation ou échec technique

- retrouver une demande
    reçoit : token
    fait : récupérer la ligne correspondante
    renvoie : la demande ou rien

- marquer comme utilisée
    reçoit : identifiant de la demande
    fait : mettre à jour l’état
    renvoie : confirmation ou échec technique
