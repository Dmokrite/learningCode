// Importe les types NextFunction, Request et Response depuis le module "express"
import { type NextFunction, type Request, type Response } from "express";
// Importe la fonction validationResult depuis le module "express-validator" pour valider les données de la requête
import { validationResult } from "express-validator";
// Importe la fonction deleteFile depuis le fichier correspondant
import { deleteFile } from "../../Core/Database/sounds";

// Middleware de validation de fichier
export const FileValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // Valide les données de la requête en fonction des règles spécifiées
    const result = validationResult(req);

    // Récupère les erreurs de validation sous forme de tableau
    const errors = result.array();

    // Vérifie s'il y a des erreurs de validation
    if (errors.length > 0) {
        // Si des erreurs sont détectées, supprime les fichiers téléchargés (s'ils existent)
        if (req.body.files) {
            for (const file of req.body.files) {
                await deleteFile(file.filename);
            }
        }
        // Répond avec un code de statut 400 (Bad Request) et les erreurs de validation
        res.status(400);
        return res.send({
            errors
        });
    }

    // Si aucune erreur de validation n'est détectée, passe la main au middleware suivant
    next();
}
