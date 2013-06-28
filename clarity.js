require('colors');

function qs(){

	var _ = require('underscore');

	if(!options) options = process.env;
	_.defaults(options, {ssl: null})

	var app = {}; app.stack = [], app.use = app.stack.push;

	app.use(function(r, s){
		s.me = 1;
	})

	app.use(function(r, s){
		s.me++;
	})

	var server = require('http' + (options.ssl == 1 ? 's':'')).createServer(function (r, s) {
		_.each(app.stack, function(f){
			f(r, s);
		});
	  	s.writeHead(200, {'Content-Type': 'text/plain'});
	  	console.log(s.me);
	}).listen(options.port || options.ssl == 1 ? 443:80);

	console.log(server.address().green);
	if(options.debug) console.log(options);
}
qs();
