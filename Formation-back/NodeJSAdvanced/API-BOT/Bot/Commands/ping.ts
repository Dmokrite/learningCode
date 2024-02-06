// Importe les modules nécessaires de la bibliothèque discord.js
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

// Exporte une constante "commandName" définie comme "ping"
export const commandName = "ping";

// Exporte une fonction "builder" qui configure le constructeur de la commande
export const builder = (builder: SlashCommandBuilder) => {
    // Définit la description de la commande comme "Makes me ping"
    return builder.setDescription('Makes me ping');
}

// Fonction asynchrone pour exécuter la commande
export async function execute(interaction: CommandInteraction) {
    // Répond à l'interaction avec "Pong" et configure le message comme éphémère
    await interaction.reply({
        content: "Pong",
        ephemeral: true // Le message n'est visible que par l'utilisateur qui a exécuté la commande
    });
}
