// Importe les types NextFunction, RequestHandler, Response et Request depuis le module "express"
import { NextFunction, RequestHandler, Response, Request } from "express";
// Importe la fonction getUserById depuis le fichier correspondant
import { getUserById } from "../../Core/Database/users";
// Importe la fonction verify depuis le module "jsonwebtoken" pour vérifier les jetons JWT
import { verify } from "jsonwebtoken";

// Définit une fonction middleware pour autoriser l'accès en fonction des rôles spécifiés
export function createAuthorizeMiddleWare(roles: string[]): RequestHandler {
    // Retourne une fonction middleware asynchrone qui sera exécutée par Express
    return async (request: Request, response: Response, next: NextFunction) => {
        // Récupère le jeton d'accès (accessToken) à partir des cookies de la requête
        const token = request.cookies.accessToken;

        // Vérifie si aucun jeton n'est fourni dans les cookies
        if (!token) {
            // Si aucun jeton n'est trouvé, envoie une réponse avec le code de statut 401 (Unauthorized)
            return response.status(401).send("Unauthorized");
        }

        try {
            // Vérifie le jeton d'accès et décode ses informations
            const accessTokenDecoded = verify(token, process.env.JWT_SECRET!, {
                complete: true
            });

            // Récupère l'utilisateur associé au jeton d'accès à partir de la base de données
            const user = await getUserById(accessTokenDecoded.payload.sub as string);
        
            // Vérifie si aucun utilisateur n'est trouvé pour le jeton d'accès fourni
            if (!user) {
                // Si aucun utilisateur n'est trouvé, envoie une réponse avec le code de statut 403 (Forbidden)
                return response.status(403).send("Forbidden");
            }
            
            // Vérifie si des rôles sont spécifiés et si l'utilisateur a un des rôles autorisés
            if (roles.length > 0 && !roles.includes(user.role)) {
                // Si l'utilisateur n'a pas les rôles requis, envoie une réponse avec le code de statut 403 (Forbidden)
                return response.status(403).send("Forbidden");
            }
        } catch(e) {
            // En cas d'erreur lors de la vérification du jeton, envoie une réponse avec le code de statut 401 (Unauthorized)
            return response.status(401).send("Unauthorized");
        }
        
        // Si tout est valide, passe la main au middleware suivant
        next();
    }
}
