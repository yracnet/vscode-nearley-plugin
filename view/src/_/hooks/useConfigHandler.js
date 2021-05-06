import { useEffect, useState } from "react"
import { handlerOnChange } from "_/helpers/handler"



const vscode = global.acquireVsCodeApi ? global.acquireVsCodeApi() : {
    postMessage: (payload) => {
        console.log('vscode->message', payload);
    }
}

export const useConfigHandler = (init) => {
    const [config, setConfig] = useState(init);

    //useEffect(() => {
    //    vscode.postMessage({ type: 'update', config });
    //}, [config])
    window.addEventListener('message', event => {
        const { type, state } = event.data;
        console.log('[REACT] ', type, state);
        switch (type) {
            case 'set-state':
                setConfig(state);
                return;
        }
    });

    const onChange = handlerOnChange(setConfig);
    const onCreateTest = () => {
        const item = {
            id: 'TEST-' + new Date().getTime(),
            name: 'Simple Test',
            content: "10 + " + Math.random(),
            result: ["Ctrl+Enter for ejecute this case"]
        }
        setConfig(state => {
            state = { ...state }
            state.active = item.id
            state.tests = [item, ...state.tests];
            return state
        })
    }
    const onActiveTest = (item) => {
        const id = typeof item === 'string' ? item : item.id;
        console.log('onActiveTest', id);
        setConfig(state => {
            state = { ...state }
            state.active = id
            return state
        })
    }
    const onRemoveTest = (item) => {
        const id = typeof item === 'string' ? item : item.id;
        console.log('onRemoveTest', id);
        setConfig(state => {
            state = { ...state }
            state.tests = state.tests.filter(it => it.id !== id)
            return state;
        })
    }
    const onUpdateTest = (item) => {
        item = { ...item }
        console.log('onUpdateTest', item);
        setConfig(state => {
            state = { ...state }
            state.tests = state.tests.map(it => it.id === item.id ? item : it)
            return state;
        })
    }
    const onExecuteTest = (item) => {
        item = { ...item }
        item.result = [Math.random(), item.result, Math.random()];
        console.log('onExecuteTest', item);
        setConfig(state => {
            state = { ...state }
            state.tests = state.tests.map(it => it.id === item.id ? item : it)
            return state;
        })
    }
    return [config, setConfig, { onChange, onCreateTest, onActiveTest, onUpdateTest, onRemoveTest, onExecuteTest }];
}