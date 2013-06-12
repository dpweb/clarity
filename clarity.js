var clarity = function(port, extend){
    var app = {
  	routes: [], filters: [],
		all: function(rx, fn){
			this.routes.push({rx: rx, fn: fn});
		},
		use: function(fn){
			this.filters.push(fn);
		},
		port: port
	}
	
	require('http').createServer(function(req, res) {
    	res.setHeader('access-control-allow-origin', '*');
    	var fin = false;
    	app.filters.forEach(function(filter){
    			filter(req, res);
    	})
	    app.routes.forEach(function(rt){
	    		if(req.url.match(rt.rx)){
	    			rt.fn(req, res);
	    			fin = !fin;
	    		}
	    })
	    if(!fin) res.end('');
	}).listen(app.port);
	console.log('listening on '+app.port);
	return app;
}

var app = clarity(8642);
app.use(function(r, s, cb){
	    	if(r.method == 'POST'){
	    		var postdata;
	        	r.on('data', function(data) {
	    			postdata += data;
	    		})
	    		r.on('end', function() {
	            	cb(require('querystring').parse(postdata));
	        	})
	    	}
    
} })
