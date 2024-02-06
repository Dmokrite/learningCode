import { rm } from "fs/promises";
import { Sound } from "../Models/sounds";
import { DatabaseConnection } from "./connection";
import { EntityNotFoundError } from "../../Api/Errors/entity-not-found.error";
import { Like } from "typeorm";

// Récupère tous les sons de la base de données avec les relations spécifiées
export async function getAllSounds(relations: string[] = []) {
    // Utilise la connexion à la base de données pour trouver tous les sons avec les relations fournies
    return DatabaseConnection.manager.find(Sound, {
        relations
    });
}

// Crée un nouveau son dans la base de données
export async function createSound(obj: Object) {
    // Crée une nouvelle instance de Sound avec les données fournies
    const sound = DatabaseConnection.manager.create(Sound, obj);
    // Sauvegarde le nouveau son dans la base de données
    await DatabaseConnection.manager.save(sound);
    // Retourne le son créé
    return sound;
}

// Récupère un son par son ID
export async function getSoundById(id: string) {
    // Utilise la connexion à la base de données pour trouver un son avec l'ID spécifié
    const sound = await DatabaseConnection.manager.findOne(Sound, {
        where: {
            id
        }
    });

    // Si aucun son n'est trouvé, lance une erreur
    if (!sound) {
        throw new EntityNotFoundError();
    }

    // Retourne le son trouvé
    return sound;
}

// Récupère un son par une propriété spécifique et sa valeur
export async function getSoundBy(property: keyof Sound, value: string) {
    // Utilise la connexion à la base de données pour trouver un son avec la propriété spécifiée et sa valeur correspondante
    const sound = await DatabaseConnection.manager.findOne(Sound, {
        where: {
            [property]: value
        }
    });

    // Retourne le son trouvé
    return sound;
} 

// Recherche les sons par un motif de nom spécifié
export async function searchSound(value: string) {
    // Utilise la connexion à la base de données pour trouver les sons dont le nom correspond au motif spécifié
    const sounds = await DatabaseConnection.manager.find(Sound,{
        where: {
            name: Like(`${value}%`)
        },
        // Limite le nombre de résultats à 25
        take: 25
    });

    // Retourne les sons trouvés
    return sounds;
}

// Supprime un son de la base de données et son fichier correspondant
export async function deleteSound (id: string) {
    // Récupère le son par son ID
    const sound = await getSoundById(id);
    // Utilise la connexion à la base de données pour supprimer le son
    await DatabaseConnection.manager.delete(Sound, sound);
    // Supprime le fichier correspondant au son
    await deleteFile(sound.file);
}

// Supprime le fichier correspondant à un son
export async function deleteFile(file: string) {
    // Construit le chemin du fichier à supprimer
    const path = `uploads/${file}`;
    // Supprime le fichier
    await rm(path);
}

// Remplace un son existant par de nouvelles données
export async function replaceSound(id: string, body: Object) {
    // Récupère le son par son ID
    const sound = await getSoundById(id);
    // Stocke le nom de fichier original
    const originalFile = sound.file;
    // Met à jour les données du son avec les nouvelles données fournies
    Object.assign(sound, body);
    // Utilise la connexion à la base de données pour sauvegarder les modifications
    await DatabaseConnection.manager.save(sound);
    // Supprime le fichier original du son
    await deleteFile(originalFile);
}
