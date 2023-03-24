import { readObjectSync, writeObjectSync } from "../lib/help";
import cp from "child_process";
import * as path from "path";
import fs from "fs";
import { performance } from "perf_hooks";
import { createTestExample } from "./init";

export const commandBuild = (source: string, option: any) => {
  if (!source.endsWith(".ne")) {
    console.log('Error: Ne-Build require a file with ".ne" as source.');
    process.exit(1);
  }
  console.log("BUILD");
  console.log("Source  :", source);
  console.log("Option  :", option);
  const {
    output = source.replace(".ne", ".js"),
    target = source.replace(".ne", ".ne-test"),
    force = false,
  } = option;
  let baseName = path.basename(source).replace(".ne", "");
  const start = performance.now();
  cp.execSync(`npx nearleyc ${source} -o ${output} -e ${baseName}`, {
    stdio: "inherit",
  });
  const finish = performance.now();
  const buildTime = new Date(finish - start).toISOString().slice(11, -1);

  if (!fs.existsSync(target) || force) {
    const state = createTestExample(source, output);
    state.config.buildTime = buildTime;
    writeObjectSync(state, target);
  } else {
    let state = readObjectSync(target);
    state.config.buildTime = buildTime;
    writeObjectSync(state, target);
  }
};
