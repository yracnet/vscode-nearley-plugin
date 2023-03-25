import * as vscode from "vscode";
import { getVscodeTerminal } from "./util";
import { neTestViewType } from "./NearleyEditor";

const commandIdCompiler = "nearley-plugin.ne-compiler";

export const registerCmdCompiler = (context: vscode.ExtensionContext) => {
  let commandCompiler = vscode.commands.registerCommand(
    commandIdCompiler,
    () => {
      const document = vscode.window.activeTextEditor?.document;
      let fileName = document?.fileName || "";
      if (document && fileName.endsWith(".ne")) {
        let fileSource = vscode.workspace.asRelativePath(fileName);
        let fileTarget = fileSource.replace(".ne", ".js");
        let fileTest = fileSource.replace(".ne", ".ne-test");
        document.save();
        const terminal = getVscodeTerminal();

        terminal.sendText(
          `npx ne-test build '${fileSource}' -o '${fileTarget}' -t ${fileTest}`
        );

        let td = vscode.workspace.textDocuments.find(
          (it) => it.fileName === fileTest
        );
        if (!td) {
          vscode.commands
            .executeCommand("workbench.action.editorLayoutTwoColumns")
            .then((e) => {
              let uri = vscode.Uri.file(fileName.replace(".ne", ".ne-test"));
              setTimeout(() => {
                vscode.commands.executeCommand(
                  "vscode.openWith",
                  uri,
                  neTestViewType,
                  {
                    viewColumn: vscode.ViewColumn.Two,
                  }
                );
              }, 1000);
            });
        }
      }
    }
  );
  return commandCompiler;
};
