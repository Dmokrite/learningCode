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

export const maVariable = 1;

export function hello() {
    console.log('hello');
}

export default class Hello {}