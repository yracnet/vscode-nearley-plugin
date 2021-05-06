import * as vscode from 'vscode';
import * as path from "path"
import * as fs from "fs"

//const TITLE_TERMINAL = "Nearley Run Tester";

const commandIdTester = 'nearley-plugin.ne-cmd-tester';

export const registerCmdTester = (context: vscode.ExtensionContext) => {
    let commandTester = vscode.commands.registerCommand(commandIdTester, () => {
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
    return commandTester;
}
