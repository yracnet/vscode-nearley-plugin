// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s\n\r\t]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "__$ebnf$1", "symbols": [/[\s\n\r\t]/]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", /[\s\n\r\t]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"]},
    {"name": "main", "symbols": ["_", "expression", "_"], "postprocess": ([ , e, ]) => e},
    {"name": "expression", "symbols": ["number", "_", {"literal":"+"}, "_", "number"], "postprocess": ([a, , _, , b]) => a + b},
    {"name": "expression", "symbols": ["number", "_", {"literal":"-"}, "_", "number"], "postprocess": ([a, , _, , b]) => a - b},
    {"name": "expression", "symbols": ["number", "_", {"literal":"*"}, "_", "number"], "postprocess": ([a, , _, , b]) => a * b},
    {"name": "expression", "symbols": ["number", "_", {"literal":"/"}, "_", "number"], "postprocess": ([a, , _, , b]) => a / b},
    {"name": "number$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$1", "symbols": ["number$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "number", "symbols": ["number$ebnf$1"], "postprocess": d => parseInt(d[0].join(""))}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.dep = grammar;
}
})();
