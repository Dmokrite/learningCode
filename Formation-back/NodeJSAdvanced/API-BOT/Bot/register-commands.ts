// Importe les modules nécessaires de la bibliothèque Discord.js
import { REST, Routes, SlashCommandBuilder } from "discord.js";
// Importe la structure de commande
import { Command } from ".";

// Fonction pour enregistrer les commandes
export async function registerCommands(commands: Command[]) {
    // Crée une instance de l'objet REST et définit le token d'accès
    const rest = new REST().setToken(process.env.BOT_TOKEN!);

    // Construit le tableau de commandes slash à partir des commandes fournies
    const slashCommands = commands.map((c) => {
        // Crée un nouveau constructeur de commande Slash avec le nom de la commande
        const builder = new SlashCommandBuilder()
            .setName(c.commandName);
        // Utilise la fonction de construction de la commande fournie par la commande
        return c.builder(builder);
    });

    // Envoie une requête HTTP pour enregistrer les commandes auprès de Discord
    await rest.put(
        // Routes.applicationCommands() génère l'URL de l'endpoint pour les commandes d'application
        Routes.applicationCommands(process.env.APPLICATION_ID!),
        // Corps de la requête contenant les commandes à enregistrer
        { body: slashCommands }
    );
}
