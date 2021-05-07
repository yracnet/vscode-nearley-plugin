import { useEffect, useState } from "react"
import { handlerOnChange } from "_/helpers/handler"
import { getMessage } from "_/helpers/message"

const INIT_TEST = {
    origin: 'default',
    grammar: './src/grammar.js',
    execute: '?',
    start: '?',
    finish: '?',
    tests: []
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
            id: 'TEST-' + new Date().getTime() + ':' + config.tests.length,
            name: 'Simple Test',
            content: "10 + " + Math.random(),
            start: '',
            finish: '',
            status: '',
            results: ['Ctrl+Enter for ejecute this case'],
            error: ''
        }
        const tests = [item, ...config.tests]
        setConfig({ ...config, execute: item.id, tests, origin: 'react' })
    }
    const onActiveTest = (item) => {
        const id = typeof item === 'string' ? item : item.id;
        const execute = (id === config.execute ? '' : id)
        setConfig({ ...config, execute, origin: 'react' })
    }
    const onRemoveTest = (item) => {
        const id = typeof item === 'string' ? item : item.id;
        const tests = config.tests.filter(it => it.id !== id)
        setConfig({ ...config, tests, origin: 'react' })
    }
    const onUpdateTest = (item) => {
        item = { ...item }
        const tests = config.tests.map(it => it.id === item.id ? item : it)
        setConfig({ ...config, tests, origin: 'react' })
    }
    const onExecuteTest = (item) => {
        const execute = typeof item === 'string' ? item : item.id;
        setConfig({ ...config, execute, origin: 'ignore' })
        sendMessage('execute-test', { ...config, execute })
    }

    return [config, setConfig, { onChange, onCreateTest, onActiveTest, onUpdateTest, onRemoveTest, onExecuteTest }];
}