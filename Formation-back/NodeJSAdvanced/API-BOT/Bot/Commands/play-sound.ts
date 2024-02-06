// Importe les modules nécessaires de discord.js/voice pour la gestion audio
import { NoSubscriberBehavior, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
// Importe les modules nécessaires de discord.js pour les interactions et les commandes
import { ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
// Importe la fonction createReadStream pour lire les fichiers
import { createReadStream } from "fs";
// Importe la fonction join pour joindre des chemins de fichiers
import { join } from "path";
// Importe la fonction setTimeout pour retarder la suppression de la réponse éphémère
import { setTimeout } from "timers/promises";
// Importe la connexion à la base de données
import { DatabaseConnection } from "../../Core/Database/connection";
// Importe les fonctions de recherche de sons dans la base de données
import { getSoundBy, searchSound } from "../../Core/Database/sounds";

// Exporte le nom de la commande
export const commandName = "play";

// Exporte la fonction builder qui configure le constructeur de la commande
export const builder = (builder: SlashCommandBuilder) => {
    return builder.setDescription('Joue un son')
        .addStringOption((o) => {
            return o
                .setName('sound')
                .setDescription('Le nom du son')
                .setRequired(true)
                .setAutocomplete(true) // Active l'autocomplétion pour ce champ
        })
        .addNumberOption((o) => {
            return o
                .setName('volume')
                .setDescription('Le volume')
                .setRequired(false)
        })
}

// Fonction de complétion automatique pour l'option 'sound'
export async function autocomplete(interaction: AutocompleteInteraction) {
    const autocompleteString = interaction.options.getFocused(true);

    console.log(autocompleteString);

    if (autocompleteString.name === "sound") {
        // Recherche des sons correspondants dans la base de données
        const sounds = await searchSound(autocompleteString.value);

        // Répond avec les suggestions de sons
        return interaction.respond(
            sounds.map((s) => ({
                name: s.name,
                value: s.file 
            }))
        )
    }
}

// Fonction d'exécution de la commande
export async function execute(interaction: CommandInteraction) {
    // Récupère le canal vocal du membre qui a exécuté la commande
    const channel = (interaction.member as GuildMember).voice;
    const channelId = channel.channelId;
    const guildId = interaction.guildId;

    // Récupère les arguments de la commande
    const soundName = interaction.options.get('sound')?.value as string;
    const volume = interaction.options.get('volume')?.value as number ?? 0.5;

    console.log(volume);

    // Vérifie si le membre est connecté à un canal vocal
    if (!channelId || !guildId) {
        return interaction.reply("Veuillez-vous connecter dans un channel pour cette commande");
    }

    // Rejoint le canal vocal du membre
    const voice = joinVoiceChannel({
        channelId,
        guildId,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false
    });

    // Crée un lecteur audio pour jouer les sons
    const audioPlayer = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });

    // Gère les erreurs du lecteur audio
    audioPlayer.on('error', error => {
        console.error(`Error: ${error.message} with resource ${error.resource.metadata}`);
    });

    // Crée une ressource audio à partir du fichier sonore spécifié
    const audioResource = createAudioResource(
        createReadStream(
            join(process.cwd(), 'uploads' , soundName)
        )
    );

    // Gère les erreurs lors de la lecture du fichier audio
    audioResource.playStream.on("error", (e) => {
        console.log("Une erreur est survenue", e);
    });

    // Définit le volume du son à jouer
    audioResource.volume?.setVolume(volume);

    // Joue le son avec le lecteur audio
    audioPlayer.play(audioResource);

    // Connecte le lecteur audio au canal vocal
    voice.subscribe(audioPlayer);
    
    // Répond à l'interaction avec un emoji et supprime la réponse après 1 seconde
    await interaction.reply({
        content: ':middle_finger:',
        ephemeral: true // Le message n'est visible que par l'utilisateur qui a exécuté la commande
    });
    await setTimeout(1000);
    await interaction.deleteReply(); // Supprime la réponse éphémère
}
