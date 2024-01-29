"use strict";
// EN INTERNE, c'est caché par nodejs
/**
const exports = {
    maVariable: 1,
    hello: function hello() {
        console.log('hello');
    },
    default: class Hello {}
};
*/
// EN INTERNE
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = exports.maVariable = void 0;
exports.maVariable = 1;
function hello() {
    console.log('hello');
}
exports.hello = hello;
class Hello {
}
exports.default = Hello;