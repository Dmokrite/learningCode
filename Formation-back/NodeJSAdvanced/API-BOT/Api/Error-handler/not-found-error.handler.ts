// Importe les types Request, Response et NextFunction depuis le module "express"
import { Request, Response, NextFunction } from "express";
// Importe l'erreur EntityNotFoundError depuis le fichier correspondant
import { EntityNotFoundError } from "../Errors/entity-not-found.error";
// Importe l'erreur NotFoundError depuis le fichier correspondant
import { NotFoundError } from "../Errors/not-found.Error";

// Définit une fonction middleware pour gérer les erreurs de ressource non trouvée
export function notFoundErrorHandler(
    error: Error, // Reçoit l'erreur qui s'est produite
    request: Request, // Reçoit l'objet Request de la requête HTTP
    response: Response, // Reçoit l'objet Response pour envoyer une réponse HTTP
    next: NextFunction // Reçoit la fonction pour passer la main au middleware suivant
) {
    // Définit le code de statut de la réponse HTTP à 404 (Not Found)
    response.status(404);
    
    // Vérifie le type de l'erreur
    if (error instanceof EntityNotFoundError) {
        // Si l'erreur est de type EntityNotFoundError, envoie un message spécifique
        response.send('404 Entity Not Found');
    }
    if (error instanceof NotFoundError) {
        // Si l'erreur est de type NotFoundError, envoie un message spécifique
        response.send('404 Not found');
    }
}
