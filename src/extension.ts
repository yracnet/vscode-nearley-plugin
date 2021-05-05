import * as vscode from 'vscode';
import { registerCompiler, registerTest } from './main/NearleyCommand';

export function activate(context: vscode.ExtensionContext) {
	console.log('=====REGISTER NEARLEY PLUGIN=====');
	context.subscriptions.push(registerCompiler(context));
	context.subscriptions.push(registerTest(context));
}

export function deactivate() { }
