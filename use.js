
module.exports = {
    "render": function(r, s, n){
        s.render = function(t, o){
            var cache = {};
            o = o || {};
            cache[t] = cache[t] || fs.readFileSync(t).toString();
            s.end(require('hogan.js').compile(cache[t]).render(o));
        };
    },
    "redirect": function(r, s, n){
        s.redirect = function(r, s, n){
            s.writeHead(302, {'Location': url });
            s.end();
        }
    }
}