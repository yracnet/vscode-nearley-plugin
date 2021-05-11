import * as vscode from 'vscode';
import { getVscodeTerminal, assertBinScript } from './util';


const commandIdCompiler = 'nearley-plugin.ne-cmd-compiler';

export const registerCmdCompiler = (context: vscode.ExtensionContext) => {
    let commandCompiler = vscode.commands.registerCommand(commandIdCompiler, () => {
        const activeTextEditor = vscode.window.activeTextEditor;
        if (!activeTextEditor) {
            vscode.window.showErrorMessage('Nearley Compiler requiere text editor');
        } else {
            const scriptPath = assertBinScript('ne', context)
            const document = activeTextEditor.document;
            const fileName = document.fileName;
            document.save();
            const terminal = getVscodeTerminal();
            terminal.show(true);
            terminal.sendText(`cd ${scriptPath}`);
            terminal.sendText(`clear`);
            terminal.sendText(`node ne build '${fileName}'`);
        }
    });
    return commandCompiler;
}