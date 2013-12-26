module.exports = function(app){
    
    app.use(function(r, s, n){
            s.render = function(t, o){
                o = o || {};
                server.cache[t] = server.cache[t] || fs.readFileSync(t).toString();
                s.end(require('hogan.js').compile(server.cache[t]).render(o));
            }
            n();
    })
    app.use(function(r, s, n){
            s.redirect = function(url){
                s.writeHead(302, {'Location': url });
            }
            n();
    })
    
}