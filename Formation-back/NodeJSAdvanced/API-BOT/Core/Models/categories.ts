import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Sound } from "../Models/sounds";

// Définit que cette classe est une entité qui sera stockée dans la base de données
@Entity()
export class Category {
    // Déclare une colonne de clé primaire générée automatiquement de type UUID
    @PrimaryGeneratedColumn("uuid")
    public declare id: string;

    // Déclare une colonne pour stocker le nom de la catégorie
    @Column({
        // Définit que la valeur doit être unique dans la base de données
        unique: true,
        // Définit la longueur maximale de la chaîne de caractères
        length: 32
    })
    public declare name: string;

    // Déclare une relation One-to-Many avec l'entité Sound
    @OneToMany(() => Sound, (sound) => sound.category)
    public declare sounds: Sound[];
}
