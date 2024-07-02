import * as vscode from 'vscode';
import { Command } from './Command';
import { ApiClient } from '../services/ApiClient';
import { LoadVectorStoreCommand } from '../commands/LoadVectorStoreCommand';
import { VectorStoreInMemory } from '../services/VectorStoreInMemory';
import { ChatWithCaptain } from '../services/ChatWithCaptain';
import WebviewContainer from '../webview/WebviewContainer';
import { TextSplitter } from '../services/TextSplitter';

export class ChatWithCaptainCommand implements Command {
    private webview: WebviewContainer | null = null;

    constructor(private apiClient: ApiClient, private extensionPath: string) {}

    async execute() {
        if (!this.webview) {
            this.webview = new WebviewContainer(
                this.extensionPath,
                () => { this.webview = null; },
                (isVisible) => { if (isVisible) {this.onVisible();} }
            );

            this.webview.setMessageHandler((message) => {
                if (message.command === 'askQuestion' && message.question) {
                    this.handleQuestion(message.question);
                } else {
                    vscode.window.showErrorMessage('Invalid question');
                }
            });
        }

        this.webview.reveal();
    }

    private async handleQuestion(question: string) {
        try {
            const vectorStore = new LoadVectorStoreCommand(
                new TextSplitter(),
                new VectorStoreInMemory()
            );

            await vectorStore.execute();

            const chat = new ChatWithCaptain(vectorStore.vectorStore);
            const answer = await chat.transformToStandalone(question);

            this.webview?.update({ answer, question });

        } catch (error: any) {
            vscode.window.showErrorMessage('Error generating text: ' + error.message);
        }
    }

    private onVisible() {
        // Handle actions when webview becomes visible
    }
}
