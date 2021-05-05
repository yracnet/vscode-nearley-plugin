import * as vscode from 'vscode';
import * as fs from 'fs'
const { exec } = require("child_process");

export const execShellCommand = (cmd: string) => {
    console.log('Execute: ', cmd);
    return new Promise((resolve, reject) => {
        exec(cmd, (error: any, stdout: any, stderr: any) => {
            if (error) {
                reject({ error, stderr })
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

export const getHtmlContentForWebview = (view: vscode.Webview, uri: vscode.Uri, ...pathSegments: string[]) => {
    const fileName = pathSegments.pop() || 'index.html';

    const parentUri = vscode.Uri.joinPath(uri, ...pathSegments);
    const fileUri = vscode.Uri.joinPath(parentUri, fileName);

    const pathBase = view.asWebviewUri(parentUri);
    const html: any = fs.readFileSync(fileUri.fsPath, 'utf8');

    return html.replaceAll("%PATH_BASE%", pathBase.toString());
}

export const loadHtmlContentForWebview = (view: vscode.Webview, uri: vscode.Uri, ...pathSegments: string[]) => {
    view.html = getHtmlContentForWebview(view, uri, ...pathSegments);
}


export const parserJsonTest = (document: vscode.TextDocument) => {
    try {
        const text = document.getText() || "[]";
        return JSON.parse(text);
    } catch (e) {
        //throw new Error('Could not get document as json. Content is not valid json');
        console.error("Error Parse", e);
    }
    return [];
}

