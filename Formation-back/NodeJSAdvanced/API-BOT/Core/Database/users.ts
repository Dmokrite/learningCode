import { DatabaseConnection } from "./connection";
import { User } from "../Models/users";
import { EntityNotFoundError } from "../../Api/Errors/entity-not-found.error";

// Récupère tous les utilisateurs de la base de données
export async function getAllUsers() {
    return DatabaseConnection.manager.find(User);
}

// Récupère un utilisateur par son ID
export async function getUserById(id: string) {
    // Utilise la connexion à la base de données pour trouver un utilisateur avec l'ID spécifié
    const foundEntity = await DatabaseConnection.manager.findOne(User, {
        where: {
            id
        }
    });

    // Si aucun utilisateur n'est trouvé, lance une erreur
    if (!foundEntity) {
        throw new EntityNotFoundError();
    }

    // Retourne l'utilisateur trouvé
    return foundEntity;
}

// Insère un nouvel utilisateur dans la base de données
export async function insertUser(body: Object) {
    // Crée une nouvelle instance d'utilisateur avec les données fournies
    const user = DatabaseConnection.manager.create(User, body);
    // Sauvegarde le nouvel utilisateur dans la base de données
    await DatabaseConnection.manager.save(user);
    // Retourne l'utilisateur créé
    return user;
}

// Met à jour un utilisateur existant dans la base de données
export async function updateUser(id: string, body: Object) {
    // Récupère l'utilisateur par son ID
    const user = await getUserById(id);
    // Met à jour les données de l'utilisateur avec les nouvelles données fournies
    Object.assign(user, body);
    // Sauvegarde les modifications dans la base de données
    await DatabaseConnection.manager.save(user);
    // Retourne l'utilisateur mis à jour
    return user;
}

// Supprime un utilisateur de la base de données
export async function deleteUser(id: string) {
    // Récupère l'utilisateur par son ID
    const user = await getUserById(id);
    // Supprime l'utilisateur de la base de données
    await DatabaseConnection.manager.delete(User, user);
    // Retourne l'utilisateur supprimé
    return user;
}
