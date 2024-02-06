// Importe le modèle Category depuis le fichier "../Models/categories"
import { Category } from "../Models/categories";
// Importe l'objet DatabaseConnection depuis le fichier "./connection"
import { DatabaseConnection } from "./connection";

// Définit une fonction asynchrone getAllCategories
export async function getAllCategories() {
    // Utilise la méthode find du gestionnaire de base de données pour récupérer toutes les instances de Category
    // La méthode find prend comme argument la classe du modèle à rechercher
    return DatabaseConnection.manager.find(Category);
}
