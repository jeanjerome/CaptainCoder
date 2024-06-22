import * as vscode from 'vscode';
import { handleGenerateCompletion } from './commands/generateCompletion.js';
import { configureParameters } from './commands/configureParameters.js';
import { CodebaseToText } from './commands/textFromCodebase.js';
import { ModelWebview } from './views/OllamaModelWebview.js';
import { pullModel, deleteModel } from './api/ollamaApi.js';

/**
 * Activates the CaptainCoder extension and registers commands with VS Code.
 * @param {vscode.ExtensionContext} context - The extension context.
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('CaptainCoder is now active!');

    const modelWebview = new ModelWebview();

    context.subscriptions.push(
        vscode.commands.registerCommand('captaincoder.helloWorld', () => {
            vscode.window.showInformationMessage('Hello World from CaptainCoder!');
        }),
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
        }),
        vscode.commands.registerCommand('captaincoder.generateTextFromCodebase', async () => {
            const inputPath = await vscode.window.showInputBox({ prompt: 'Enter the input path (folder or GitHub URL)' });
            const outputPath = await vscode.window.showInputBox({ prompt: 'Enter the output file path' });
            const verbose = await vscode.window.showQuickPick(['true', 'false'], { placeHolder: 'Verbose output?' });
            const excludeHidden = await vscode.window.showQuickPick(['true', 'false'], { placeHolder: 'Exclude hidden files?' });

            if (inputPath && outputPath && verbose !== undefined && excludeHidden !== undefined) {
                const codeToText = new CodebaseToText(inputPath, outputPath, verbose === 'true', excludeHidden === 'true');
                await codeToText.getFile();
                vscode.window.showInformationMessage('Text file generated successfully.');
            } else {
                vscode.window.showErrorMessage('Missing required input.');
            }
        })
    );
}

export function deactivate() {}
