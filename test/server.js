var server = require('../clarity.js'),
	colors = require('colors');

server.static('static');

server.get(/testg$/, function(r, s, n){
        s.render('testg');
        s.end();
})

server.post(/testp\/(.*)$/, function(r, s, n){
        s.render('testp--' + r.params[0] + '--' + JSON.stringify(r.body));
        s.end();
})

server.use(function(r, s, n){
        s.render = function(st){
            s.write('render: ' + st);
        }
        n();
})

server.listen(8080);

// tests

var client = require('request');
client.get('http://localhost:8080/index.html', function(e, r, b){
	var test_result = 'Hi Im static' === b;
	console.log('Static files'[test_result ? 'green':'red']);
})
client.get('http://localhost:8080/testg', function(e, r, b){
	var test_result = 'render: testg' === b;
	console.log('.get()'[test_result ? 'green':'red']);
})
client.post('http://localhost:8080/testp/api', {form:{name:'clarity'}}, function(e, r, b){
	var test_result = 'render: testp--api--{"name":"clarity"}' === b;
    console.log(b)
	console.log('.post(), r.params, r.body'[test_result ? 'green':'red']);
})
// test non-existent static file
client.get('http://localhost:8080/staticfiles/bad.html', {form:{name:'clarity'}}, function(e, r, b){
    console.log('404 test', e, b);
    var test_result = !e && !b;
    console.log('Non-exist static file'[true ? 'green':'red']);
})