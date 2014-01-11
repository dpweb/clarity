var fs = require('fs'),
	path = require('path'),
	debug = process.env.debugclarity;

if(debug) console.log('CLARITY DEBUGGING');

var clarity = {
	chain: function(r, s, n){
		if(debug) console.log('CLARITY COMPLETE REQ PROCESSING');
		s.end();
	},
	use: function (f){
		this.chain = (function(nxt){
			return function(r, s, n){
				f(r, s, nxt.bind(this, r, s));
			}
		})(this.chain);
	},
	verb: function (vrb, url, f){
		if(debug) console.log('CLARITY NEW VERB', vrb, url);
		this.use(function(r, s, n){
			if(debug) console.log('<=', r.url);
			if(typeof url === 'string'){
				var key = url.split(':');
				if(key.length > 1){
						r.params = {};
						r.params[key[1]] = r.url.replace(key[0], '');
						var murl = key[0];
						r.url = r.url.split(':')[0];
						console.log(':', r.params);
				} else {
					r.params = r.url.match(url);
	                if(r.params && r.params.length) r.params.shift();
				}
			}
			console.log('attempting match with', murl || url);
			if(r.method == vrb && r.url.match(murl || url)){
				if(debug) console.log('== handling', r.url, r.params);
				f(r, s, n);
			} else {
				n();
			}
		})
	},
	get: function (url, f){
		this.verb('GET', url, f);
	},
	post: function (url, f){
		this.verb('POST', url, f);
	},
	listen: function (){
		// Get query or post data
		this.use(function (r, s, n){
			r.body = require('url').parse(r.url, true).query,
			r.postbody = '';
		    r.on('data', function (data) {
		        r.postbody += data;
		    });
		    r.on('end', function(){
		    	var o = require('querystring').parse(r.postbody);
		    	for(i in o) r.body[i] = o[i];
		    	n();
		    });
		})
		var svr = require('http').createServer(this.chain);
		svr.listen.apply(svr, [].slice.call(arguments));
		this.http =svr;
		return this
	},
	cache:{},
		static: function(dir){
			var thatdir = dir, that = this; paths = path;
			this.use(function(r, s, n){
				if(r.url == '/') r.url = '/index.html';
				var path = paths.dirname(require.main.filename) + '/' + thatdir + r.url;
				if(debug) console.log('Checking for static');
				if(debug || !that.cache[path]){
					if(fs.existsSync(path)){
						if(debug) console.log('loading', path);
						that.cache[path] = fs.readFileSync(path);
					} else {
						if(debug) console.log('not found', path);
						n();
					}
				}
				s.end(that.cache[path]);
				n();
			})
		}
}

function start(args){
	var port = args[0] || 80;
	clarity.static(/./, '.');
	console.log('Starting clarity on', port);
	clarity.listen(port);
}

__filename !== require.main.filename ? module.exports = clarity : start(process.argv.slice(2));