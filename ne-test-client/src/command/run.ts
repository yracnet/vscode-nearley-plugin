import nearley from "nearley";
import path from "path";
import { performance } from "perf_hooks";
import { readObjectSync, writeObjectSync } from "../lib/help";

export const commandRun = (source: string, output: string, option: any) => {
  console.log("RUN");
  if (!source.endsWith(".ne-test")) {
    console.log('Error: Ne-Run require a file with ".ne-test" as source.');
    process.exit(1);
  }
  output = output ? output : source.replace(".ne-test", ".ne-out");
  console.log("Source  :", source);
  console.log("Output  :", output);
  console.log("Option  :", option);
  try {
    let state = readObjectSync(source);
    state = executeTest(state.config, state.items, option.test);
    writeObjectSync(state, output);
  } catch (error) {
    console.log("Error   :", error);
  }
};

const executeTest = (config, items, test) => {
  console.log("Grammar :", config.target);
  const grammarFile = path.resolve(config.target);
  const grammarInstance = require(grammarFile);
  const grammar = nearley.Grammar.fromCompiled(grammarInstance);
  const start = performance.now();
  items = items.map((item) => {
    if (item.id === test || item.name === test || test === "all") {
      item = executeItem(item, grammar);
    }
    return item;
  });
  const finish = performance.now();
  config.runTime = new Date(finish - start).toISOString().slice(11, -1);
  return { config, items };
};

const executeItem = (item, grammar) => {
  // const nearley = assertNELibary();
  const parser = new nearley.Parser(grammar, { keepHistory: item.trace });
  console.log("Execute :", item.name, ":", item.id);
  console.log("Content :", item.input);
  const start = performance.now();
  try {
    parser.feed(item.input);
    item.output = parser.results;
    item.traces = item.trace ? assertTraces(parser.table, item) : [];
    item.status = "success";
  } catch (error) {
    item.status = "error";
    item.output = [error.toString()];
    item.traces = item.trace ? assertTraces(parser.table, item) : [];
  }
  const finish = performance.now();
  item.runTime = new Date(finish - start).toISOString().slice(11, -1);
  console.log("Status  :", item.status);
  console.log("Output  :", item.output);
  return item;
};

const assertTraces = (table, item) => {
  return table.map((column, index) => ({
    index,
    charAt: item.input[index],
    rules: column.states.map(
      (state, stateIndex) => stateIndex + ": " + state.toString()
    ),
  }));
};
