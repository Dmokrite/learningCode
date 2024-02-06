// Importe les types Request, Response et NextFunction depuis le module "express"
import { Request, Response, NextFunction } from "express";

// Définit une fonction middleware pour gérer les erreurs internes du serveur
export function internalServerErrorHandler(
    error: Error, // Reçoit l'erreur qui s'est produite
    request: Request, // Reçoit l'objet Request de la requête HTTP
    response: Response, // Reçoit l'objet Response pour envoyer une réponse HTTP
    next: NextFunction // Reçoit la fonction pour passer la main au middleware suivant
) {
    // Définit le code de statut de la réponse HTTP à 500 (Internal Server Error)
    response.status(500);

    // Envoie une réponse avec le message d'erreur générique
    response.send(`500 Internal Server Error`);
}
