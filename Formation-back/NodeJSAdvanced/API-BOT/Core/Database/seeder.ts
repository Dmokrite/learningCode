// Importe EntityManager depuis TypeORM
import { EntityManager } from "typeorm";
// Importe les modèles User et Role depuis le fichier "../Models/users"
import { Role, User } from "../Models/users";
// Importe le modèle Category depuis le fichier "../Models/categories"
import { Category } from "../Models/categories";
// Importe la connexion à la base de données depuis le fichier "./connection"
import { DatabaseConnection } from "./connection";

// Définit une fonction asynchrone seeder
export async function seeder() {
    // Récupère le gestionnaire d'entités depuis la connexion à la base de données
    const manager = DatabaseConnection.manager;

    // Crée des instances d'utilisateurs avec des données factices
    const users = manager.create(User, [{
        firstName: 'Dramix',
        lastName: 'Otter',
        username: 'romain',
        role: Role.ADMIN,
        // mot de passe HASHÉ (potato)
        password: '$2b$12$TS7w9XaC7BEe4njDbI6Uye90X4BO7Pb7zZGa9zDuN20Lw/WuKJQ9C'
    }, {
        firstName: 'Seb',
        lastName: 'Caudron',
        role: Role.USER,
        username: 'remadex',
        // mot de passe HASHÉ (potato)
        password: '$2b$12$TS7w9XaC7BEe4njDbI6Uye90X4BO7Pb7zZGa9zDuN20Lw/WuKJQ9C'
    }]);

    // Crée des instances de catégories avec des données factices
    const categories = manager.create(Category, [
        { name: 'Troll' },
        { name: 'Pet' },
        { name: 'Animaux' },
        { name: 'Meme' },
        { name: 'Anime' },
        { name: 'Movie' },
        { name: 'NSFW' }
    ]);

    // Enregistre les catégories dans la base de données
    await manager.save(categories);
    // Enregistre les utilisateurs dans la base de données
    await manager.save(users);
}
