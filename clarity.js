var fs = require('fs'),
	path = require('path'),
	debug = process.env.debug;

var clarity = {
	chain: function(r, s, n){
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
		this.use(function(r, s, n){
			if(debug) console.log('<=', r.url, url);
			r.params = r.url.match(url);
			if(r.method == vrb && r.url.match(url)){
				if(debug) console.log('== handling', r.url);
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
	},
	cache:{},
	static: function(url, dir){
		var that = this;
		this.verb('GET', url, function(r, s, n){
			var spath = dir + '/' + path.basename(r.url);
			if(!that.cache[spath]) 
				 that.cache[spath] = fs.readFileSync(spath).toString();
			if(debug) console.log('=>', that.cache[spath]);
			s.write(that.cache[spath]);
			n();
		})
	}
}

module.exports = clarity;
