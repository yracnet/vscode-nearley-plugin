import * as vscode from 'vscode';
import { createReactInfo, ReactInfo, parseJson } from './util';



export const registerRunTester = (context: vscode.ExtensionContext) => {
    const config = createReactInfo(context, 'media/index.html', 'asset-manifest.json');
    const provider = new ReactEditorProvider(config);
    const providerRegistration = vscode.window.registerCustomEditorProvider(ReactEditorProvider.viewType, provider);
    return providerRegistration;
}

class ReactEditorProvider implements vscode.CustomTextEditorProvider {
    public static readonly viewType = 'nearley-plugin.ne-run-tester';
    constructor(private readonly config: ReactInfo) { }
    public async resolveCustomTextEditor(document: vscode.TextDocument, panel: vscode.WebviewPanel, _token: vscode.CancellationToken): Promise<void> {
        const view = panel.webview;
        const { content = 'Error Load', parentUri } = this.config;
        const webviewParentUri = view.asWebviewUri(parentUri)
        view.html = content.replace(/VSCODE_ROOT_URI/g, webviewParentUri.toString());
        //console.log('view.html-->', view.html);
        view.options = {
            enableScripts: true,
            localResourceRoots: [
                webviewParentUri,
                parentUri
            ]
        };


        const reloadContent = () => {
            parseJson(document.getText())
                .then(content => {
                    view.postMessage({ type: 'set-state', content })
                })
                .catch(error => {
                    vscode.window.showErrorMessage('Content file no is JSON format: ' + error);
                })
        }


        const ___changeFile = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                reloadContent();
            }
        });

        panel.onDidDispose(() => {
            ___changeFile.dispose();
        });

        view.onDidReceiveMessage(e => {
            console.log('Received=================>', e);
        });
        reloadContent();
    }
}


/*
export default class NeTesterEditorProvider implements vscode.CustomTextEditorProvider {


    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new NeTesterEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(NeTesterEditorProvider.viewType, provider);
        return providerRegistration;
    }

    constructor(private readonly context: vscode.ExtensionContext) {

    }

    public async resolveCustomTextEditor(document: vscode.TextDocument, panel: vscode.WebviewPanel, _token: vscode.CancellationToken): Promise<void> {
        const view = panel.webview;

        console.log('1-->', this.context.extension);
        console.log('2-->', this.context.extensionUri);
        console.log('3-->', this.context.extensionMode);
        console.log('4-->', this.context.extensionPath);

        //const uri = this.context.extensionUri;
        //view.options = {
        //    enableScripts: true
        //};



        //view.html = getHtmlContentForWebview(view, uri, 'media', 'index.html', (content, path)=>{
        //    content.replaceAll('',)
        //});
        //const controller = createController(document, panel);
        //controller.refresh();
        view.html = '<h1>HOLA!!!!!!!!!!!!</h1>'
    }
}


const createController = (document: vscode.TextDocument, panel: vscode.WebviewPanel) => {
    const view = panel.webview;
    let content = parserJsonTest(document)

    const refresh = () => view.postMessage({ type: 'update', content });


    return {
        refresh
    }
}




        //view.onDidReceiveMessage(e => {
        //    switch (e.type) {
        //        case 'add':
        //            this.addNewScratch(document);
        //            return;
        //        case 'delete':
        //            this.deleteScratch(document, e.id);
        //            return;
        //    }
        //});
        //view.postMessage({ type: 'update', text: document.getText() });

        //const updateWebview = () => view.postMessage({ type: 'update', text: document.getText() });
        //const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
        //    if (e.document.uri.toString() === document.uri.toString()) {
        //        updateWebview();
        //    }
        //});
        //panel.onDidDispose(() => {
        //    changeDocumentSubscription.dispose();
        //});
        //updateWebview();

    //private addNewScratch(document: vscode.TextDocument) {
    //    const json = parserJsonTest(document);
    //    const character = NearleyTestEditorProvider.scratchCharacters[Math.floor(Math.random() * NearleyTestEditorProvider.scratchCharacters.length)];
    //    json.scratches = [
    //        ...(Array.isArray(json.scratches) ? json.scratches : []),
    //        {
    //            text: character,
    //            created: Date.now(),
    //        }
    //    ];
    //    return this.updateTextDocument(document, json);
    //}
    //private deleteScratch(document: vscode.TextDocument, id: string) {
    //    const json = parserJsonTest(document);
    //    if (!Array.isArray(json.scratches)) {
    //        return;
    //    }
    //    json.scratches = json.scratches.filter((note: any) => note.id !== id);
    //    return this.updateTextDocument(document, json);
    //}
    //private updateTextDocument(document: vscode.TextDocument, json: any) {
    //    const edit = new vscode.WorkspaceEdit();
    //    edit.replace(
    //        document.uri,
    //        new vscode.Range(0, 0, document.lineCount, 0),
    //        JSON.stringify(json, null, 2));
    //    return vscode.workspace.applyEdit(edit);
    //}

*/