import { Application, json } from "express";
import express from "express";
import { soundRouter } from "./Api/routers/sounds.router";
import { loggerMiddleware } from "./Api/Middlewares/logger.middleware";
import { internalServerErrorHandler } from "./Api/Error-handler/internal-server-error.handler";
import { notFoundErrorHandler } from "./Api/Error-handler/not-found-error.handler";
import { NotFoundError } from "./Api/Errors/not-found.Error";
import mustacheExpress from "mustache-express";
import { userRouter } from "./Api/routers/users.router";
import { DatabaseConnection } from "./Core/Database/connection";
import { config } from "dotenv";
import { authRouter } from "./Api/routers/auth.router";
import cookieParser from 'cookie-parser';
import { seeder } from "./Core/Database/seeder";
import { rateLimit } from 'express-rate-limit';
import { initApi } from "./Api";
import { initBot } from "./Bot";

// Initialise l'application Express
async function initApplication() {
    // Charge les variables d'environnement depuis le fichier "development.env"
    config({
        path: 'development.env'
    });

    // Initialise la connexion à la base de données
    await DatabaseConnection.init();
    const databaseInstance = DatabaseConnection.getConnection();

    // Si la variable d'environnement DB_REFRESH est définie à true, rafraîchit la base de données
    if (process.env.DB_REFRESH === "true") {
        console.log("Refreshing de la DB ...");

        // Supprime la base de données existante
        await databaseInstance.dropDatabase();
        // Synchronise la structure de la base de données avec les modèles
        await databaseInstance.synchronize();
        // Remplit la base de données avec des données initiales
        await seeder();
    } else {
        // Si DB_REFRESH n'est pas défini à true, synchronise simplement la base de données
        await databaseInstance.synchronize();
    }

    // Initialise le bot
    await initBot();
    // Initialise l'API
    initApi();
}

// Appelle la fonction d'initialisation de l'application
initApplication();
