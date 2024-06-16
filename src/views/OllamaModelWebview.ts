import * as vscode from 'vscode';
import { listLocalModels, pullModel, deleteModel } from '../api/ollamaApi';
import { ModelDetails } from '../types/ollamaTypes';

export class ModelWebview {
    private panel: vscode.WebviewPanel | undefined;

    public async show() {
        if (this.panel) {
            this.panel.reveal(vscode.ViewColumn.One);
        } else {
            this.panel = vscode.window.createWebviewPanel(
                'modelWebview',
                'Model Manager',
                vscode.ViewColumn.One,
                {
                    enableScripts: true
                }
            );

            this.panel.onDidDispose(() => {
                this.panel = undefined;
            });

            const models = await listLocalModels();
            this.panel.webview.html = this.getWebviewContent(models);

            this.panel.webview.onDidReceiveMessage(async message => {
                switch (message.command) {
                    case 'refresh':
                        const models = await listLocalModels();
                        this.panel!.webview.html = this.getWebviewContent(models);
                        break;
                    case 'delete':
                        await deleteModel(message.model);
                        vscode.window.showInformationMessage(`Model ${message.model} successfully deleted.`);
                        const updatedModels = await listLocalModels();
                        this.panel!.webview.html = this.getWebviewContent(updatedModels);
                        break;
                    case 'download':
                        this.panel!.webview.postMessage({ command: 'downloading', state: true });
                        vscode.window.showInformationMessage(`Starting downloading model ${message.model}...`);
                        await pullModel(message.model);
                        vscode.window.showInformationMessage(`Model ${message.model} successfully downloaded.`);
                        this.panel!.webview.postMessage({ command: 'downloading', state: false });
                        const refreshedModels = await listLocalModels();
                        this.panel!.webview.html = this.getWebviewContent(refreshedModels);
                        break;
                }
            });
        }
    }

    private getWebviewContent(models: ModelDetails[]): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Model Manager</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #1e1e1e;
                        color: #d4d4d4;
                        margin: 0;
                        padding: 20px;
                    }
                    h1 {
                        color: #ffffff;
                    }
                    h2 {
                        color: #ffffff;
                        margin-top: 20px;
                    }
                    button, input {
                        font-size: 1em;
                        padding: 10px;
                        margin: 5px 0;
                        border-radius: 5px;
                        border: none;
                    }
                    button {
                        background-color: #007acc;
                        color: white;
                        cursor: pointer;
                    }
                    button:hover {
                        background-color: #005f99;
                    }
                    input {
                        background-color: #333333;
                        color: #ffffff;
                        border: 1px solid #444444;
                    }
                    .model-list {
                        list-style: none;
                        padding: 0;
                        margin-left: 20px; /* Decalage vers la droite */
                    }
                    .model-list li {
                        display: flex;
                        flex-direction: column;
                        padding: 10px;
                        background-color: #2d2d2d;
                        margin-bottom: 5px;
                        border-radius: 5px;
                    }
                    .model-list li:hover {
                        background-color: #383838;
                    }
                    .model-list li .model-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .model-list li .model-name {
                        font-size: 1.2em;
                        font-weight: bold;
                    }
                    .model-list li .model-tag {
                        font-size: 1.2em;
                        color: #aaaaaa;
                    }
                    .model-list li table {
                        width: 100%;
                        margin-top: 10px;
                        border-collapse: collapse;
                    }
                    .model-list li table, th, td {
                        border: 1px solid #444;
                    }
                    .model-list li table th, .model-list li table td {
                        padding: 8px;
                        text-align: left;
                    }
                    .model-list li table th {
                        background-color: #333;
                        color: #ffffff;
                    }
                    .actions {
                        display: flex;
                        gap: 10px;
                        margin-top: 10px;
                    }
                    .install-section {
                        margin-left: 20px; /* Decalage vers la droite */
                    }
                    .spinner {
                        border: 4px solid rgba(0, 0, 0, 0.1);
                        border-left-color: #007acc;
                        border-radius: 50%;
                        width: 24px;
                        height: 24px;
                        animation: spin 1s linear infinite;
                        display: none;
                    }
                    .spinner.show {
                        display: inline-block;
                    }
                    @keyframes spin {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(360deg);
                        }
                    }
                </style>
            </head>
            <body>
                <h1>Ollama Models Manager</h1>
                <button onclick="refresh()">Refresh</button>
                <h2>Installed Models</h2>
                <ul class="model-list">
                    ${models.map(model => {
                        const [name, tag] = model.name.split(':');
                        return `
                            <li>
                                <div class="model-header">
                                    <div>
                                        <span class="model-name">${name}</span>
                                        <span class="model-tag">:${tag}</span>
                                    </div>
                                    <div class="actions">
                                        <button onclick="deleteModel('${model.name}')">Delete</button>
                                    </div>
                                </div>
                                <table>
                                    <tr>
                                        <th>Modified At</th>
                                        <th>Size</th>
                                        <th>Family</th>
                                        <th>Parameter Size</th>
                                        <th>Quantization Level</th>
                                    </tr>
                                    <tr>
                                        <td>${new Date(model.modified_at).toLocaleString()}</td>
                                        <td>${(model.size / (1024 * 1024)).toFixed(2)} MB</td>
                                        <td>${model.details.family}</td>
                                        <td>${model.details.parameter_size}</td>
                                        <td>${model.details.quantization_level}</td>
                                    </tr>
                                </table>
                            </li>
                        `;
                    }).join('')}
                </ul>
                <h2>Install New Model</h2>
                <div class="install-section">
                    <input type="text" id="newModel" placeholder="Model name">
                    <button onclick="downloadModel()">Install</button>
                    <div class="spinner" id="spinner"></div>
                </div>
                <script>
                    const vscode = acquireVsCodeApi();
                    function refresh() {
                        vscode.postMessage({ command: 'refresh' });
                    }
                    function deleteModel(model) {
                        vscode.postMessage({ command: 'delete', model: model });
                    }
                    function downloadModel() {
                        const model = document.getElementById('newModel').value;
                        vscode.postMessage({ command: 'download', model: model });
                    }
                    window.addEventListener('message', event => {
                        const message = event.data;
                        if (message.command === 'downloading') {
                            const spinner = document.getElementById('spinner');
                            if (message.state) {
                                spinner.classList.add('show');
                            } else {
                                spinner.classList.remove('show');
                            }
                        }
                    });
                </script>
            </body>
            </html>
        `;
    }
}
