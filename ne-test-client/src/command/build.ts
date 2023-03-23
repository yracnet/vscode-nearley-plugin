import { assertNECompiler } from "../lib/assert";
import { readObjectSync, writeObjectSync } from "../lib/help";
import cp from "child_process";
import fs from "fs";
import { performance } from "perf_hooks";

export const commandBuild = (source: string, target: string, option: any) => {
  if (!source.endsWith(".ne")) {
    console.log('Error: Ne-Build require a file with ".ne" as source.');
    process.exit(1);
  }
  const command = assertNECompiler();
  target = target ? target : source.replace(".ne", ".js");
  console.log("BUILD");
  console.log("Command :", command);
  console.log("Source  :", source);
  console.log("Target  :", target);
  console.log("Option  :", option);
  const start = performance.now();
  cp.execSync(`${command} ${source} -o ${target}`, { stdio: "inherit" });
  const finish = performance.now();
  const buildTime = new Date(finish - start).toISOString().slice(11, -1);
  const output = target.replace(".js", ".ne-test");
  if (!fs.existsSync(output) || option.force) {
    const state = {
      config: {
        source,
        target,
        buildTime,
      },
      items: [
        {
          id: "01",
          name: "suma",
          input: " 1 + 2 ",
        },
        {
          id: "02",
          name: "suma2",
          input: " 10 - 100 ",
        },
      ],
    };
    writeObjectSync(state, output);
  } else {
    let state = readObjectSync(output);
    state.config.buildTime = buildTime;
    writeObjectSync(state, output);
  }
};
