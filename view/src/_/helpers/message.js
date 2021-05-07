
const vscode = global.acquireVsCodeApi ? global.acquireVsCodeApi() : {
    postMessage: (payload) => {
        console.debug('vscode->browser', payload);
    }
}
const messages = [];

const sendMessage = (type, payload) => {
    console.log('REACT:sendMessage', type, payload);
    vscode.postMessage({ type, payload })
}

const receiveMessage = (type, callback = console.log) => {
    messages.push({ type, callback })
}

const eventListener = (event) => {
    const { type, payload } = event.data;
    console.log('REACT:messages:', messages.length);
    messages.filter(it => it.type === type)
        .forEach(it => {
            console.log('REACT:receiveMessage', type, payload);
            it.callback(payload);
        })
}

window.addEventListener('message', eventListener);

export const getMessage = () => {
    return [sendMessage, receiveMessage]
}