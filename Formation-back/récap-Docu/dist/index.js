"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faux_module_1 = require("./faux-module");
console.log('import moustache', faux_module_1.hello);
// ça c'est la syntaxe d'import par défaut.
const faux_module_2 = __importDefault(require("./faux-module"));
console.log('import default', faux_module_2.default);
// pour importer TOUT le contenu qui est exporté par le module
const exportsDuModule = __importStar(require("./faux-module"));
console.log('import de tout', exportsDuModule);
const colors_1 = require("colors");
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
// typage explicite
const friteuseTypee = {
    name: 'friteuse',
    temperature: 180,
    content: []
};
console.log((0, colors_1.green)('Hello'));