import { readFile, writeFile } from "fs/promises";
import { EntityNotFoundError } from "../Errors/entity-not-found.error";
import { NextFunction, Request, Response, Router } from "express";

async function readFileAndParseAsJson(fileName: string) {
    const stringifiedData = await readFile(`./Data/${fileName}.json`, 'utf8');
    return JSON.parse(stringifiedData);
}

async function stringifyJsonAndOverWrite(modelName: string, data: Object[]) {
    const stringified = JSON.stringify(data);
    await writeFile(`./Data/${modelName}.json`, stringified);
}

export async function getAll(modelName: string) {
    return readFileAndParseAsJson(modelName);
}

export async function getById(modelName: string, id: string) {
    const sounds = await readFileAndParseAsJson(modelName);
    return sounds.find((obj: { id: number }) => obj.id === Number(id)); 
}

export async function insert(modelName: string, body: Object) {
    const data = await readFileAndParseAsJson(modelName);
    data.push(body);
    await stringifyJsonAndOverWrite(modelName, data);
    return body;
}

export async function replace(modelName: string, id: string, body: Object) {
    const data = await readFileAndParseAsJson(modelName);
    const replaceIndex = data.findIndex((obj: { id: number }) => obj.id === Number(id));
    data[replaceIndex] = body;
    await stringifyJsonAndOverWrite(modelName, data);
    return body;
}

export async function update (modelName: string, id: string, body: Object) {
    const data = await readFileAndParseAsJson(modelName);
    const updateIndex = data.findIndex((obj: { id: string}) => obj.id === id);
    if (updateIndex === -1) {
        throw new EntityNotFoundError();
    }
    data[updateIndex] = { ...data[updateIndex], ...body };
    await stringifyJsonAndOverWrite(modelName, data);
    return data[updateIndex];
}

export async function deleteEntity (modelName: string, id: string) {
    const data = await readFileAndParseAsJson(modelName);
    const toDeleteIndex = data.findIndex((obj: { id: string }) => obj.id === id);
    data.splice(toDeleteIndex, 1);
    await stringifyJsonAndOverWrite(modelName, data);
}

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
