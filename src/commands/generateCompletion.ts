import * as vscode from 'vscode';
import { generateCompletion } from '../api/ollamaApi.js';
import { getContentWindow } from '../utils/contentWindow.js';
import { OllamaRequest, ModelDetails } from '../types/ollamaTypes.js';
import { getAdditionalContext } from '../utils/contextHelper.js';


export async function handleGenerateCompletion() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return vscode.window.showErrorMessage('No active editor found.');
    }

    const prompt = editor.document.getText(editor.selection);
    const model = vscode.workspace.getConfiguration('captaincoder').get<string>('model');

    if (!model) {
        return vscode.window.showErrorMessage('No model configured in captaincoder.model.');
    }

    const position = editor.selection.active;
    const document = editor.document;
    const windowSize = 100; // Adjust as necessary
    const [prefix, suffix] = getContentWindow(document, position, windowSize);
    const additionalContext = getAdditionalContext(document, position);

    try {
        vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: "Generating completion...",
                cancellable: true,
            },
            async (progress, token) => {
                const request = {
                    model,
                    prompt: `${prefix}\n${prompt}\n${suffix}`,
                    stream: true,
                    options: {
                        temperature: 0.6,
                        num_predict: 100,
                        top_k: 30,
                        top_p: 0.2,
                        repeat_penalty: 1.1,
                        stop: ["<|endoftext|>", "\n"]
                    }
                };

                const response = await generateCompletion(request);
                let accumulatedResponse = '';

                for await (const chunk of response) {
                    if (token.isCancellationRequested) {
                        break;
                    }
                    accumulatedResponse += chunk.response;
                    editor.edit(editBuilder => {
                        editBuilder.replace(editor.selection, accumulatedResponse);
                    });
                }

                if (!token.isCancellationRequested) {
                    vscode.window.showInformationMessage('Completion generated successfully.');
                }
            }
        );
    } catch (error) {
        vscode.window.showErrorMessage(`Error generating completion: ${error instanceof Error ? error.message : String(error)}`);
    }
}


function getPromptForModel(model: ModelDetails, beginning: string, middle: string, ending: string, context: string): string {
    if (model.details.family === 'qwen') {
        return `<fim_prefix>${beginning}<fim_suffix>${ending}<fim_middle>${middle}`;
    } else if (model.details.family === 'llama') {
        return `${context}\n${beginning} ${middle} ${ending}`;
    }
    // Add more conditions for other families if needed
    return `${context}\n${beginning} ${middle} ${ending}`;
}
