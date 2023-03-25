import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { exec } from "child_process";
import { VSCEditorConfig } from "./ReactEditorProvider";

export const TITLE_TERMINAL = "Nearley Compiler";

export const assertNeTestClient = () => {
  //@ts-ignore
  const rootPath = vscode.workspace.rootPath || "./";
  const packageJsonPath = path.join(rootPath, "package.json");
  fs.readFile(packageJsonPath, "utf8", (error, data) => {
    if (error) {
      console.error(`Error al leer el archivo 'package.json': ${error}`);
      return;
    }
    const packageJson = JSON.parse(data);
    const devDependencies = packageJson.devDependencies || {};
    if (!devDependencies["ne-test-client"]) {
      vscode.window
        .showInformationMessage(
          "El editor requiere la librería 'ne-test-client'. ¿Desea instalarla ahora?",
          "Sí",
          "No"
        )
        .then((selection) => {
          if (selection === "Sí") {
            const terminal = getVscodeTerminal();
            terminal.sendText("yarn add ne-test-client -D");
            terminal.show();
          }
        });
    }
  });
};

export const getVscodeTerminal = () => {
  let terminal = vscode.window.terminals.find(
    (it) => it.name === TITLE_TERMINAL
  );
  if (terminal) {
    terminal.dispose();
  }
  terminal = vscode.window.createTerminal(TITLE_TERMINAL);
  terminal.show(true);
  return terminal;
};

type FNPageConfig = (
  context: vscode.ExtensionContext,
  fileName?: string
) => VSCEditorConfig;

const createEditorConfig_DEV: FNPageConfig = (
  context,
  fileName = "index-dev.html"
) => {
  const fileUri = vscode.Uri.joinPath(
    context.extensionUri,
    "../ne-test-editor",
    fileName
  );
  const content =
    fs.readFileSync(fileUri.fsPath, {})?.toString() || "<h1>Not Found!</h1>";

  const url = process.env.URL_EDITOR || "http://localhost:5173/VSCODE_ROOT_URI";
  const urlRoot = vscode.Uri.parse(url);
  const urlContent = content.replace(/\/VSCODE_ROOT_URI/g, urlRoot.toString());
  return {
    urlContent,
    urlRoot,
  };
};

const createEditorConfig_PROD: FNPageConfig = (
  context,
  fileName = "index.html"
) => {
  const fileUri = vscode.Uri.joinPath(context.extensionUri, "media", fileName);
  const content = fs.readFileSync(fileUri.fsPath, {}).toString();
  const urlRoot = vscode.Uri.joinPath(context.extensionUri, "media");
  const urlContent = content.replace(/\/VSCODE_ROOT_URI/g, "/WEBVIEW_URI");
  return { urlRoot, urlContent };
};

export const createEditorConfig: FNPageConfig =
  process.env.NODE_ENV === "development"
    ? createEditorConfig_DEV
    : createEditorConfig_PROD;
