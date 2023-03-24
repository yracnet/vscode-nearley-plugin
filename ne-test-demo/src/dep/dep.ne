@include "./lib.ne"

main -> _ expression _ {% ([ , e, ]) => e %}

expression -> number _ "+" _ number {% ([a, , _, , b]) => a + b %}
			| number _ "-" _ number {% ([a, , _, , b]) => a - b %}
			| number _ "*" _ number {% ([a, , _, , b]) => a * b %}
			| number _ "/" _ number {% ([a, , _, , b]) => a / b %}

number -> [0-9]:+ {% d => parseInt(d[0].join("")) %}
