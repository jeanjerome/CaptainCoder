import * as vscode from 'vscode';
import { Command } from './Command';
import { ApiClient } from '../services/ApiClient';

export class ListModelsCommand implements Command {
    constructor(private apiClient: ApiClient) {}

    async execute() {
        try {
            const data = await this.apiClient.listModels();
            vscode.window.showInformationMessage('Data fetched successfully!');
            console.log('Data:', data);
        } catch (error: any) {
            vscode.window.showErrorMessage('Error fetching data: ' + error.message);
        }
    }
}
