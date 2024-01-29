import { hello } from "./faux-module";

console.log('import moustache', hello);

// ça c'est la syntaxe d'import par défaut.
import Hello from "./faux-module";

console.log('import default', Hello);

// pour importer TOUT le contenu qui est exporté par le module
import * as exportsDuModule from './faux-module';

console.log('import de tout',exportsDuModule);

import { green } from "colors";

// inféré : le type est automagiquement dédui de l'objet qui est créé.
const friteuse = {
    name: 'jacqueline',
    temperature: 200,
    content: [
        {
            type: 'frites',
            quantity: 200
        },
        {
            type: 'croquettes',
            quantity: 100
        }
    ]
};

// déstructuration
const { name, temperature } = friteuse;



type Friteuse = {
    name: string,
    temperature: number,
    // tableau d'objets
    content: {
        type: string,
        quantity: number
    }[]
}

// typage explicite
const friteuseTypee : Friteuse = {
    name: 'friteuse',
    temperature: 180,
    content: []
}

console.log(green('Hello'));
