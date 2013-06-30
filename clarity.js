#!/usr/bin/env node
var _ = require('underscore'), fs = require('fs'), verb = {POST:[], GET:[]}, pc = 'http', require('colors');
function _clarity(options, _fn){

	if(options.ssl === 1){
		opts = {
       		key: fs.readFileSync('./'+process.env.ssl+'.key').toString(),
       		cert: fs.readFileSync('./'+process.env.ssl+'.crt').toString(),
       		ca: fs.readFileSync('./'+process.env.ssl+'.intermediate.crt').toString()
   		}
   		pc = 'https';
    } 

	require(pc).createServer(function (r, s, n) {
	        s.writeHead(200, {'Content-Type': 'text/html' });

	        if(!n && r.method == 'POST'){
	            var fu = arguments.callee;
	            r.on('data', function(data){
	                r.body = require('querystring').parse(data.toString());
	                fu(r, s, 1);
	            })
	            return;
	        }
	        s.render = function(t, o){
	            if(fs.existsSync(t)) t = fs.readFileSync(t).toString();
	            s.end(require("hogan.js").compile(t).render(o));
	        }
	        _.find(verb[r.method], function(f){ f(r, s) })
	}).listen(process.env.port || 80);
}

__filename !== require.main.filename ? module.exports = _clarity : _clarity();
