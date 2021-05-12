import * as vscode from 'vscode';
import { getVscodeTerminal, assertBinScript } from './util';
import { neTestViewType } from './NeRunTester';



const commandIdCompiler = 'nearley-plugin.ne-compiler';

export const registerCmdCompiler = (context: vscode.ExtensionContext) => {


    let commandCompiler = vscode.commands.registerCommand(commandIdCompiler, () => {
        const document = vscode.window.activeTextEditor?.document;
        const fileName = document?.fileName || '';
        if (document && fileName.endsWith('.ne')) {
            const scriptPath = assertBinScript('ne', context)
            const fileTest = fileName.replace('.ne', '.ne-test');
            document.save();
            const terminal = getVscodeTerminal();
            terminal.show(true);
            terminal.sendText(`cd ${scriptPath}`);
            terminal.sendText(`clear`);
            terminal.sendText(`node ne build '${fileName}' '${fileTest}'`);

            let td = vscode.workspace.textDocuments.find(it => it.fileName === fileTest)
            if (!td) {
                vscode.commands.executeCommand('workbench.action.editorLayoutTwoColumns')
                    .then(e => {
                        let uri = vscode.Uri.parse(fileTest);
                        vscode.commands.executeCommand("vscode.openWith", uri, neTestViewType, {
                            viewColumn: vscode.ViewColumn.Two
                        })
                    })

            }
        }
    });
    return commandCompiler;
}