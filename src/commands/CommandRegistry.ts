import * as vscode from 'vscode';
import { ListModelsCommand } from './ListModelsCommand';
import { PullModelCommand } from './PullModelCommand';
import { PickProjectFilesCommand } from './PickProjectFilesCommand';
import { ProjectTypeDetector } from '../services/ProjectTypeDetector';
import { ProjectFileExcluder } from '../services/ProjectFileExcluder';
import { ProjectCodePicker } from '../services/ProjectCodePicker';
import { LoadVectorStoreCommand } from './LoadVectorStoreCommand';
import { TextSplitter } from '../services/TextSplitter';

import { ApiClient } from '../services/ApiClient';
import { apiUrl } from '../config';
import { ChatWithCaptainCommand } from './ChatWithCaptainCommand';
import { VectorStoreInMemory } from '../services/VectorStoreInMemory';

export function registerCommands(context: vscode.ExtensionContext) {
    const apiClient = new ApiClient(apiUrl);

    const listModelsCommand = new ListModelsCommand(apiClient);
    context.subscriptions.push(vscode.commands.registerCommand('captaincoder.listModels', () => listModelsCommand.execute()));

    const pullModelCommand = new PullModelCommand(apiClient);
    context.subscriptions.push(vscode.commands.registerCommand('captaincoder.pullModel', () => pullModelCommand.execute()));

    const chatWithCaptainCommand = new ChatWithCaptainCommand();
    context.subscriptions.push(vscode.commands.registerCommand('captaincoder.chatWithCaptainCommand', () => chatWithCaptainCommand.execute()));

    const projectTypeDetector = new ProjectTypeDetector();
    const projectFileExcluder = new ProjectFileExcluder();
    const projectCodePicker = new ProjectCodePicker(projectFileExcluder);
    const pickProjectFilesCommand = new PickProjectFilesCommand(projectTypeDetector, projectCodePicker);
    context.subscriptions.push(vscode.commands.registerCommand('captaincoder.pickProjectFiles', () => pickProjectFilesCommand.execute()));

    const textSplitter = new TextSplitter();
    const vectorStore = new VectorStoreInMemory();
    const loadVectorStoreCommand = new LoadVectorStoreCommand(textSplitter, vectorStore);
    context.subscriptions.push(vscode.commands.registerCommand('captaincoder.loadVectorStore', () => loadVectorStoreCommand.execute()));
}
