// Importe le module cookie-parser pour analyser les cookies de la requête
import cookieParser from "cookie-parser";
// Importe express ainsi que les types Application et json depuis le module "express"
import express, { Application, json } from "express";
// Importe express-rate-limit pour limiter le nombre de requêtes à l'API
import rateLimit from "express-rate-limit";
// Importe mustacheExpress pour configurer le moteur de modèle Mustache
import mustacheExpress from "mustache-express";
// Importe le gestionnaire d'erreur pour les erreurs internes du serveur
import { internalServerErrorHandler } from "./Error-handler/internal-server-error.handler";
// Importe le gestionnaire d'erreur pour les erreurs 404
import { notFoundErrorHandler } from "./Error-handler/not-found-error.handler";
// Importe l'erreur NotFoundError pour être utilisée en cas de ressource non trouvée
import { NotFoundError } from "./Errors/not-found.Error";
// Importe le middleware loggerMiddleware pour enregistrer les requêtes entrantes dans des fichiers journaux
import { loggerMiddleware } from "./Middlewares/logger.middleware";
// Importe le routeur pour les routes d'authentification
import { authRouter } from "./routers/auth.router";
// Importe le routeur pour les routes liées aux sons
import { soundRouter } from "./routers/sounds.router";
// Importe le routeur pour les routes liées aux utilisateurs
import { userRouter } from "./routers/users.router";

// Définit le port sur lequel l'API écoutera les requêtes entrantes
const PORT = 8081;

// Fonction pour initialiser l'API
export function initApi() {
    // Crée une nouvelle instance d'application Express
    const application: Application = express();
    
    // Configure le moteur de modèle Mustache
    application.engine('mustache', mustacheExpress());
    application.set('view engine', 'mustache');
    application.set('views', './Api/Views');
    
    // Utilise express-rate-limit pour limiter le nombre de requêtes à 20 par fenêtre de 10 secondes
    application.use(rateLimit({
        limit: 20,
        windowMs: 10 * 1000
    }))
    // Utilise cookie-parser pour analyser les cookies de la requête
    application.use(cookieParser());
    // Utilise le middleware json pour analyser les corps de requête JSON
    application.use(json());
    // Utilise loggerMiddleware pour enregistrer les requêtes entrantes dans des fichiers journaux
    application.use(loggerMiddleware);
    // Définit des routes statiques pour les fichiers d'assets et les fichiers téléchargés
    application.use('/assets', express.static(__dirname + '/assets'));
    application.use('/static', express.static(process.cwd() + '/uploads'));
    // Utilise les routeurs authRouter, soundRouter, et userRouter pour gérer les routes
    application.use('/sounds', soundRouter);
    application.use('/users', userRouter);
    application.use('/auth', authRouter);
    
    // Override le comportement par défaut pour la 404 en lançant une NotFoundError
    application.use((request, response, next) => {
        throw new NotFoundError();
    })
    // Utilise le middleware notFoundErrorHandler pour gérer les erreurs 404
    application.use(notFoundErrorHandler);
    // Utilise internalServerErrorHandler pour gérer les erreurs internes du serveur
    application.use(internalServerErrorHandler);
    
    // Lance l'écoute sur le port spécifié
    application.listen(PORT, () => {
        console.log(`Prêt et à l\'écoute sur http://localhost:${PORT}`);
    })
}
