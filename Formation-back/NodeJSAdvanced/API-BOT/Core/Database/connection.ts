// Importe DataSource depuis TypeORM
import { DataSource } from "typeorm";

// Définit la classe DatabaseConnection
export class DatabaseConnection {
    // Stocke la connexion à la base de données en tant que propriété statique
    private static databaseConnection?: DataSource;

    /**
     * Singleton pas fainéant (not lazy)
     * Méthode statique pour obtenir la connexion à la base de données.
     * Lance une erreur si la connexion n'est pas initialisée.
     */
    public static getConnection() {
        if (this.databaseConnection === undefined) {
            throw new Error("La connection à la base de données doit être initialisée");
        }
        return this.databaseConnection;
    }

    /**
     * Singleton fainéant (lazy)
     * Méthode statique asynchrone pour obtenir la connexion à la base de données.
     * Initialise la connexion si elle n'est pas déjà initialisée.
     */
    public static async lazyGetConnection() {
        if (this.databaseConnection === undefined) {
            await this.init();
        }
        return this.databaseConnection;
    }

    /**
     * Getter Alias
     * Propriété statique pour accéder au gestionnaire d'entités de la connexion à la base de données.
     */
    public static get manager() {
        return this.getConnection().manager;
    }

    /**
     * Initialize moi la connection DB
     * Méthode statique asynchrone pour initialiser la connexion à la base de données.
     * Crée une nouvelle instance de DataSource avec les paramètres de connexion.
     * Initialise la connexion.
     * Stocke la connexion dans la propriété statique databaseConnection.
     */
    public static async init() {
        // Crée une nouvelle instance de DataSource avec les paramètres de connexion
        const connection = new DataSource({
            host: 'localhost',
            port: 3376,
            database: process.env.DB_DATABASE,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            type: 'mysql',
            entities: ["Core/Models/*.ts"] // Spécifie les entités à charger depuis les fichiers de modèle
        });
        
        // Initialise la connexion
        await connection.initialize();

        // Stocke la connexion dans la propriété statique databaseConnection
        this.databaseConnection = connection;
    }
}
