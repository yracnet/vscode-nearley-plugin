import * as fs from 'fs'
import * as vscode from 'vscode';

export type HandlerState<T = any> = {
    state: T,
    setState: (t: T) => void,
    readState: () => Promise<T>,
    writeState: () => Promise<T>
}

export const useState = <T>(document: vscode.TextDocument, init: T): HandlerState<T> => {
    let state: T = init;

    const readState = () => {
        return new Promise<T>((resolve, reject) => {
            try {
                const text = document.getText()
                state = <T>JSON.parse(text);
                resolve(state);
            } catch (error) {
                reject(error)
            }
        });
    }
    const writeState = () => {
        return new Promise<T>((resolve, reject) => {
            const text = JSON.stringify(state, null, 2);
            try {
                fs.writeFileSync(document.fileName, text, { encoding: 'utf8', flag: 'w' })
                resolve(state);
            } catch (error) {
                reject(error);
            }
        });
    }

    const setState = (data: T) => {
        state = data;
    }

    return { state, setState, readState, writeState }
}