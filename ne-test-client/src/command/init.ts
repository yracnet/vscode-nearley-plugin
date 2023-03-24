import { writeObjectSync } from "../lib/help";
import fs from "fs";

export const commandInit = (source: string, option: any) => {
  if (!source.endsWith(".ne")) {
    console.log('Error: Ne-Build require a file with ".ne" as source.');
    process.exit(1);
  }
  console.log("INIT");
  console.log("Source  :", source);
  console.log("Option  :", option);
  let {
    // default options
    output = source.replace(".ne", ".ne-test"),
    target = source.replace(".ne", ".js"),
    force = false,
  } = option;
  if (!fs.existsSync(output) || force) {
    const state = createTestExample(source, target);
    writeObjectSync(state, output);
  }
};

declare const VERSION: string;

export const createTestExample = (source, target): any => {
  return {
    version: VERSION,
    created: Date.now().toString(),
    config: {
      source,
      target,
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
};
