require('http').createServer(function(r, s){
	[showurl, showhost].map(function(fn){ fn(r, s) })
	s.end();
}).listen(80);

function showurl(r, s){
	console.log('url is', r.url);
	s.write('one');
}

function showhost(r, s){
	console.log('headers host is', r.headers.host);
	s.write('two');
}