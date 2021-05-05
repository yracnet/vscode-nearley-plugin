import * as vscode from 'vscode';
import * as path from "path"
import * as fs from "fs"

const TITLE_TERMINAL = "Nearley Compiler";

const commandIdCompiler = 'nearley-plugin.ne-compiler';

export const registerCompiler = (context: vscode.ExtensionContext) => {
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

const commandIdTester = 'nearley-plugin.ne-tester';

export const registerTest = (context: vscode.ExtensionContext) => {
    let commandCompiler = vscode.commands.registerCommand(commandIdTester, () => {
        const activeTextEditor = vscode.window.activeTextEditor;
        if (!activeTextEditor) {
            vscode.window.showErrorMessage('Nearley Tester requiere text editor');
        } else {
            const document = activeTextEditor.document;
            const fileName = document.fileName || '';
            const file = path.parse(fileName);
            if (!file.base) {
                vscode.window.showWarningMessage('Requiere save nearley grammar file');
            } else if (file.ext !== '.ne' && file.ext !== '.ne.test') {
                vscode.window.showWarningMessage('Requiere nearley file (.ne or .ne.test extension)');
            } else {
                if (file.ext === '.ne') {
                    const fileNameTest = fileName + '.test';
                    console.log('Nearley Tester: ', fileNameTest);
                    if (!fs.existsSync(fileNameTest)) {
                        fs.writeFile(fileNameTest, '[{"name":"Basic Test", "content": "1+2", "result":"Execute: ctrl+enter", "error":"", "open":true}]', function (err) {
                            if (err) return console.log(err);
                            console.log('Create:', fileNameTest);
                        });
                    }
                }
                // Open Editor
            }
        }
    });
    return commandCompiler;
}
