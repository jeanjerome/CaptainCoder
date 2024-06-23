import * as vscode from 'vscode';
import { registerCommands } from './commands/CommandRegistry';

export function activate(context: vscode.ExtensionContext) {
    registerCommands(context);
}

export function deactivate() {}
