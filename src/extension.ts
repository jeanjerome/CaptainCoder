import * as vscode from 'vscode';
import { handleGenerateCompletion } from './commands/generateCompletion';
import { checkAndInstallModel } from './commands/checkAndInstallModel';
import { configureParameters } from './commands/configureParameters';
import { modelTreeDataProvider } from './views/OllamaModelTreeview';
import { ModelWebview } from './views/OllamaModelWebview';
import { pullModel, deleteModel } from './api/ollamaApi';

export function activate(context: vscode.ExtensionContext) {
    console.log('CaptainCoder is now active!');

    vscode.window.registerTreeDataProvider('modelTreeView', modelTreeDataProvider);
    const modelWebview = new ModelWebview();

    context.subscriptions.push(
        vscode.commands.registerCommand('captaincoder.generateCompletion', handleGenerateCompletion),
        vscode.commands.registerCommand('captaincoder.checkAndInstallModel', checkAndInstallModel),
        vscode.commands.registerCommand('captaincoder.configureParameters', configureParameters),
        vscode.commands.registerCommand('captaincoder.refreshModelList', () => modelTreeDataProvider.refresh()),
        vscode.commands.registerCommand('captaincoder.downloadModel', async (modelName: string) => {
            try {
                await pullModel(modelName);
                vscode.window.showInformationMessage(`Model ${modelName} successfully downloaded.`);
                modelTreeDataProvider.refresh(); // Refresh the tree view
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
                modelTreeDataProvider.refresh(); // Refresh the tree view
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
