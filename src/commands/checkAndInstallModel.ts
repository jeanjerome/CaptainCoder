import * as vscode from 'vscode';
import { listLocalModels, pullModel } from '../api/ollamaApi';
import { modelTreeDataProvider } from '../views/ModelTreeDataProvider';

export async function checkAndInstallModel() {
    const modelName = vscode.workspace.getConfiguration('captaincoder').get('model', 'qwen2:0.5b');

    try {
        const localModels = await listLocalModels();
        if (!localModels.includes(modelName)) {
            vscode.window.showInformationMessage(`Model ${modelName} not found locally. Downloading...`);
            await pullModel(modelName);
            vscode.window.showInformationMessage(`Model ${modelName} successfully downloaded.`);
            modelTreeDataProvider.refresh(); // Refresh the tree view
        } else {
            vscode.window.showInformationMessage(`Model ${modelName} is already installed.`);
            modelTreeDataProvider.refresh(); // Refresh the tree view
        }
    } catch (error) {
        if (error instanceof Error) {
            vscode.window.showErrorMessage(`Error checking or installing model: ${error.message}`);
        } else {
            vscode.window.showErrorMessage('An unknown error occurred while checking or installing the model.');
        }
    }
}
