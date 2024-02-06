// Importe les types NextFunction, Request et Response depuis le module "express"
import { NextFunction, Request, Response } from "express";
// Importe la fonction appendFile depuis le module "fs/promises" pour ajouter du contenu à un fichier de manière asynchrone
import { appendFile } from "fs/promises";

// Fonction utilitaire pour obtenir l'ID de l'utilisateur à partir de la requête ou "anonymous" par défaut
function getUserIdOrDefault(request: Request) {
    // Vérifie si l'ID de l'utilisateur est présent dans les paramètres de requête
    if (request.query.userId) {
        // Si oui, renvoie cet ID
        return request.query.userId;
    }
    // Si non, renvoie "anonymous"
    return "anonymous";
}

// Middleware de journalisation des requêtes
export async function loggerMiddleware(
    request: Request,
    response: Response,
    next: NextFunction, 
) {
    // Crée une nouvelle instance de Date pour obtenir la date et l'heure actuelles
    const today = new Date();
    // Définit le chemin du fichier de journal en fonction de la date du jour
    const uploadPath = `./Logs/${today.toDateString()}.log`;
    // Construit le contenu du journal avec la date, l'heure, la méthode HTTP, le chemin de la requête et l'ID de l'utilisateur
    const logContent = `${today.getHours()}-${today.getMinutes()} : ${request.method} ${request.path} ${getUserIdOrDefault(request)}\n`;
    // Ajoute le contenu du journal au fichier de journal
    await appendFile(uploadPath, logContent);

    // Passe la main au middleware suivant dans la chaîne de middleware
    next();
}
