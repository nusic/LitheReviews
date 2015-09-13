var TicketMap = require('../models/TicketMap.js');

function repl(code){
	console.log(code);
	console.log(eval(code));
}


/* TEST CASE - executing code through repl*/ 
var tm = new TicketMap({
	lifeTimeInMillis: 1000,
	verbose: true
});

console.log('->', tm.set('some_ticket', 'some_liu_id'));
console.log('->', tm.has('some_ticket'));
console.log('->', tm.getLiuId('some_ticket'));

setTimeout(function(){
	console.log('->', tm.extendLifeTime('some_ticket'));
}, 900);

setTimeout(function(){
	console.log('->', tm.has('some_ticket'));
}, 1500);

setTimeout(function(){
	console.log('->', tm.has('some_ticket'));
}, 2500);




