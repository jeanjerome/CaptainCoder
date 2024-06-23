import * as vscode from 'vscode';
import { ListModelsCommand } from './ListModelsCommand';
import { PullModelCommand } from './PullModelCommand';
import { GenerateTextCommand } from './GenerateTextCommand';
import { ApiClient } from '../services/ApiClient';
import { apiUrl } from '../config';

export function registerCommands(context: vscode.ExtensionContext) {
    const apiClient = new ApiClient(apiUrl);

    const listModelsCommand = new ListModelsCommand(apiClient);
    const pullModelCommand = new PullModelCommand(apiClient);
    const generateTextCommand = new GenerateTextCommand(apiClient);

    context.subscriptions.push(vscode.commands.registerCommand('captaincoder.listModels', () => listModelsCommand.execute()));
    context.subscriptions.push(vscode.commands.registerCommand('captaincoder.pullModel', () => pullModelCommand.execute()));
    context.subscriptions.push(vscode.commands.registerCommand('captaincoder.generateText', () => generateTextCommand.execute()));
}
