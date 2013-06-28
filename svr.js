#!/usr/bin/env node
require('colors');
function _clarity(options, _fn){

	var _ = require('underscore'), fs = require('fs');

	options = options || process.env;
	options.shell = options === 1 ? 1 : 0;

	_.defaults(options, {ssl: null})

	var app = {}; app.stack = []; app.use = function(f){app.stack.push(f)};

	app.use(function(){
		// get post
	})

	if(options.ssl === 1){
		opts = {
       		key: fs.readFileSync('./'+process.env.ssl+'.key').toString(),
       		cert: fs.readFileSync('./'+process.env.ssl+'.crt').toString(),
       		ca: fs.readFileSync('./'+process.env.ssl+'.intermediate.crt').toString()
   		}
    } 
    
    var opts = opts || {};
    var server = require('http' + (options.ssl == 1 ? 's':'')).createServer(opts, function (r, s) {
		s.writeHead(200, {'Content-Type': 'text/plain' });
		_.each(app.stack, function(f){
			f(r, s);
		});
		s.end('');
	}).listen(options.port || options.ssl == 1 ? 443:80);

	console.log(server.address());
	_fn(options, app);

	if(options.debug) console.log(options);
}

__filename !== require.main.filename ? module.exports = _clarity : _clarity();

// call like this
// require('clarity')(options, )
// OR
// $ clarity
// OR
// $ port=3000 ssl=1 clarity
