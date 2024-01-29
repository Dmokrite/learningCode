import { NextFunction, Request, Response } from "express";
import { insert } from "../Database/utils";
import { body } from "express-validator";

// Validation des fichiers téléchargés
export const uploadValidation = [
    body('name').notEmpty(), // Vérifier que le champ 'name' n'est pas vide
    body('category').notEmpty(), // Vérifier que le champ 'category' n'est pas vide
    // Vérification du type de fichier (audio/mpeg)
    body('files.*.mimetype').isIn(['audio/mpeg'])
];

export const handleFileUpload = async (req: Request, _res: Response, next: NextFunction) => {
    req.body.files = req.files as Express.Multer.File[]; // Ajouter le tableau de fichiers au corps de la requête

    const files = req.body.files;

    for (const file of files) {
        const fileName = file.filename.split('.');
        fileName.pop();
        await insert('sounds', {
            id: new Date().getTime(), // Utiliser le timestamp comme ID
            name: `${req.body.name}-${fileName.join('.')}`, // Concaténer le nom du son avec le nom du fichier
            category: req.body.category, // Utiliser la catégorie fournie dans la requête
            file: file.originalname, // Utiliser le nom original du fichier téléchargé
        });
    }

    next();
};