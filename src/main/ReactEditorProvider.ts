import * as vscode from 'vscode';
import { HandlerState, useState } from './useState';
import { ReactInfo } from './util';

export type SendMessage = (type: string, payload: any) => void
export type ProcessCallback = (payload: any, pcontext: ProcessContext) => void

export type ProcessContext = {
    //document: vscode.TextDocument,
    //view: vscode.Webview,
    panel: vscode.WebviewPanel,
    fileName: string,
    handler: HandlerState,
    sendMessage: SendMessage,
}
export type ReceiveEvent = {
    type: string,
    callback: ProcessCallback
}


export class ReactEditorProvider implements vscode.CustomTextEditorProvider {
    constructor(private readonly config: ReactInfo) {
    }

    private processEvent: ReceiveEvent[] = []

    public receiveMessage(type: string, callback: ProcessCallback) {
        this.processEvent.push({ type, callback });
    }

    public async resolveCustomTextEditor(document: vscode.TextDocument, panel: vscode.WebviewPanel, _token: vscode.CancellationToken): Promise<void> {
        //const document: ReactTextDocument = new ReactTextDocument(delegate);
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

        const handler = useState(document, {});

        const pContext: ProcessContext = {
            //document,
            //view,
            panel,
            fileName: document.fileName,
            handler,
            sendMessage: (type, payload) => {
                //const data = typeof payload === 'string' ? JSON.parse(payload) : payload
                console.log('VSCODE:sendMessage: ', type, payload);
                view.postMessage({ type, payload })
            },
        };

        const executeProcess = ({ type, payload }: any) => {
            //payload = typeof payload === 'string' ? JSON.parse(payload) : payload
            this.processEvent
                .filter(it => it.type === type)
                .forEach((it, ix) => {
                    console.log('VSCODE:receiveMessage: ', ix, type, payload);
                    it.callback(payload, pContext);
                })
        }

        view.onDidReceiveMessage(executeProcess);

        const onChangeDocument = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                const payload = JSON.parse(e.document.getText())
                //console.log('-onChangeDocument----------->', payload.origin);
                executeProcess({ type: 'change-file', payload })
            }
        });
        panel.onDidDispose(() => {
            onChangeDocument.dispose();
        });
    }
}

export class ReactTextDocument implements vscode.TextDocument {

    public state: any = {};

    constructor(
        private readonly delegate: vscode.TextDocument
    ) {
    }

    get uri(): vscode.Uri {
        return this.delegate.uri;
    }
    get version(): number {
        return this.delegate.version;
    }

    get isUntitled(): boolean {
        return this.delegate.isUntitled;
    }
    get languageId(): string {
        return this.delegate.languageId;
    }
    get isDirty(): boolean {
        return this.delegate.isDirty;
    }
    get isClosed(): boolean {
        return this.delegate.isClosed;
    }
    get eol(): vscode.EndOfLine {
        return this.delegate.eol;
    }
    //get notebook(): undefined{
    //    return this.delegate.notebook;
    //}

    get fileName(): string {
        return this.delegate.fileName;
    }

    get lineCount(): number {
        return this.delegate.lineCount;
    }

    lineAt(line: any): vscode.TextLine {
        return this.delegate.lineAt(line);
    }
    offsetAt(_position: vscode.Position): number {
        return this.delegate.offsetAt(_position);
    }
    positionAt(offset: number): vscode.Position {
        return this.delegate.positionAt(offset);
    }
    getText(_range?: vscode.Range | undefined): string {
        return this.delegate.getText(_range);
    }
    getWordRangeAtPosition(_position: vscode.Position, _regex?: RegExp | undefined): vscode.Range | undefined {
        return this.delegate.getWordRangeAtPosition(_position, _regex);
    }
    validateRange(_range: vscode.Range): vscode.Range {
        return this.delegate.validateRange(_range);
    }
    validatePosition(_position: vscode.Position): vscode.Position {
        return this.delegate.validatePosition(_position);
    }
    save(): Thenable<boolean> {
        const text = JSON.stringify(this.state, null, 2)
        const edit = new vscode.WorkspaceEdit();
        edit.replace(this.delegate.uri, new vscode.Range(0, 0, this.delegate.lineCount, 0), text);
        vscode.workspace.applyEdit(edit);
        console.log('save', this.state);
        return this.delegate.save();
    }
}
