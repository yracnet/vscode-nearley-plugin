// Demo!!!!
import { Command } from "commander";
import { commandBuild } from "./command/build";
import { commandInit } from "./command/init";
import { commandRun } from "./command/run";
declare const VERSION: string;

const program = new Command();
program.version(VERSION, "-v, --version");

program
  .command("init")
  .description("Create the ne-test file from .ne file and .js")
  .argument("<source>", "File ne")
  .option("-o, --output <output>", "Output file, with extension .ne-test")
  .option("-t, --target <target>", "Grammar file, with extension .js")
  .option("-f, --force", "Force create the .ne-test file")
  .action(commandInit);

program
  .command("build")
  .description("Execute command 'nearleyc' and generate ne-test file")
  .argument("<source>", "File ne")
  .option("-o, --output <output>", "Output file js grammar")
  .option("-t, --target <target>", "Output file ne-test")
  .option("-f, --force", "Force create the .ne-test file")
  .action(commandBuild);

program
  .command("run")
  .description("Execute ne-test file with nearley")
  .argument("<source>", "File ne-test")
  .option("-o, --output <output>", "Output file result")
  .option("-i, --item [item]", "ID or Name of Test Item", "all")
  .action(commandRun);

program.parse(process.argv);
