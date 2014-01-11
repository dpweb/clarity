
process.env.debugclarity = 1;

server = require('./clarity.js'),
uses = require('./use.js'),
colors = require('colors');

server.use(uses.render);
server.use(uses.redirect);
server.static('.');

server.listen(80);

/*tests
var client = require('request');

client.get('http://localhost/index.html', function(e, r, b){
	var test_result = 'Hi Im static' === b;
	console.log('Static files'[test_result ? 'green':'red']);
})
client.get('http://localhost/testg', function(e, r, b){
	var test_result = 'render: testg' === b;
	console.log('.get()'[test_result ? 'green':'red']);
})
client.post('http://localhost/testp/api', {form:{name:'clarity'}}, function(e, r, b){
	var test_result = 'render: testp--api--{"name":"clarity"}' === b;
    console.log(b)
	console.log('.post(), r.params, r.body'[test_result ? 'green':'red']);
})
// test non-existent static file
client.get('http://localhost/staticfiles/bad.html', {form:{name:'clarity'}}, function(e, r, b){
    console.log('404 test', e, b);
    var test_result = !e && !b;
    console.log('Non-exist static file'[true ? 'green':'red']);
})*/