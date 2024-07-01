import * as vscode from 'vscode';
import { Command } from './Command';
import { ApiClient } from '../services/ApiClient';
import { LoadVectorStoreCommand } from './LoadVectorStoreCommand';
import { VectorStoreInMemory } from '../services/VectorStoreInMemory';
import { TextSplitter } from '../services/TextSplitter';
import { ChatWithCaptain } from '../services/ChatWithCaptain';

export class ChatWithCaptainCommand implements Command {
    constructor() {}

    async execute() {
        try {
            const vectorStore = new LoadVectorStoreCommand(
                new TextSplitter(),
                new VectorStoreInMemory()
            );

            vectorStore.execute();

            const chat = new ChatWithCaptain(vectorStore.vectorStore);
            chat.transformToStandalone('What improvements can be made to this program?');

        } catch (error: any) {
            vscode.window.showErrorMessage('Error generating text: ' + error.message);
        }
    }
}
