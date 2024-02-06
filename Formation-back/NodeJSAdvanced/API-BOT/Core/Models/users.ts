import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// Enumération des rôles disponibles pour les utilisateurs
export enum Role {
    ADMIN = "Admin",
    USER = "User"
}

// Définit que cette classe est une entité qui sera stockée dans la base de données
@Entity()
export class User {
    // Déclare une colonne de clé primaire générée automatiquement de type UUID
    @PrimaryGeneratedColumn("uuid")
    public declare id: string;
    
    // Déclare une colonne pour stocker le nom d'utilisateur
    @Column({
        // Définit que la valeur doit être unique dans la base de données
        unique: true
    })
    public declare username: string;

    // Déclare une colonne pour stocker le prénom de l'utilisateur
    @Column({
        // Définit la longueur maximale de la chaîne de caractères
        length: 32
    })
    public declare firstName: string;

    // Déclare une colonne pour stocker le nom de famille de l'utilisateur
    @Column({
        // Définit la longueur maximale de la chaîne de caractères
        length: 32
    })
    public declare lastName: string;

    // Déclare une colonne pour stocker le mot de passe de l'utilisateur
    @Column({
        // Définit la longueur maximale de la chaîne de caractères
        length: 60
    })
    public declare password: string;

    // Déclare une colonne pour stocker le rôle de l'utilisateur en tant qu'enumération
    @Column({
        // Définit le type de données de la colonne comme une enumération
        type: 'enum',
        // Spécifie les valeurs possibles de l'enumération
        enum: Object.values(Role)
    })
    public declare role: Role;
}
