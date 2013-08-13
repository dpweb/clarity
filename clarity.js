
module.exports = 

{
	uses: [],
	use: function(f){
		this.uses.push(f);
	},
	get: function(url, f){
		this.uses.push(function(r, s){
			if(r.method == 'GET' && r.url.match(url)) f(r, s);
		})
	},
	post: function(url, f){
		this.uses.push(function(r, s){
			if(r.method == 'POST' && r.url.match(url)) f(r, s);
		})
	},
	listen: function(){
		var that = this;
		var svr = require('http').createServer(function(r, s){
			that.uses.map(function(fn){ fn(r, s) })
			s.end();
		});
		svr.listen.apply(svr, [].slice.call(arguments));
	}
}
