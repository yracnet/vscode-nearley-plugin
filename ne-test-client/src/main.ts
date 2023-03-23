// Demo!!!!
import { Command } from "commander";
import { commandBuild } from "./command/build";
import { commandRun } from "./command/run";
declare const VERSION: string;

const program = new Command();
program.version(VERSION, "-v, --version");

program
  .command("build")
  .description("Execute command 'nearleyc <source>' and generate ne-test file")
  .argument("<source>", "File ne")
  .argument("[output]", "File js grammar")
  .option("--force", "Force create the .ne-test file", false)
  .action(commandBuild);

program
  .command("run")
  .description("Execute ne-test file with nearley")
  .argument("<source>", "File ne-test")
  .argument("[output]", "File output result")
  .option("--test [test]", "ID or Name of Test Item", "all")
  .action(commandRun);

program.parse(process.argv);
