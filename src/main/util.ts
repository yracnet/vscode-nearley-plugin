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

export const existFile = (file: string) => {
    return new Promise<string | any>((resolve, reject) => {
        console.log('Exist File: ', file);
        const exist = fs.existsSync(file)
        if (exist) {
            resolve(file);
        } else {
            reject(file)
        }
    });
}

export const readFile = (file: string, encode: string) => {
    return new Promise<string | any>((resolve, reject) => {
        console.log('Read File: ', file);
        try {
            const content: string = fs.readFileSync(file, encode);
            resolve(content);
        } catch (error) {
            reject(error)
        }
    });
}

export type ReactInfo = {
    parentUri: vscode.Uri,
    fileUri: vscode.Uri,
    content?: String,
    manifestUri?: vscode.Uri,
    manifest?: object
}

export const createReactInfo = (context: vscode.ExtensionContext, fileName: string, manifestName?: string): ReactInfo => {
    const result: ReactInfo = {
        fileUri: vscode.Uri.joinPath(context.extensionUri, fileName),
        parentUri: vscode.Uri.joinPath(context.extensionUri, fileName, "..")
    }
    readFile(result.fileUri.fsPath, 'utf-8')
        .then(content => {
            result.content = content;
        })
    if (manifestName) {
        result.manifestUri = vscode.Uri.joinPath(result.parentUri, manifestName);
        readFile(result.manifestUri.fsPath, 'utf-8')
            .then(content => {
                result.manifest = JSON.parse(content);
            })
    }
    return result
}

//export const readTextContent = (view: vscode.Webview, uri: vscode.Uri, ...pathSegments: string[]) => {
//    const fileName = pathSegments.pop() || 'index.html';
//
//    const parentUri = vscode.Uri.joinPath(uri, ...pathSegments);
//    const fileUri = vscode.Uri.joinPath(parentUri, fileName);
//
//    const pathBase = view.asWebviewUri(parentUri);
//    const html: any = fs.readFileSync(fileUri.fsPath, 'utf8');
//
//    return html.replaceAll("%PATH_BASE%", pathBase.toString());
//}

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

