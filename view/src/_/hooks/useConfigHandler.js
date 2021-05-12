import { useEffect, useState } from "react"
import { handlerOnChange } from "_/helpers/handler"
import { getMessage } from "_/helpers/message"

//import INIT_TEST from './calc.json'

const INIT_TEST = {
    origin: 'default',
    auto: false,
    source: './src/grammar.ne',
    grammar: './src/grammar.js',
    execute: 0,
    start: 0,
    finish: 0,
    items: []
}

const [sendMessage, receiveMessage] = getMessage();

export const useConfigHandler = (init = INIT_TEST) => {
    const [config, setConfig] = useState(init);

    useEffect(() => {
        const { origin, ...payload } = config;
        if (origin === 'default') {
            sendMessage('init-view', payload);
        } else if (origin === 'react') {
            sendMessage('change-state', payload);
        } else if (origin === 'vscode') {
            //ignore
        } else if (origin === 'ignore') {
            //ignore
        } else {
            console.log('Origin change not allowed', origin);
        }
    }, [config])

    useEffect(() => {
        receiveMessage('init-state', (payload) => {
            const state = typeof payload === 'string' ? JSON.parse(payload) : { ...payload }
            state.origin = 'vscode';
            setConfig(state);
        })
        receiveMessage('reload-state', (payload) => {
            const state = typeof payload === 'string' ? JSON.parse(payload) : { ...payload }
            state.origin = 'vscode';
            setConfig(state);
        })
    }, [setConfig])


    const onChange = handlerOnChange(config, setConfig, (state) => {
        state.origin = 'react';
        return state;
    });

    const onCreateTest = () => {
        const item = {
            id: 'TEST-' + new Date().getTime() + ':' + config.items.length,
            name: 'Simple Test',
            content: "10 + " + Math.random(),
            start: '',
            finish: '',
            status: '',
            results: ['Ctrl+Enter for ejecute this case'],
            traces: [],
            output: ''
        }
        const items = [item, ...config.items]
        setConfig({ ...config, execute: item.id, items, origin: 'react' })
    }
    const onActiveTest = (item) => {
        const id = typeof item === 'string' ? item : item.id;
        const execute = (id === config.execute ? '' : id)
        setConfig({ ...config, execute, origin: 'react' })
    }
    const onRemoveTest = (item) => {
        const id = typeof item === 'string' ? item : item.id;
        const items = config.items.filter(it => it.id !== id)
        setConfig({ ...config, items, origin: 'react' })
    }
    const onUpdateTest = (item) => {
        item = { ...item }
        const items = config.items.map(it => it.id === item.id ? item : it)
        setConfig({ ...config, items, origin: 'react' })
    }
    const onExecuteTest = (item) => {
        const execute = typeof item === 'string' ? item : item.id;
        const state = { ...config, execute }
        setConfig({ ...state, origin: 'ignore' })
        sendMessage('execute-test', state)
    }
    const onBuildNow = () => {
        sendMessage('build-now', config)
    }
    const onBuildAuto = () => {
        const state = { ...config, auto: !config.auto }
        setConfig({ ...state, origin: 'ignore' })
        sendMessage('build-auto', state)
    }

    return [config, setConfig, { onChange, onCreateTest, onActiveTest, onUpdateTest, onRemoveTest, onExecuteTest, onBuildSource: onBuildNow, onBuildAuto }];
}