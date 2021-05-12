import * as fs from 'fs'
import * as path from "path"
import * as vscode from 'vscode';

export const assertBinScript = (name: string, context: vscode.ExtensionContext) => {
    const binPath = path.join(vscode.workspace.rootPath || '', 'node_modules', '.bin');
    const neScript = path.join(binPath, name)
    if (!fs.existsSync(neScript)) {
        fs.mkdirSync(binPath, { recursive: true });
        const neOrigin = path.join(context.extensionPath, "bin", name)
        fs.copyFileSync(neOrigin, neScript)
    }
    return binPath;
}

const TITLE_TERMINAL = "Nearley Compiler";

export const getVscodeTerminal = () => {
    let terminal = vscode.window.terminals.find(it => it.name === TITLE_TERMINAL);
    if (!terminal) {
        terminal = vscode.window.createTerminal(TITLE_TERMINAL);
    }
    return terminal;
}

// export const existFile = (file: string) => {
//     return new Promise<string | any>((resolve, reject) => {
//         //console.debug('Exist File: ', file);
//         const exist = fs.existsSync(file)
//         if (exist) {
//             resolve(file);
//         } else {
//             reject(file)
//         }
//     });
// }

export const readFile = (file: string, encode: string = 'utf-8') => {
    return new Promise<string | any>((resolve, reject) => {
        //console.debug('Read File: ', file);
        try {
            const content: string = fs.readFileSync(file, encode);
            resolve(content);
        } catch (error) {
            reject(error)
        }
    });
}

export const parseJson = (content: string) => {
    return new Promise<any>((resolve, reject) => {
        //console.debug('Parse Json: ', content);
        try {
            const data = JSON.parse(content);
            resolve(data);
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


