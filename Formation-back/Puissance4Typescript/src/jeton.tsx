import React, { useEffect, useMemo, useState } from "react"; // Importe les hooks et le composant React depuis la bibliothèque React

// Définition du type Position
type Position = "absolute" | "relative" | "static" | "fixed";

interface JetonProps { // Définit les propriétés attendues par le composant Jeton
  couleur: string; // Couleur du jeton
  x: number; // Position horizontale du jeton
  y: number; // Position verticale du jeton
}

const tailleJeton = 50; // Définit la taille du jeton en pixels

const Jeton: React.FC<JetonProps> = ({ couleur, x, y }) => { // Définit le composant Jeton en fonction des propriétés JetonProps
  const [shownY, setShownY] = useState(y); // Déclare un état pour stocker la position verticale affichée du jeton

  useEffect(() => { // Utilise l'effet useEffect pour mettre à jour la position verticale affichée du jeton lorsque la position y change
    setShownY(y);
  }, [y]);

  const jetonStyle = useMemo(() => ({ // Utilise useMemo pour calculer le style du jeton de manière efficace
    backgroundColor: couleur, // Couleur de fond du jeton
    top: y * tailleJeton, // Position verticale du jeton
    left: x * tailleJeton, // Position horizontale du jeton
    width: tailleJeton, // Largeur du jeton
    height: tailleJeton, // Hauteur du jeton
    borderRadius: tailleJeton, // Bordure arrondie du jeton
    zIndex: -1, // Ordre de superposition du jeton
    position: "absolute" as Position, // Type de positionnement du jeton
    transform: `translateY(${(shownY - y) * tailleJeton}px)`, // Translation verticale du jeton pour les animations
    transition: `linear ${y * 60}ms` // Transition pour les animations de déplacement du jeton
  }), [couleur, x, y, shownY]); // Dépendances du hook useMemo

  return <div style={jetonStyle} />; // Rendu du composant Jeton avec le style calculé
};

export default Jeton; // Exporte le composant Jeton pour qu'il puisse être utilisé ailleurs dans l'application
