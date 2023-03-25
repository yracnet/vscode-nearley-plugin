import { writeFileSync } from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { ReactEditorProvider, VSCReducer } from "./ReactEditorProvider";
import { createEditorConfig, getVscodeTerminal } from "./util";

const reducer: VSCReducer<string> = (
  fileName,
  content,
  action,
  postMessage
) => {
  const { type, value, payload } = action;
  //@ts-ignore
  const rootPath = vscode.workspace.rootPath || "./";
  const fileRelative = vscode.workspace.asRelativePath(fileName);

  if (type === "editor:load") {
    postMessage({ type: "document:open", payload: content });
  } else if (type === "editor:change") {
    content = payload;
  } else if (type === "run:build") {
    writeFileSync(fileName, payload);
    const state: any = JSON.parse(payload);
    const source = path.resolve(rootPath, state.config.source);
    const target = path.resolve(rootPath, state.config.target);
    const terminal = getVscodeTerminal();
    terminal.show(true);
    terminal.sendText(`npx ne-test build '${source}' -o '${target}'`);
  } else if (type === "run:all") {
    writeFileSync(fileName, payload);
    const terminal = getVscodeTerminal();
    terminal.show(true);
    terminal.sendText(`npx ne-test run '${fileRelative}' -o '${fileRelative}'`);
  } else if (type === "run:item") {
    writeFileSync(fileName, payload);
    const terminal = getVscodeTerminal();
    terminal.show(true);
    terminal.sendText(
      `npx ne-test run '${fileRelative}' -o '${fileRelative}' -i ${value}`
    );
  } else {
    // console.log(">>>>VSCODE_REDUCER_SKIP: ", type);
  }
  return content;
};

export const neTestViewType = "nearley-plugin.ne-test";

export const registerEditorTester = (context: vscode.ExtensionContext) => {
  const config = createEditorConfig(context);
  const neTestEditorProvider = new ReactEditorProvider(config, reducer);
  const providerRegistration = vscode.window.registerCustomEditorProvider(
    neTestViewType,
    neTestEditorProvider
  );
  return providerRegistration;
};
