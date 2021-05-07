// params
const [, , fileInput, fileOutput] = process.argv
console.log("Run Grammar Test  : ", fileInput)

// instance
const fs = require('fs');
const nearley = require("nearley");

const rawdata = fs.readFileSync(fileInput);
let config = JSON.parse(rawdata);

const grammar = require(config.grammar);

config.start = new Date();
config.tests = config.tests
    .map(test => {
        if (test.id === config.execute || config.execute === 'ALL') {
            const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
            console.log('Execute: ', test.name);
            test.start = new Date();
            test.status = 'success'
            test.results = []
            test.error = ''
            try {
                parser.feed(test.content);
                test.results = parser.results
            } catch (error) {
                test.error = error.toString()
                test.status = 'error'
            }
            console.log('Result: ', test.results);
            console.log('Error: ', test.error);
            test.finish = new Date();
        }
        return test;
    })
config.finish = new Date();

const data = JSON.stringify(config, null, 2)
if (fileOutput) {
    fs.writeFileSync(fileOutput, data);
}
