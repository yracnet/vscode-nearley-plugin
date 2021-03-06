import * as vscode from 'vscode';
import { registerCmdCompiler } from './main/NeCmdCompiler';
import { registerRunTester } from './main/NeRunTester';

export function activate(context: vscode.ExtensionContext) {
	console.log('=====REGISTER NEARLEY PLUGIN=====');
	context.subscriptions.push(registerCmdCompiler(context));
	context.subscriptions.push(registerRunTester(context));
}

export function deactivate() { }
