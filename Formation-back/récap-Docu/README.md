# Recap projet nodejs

`pnpm init` => crée un package.json dans le répertoire courant.
`npm init -y` => crée un package.json dans le répertoire courant.

## Package manager

Sert à installer des packages. comme mongoose, colors, imagejs, tailwind, vite, webpack, ...

`pnpm` et `npm`.

Très peu de différences au niveau des commandes. Généralement pour faire une commande `npm` vous pouvez faire la même en rajoutant le `p` de pnpm devant:

exemple:
```
npm install mongoose
pnpm install mongoose
=> la même chose
```

pnpm => plus récent, il est plus rapide, moins gourmand en espace disque.
npm => plus vieux, le plus de fonctionnalités mais le plus lent.


Lorsque vous voulez coder, vous créez un dossier source `src` dans lesquel vous allez mettre votre code.

## Typescript

Ex: index.ts => un fichier Typescript.

Typescript => c'est une surcouche à javascript qui apporte du Typage à javascript : (type nombre, type string, etc ...).

- Typage explicite: on indique le typage devant la variable
- Typage implicite: typescript devine le typage selon la variable créée.


Pour exécuter le Typescript, il faut le traduire en Javascript.

Pour le traduire il faut un compilateur => `tsc`.
**T**ype**S**cript**C**ompiler qu'il faut installer en faisant `(p)npm i(nstall) -D typescript`.

- `-D` => dépendances de développement
- pas -D => dépendances (production)

Une fois installé, il faut créer un fichier de configuration Typescript pour le projet.

Pour ce faire: `pnpm tsc --init` (`npx tsc --init`). Ce fichier sert à configurer comment Typescript interprète nos fichiers Typescript. (ex: commonjs vs esm).

On va compiler notre projet en faisant `pnpm tsc` ou `npx tsc`.

ça va nous générer une version compilée (traduite) de notre Typescript en Javascript.

ATTENTION: UNE FOIS COMPILE, TOUTE NOTION DE TYPAGE EST PERDUE. Le typage n'existe pas en Javascript.

petite astuce: par défaut tout les fichiers sont générés à côté de leur fichier source. Pour générer les fichiers dans un répertoire séparé `dist`, il faut éditer le tsconfig `compilerOptions.outDir`.

Une fois que l'on refait un `pnpm tsc`|`npx tsc` => ça va tout compiler dans le dossier dist.

Permet d'avoir une séparation claire entre votre code source et ce qui est compilé.

Avec `pnpm`. le `pnpm-lock.yaml` apparait lorsque l'on installe un paquet avec pnpm. ça représente l'arborescence des dépendances. ça évite au package manager de relire toute votre arboresence de fichiers. 
Avec `npm`. Ce sera le `package-lock.json` qui sera généré.

Séparation entre les dépendances de dev (`devDependencies`) et dépendances de production (`dependencies`), vous vous en foutez lorsque vous êtes en production avec votre javascript compilé d'avoir typescript d'installé. à cette étape, il ne sert plus à rien.

Lorsque vous êtes en production, on va indiquer au package manager de n'installer que les packets de production.

`pnpm i --production` ou `npm i --omit=dev`

Cette commande est généralement faite sur le serveur de production lorsque vous copiez votre fichier `dist`.

Pour exécuter notre code compilé :

`node dist/index.js`.

Essayer d'éxécuter le fichier Typescript directement avec node nous donne une erreur car il doit être compilé.

## Scripts package.json

Dans le package.json on a une section scripts. Qui contient des commandes spécifiques à votre projet.

Ces commandes son exécutables avec votre package manager.

`pnpm run <lenomduscript>`
`npm run <lenomduscript>`

à savoir que pnpm essaie d'être intelligent et la commande peut être raccourcie en `pnpm <lenomduscript>`.

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node dist/index.js"
  },
```

## Imports

- mot clé `import` qui permet d'importer quelque chose qui a été `exporté`.
# recap