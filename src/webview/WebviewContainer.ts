import * as vscode from 'vscode';
import * as path from 'path';

interface ExtensionMessage {
    command: string;
    question?: string;
}

interface UIMessage {
    question: string;
    answer: string;
}

export default class WebviewContainer {
    panel: vscode.WebviewPanel;
    private messages: { question: string, answer: string }[] = [];

    constructor(
        private extensionPath: string,
        private onDidDispose: () => void,
        private onDidChangeViewState: (isVisible: Boolean) => void
    ) {
        const baseVuePath = path.join(extensionPath, "static");
        const staticPath = vscode.Uri.file(baseVuePath).with({
            scheme: "vscode-resource"
        });

        this.panel = vscode.window.createWebviewPanel(
            "chatPanel",
            "Captain Coder Chat",
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.file(baseVuePath)]
            }
        );

        this.panel.webview.html = this.getWebviewContent(this.panel.webview, vscode.Uri.file(this.extensionPath));

        // Handle on did dispose for webview panel
        this.panel.onDidDispose(() => this.onDidDispose());

        // Handle tab switching event
        this.panel.onDidChangeViewState(event => {
            const { visible } = event.webviewPanel;
            this.onDidChangeViewState(visible);
        });
    }

    setMessageHandler(msgHandler: (message: ExtensionMessage) => void) {
        this.panel.webview.onDidReceiveMessage(msgHandler);
    }

    update(uiMessage: UIMessage) {
        this.messages.push(uiMessage);
        this.panel.webview.postMessage(this.messages);
    }

    reveal() {
        this.panel.reveal();
    }

    isVisible() {
        return this.panel.visible;
    }

    private getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'static', 'js', 'app.js'));
        const markedUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'static', 'js', 'marked.min.js'));

        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'static', 'css', 'app.css'));
        const nonce = getNonce();

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta
            http-equiv="Content-Security-Policy"
            content="default-src 'none'; img-src ${webview.cspSource} data:; script-src 'nonce-${nonce}'; style-src ${webview.cspSource} 'unsafe-inline';"
            />
            <title>Captain Coder Chat</title>

            <link href="${styleUri}" rel="stylesheet">
        </head>
        <body>
            <div id="app">
                <div id="chat-container" class="markdown-body"></div>
                <textarea id="question-input" placeholder="Type your question here..."></textarea>
                <button id="send-button">Send</button>
            </div>
            <script nonce="${nonce}" src="${markedUri}"></script>
            <script nonce="${nonce}" src="${scriptUri}"></script>
            <script nonce="${nonce}">
                const vscode = acquireVsCodeApi();
                document.getElementById('send-button').addEventListener('click', () => {
                    const question = document.getElementById('question-input').value;
                    document.getElementById('question-input').value = ''; // Clear the input
                    vscode.postMessage({ command: 'askQuestion', question });
                });

                window.addEventListener('message', event => {
                    const messages = event.data;
                    const chatContainer = document.getElementById('chat-container');
                    chatContainer.innerHTML = ''; // Clear previous content
                    messages.forEach((msg) => {
                        const questionElem = document.createElement('div');
                        questionElem.classList.add('message', 'question');
                        questionElem.innerHTML = '<img src="${webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'static', 'icons', 'user.png'))}" class="icon" alt="User">' + msg.question;

                        const answerElem = document.createElement('div');
                        answerElem.classList.add('message', 'answer');
                        answerElem.innerHTML = '<img src="${webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'static', 'icons', 'captaincoder.png'))}" class="icon" alt="Captain Coder"> <div class="markdown-body">' + marked.parse(msg.answer) + '</div>';

                        chatContainer.appendChild(questionElem);
                        chatContainer.appendChild(answerElem);
                    });
                });
            </script>
        </body>
        </html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
