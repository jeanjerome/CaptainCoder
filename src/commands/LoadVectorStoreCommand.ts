import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import { TextSplitter } from '../services/TextSplitter';
import { InMemoryVectorStore } from '../services/InMemoryVectorStore';
import { Command } from './Command';

export class LoadVectorStoreCommand implements Command {
    constructor(
        private textSplitter: TextSplitter,
        private vectorStore: InMemoryVectorStore
    ) {}

    async execute() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace is opened.');
            return;
        }

        const workspaceRoot = workspaceFolders[0].uri.fsPath;
        const contentFilePath = path.join(workspaceRoot, 'code_content.txt');

        if (!await fs.pathExists(contentFilePath)) {
            vscode.window.showErrorMessage('Content file does not exist.');
            return;
        }

        try {
            const documents = await this.textSplitter.split(contentFilePath);
            await this.vectorStore.add(documents);
            vscode.window.showInformationMessage('Vector store loaded successfully.');
        } catch (error: any) {
            vscode.window.showErrorMessage(`Error loading vector store: ${error.message}`);
        }
    }
}
