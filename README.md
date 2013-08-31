clarity
=======

Web server for NodeJS. Takes the best features of Connect/Express - req/res pipelining, in a minimal codebase.

50 lines pure-JS. No dependencies. 5-6 MB runtime footprint.

Where you are used to seeing 'req' and 'res' for the request and response objects, we just use 'r' and 's' in the examples below.

####Example
````
var server = require('./clarity.js'); 

server.post(/dopost$/, function(r, s, n){
        var site = sites[r.headers.host.split(':')[0]], post = r.body;
        post.date = _today();
        if(!post.anchor.match(/^\//)) post.anchor = '/' + post.anchor;
        site.posts.unshift(post);
        server.postq.map(function(fn){ fn(site, post) });
        s.redirect('/');
        n();
})

server.get(/flava\.js/, function(r, s, n){
        s.render('./flava.js');
})

server.use(function(r, s, n){
        s.render = function(t, o){
            o = o || {};
            server.cache[t] = server.cache[t] || fs.readFileSync(t).toString();
            s.end(require('hogan.js').compile(server.cache[t]).render(o));
        }
        n();
})

server.get(/loaderio/, function(r, s, n){
        var f = fs.readFileSync('./loaderio-9251122b30907a8cc34519fcfe6d1f64.txt');
        s.end(f);
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
Start the server.

####Couple things..

Functions you add during .use() are last in, first executed on a new request

You must use <b>n()</b> at the end of your .use() functions, if the request will need to continue processing.    

This is maybe the best part.  Easy access to GET and POST vars. There is a 'built-in' function.
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
