const { say } = require('../hello-world/pkg/ssvm_nodejs_starter_lib.js');
console.log( say("Node.js") );

const { solve } = require('../quadratic/pkg/quadratic_lib.js');

console.log( solve([2., 5., -3.]) );
