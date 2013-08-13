
var server = require('./clarity.js');

function showurl(r, s){
	console.log('url is', r.url);
	s.write('one');
}

function showhost(r, s){
	console.log('headers.host is', r.headers.host);
	s.write('two');
}

server.use(showurl);
server.use(showhost);

server.get(/\/$/, function(r, s){
	s.end('index!');
})

server.listen(8080);
