var server = require('../clarity.js'),
	colors = require('colors');

server.get(/testg$/, function(r, s, n){
        s.render('testg');
        s.end();
})

server.post(/testp\/(.*)$/, function(r, s, n){
        s.render('testp--' + r.params[1] + '--' + JSON.stringify(r.body));
        s.end();
})

server.use(function(r, s, n){
        s.render = function(st){
            s.write('render: ' + st);
        }
        n();
})

server.static(/\/staticfiles/, 'static');
server.listen(8080);

// tests

var client = require('request');
client.get('http://localhost:8080/staticfiles/index.html', function(e, r, b){
	var test_result = 'Hi Im static' === b;
	console.log('Static files'[test_result ? 'green':'red']);
})

client.get('http://localhost:8080/testg', function(e, r, b){
	var test_result = 'render: testg' === b;
	console.log('.get()'[test_result ? 'green':'red']);
})

client.post('http://localhost:8080/testp/api', {form:{name:'clarity'}}, function(e, r, b){
	var test_result = 'render: testp--api--{"name":"clarity"}' === b;
	console.log('.post(), r.params, r.body'[test_result ? 'green':'red']);
})