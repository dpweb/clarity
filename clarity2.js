log = console.log;

var chain = function(fn) {
    var queue = fn ? [fn] : [], index = 0, req, res;
    var run = function(r, s) {
        req = req || r; res = res || s;
        if (index < queue.length) {
            queue[index++](req, res, run);
        }    
    };

    return {
        use: function(fn) {
            queue.push(fn);    
        },
        run: run
    };
};

var c = chain();
c.use(function(r, s, n) {log(r, s, 1); n();});
c.use(function(r, s, n) {log(r, s, 2); });
c.use(function(r, s, n) {log(r, s, 3); n();});
c.use(function(r, s, n) {log(r, s, 4); n();});

c.run("req", "res");