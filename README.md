clarity
=======

A Web server. Takes the best features of Connect/Express - in a minimal codebase.

####.use(function(r,s,n){...})
####.get(/match/, function(r,s,n){...})
####.post(/match/, function(r,s,n){...})
####.verb(verb, /match/, function(r,s,n){...})
####.listen(port, [hostname], [backlog], [callback]) 
Same params as <a href='http://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback'>http.createServer</a>

Couple things..

Functions you add during .use() are last in, first executed on a new request

####r.body 
Is a JSON object that will show combines POST parameters and GET parameters, for instance..

Posting origins=NY&destinations=CA in the POST body to http://localhost/?q=1 results in..

````
{
	"q": "1",
	"origins": "NY",
	"destinations": "CA"
}
````

####example
````
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
````