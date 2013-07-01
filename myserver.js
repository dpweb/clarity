require('./clarity.js')(options, function(app){
	 
	 app.use(function(r, s){
	 	 console.log('a');
	 	 //return true
	 })

	 app.static({name:'/', dir:'.'});

})