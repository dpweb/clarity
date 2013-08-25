
var server = require('./clarity2.js');

server.use(function(r, s, n){
	console.log('two');
	s.write('two');
	n();
});

server.use(function(r, s, n){
	console.log('th');
	s.end('three');
	console.log('three');
	n();
});

server.use(function(r, s, n){
	console.log('fr');
	s.end('fr');
	console.log('fr');
});
/*
server.get(/\//, function(r, s, n){
	s.end('<a href="/ok?a=1&b=2">test query</a>');
})

server.get(/ok/, function(r, s, n){
	s.end('r.body == ' + JSON.stringify(r.body));
})
*/
server.listen(8080, null, null, function(){
	console.log('ready!', 8080)
});

