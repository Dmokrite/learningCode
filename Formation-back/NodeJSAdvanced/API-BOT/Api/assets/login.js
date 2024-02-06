// Sélectionne le formulaire dans le document HTML
const form = document.querySelector("form");

// Ajoute un écouteur d'événement pour le soumission du formulaire
form.addEventListener("submit", async function (e) {
    // Empêche le comportement par défaut du formulaire (rechargement de la page)
    e.preventDefault();
    
    // Crée un objet FormData à partir des données du formulaire
    const data = new FormData(this);
    // Récupère les valeurs des champs username et password
    const username = data.get('username');
    const password = data.get('password');

    // Envoie une requête POST au serveur pour l'authentification
    const response = await fetch("http://localhost:8081/auth/login", {
        method: 'POST',
        // Convertit les données en JSON et les envoie dans le corps de la requête
        body: JSON.stringify({
            username,
            password
        }),
        // Inclut les informations d'authentification (cookies, etc.)
        credentials: 'include',
        // Définit le type de contenu de la requête comme JSON
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Vérifie si la réponse du serveur n'est pas un succès (code différent de 200)
    if (response.status !== 200) {
        // Sélectionne l'élément avec l'ID "errors" dans le document HTML
        const errorsP = document.querySelector("#errors");

        // Affiche un message d'erreur dans cet élément
        errorsP.innerHTML = "L'utilisateur ou le mot de passe est incorrect";
        return;
    }

    // Si la réponse du serveur est un succès, traite les données JSON retournées
    const json = await response.json();

    // Stocke le jeton d'accès (accessToken) dans le stockage local du navigateur
    localStorage.setItem("accessToken", json.accessToken);

    // Redirige l'utilisateur vers la page "/sounds/list"
    location.href = "/sounds/list";
});
