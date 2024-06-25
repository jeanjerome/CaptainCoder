import * as vscode from 'vscode';
import { Command } from './Command';
import { callRagModel } from '../services/RAGService';

export class CallRagModelCommand implements Command {

    constructor() {}

    async execute() {
        try {
            const data = await callRagModel();
            vscode.window.showInformationMessage('Data fetched with callRagModel!');
            console.log('Data:', data);
        } catch (error: any) {
            vscode.window.showErrorMessage('Error fetching data with callRagModel: ' + error.message);
        }
    }
}