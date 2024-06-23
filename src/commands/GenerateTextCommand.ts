import * as vscode from 'vscode';
import { Command } from './Command';
import { ApiClient } from '../services/ApiClient';

export class GenerateTextCommand implements Command {
    constructor(private apiClient: ApiClient) {}

    async execute() {
        try {
            const model = 'mixtral';
            const prompt = 'Why is the sky blue?';
            await this.apiClient.generate(model, prompt, (data) => {
                console.log('Generated Text:', data);
                vscode.window.showInformationMessage('Text generated successfully!');
            });
        } catch (error: any) {
            vscode.window.showErrorMessage('Error generating text: ' + error.message);
        }
    }
}
