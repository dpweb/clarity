
require('./svr.js')(null, function(options, app){
	app.use(function(r, s){
		s.end('o2k');
	});
})