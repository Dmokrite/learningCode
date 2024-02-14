export function calculLine(
  tableau: readonly (readonly string[])[], // Représente le tableau de jeu
  x: number // Représente la colonne dans laquelle vérifier la ligne
): number | undefined { // Renvoie la position de la ligne vide ou undefined si la colonne est pleine
  const colonne = tableau[x]; // Récupère la colonne du tableau à l'indice x
  if (!colonne) { // Vérifie si la colonne existe
    return undefined; // Si la colonne n'existe pas, retourne undefined
  }
  let y = colonne.length - 1; // Initialise la position y à la dernière ligne du tableau
  while (y >= 0) { // Parcourt les lignes de bas en haut
    if (colonne[y] === "") { // Si la ligne est vide
      return y; // Renvoie la position de la ligne vide
    }
    y--; // Passe à la ligne précédente
  }
}

export function CreateArrayOnPlay(
  tableau: readonly (readonly string[])[], // Représente le tableau de jeu
  x: number, // Représente la colonne dans laquelle placer le jeton
  couleur: string // Représente la couleur du jeton à placer
): [undefined | readonly (readonly string[])[], number] { // Renvoie le nouveau tableau avec le jeton placé et sa position
  const y = calculLine(tableau, x); // Récupère la position y où placer le jeton
  if (y === undefined) { // Si la colonne est pleine
    return [undefined, -1]; // Retourne undefined et -1 pour indiquer que le jeton ne peut pas être placé
  }
  return [ // Retourne le nouveau tableau avec le jeton placé et sa position
    tableau.map((colonne, colonneX) => // Parcourt chaque colonne du tableau
      colonne.map((valeur, ligneY) => { // Parcourt chaque ligne de la colonne
        if (colonneX === x && ligneY === y) { // Si c'est la position où placer le jeton
          return couleur; // Place le jeton de la couleur spécifiée
        }
        return valeur; // Sinon, conserve la valeur existante
      })
    ),
    y // Renvoie la position y où le jeton a été placé
  ];
}

export function verifyWinner(
  tableau: readonly (readonly string[])[] // Représente le tableau de jeu
): string | undefined { // Renvoie la couleur du gagnant ou undefined s'il n'y a pas de gagnant
  for (const couleur of ["yellow", "red"]) { // Parcourt chaque couleur de jeton
    // Vérifie les diagonales de bas-gauche à haut-droite.
    for (let position = 0; position < 4; position++) { // Parcourt les positions de départ possibles
      for (let étage = 5; étage > 2; étage--) { // Parcourt les étages possibles
        if ( // Vérifie si une diagonale de bas-gauche à haut-droite est complète
          tableau[position][étage] === couleur &&
          tableau[position + 1][étage - 1] === couleur &&
          tableau[position + 2][étage - 2] === couleur &&
          tableau[position + 3][étage - 3] === couleur
        ) {
          return couleur; // Renvoie la couleur du gagnant
        }
      }
    }

    // Vérifie les diagonales de haut-gauche à bas-droite.
    for (let position = 0; position < 4; position++) {
      for (let étage = 0; étage < 3; étage++) {
        if (
          tableau[position][étage] === couleur &&
          tableau[position + 1][étage + 1] === couleur &&
          tableau[position + 2][étage + 2] === couleur &&
          tableau[position + 3][étage + 3] === couleur
        ) {
          return couleur;
        }
      }
    }

    // Vérifie les horizontales de gauche à droite.
    for (let position = 0; position < 4; position++) {
      for (let étage = 0; étage < 6; étage++) {
        if (
          tableau[position][étage] === couleur &&
          tableau[position + 1][étage] === couleur &&
          tableau[position + 2][étage] === couleur &&
          tableau[position + 3][étage] === couleur
        ) {
          return couleur;
        }
      }
    }

    // Vérifie les verticales de bas en haut.
    for (let position = 0; position < 7; position++) {
      for (let étage = 5; étage > 2; étage--) {
        if (
          tableau[position][étage] === couleur &&
          tableau[position][étage - 1] === couleur &&
          tableau[position][étage - 2] === couleur &&
          tableau[position][étage - 3] === couleur
        ) {
          return couleur;
        }
      }
    }
  }
}

export function otherColor(couleur: string): string { // Renvoie la couleur opposée
  if (couleur === "yellow") { // Si la couleur est jaune
    return "red"; // Renvoie rouge
  }
  return "yellow"; // Sinon, renvoie jaune
}

// Ajout de la fonction chooseCorrectly si nécessaire
export function chooseCorrectly(tableau: readonly (readonly string[])[]): number { // Choix de colonne aléatoire
  return Math.floor(Math.random() * tableau.length); // Renvoie un nombre aléatoire entre 0 et la longueur du tableau
}
