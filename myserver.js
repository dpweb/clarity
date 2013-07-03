require('./clarity.js')({}, function(options, app){
	 
	 app.push(function(r, s){
	 	 console.log('a');
	 	 //return true
	 })

	 app.static({name:'/', dir:'.'});

})