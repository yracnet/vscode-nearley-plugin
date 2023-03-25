# NE-Test Cli

ne-test is a clie for work with "Nearley Plugin" in VSCode, it used for read and execute nearley grammar file.

## File .ne-test

The file structure is simple:

Config has the files to execute in `nearleyc ${config.source} -o ${config.target}`

Items has the list of test, input and output values for grammar file evaluation.

```json
{
  "config": {
    "source": "src/calc/calc.ne",
    "target": "src/calc/calc.js",
    "buildTime": "00:00:00.910",
    "runTime": "00:00:00.002"
  },
  "items": [
    {
      "id": "01",
      "name": "suma",
      "input": " 1 + 2 + 3",
      "open": true,
      "output": [6],
      "traces": [],
      "status": "success",
      "runTime": "00:00:00.000"
    }
  ]
}
```

## Commands

```bash
npx ne-test
Usage: ne-test [options] [command]

Options:
  -v, --version             output the version number
  -h, --help                display help for command

Commands:
  init [options] <source>   Create the ne-test file from .ne file and .js
  build [options] <source>  Execute command 'nearleyc' and generate ne-test file
  run [options] <source>    Execute ne-test file with nearley
  help [command]            display help for command
```

```bash
npx ne-test init -h
Usage: ne-test init [options] <source>

Create the ne-test file from .ne file and .js

Arguments:
  source                 File ne

Options:
  -o, --output <output>  Output file, with extension .ne-test
  -t, --target <target>  Grammar file, with extension .js
  -f, --force            Force create the .ne-test file
  -h, --help             display help for command
```

```bash
npx ne-test build -h
Usage: ne-test build [options] <source>

Execute command 'nearleyc' and generate ne-test file

Arguments:
  source                 File ne

Options:
  -o, --output <output>  Output file js grammar
  -t, --target <target>  Output file ne-test
  -f, --force            Force create the .ne-test file
  -h, --help             display help for command
```

```bash
npx ne-test run -h
Usage: ne-test run [options] <source>

Execute ne-test file with nearley

Arguments:
  source                 File ne-test

Options:
  -o, --output <output>  Output file result
  -i, --item [item]      ID or Name of Test Item (default: "all")
  -h, --help             display help for command
```
