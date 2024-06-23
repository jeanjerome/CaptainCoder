import * as vscode from 'vscode';
import { ApiClient } from './api';
import { apiUrl } from './config';


export function activate(context: vscode.ExtensionContext) {
    const apiClient = new ApiClient(apiUrl);

    context.subscriptions.push(
        vscode.commands.registerCommand('captaincoder.listModels', async () => {
            try {
                const data = await apiClient.listModels();
                vscode.window.showInformationMessage('Data fetched successfully!');
                console.log('Data:', data);
            } catch (error: any) {
                vscode.window.showErrorMessage('Error fetching data: ' + error.message);
            }
        })
    );

	context.subscriptions.push(
        vscode.commands.registerCommand('captaincoder.pullModel', async () => {
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

                        await apiClient.pullModel(modelName, (data) => {
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
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('captaincoder.generateText', async () => {
            try {
                const model = 'mixtral';
                const prompt = 'Why is the sky blue?';
                await apiClient.generate(model, prompt, (data) => {
                    console.log('Generated Text:', data);
                    vscode.window.showInformationMessage('Text generated successfully!');
                });
            } catch (error: any) {
                vscode.window.showErrorMessage('Error generating text: ' + error.message);
            }
        })
    );

}

export function deactivate() {}


function createFiraCodeProgressBar(percentage: number, length: number, animationFrame: number): string {
	const filledLength = Math.round(length * (percentage / 100));
	const emptyLength = length - filledLength;

	const blocks = ['▏', '▎', '▍', '▌', '▋', '▊', '▉', '█'];
	const animatedBlock = blocks[animationFrame];

	let filledBar = '█'.repeat(Math.max(0, filledLength - 1)) + animatedBlock;
	if (filledLength === 0) {
		filledBar = animatedBlock + '░'.repeat(emptyLength - 1);
	} else if (filledLength >= length) {
		filledBar = '█'.repeat(length);
	}

	const emptyBar = '░'.repeat(emptyLength);

	return filledBar + emptyBar;
}
