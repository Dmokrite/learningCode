// Importe les types NextFunction, Request et Response depuis le module "express"
import { NextFunction, Request, Response, Router } from "express";
// Importe la fonction body depuis le module "express-validator" pour valider les données de la requête
import { body } from 'express-validator';
// Importe le module multer pour gérer les fichiers téléchargés
import multer from "multer";
// Importe les fonctions de la base de données liées aux catégories et aux sons
import { getAllCategories } from "../../Core/Database/categories";
import { createSound, deleteSound, getAllSounds, getSoundById, replaceSound } from "../../Core/Database/sounds";
// Importe le middleware de vérification d'autorisation
import { createAuthorizeMiddleWare } from "../Middlewares/authorize.middleware";
// Importe le middleware de validation de fichier
import { FileValidationMiddleware } from "../Middlewares/file-validation.middleware";
// Importe le modèle Role depuis le fichier correspondant
import { Role } from "../../Core/Models/users";

// Configuration du stockage des fichiers téléchargés avec multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        // Sépare le nom de fichier et son extension
        const fileParts = file.originalname.split('.');
        const extension = fileParts.pop();
        // Génère un nouveau nom de fichier avec un timestamp pour éviter les doublons
        cb(null, `${fileParts.join('.')}-${Date.now()}.${extension}`);
    }
});

// Configuration de multer avec le stockage défini
const configuredMulter = multer({
    dest: './uploads',
    storage,
});

// Crée un routeur pour gérer les routes liées aux sons
export const soundRouter = Router();

// Route pour obtenir tous les sons
soundRouter.get('/', createAuthorizeMiddleWare([]), async (request, response) => {
    const sounds = await getAllSounds();
    response.send(sounds);
});

// Route pour afficher la liste des sons
soundRouter.get('/list', async (request, response) => {
    // Récupère tous les sons et toutes les catégories en parallèle
    const [sounds, categories] = await Promise.all([
        getAllSounds(['category']),
        getAllCategories()
    ]);

    // Rend la vue de la liste des sons avec les données récupérées
    response.render('sound_list', {
        categories,
        sounds,
    });
});

// Route pour obtenir un son par son identifiant
soundRouter.get('/:id', createAuthorizeMiddleWare([]), async (request: Request, response: Response, next: NextFunction) => {
    const sound = await getSoundById(request.params.id);
    response.send(sound);
});

// Middleware de validation pour le téléchargement de fichiers
const uploadValidation = [
    body('name').notEmpty(),
    body('category').notEmpty(),
    // Vérifie que le type de fichier est audio/mpeg (MP3)
    body('files.*.mimetype').isIn(['audio/mpeg'])
];

// Route pour créer un nouveau son
soundRouter.post('/', configuredMulter.array('sound'), (req, _res, next) => {
    // Ajoute les fichiers téléchargés dans le corps de la requête pour la validation
    req.body.files = req.files;
    // Passe au middleware de validation suivant
    next();
}, ...uploadValidation, FileValidationMiddleware, async (request, response) => {
    // Récupère les fichiers téléchargés depuis la requête
    const files = request.files as Express.Multer.File[];

    // Parcourt chaque fichier téléchargé
    for (const file of files) {
        // Sépare le nom de fichier et son extension
        const fileName = file.filename.split('.');
        fileName.pop();
        let name = `${request.body.name}-${fileName.join('.')}`;

        // S'il n'y a qu'un seul fichier, utilise le nom spécifié dans le formulaire
        if (files.length === 1) {
            name = request.body.name; 
        }

        // Crée le son dans la base de données avec les informations spécifiées
        await createSound({
            id: new Date().getTime().toString(),
            name,
            category: request.body.category,
            file: file.filename,
        });
    }

    // Redirige vers la liste des sons
    response.redirect('/sounds/list');
});

// Route pour remplacer un son existant
soundRouter.post('/:id', configuredMulter.single('sound'), async (request, response) => {
    // Remplace le son dans la base de données avec les nouvelles informations spécifiées
    await replaceSound(request.params.id, {
        ...request.body,
        file: request.file?.filename,
    });
    // Redirige vers la liste des sons
    response.redirect('/sounds/list');
});

// Route pour supprimer un son
soundRouter.delete('/:id', createAuthorizeMiddleWare([Role.ADMIN, Role.USER]), async (request, response) => {
    // Supprime le son de la base de données
    await deleteSound(request.params.id);
    // Renvoie une réponse avec le code de statut 204 (No Content)
    response.status(204).send(null);
});
