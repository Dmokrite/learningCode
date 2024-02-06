// Importe la fonction compare depuis le module "bcrypt" pour comparer les mots de passe hachés
import { compare } from "bcrypt";
// Importe la classe Router depuis le module "express" pour créer des routes
import { Router } from "express";
// Importe la fonction sign depuis le module "jsonwebtoken" pour signer les jetons JWT
import { sign } from "jsonwebtoken";
// Importe la classe DatabaseConnection depuis le fichier correspondant pour interagir avec la base de données
import { DatabaseConnection } from "../../Core/Database/connection";
// Importe l'erreur EntityNotFoundError depuis le fichier correspondant
import { EntityNotFoundError } from "../Errors/entity-not-found.error";
// Importe le module express-rate-limit pour limiter le taux de requêtes
import rateLimit from "express-rate-limit";
// Importe la classe User depuis le fichier correspondant pour représenter les utilisateurs
import { User } from "../../Core/Models/users";

// Crée un routeur pour gérer les routes liées à l'authentification
const authRouter = Router();

// Route pour afficher la page de connexion
authRouter.get('/login', async (request, response) => {
    // Renvoie une page de connexion rendue par le moteur de modèle avec des données vides pour le moment
    return response.render('login_page', {});
});

// Route pour l'authentification
authRouter.post('/login', rateLimit({
    limit: 1, windowMs: 1 * 1000
}), async (request, response, next) => {
    // Récupère le nom d'utilisateur et le mot de passe à partir du corps de la requête
    const { username, password } = request.body;

    // Recherche l'utilisateur dans la base de données en fonction du nom d'utilisateur fourni
    const user = await DatabaseConnection.manager.findOne(User, {
        where: {
            username
        }
    });

    // Vérifie si aucun utilisateur n'est trouvé avec le nom d'utilisateur fourni
    if (!user) {
        // Si aucun utilisateur n'est trouvé, renvoie une erreur EntityNotFoundError
        return next(new EntityNotFoundError("Mot de passe ou nom d'utilisateur incorrect"));
    }

    // Vérifie si le mot de passe fourni correspond au mot de passe haché de l'utilisateur
    if (!await compare(password, user.password)) {
        // Si les mots de passe ne correspondent pas, renvoie une erreur EntityNotFoundError
        return next(new EntityNotFoundError("Mot de passe ou nom d'utilisateur incorrect"));
    }

    // Si l'authentification réussit, génère un jeton d'accès JWT avec une durée de validité de 5 minutes
    const accessToken = sign({
        id: user.id,
        // Timestamp de création du jeton
        iat: Math.floor(new Date().getTime() / 1000),
        // Timestamp d'expiration du jeton (5 minutes à partir de maintenant)
        exp: Math.floor((new Date().getTime() / 1000) + 300),
    }, process.env.JWT_SECRET!);

    // Ajoute le jeton d'accès dans les cookies de la réponse avec une expiration de 5 minutes
    response.cookie('accessToken', accessToken, {
        expires: new Date(Date.now() + 300000),
        httpOnly: true
    });

    // Envoie une réponse contenant le jeton d'accès
    response.send({
        accessToken
    });
});

// Exporte le routeur d'authentification
export {
    authRouter
}
