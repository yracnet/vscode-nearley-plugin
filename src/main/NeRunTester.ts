import * as vscode from 'vscode';
import * as fs from 'fs'
import { assertBinScript, createReactInfo, getVscodeTerminal } from './util';
import { ProcessCallback, ReactEditorProvider } from './ReactEditorProvider';

export const neTestViewType = 'nearley-plugin.ne-test';

export const registerRunTester = (context: vscode.ExtensionContext) => {
    const config = createReactInfo(context, 'media/index.html', 'asset-manifest.json');
    const provider = new ReactEditorProvider(config);

    const processInitView: ProcessCallback = (payload, { fileName, handler, sendMessage }) => {
        handler.readState()
            .then(state => {
                sendMessage('init-state', state)
            }).catch(error => {
                vscode.window.showErrorMessage(fileName + ' not is JSON file');
            })
    }
    const processChangeState: ProcessCallback = (payload, { handler }) => {
        handler.setState(payload);
    }
    const processExecuteTest: ProcessCallback = async (payload, { fileName, handler }) => {
        handler.setState(payload);
        handler.writeState()
            .then(() => {
                const scriptPath = assertBinScript('ne', context)
                const terminal = getVscodeTerminal();
                terminal.show(true)
                terminal.sendText(`cd ${scriptPath}`)
                terminal.sendText(`clear`)
                terminal.sendText(`node ne run '${fileName}' '${fileName}' `)
            })
            .catch(error => {
                vscode.window.showErrorMessage('Error on save file test');
            })
    }
    const processChangeFile: ProcessCallback = (payload, { handler, sendMessage }) => {
        handler.setState(payload)
        sendMessage('reload-state', payload)
    }
    const processBuild: ProcessCallback = (payload, { fileName, handler }) => {
        handler.setState(payload)
        handler.writeState()
            .then(state => {
                const scriptPath = assertBinScript('ne', context)
                const terminal = getVscodeTerminal();
                terminal.show(true);
                terminal.sendText(`cd ${scriptPath}`);
                terminal.sendText(`clear`);
                terminal.sendText(`node ne build '${payload.source}' '${payload.grammar}'`);
                terminal.sendText(`node ne run '${fileName}' '${fileName}' `)
            })
            .catch(error => {
                vscode.window.showErrorMessage('error ne build');
            })
    }



    const processRunAuto: ProcessCallback = (payload, { handler, fileName }) => {
        handler.setState(payload)
        handler.writeState()
            .then(state => {
                const terminal = getVscodeTerminal();
                const scriptPath = assertBinScript('ne', context)
                if(state.auto){
                    fs.watchFile(state.source, ()=>{
                        terminal.show(true);
                        terminal.sendText(`cd ${scriptPath}`);
                        terminal.sendText(`clear`);
                        terminal.sendText(`node ne build '${state.source}' '${state.grammar}'`);
                    })
                    fs.watchFile(state.grammar, ()=>{
                        terminal.show(true);
                        terminal.sendText(`cd ${scriptPath}`);
                        terminal.sendText(`clear`);
                        terminal.sendText(`node ne run '${fileName}' '${fileName}'`);
                    })
                } else {
                    fs.unwatchFile(state.source);
                    fs.unwatchFile(state.grammar);
                }
            })
            .catch(error => {
                vscode.window.showErrorMessage('error ne build');
            })
    }

    provider.receiveMessage('init-view', processInitView);
    provider.receiveMessage('change-state', processChangeState);
    provider.receiveMessage('execute-test', processExecuteTest);
    provider.receiveMessage('change-file', processChangeFile);
    provider.receiveMessage('build-now', processBuild);
    provider.receiveMessage('build-auto', processRunAuto);
    const providerRegistration = vscode.window.registerCustomEditorProvider(neTestViewType, provider);
    return providerRegistration;
}



