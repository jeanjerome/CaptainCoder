import * as vscode from 'vscode';
import { handleGenerateCompletion } from './commands/generateCompletion';
import { configureParameters } from './commands/configureParameters';
import { ModelWebview } from './views/OllamaModelWebview';
import { pullModel, deleteModel } from './api/ollamaApi';

export function activate(context: vscode.ExtensionContext) {
    console.log('CaptainCoder is now active!');

    const modelWebview = new ModelWebview();

    context.subscriptions.push(
        vscode.commands.registerCommand('captaincoder.generateCompletion', handleGenerateCompletion),
        vscode.commands.registerCommand('captaincoder.configureParameters', configureParameters),
        vscode.commands.registerCommand('captaincoder.downloadModel', async (modelName: string) => {
            try {
                await pullModel(modelName);
                vscode.window.showInformationMessage(`Model ${modelName} successfully downloaded.`);
            } catch (error) {
                if (error instanceof Error) {
                    vscode.window.showErrorMessage(`Error downloading model: ${error.message}`);
                } else {
                    vscode.window.showErrorMessage('An unknown error occurred while downloading the model.');
                }
            }
        }),
        vscode.commands.registerCommand('captaincoder.deleteModel', async (modelName: string) => {
            try {
                await deleteModel(modelName);
                vscode.window.showInformationMessage(`Model ${modelName} successfully deleted.`);
            } catch (error) {
                if (error instanceof Error) {
                    vscode.window.showErrorMessage(`Error deleting model: ${error.message}`);
                } else {
                    vscode.window.showErrorMessage('An unknown error occurred while deleting the model.');
                }
            }
        }),
        vscode.commands.registerCommand('captaincoder.showModelManager', () => {
            modelWebview.show();
        })
    );
}

export function deactivate() {}
