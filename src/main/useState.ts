import * as vscode from 'vscode';

export type HandlerState<T=any> = {
    state: T,
    setState: (t: T) => void,
    readState: () => Promise<T | any>,
    writeState: () => Promise<boolean>
}

export const useState = <T>(document: vscode.TextDocument, init: T): HandlerState<T> => {
    let state: T = init;

    const readState = (): Promise<T | any> => {
        return new Promise<any>((resolve, reject) => {
            try {
                const text = document.getText()
                state = <T>JSON.parse(text);
                resolve(state);
            } catch (error) {
                reject(error)
            }
        });
    }
    const writeState = (): Promise<boolean> => {
        return new Promise<any>((resolve, reject) => {
            const text = JSON.stringify(state, null, 2);
            document.save()
                .then(resolve, reject);
        });
    }

    const setState = (data: T) => {
        state = data;
    }

    return { state, setState, readState, writeState }
}