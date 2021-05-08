import * as vscode from 'vscode';
import { assertScript, createReactInfo, generateTempFile, readFile, parseJson, getVscodeTerminal } from './util';
import { ProcessCallback, ReactEditorProvider } from './ReactEditorProvider';


export const registerRunTester = (context: vscode.ExtensionContext) => {
    const config = createReactInfo(context, 'media/index.html', 'asset-manifest.json');
    const provider = new ReactEditorProvider(config);

    const processInitView: ProcessCallback = (payload, { document, sendMessage }) => {
        const text = document.getText();
        parseJson(text)
            .then(data => {
                sendMessage('init-state', data)
            }).catch(error => {
                vscode.window.showErrorMessage(document.fileName + ' not is JSON file');
            })
    }
    const processChangeState: ProcessCallback = (payload, { document }) => {
        const text = JSON.stringify(payload, null, 2)
        const edit = new vscode.WorkspaceEdit();
        edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), text);
        vscode.workspace.applyEdit(edit);
    }
    const processExecuteTest: ProcessCallback = async (payload, args) => {
        const { document } = args
        processChangeState(payload, args);
        document.save()
            .then(() => {
                const fileName = vscode.workspace.asRelativePath(document.fileName);
                console.log('Nearley Run Test: ', fileName);
                const projectPath = assertScript('ne.js', context)
                const terminal = getVscodeTerminal();
                terminal.show(true)
                terminal.sendText(`cd ${projectPath}`)
                terminal.sendText(`clear`)
                terminal.sendText(`node ne.js './${fileName}' './${fileName}'`)
            }, () => {
                vscode.window.showErrorMessage('Error on save files test');
            })
    }
    const processChangeText: ProcessCallback = (payload, { document, sendMessage }) => {
        document.save();
        parseJson(payload)
            .then(data => {
                sendMessage('reload-state', data)
            }).catch(error => {
                vscode.window.showErrorMessage(document.fileName + ' not is JSON file');
            })
    }

    provider.receiveMessage('init-view', processInitView);
    provider.receiveMessage('change-state', processChangeState);
    provider.receiveMessage('execute-test', processExecuteTest);
    provider.receiveMessage('change-text', processChangeText);
    const providerRegistration = vscode.window.registerCustomEditorProvider(ReactEditorProvider.viewType, provider);
    return providerRegistration;
}



