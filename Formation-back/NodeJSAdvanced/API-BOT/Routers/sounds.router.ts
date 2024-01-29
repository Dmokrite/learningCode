import multer from "multer";
import { createAuthorizeMiddleWare } from "../Middlewares/authorize.middleware";
import { NextFunction, Router, Response, Request } from "express";
import { deleteEntity, getAll, getById, insert, replace } from "../Database/utils";
import { EntityNotFoundError } from "../Errors/entity-not-found.error";
import { ValidationMiddleware } from "../Middlewares/validation.middleware";
import { handleFileUpload, uploadValidation } from "../Middlewares/mp3.middleware";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const configuredMulter = multer({
    dest: './uploads',
    storage,
})

export const soundRouter = Router();

soundRouter.get('/', createAuthorizeMiddleWare([]), async (request: Request, response: Response) => {
    const sounds = await getAll('sounds');
    response.send(sounds);
})

soundRouter.get('/list', async (request: Request, response: Response) => {
    const sounds = await getAll('sounds');
    response.render('sound_list', {
        sounds,
    });
})

soundRouter.get('/:id', createAuthorizeMiddleWare([]), async (request: Request, response: Response, next: NextFunction) => {
    const sound = await getById('sounds', request.params.id);
    if (!sound) {
        return next(new EntityNotFoundError('banane'));
    }
    response.send(sound);
});

soundRouter.post('/', configuredMulter.array('sound'), handleFileUpload, ...uploadValidation, ValidationMiddleware, async (_request, response) => {
    response.redirect('/sounds/list'); // Rediriger vers la liste des sons après l'ajout
});

soundRouter.put('/:id', configuredMulter.single('sound'), async (request, response) => {
    await replace('sounds', request.params.id, {
        ...request.body,
        file: request.file?.originalname,
    });
    response.redirect('/sounds/list');
})

// Les formulaires en html n'accepte que les method post et get. Pour pas écrire un fetch,
// Nous avons fait un post /:id qui se comporte comme un put.
soundRouter.post('/:id', configuredMulter.single('sound'), async (request, response) => {
    await replace('sounds', request.params.id, {
        ...request.body,
        file: request.file?.originalname,
    });
    response.redirect('/sounds/list');
})

soundRouter.delete('/:id', async (request: Request, response: Response) => {
    await deleteEntity('sounds', request.params.id);
    response.status(204).send(null);
})
