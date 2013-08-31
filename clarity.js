var debug = process.env.loglevel;

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
		if(debug) console.log(vrb, url)
		this.use(function(r, s, n){
			if(r.method == vrb && r.url.match(url)){
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
	}
}

module.exports = clarity;