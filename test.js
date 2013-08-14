
var server = require('./clarity.js');

function showurl(r, s, n){
	s.write('two');
	n();
}

function showhost(r, s, n){
	s.write('one');
	n();
}

server.use(showurl);
server.use(showhost);

server.post(/ok/, function(r, s, n){
	s.end('index!');
	console.log('params are ', r.body)
	n();
})

server.listen(8080, null, null, function(){
	console.log('ready!')
});

