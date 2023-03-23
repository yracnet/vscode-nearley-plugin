import * as vscode from "vscode";
import { registerEditorTester } from "./main/NearleyEditor";

export function activate(context: vscode.ExtensionContext) {
  console.log("=====REGISTER NEARLEY PLUGIN=====");
  //context.subscriptions.push(registerCmdCompiler(context));
  context.subscriptions.push(registerEditorTester(context));
}

export function deactivate() {}
