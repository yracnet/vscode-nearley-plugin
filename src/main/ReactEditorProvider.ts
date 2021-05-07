import * as vscode from 'vscode';
import { ReactInfo } from './util';

export type SendMessage = (type: string, payload: any) => void
export type ProcessCallback = (payload: any, pcontext: ProcessContext) => void

export type ProcessContext = {
    sendMessage: SendMessage,
    document: vscode.TextDocument,
    view: vscode.Webview,
    panel: vscode.WebviewPanel
}
export type ReceiveEvent = {
    type: string,
    callback: ProcessCallback
}


export class ReactEditorProvider implements vscode.CustomTextEditorProvider {
    public static readonly viewType = 'nearley-plugin.ne-run-tester';
    constructor(private readonly config: ReactInfo) { }

    private processEvent: ReceiveEvent[] = []

    public receiveMessage(type: string, callback: ProcessCallback) {
        this.processEvent.push({ type, callback });
    }

    public async resolveCustomTextEditor(document: vscode.TextDocument, panel: vscode.WebviewPanel, _token: vscode.CancellationToken): Promise<void> {
        const view = panel.webview;
        const { content = '<h1>Error Load</h1> <p>URI: VSCODE_ROOT_URI</p>', parentUri } = this.config;
        const webviewParentUri = view.asWebviewUri(parentUri)
        view.options = {
            enableScripts: true,
            localResourceRoots: [
                webviewParentUri,
                parentUri
            ]
        };

        view.html = content.replace(/\/VSCODE_ROOT_URI/g, webviewParentUri.toString());

        const pContext: ProcessContext = {
            document,
            view,
            panel,
            sendMessage: (type, payload) => {
                console.log('VSCODE:sendMessage: ', type, payload);
                view.postMessage({ type, payload })
            }
        };

        const executeProcess = ({ type, payload }: any) => {
            this.processEvent
                .filter(it => it.type === type)
                .forEach(it => {
                    console.log('VSCODE:receiveMessage: ', type, payload);
                    it.callback(payload, pContext);
                })
        }

        view.onDidReceiveMessage(executeProcess);


        const onChangeDocument = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                executeProcess({ type: 'change-text', payload: document.getText() })
            }
        });
        panel.onDidDispose(() => {
            onChangeDocument.dispose();
        });
    }
}