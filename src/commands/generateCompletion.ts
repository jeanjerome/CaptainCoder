import * as vscode from 'vscode';
import { generateCompletion as generateCompletionFromApi } from '../api/ollamaApi';

export async function handleGenerateCompletion() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return vscode.window.showErrorMessage('No active editor found.');
    }

    const prompt = editor.document.getText(editor.selection);
    const model = vscode.workspace.getConfiguration('captaincoder').get('model', 'qwen2:0.5b');

    try {
        const response = await generateCompletionFromApi({ model, prompt });
        editor.edit(editBuilder => {
            editBuilder.replace(editor.selection, response.response);
        });
    } catch (error) {
        if (error instanceof Error) {
            vscode.window.showErrorMessage(`Error generating completion: ${error.message}`);
        } else {
            vscode.window.showErrorMessage('An unknown error occurred while generating completion.');
        }
    }
}
