import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./categories";

// Définit que cette classe est une entité qui sera stockée dans la base de données
@Entity()
export class Sound {
    // Déclare une colonne de clé primaire générée automatiquement de type UUID
    @PrimaryGeneratedColumn("uuid")
    public declare id: string;
    
    // Déclare une colonne pour stocker le nom du son
    @Column({
        // Définit la longueur maximale de la chaîne de caractères
        length: 64,
        // Définit que la valeur doit être unique dans la base de données
        unique: true
    })
    public declare name: string;

    // Déclare une colonne pour stocker le chemin du fichier audio
    @Column({
        length: 260
    })
    public declare file: string;

    // Déclare une relation Many-to-One avec l'entité Category
    @ManyToOne(() => Category, (cat) => cat.sounds)
    public declare category: Category;
}
