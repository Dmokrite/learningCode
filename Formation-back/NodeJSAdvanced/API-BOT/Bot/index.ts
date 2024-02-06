// Importe les modules nécessaires de la bibliothèque Discord.js
import { AutocompleteInteraction, Client, CommandInteraction, GatewayIntentBits, Routes, SlashCommandBuilder } from 'discord.js';
// Importe la classe REST pour effectuer des requêtes HTTP à l'API Discord
import { REST } from 'discord.js';
// Importe la fonction readdir pour lire les fichiers du répertoire de manière asynchrone
import { readdir } from 'fs/promises';
// Importe la fonction registerCommands pour enregistrer les commandes auprès de Discord
import { registerCommands } from './register-commands';

// Définit la structure d'une commande
export interface Command {
    commandName: string;
    // Fonction de complétion automatique pour l'interaction d'autocomplétion
    autocomplete?: (autocomplete: AutocompleteInteraction) => Promise<unknown>;
    // Fonction de construction du constructeur de commande Slash
    builder: (b: SlashCommandBuilder) => SlashCommandBuilder;
    // Fonction d'exécution de la commande
    execute: (interaction: CommandInteraction) => Promise<unknown>;
}

// Fonction d'initialisation du bot
export async function initBot() {
    // Crée une instance du client Discord
    const client = new Client({ intents: [
        GatewayIntentBits.Guilds, // Intent pour les informations sur les serveurs
        GatewayIntentBits.GuildVoiceStates // Intent pour les états vocaux des membres
    ] });

    // Tableau des commandes
    const commands: Command[] = [];

    // Lit les fichiers de commandes dans le répertoire Commands
    const commandFiles = await readdir(__dirname + "/Commands");

    // Importe chaque fichier de commande et l'ajoute au tableau de commandes
    for (const file of commandFiles) {
        const imp = await import(`${__dirname}/Commands/${file}`);
        commands.push(imp);
    }
    
    // Enregistre les commandes auprès de Discord
    await registerCommands(commands);

    // Événement lorsque le bot est prêt
    client.on('ready', () => {
        console.log("Le bot est connecté à Discord");
    });

    // Événement lorsqu'une interaction est créée avec le bot
    client.on('interactionCreate', async (interaction) => {
        // Vérifie si l'interaction est une interaction d'autocomplétion
        if (interaction.isAutocomplete()) {
            // Trouve la commande correspondante dans le tableau de commandes
            const command = commands.find((c) => c.commandName === interaction.commandName);

            // Si la commande n'est pas trouvée, répond avec une liste vide
            if (!command) {
                return interaction.respond([]);
            }

            // Vérifie si la commande a une fonction d'autocomplétion
            if (!command.autocomplete) {
                console.error("Un autocomplete n'a pas été trouvé pour la commande : ", command.commandName);
                return interaction.respond([]);
            }

            // Exécute la fonction d'autocomplétion de la commande
            await command.autocomplete(interaction);

            return;
        }

        // Vérifie si l'interaction est une commande
        if (interaction.isCommand()) {
            // Trouve la commande correspondante dans le tableau de commandes
            const command = commands.find((c) => c.commandName === interaction.commandName);

            // Si la commande est trouvée, exécute la commande
            if (command) {
                await command.execute(interaction);
                return;
            }
            
            // Si la commande n'est pas trouvée, répond avec un message d'erreur
            await interaction.reply("Command Not found :(");
        }
    });

    // Connecte le bot à Discord en utilisant le token d'accès
    await client.login(process.env.BOT_TOKEN);
}
