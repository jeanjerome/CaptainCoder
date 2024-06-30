import * as vscode from 'vscode';
import { ListModelsCommand } from './ListModelsCommand';
import { PullModelCommand } from './PullModelCommand';
import { GenerateTextCommand } from './GenerateTextCommand';
import { PickProjectFilesCommand } from './PickProjectFilesCommand';
import { ProjectTypeDetector } from '../services/ProjectTypeDetector';
import { ProjectFileExcluder } from '../services/ProjectFileExcluder';
import { ProjectCodePicker } from '../services/ProjectCodePicker';
import { LoadVectorStoreCommand } from './LoadVectorStoreCommand';
import { TextSplitter } from '../services/TextSplitter';
import { InMemoryVectorStore } from '../services/InMemoryVectorStore';

import { ApiClient } from '../services/ApiClient';
import { apiUrl } from '../config';

export function registerCommands(context: vscode.ExtensionContext) {
    const apiClient = new ApiClient(apiUrl);

    const listModelsCommand = new ListModelsCommand(apiClient);
    context.subscriptions.push(vscode.commands.registerCommand('captaincoder.listModels', () => listModelsCommand.execute()));

    const pullModelCommand = new PullModelCommand(apiClient);
    context.subscriptions.push(vscode.commands.registerCommand('captaincoder.pullModel', () => pullModelCommand.execute()));

    const generateTextCommand = new GenerateTextCommand(apiClient);
    context.subscriptions.push(vscode.commands.registerCommand('captaincoder.generateText', () => generateTextCommand.execute()));

    const projectTypeDetector = new ProjectTypeDetector();
    const projectFileExcluder = new ProjectFileExcluder();
    const projectCodePicker = new ProjectCodePicker(projectFileExcluder);
    const pickProjectFilesCommand = new PickProjectFilesCommand(projectTypeDetector, projectCodePicker);
    context.subscriptions.push(vscode.commands.registerCommand('captaincoder.pickProjectFiles', () => pickProjectFilesCommand.execute()));

    const textSplitter = new TextSplitter();
    const vectorStore = new InMemoryVectorStore();
    const loadVectorStoreCommand = new LoadVectorStoreCommand(textSplitter, vectorStore);
    context.subscriptions.push(vscode.commands.registerCommand('captaincoder.loadVectorStore', () => loadVectorStoreCommand.execute()));
}
