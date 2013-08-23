
var clarity = {
	chain: function(r, s, n){
		s.end();
	},
	use: function (){
		var that = this;
		[].map.call(arguments, function(f){
			that.chain = (function(nxt){
				return function(r, s, n){
					f(r, s, nxt.bind(this, r, s));
				}
			})(that.chain);
		})
	},
	verb: function (vrb, url, f){
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
		// Get query or post data - 1st to run
		this.use(function (r, s, n){
			s.setHeader("Content-Type", "text/html");
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
		var svr = require('http').createServer(clarity.chain);
		svr.listen.apply(svr, [].slice.call(arguments));
	}
}

module.exports = clarity;