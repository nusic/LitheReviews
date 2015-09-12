var TicketMap = require('../models/TicketMap.js');

function repl(code){
	console.log(code);
	console.log(eval(code));
}


/* TEST CASE - executing code through repl*/ 
var tm = new TicketMap(1000);

repl("tm.set('some_ticket', 'some_liu_id');");
repl("tm.has('some_ticket');");
repl("tm.getLiuId('some_ticket');");

setTimeout(function(){
	repl("tm.extendLifeTime('some_ticket');");
}, 900);

setTimeout(function(){
	repl("tm.has('some_ticket');");
}, 1500);

setTimeout(function(){
	repl("tm.has('some_ticket');");
}, 2500);




