import * as vscode from 'vscode';

export async function configureParameters() {
    const config = vscode.workspace.getConfiguration('captaincoder');

    const model = await vscode.window.showInputBox({
        prompt: 'Enter the model name',
        value: config.get('model', 'qwen2:7b')
    });

    if (model) {
        await config.update('model', model, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Model set to ${model}`);
    }

    // Ajoutez d'autres paramètres à configurer ici
}
