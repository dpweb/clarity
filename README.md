clarity
=======

Web server for NodeJS. Takes the best features of Connect/Express - req/res pipelining, in a minimal codebase. 50 lines pure-JS. No dependencies. 5-6 MB runtime footprint.

Where you are used to seeing 'req' and 'res' for the request and response objects, we just use 'r' and 's' in the examples below.

####Example
````
var server = require('./clarity.js'); 

server.post(/dopost$/, function(r, s, n){
        console.log('All the post vars are', r.body);
        n();
})

server.get(/flava\.js/, function(r, s, n){
        s.render('./flava.js');
})

server.cache = {};
server.use(function(r, s, n){
        s.render = function(t, o){
            o = o || {};
            server.cache[t] = server.cache[t] || fs.readFileSync(t).toString();
            s.end(require('hogan.js').compile(server.cache[t]).render(o));
        }
        n();
})

server.listen(80);
````

####.use(function(r,s,n){...})
Every function you pass to use, is added to the pipeline. So you can modify req and res, for instance
adding functions to the response object, or just printing requests to console.
````
server.use(function(r, s, n){
        s.render = function(t, o){
            o = o || {};
            server.cache[t] = server.cache[t] || fs.readFileSync(t).toString();
            s.end(require('hogan.js').compile(server.cache[t]).render(o));
        }
        n();
})

server.use(function(r, s, n){
        console.log('Someone requested '+ r.url);
        n();
})
````

####.get(/match/, function(r,s,n){...})
####.post(/match/, function(r,s,n){...})
####.verb(httpverb, /match/, function(r,s,n){...})
####.listen(port, [hostname], [backlog], [callback]) 
Same params as 
<a target=_ href='http://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback'>http server</a>    

####.static(url to match, folder to serve)
Direct a URL to serve html in statically from a folder
````
clarity.static(/\/js/, './static');
````

####r.body
Which is accessible in any function and contains combined GET and POSTed variables.      
Posting origins=NY&destinations=CA in the POST body to http://localhost/?q=1 results in..

````
// r.body = 
{
	"q": "1",
	"origins": "NY",
	"destinations": "CA"
}
````

####r.params
Capture url using regex

````
http://server/api/sendEmail

server.get(/api\/.*$/, function(r, s, n){
    r.param[1] // sendEmail
}
````

####debugging info
````
$ debugclarity=1 node myapp.js
````
