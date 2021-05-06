import * as vscode from 'vscode';
import * as path from "path"

const TITLE_TERMINAL = "Nearley Compiler";

const commandIdCompiler = 'nearley-plugin.ne-cmd-compiler';

export const registerCmdCompiler = (context: vscode.ExtensionContext) => {
    let commandCompiler = vscode.commands.registerCommand(commandIdCompiler, () => {
        const activeTextEditor = vscode.window.activeTextEditor;
        if (!activeTextEditor) {
            vscode.window.showErrorMessage('Nearley Compiler requiere text editor');
        } else {
            console.log('activeTextEditor', activeTextEditor, typeof activeTextEditor);
            const document = activeTextEditor.document;
            const fileName = document.fileName || '';
            const file = path.parse(fileName);
            if (!file.base) {
                vscode.window.showWarningMessage('Requiere save nearley grammar file');
            } else if (file.ext !== '.ne') {
                vscode.window.showWarningMessage('Requiere nearley file (.ne extension)');
            } else {
                console.log('Nearley Compile: ', fileName);
                document.save();
                let terminal = vscode.window.terminals.find(it => it.name === TITLE_TERMINAL);
                if (!terminal) {
                    terminal = vscode.window.createTerminal(TITLE_TERMINAL);
                }
                terminal.show(true);
                terminal.sendText(`clear`);
                terminal.sendText(`cd ${file.dir}`);
                terminal.sendText(`rm ${file.name}.js`);
                terminal.sendText(`nearleyc ${file.base} -o ${file.name}.js`)
            }
        }
    });
    return commandCompiler;
}