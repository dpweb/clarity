#!/usr/bin/env node
var _ = require('underscore'), fs = require('fs'), app = [], pc = 'http';
    require('colors'); var statics = []; app.static = function(o){statics.push(o)}; app.use = app.push;
function _clarity(options, _fn){

	if(options && options.ssl === 1){
		opts = {
       		key: fs.readFileSync('./'+process.env.ssl+'.key').toString(),
       		cert: fs.readFileSync('./'+process.env.ssl+'.crt').toString(),
       		ca: fs.readFileSync('./'+process.env.ssl+'.intermediate.crt').toString()
   		}
   		pc = 'https';
    } 

    _fn(options, app);

	require(pc).createServer(function (r, s, n) {
	        var stat = _.find(statics, function(key){ return r.url.match(RegExp(key.name+'/?')) });
	        if(stat){
	        	var fn = r.url.replace(stat.name, stat.dir);
	        	if(!r.url.match(/\./)) fn += '/index.html';
	        	console.log(r.url, fn);
	        	if(!fs.existsSync(fn)) return notfound(s);
	        	s.writeHead(200, {'Content-Type': 'text/html' });
	        	s.end(fs.readFileSync(fn).toString());
	        }
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
	        s.endo = s.end;
	        s.end = function(o){
	        	s.endo('object'===typeof(o) ? JSON.stringify(o) : o);
	        }
	        var endf = _.find(app, function(f){ f(r, s) });
	        endf || notfound(s);
	}).listen(process.env.port || 80);
}

function notfound(s){
		s.writeHead(404, {"Content-Type": "text/plain"});
   		s.write("404 Not found");
    	return s.end();
}
__filename !== require.main.filename ? module.exports = _clarity : _clarity();
