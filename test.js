
var server = require('./clarity.js');

function pipeline2(r, s, n){
	console.log('two');
	n();
}
function pipeline1(r, s, n){
	console.log('one');
	n();
}

server.get(/\//, function(r, s, n){
	s.end('<a href="/ok?a=1&b=2">test query</a>');
})

server.get(/ok/, function(r, s, n){
	s.end('r.body == ' + JSON.stringify(r.body));
})
server.use(pipeline2, pipeline1);

server.listen(8080, null, null, function(){
	console.log('ready!', 8080)
});

