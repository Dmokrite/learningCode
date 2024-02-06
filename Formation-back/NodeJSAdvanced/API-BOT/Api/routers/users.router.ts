// Importe la classe Router depuis le module "express" pour créer des routes
import { Router } from "express";
// Importe les fonctions de la base de données liées aux utilisateurs
import { deleteUser, getAllUsers, getUserById, insertUser, updateUser } from "../../Core/Database/users";
// Importe le middleware de vérification d'autorisation
import { createAuthorizeMiddleWare } from "../Middlewares/authorize.middleware";
// Importe le modèle Role depuis le fichier correspondant
import { Role } from "../../Core/Models/users";

// Crée un routeur pour gérer les routes liées aux utilisateurs
export const userRouter = Router();

// Utilise le middleware de vérification d'autorisation pour limiter l'accès aux utilisateurs avec le rôle ADMIN
userRouter.use(createAuthorizeMiddleWare([Role.ADMIN]));

// Route pour obtenir tous les utilisateurs
userRouter.get('/', async (request, response) => {
    // Récupère tous les utilisateurs depuis la base de données
    const allUsers = await getAllUsers();
    // Envoie la liste des utilisateurs
    response.send(allUsers);
})

// Route pour afficher la liste des utilisateurs avec des options d'interaction
userRouter.get('/list', async (request, response) => {
   // Récupère tous les utilisateurs depuis la base de données
   const users = await getAllUsers();  
   // Rend la vue de la liste des utilisateurs avec les données récupérées
   response.render("user_list", {
        users,
        // Fonction pour vérifier si un rôle est actuellement le rôle en cours
        isCurrentRole: () => function (placeholder: string, render: Function) {
            // Extrait le rôle actuel et le rôle testé de la chaîne
            const [currentRole, testedRole] = render(placeholder).trim().split(" ");
            // Vérifie si le rôle actuel correspond au rôle testé
            if (currentRole === testedRole) {
                // Si oui, retourne "disabled" pour désactiver l'élément dans la vue
                return "disabled";
            }
            // Sinon, retourne une chaîne vide
            return "";
        }
   })
});

// Route pour obtenir un utilisateur par son identifiant
userRouter.get('/:id', async (request, response, next) => {
    try {
        // Récupère l'utilisateur avec l'identifiant spécifié depuis la base de données
        const user = await getUserById(request.params.id);
        // Envoie les données de l'utilisateur
        response.send(user);
    } catch(err) {
        // Passe à l'erreur suivante dans la chaîne de middleware s'il y a une erreur
        next(err);
    }
})

// Route pour insérer un nouvel utilisateur
userRouter.post('/', async (request, response) => {
    // Insère le nouvel utilisateur dans la base de données et envoie la réponse
    response.send(await insertUser(request.body));
})

// Route pour mettre à jour les informations d'un utilisateur
userRouter.patch('/:id', async (request, response, next) => {
    try {
        // Met à jour les informations de l'utilisateur avec l'identifiant spécifié et envoie la réponse
        const user = await updateUser(request.params.id, request.body);
        response.send(user);
    } catch(err) {
        // Passe à l'erreur suivante dans la chaîne de middleware s'il y a une erreur
        next(err);
    }
})

// Route pour supprimer un utilisateur par son identifiant
userRouter.delete('/:id', async (request, response) => {
    // Supprime l'utilisateur avec l'identifiant spécifié de la base de données
    await deleteUser(request.params.id);
    // Renvoie une réponse avec le code de statut 204 (No Content)
    response.status(204).send(null);
})
