import * as vscode from 'vscode';
import { Command } from './Command';
import { ApiClient } from '../services/ApiClient';
import { createFiraCodeProgressBar } from '../services/ProgressBar';

export class PullModelCommand implements Command {
    constructor(private apiClient: ApiClient) {}

    async execute() {
        try {
            const modelName = await vscode.window.showInputBox({
                placeHolder: 'Enter the model name to download',
            });

            if (modelName) {
                await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: `Downloading model ${modelName}`,
                    cancellable: true
                }, async (progress, token) => {
                    token.onCancellationRequested(() => {
                        console.log('User canceled the download');
                    });

                    let totalSize = 0;
                    let completedSize = 0;
                    let animationFrame = 0;

                    await this.apiClient.pullModel(modelName, (data) => {
                        if (data.total && data.completed) {
                            totalSize = data.total;
                            completedSize = data.completed;
                            const percentage = Math.round((completedSize / totalSize) * 100);
                            animationFrame = (completedSize % 32 === 0) ? (animationFrame + 1) % 8 : animationFrame;

                            const progressBar = createFiraCodeProgressBar(percentage, 20, animationFrame);
                            progress.report({ increment: 0, message: `[${progressBar}] ${percentage}%` });
                        } else if (data.status) {
                            progress.report({ message: data.status });
                        }
                        if (data.status === 'success') {
                            vscode.window.showInformationMessage(`Model ${modelName} downloaded successfully!`);
                        }
                    });
                });
            }
        } catch (error: any) {
            vscode.window.showErrorMessage('Error pulling model: ' + error.message);
        }
    }
}
