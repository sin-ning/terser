this_binding_conditionals: {
    options = {
        conditionals: true,
        evaluate: true,
        side_effects: true,
    };
    input: {
        (1 && a)();
        (0 || a)();
        (0 || 1 && a)();
        (1 ? a : 0)();

        (1 && a.b)();
        (0 || a.b)();
        (0 || 1 && a.b)();
        (1 ? a.b : 0)();

        (1 && a[b])();
        (0 || a[b])();
        (0 || 1 && a[b])();
        (1 ? a[b] : 0)();

        (1 && eval)();
        (0 || eval)();
        (0 || 1 && eval)();
        (1 ? eval : 0)();
    }
    expect: {
        a();
        a();
        a();
        a();

        (0, a.b)();
        (0, a.b)();
        (0, a.b)();
        (0, a.b)();

        (0, a[b])();
        (0, a[b])();
        (0, a[b])();
        (0, a[b])();

        (0, eval)();
        (0, eval)();
        (0, eval)();
        (0, eval)();
    }
}

this_binding_collapse_vars: {
    options = {
        collapse_vars: true,
        toplevel: true,
        unused: true,
    };
    input: {
        var c = a; c();
        var d = a.b; d();
        var e = eval; e();
    }
    expect: {
        a();
        (0, a.b)();
        (0, eval)();
    }
}

this_binding_side_effects: {
    options = {
        side_effects: true,
    }
    input: {
        (function (foo) {
            (0, foo)();
            (0, foo.bar)();
            (0, eval)('console.log(foo);');
        }());
        (function (foo) {
            var eval = console;
            (0, foo)();
            (0, foo.bar)();
            (0, eval)('console.log(foo);');
        }());
    }
    expect: {
        (function (foo) {
            foo();
            (0, foo.bar)();
            (0, eval)('console.log(foo);');
        }());
        (function (foo) {
            var eval = console;
            foo();
            (0, foo.bar)();
            (0, eval)('console.log(foo);');
        }());
    }
}

this_binding_sequences: {
    options = {
        sequences: true,
        side_effects: true,
    }
    input: {
        console.log(typeof function() {
            return eval("this");
        }());
        console.log(typeof function() {
            "use strict";
            return eval("this");
        }());
        console.log(typeof function() {
            return (0, eval)("this");
        }());
        console.log(typeof function() {
            "use strict";
            return (0, eval)("this");
        }());
    }
    expect_stdout: [
        "object",
        "undefined",
        "object",
        "object",
    ]
}
