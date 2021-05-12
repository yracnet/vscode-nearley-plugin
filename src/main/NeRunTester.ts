import * as vscode from 'vscode';
import { assertBinScript, createReactInfo, parseJson, getVscodeTerminal } from './util';
import { ProcessCallback, ReactEditorProvider } from './ReactEditorProvider';

export const neTestViewType = 'nearley-plugin.ne-test';

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
                const fileName = document.fileName;
                const scriptPath = assertBinScript('ne', context)
                const terminal = getVscodeTerminal();
                terminal.show(true)
                terminal.sendText(`cd ${scriptPath}`)
                terminal.sendText(`clear`)
                terminal.sendText(`node ne run '${fileName}' '${fileName}' `)
            }, () => {
                vscode.window.showErrorMessage('Error on save file test');
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
    const providerRegistration = vscode.window.registerCustomEditorProvider(neTestViewType, provider);
    return providerRegistration;
}



