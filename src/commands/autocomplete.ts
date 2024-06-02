import * as vscode from 'vscode';
import axios from 'axios';
import { OllamaService } from '../api/ollamaService';

export async function autocompleteCommand(
    textEditor: vscode.TextEditor,
    cancellationToken: vscode.CancellationToken | undefined,
    ollamaService: OllamaService,
    messageHeader: string,
    promptWindowSize: number
) {
    const document = textEditor.document;
    const position = textEditor.selection.active;
    const prompt = document.getText(new vscode.Range(document.lineAt(0).range.start, position))
    .slice(-promptWindowSize);

    vscode.window.withProgress(
        {
        location: vscode.ProgressLocation.Notification,
        title: "Captain Coder",
        cancellable: true,
        },
        async (progress, progressCancellationToken) => {
        try {
            progress.report({ message: "Starting model..." });

            const axiosCancelToken = new axios.CancelToken(c => {
                const cancelPost = () => c("Autocompletion request terminated by user cancel");
                if (cancellationToken) {cancellationToken.onCancellationRequested(cancelPost);}
                progressCancellationToken.onCancellationRequested(cancelPost);
                vscode.workspace.onDidCloseTextDocument(cancelPost);
            });

            const response = await ollamaService.fetchCompletion(prompt, messageHeader, axiosCancelToken);
            let accumulatedResponse = '';
            let currentPosition = position;

            response.data.on('data', async (d: Uint8Array) => {
            progress.report({ message: "Generating..." });

            const { response: completionFragment, done } = JSON.parse(d.toString());
                    if (completionFragment) {
                        accumulatedResponse += completionFragment;
                    }

                    if (done) {
                        const edit = new vscode.WorkspaceEdit();
                        edit.insert(document.uri, currentPosition, accumulatedResponse);
                        await vscode.workspace.applyEdit(edit);

                        const newPosition = currentPosition.translate(
                            accumulatedResponse.split("\n").length - 1,
                            accumulatedResponse.split("\n").pop()?.length || 0
                        );
                        textEditor.selection = new vscode.Selection(position, newPosition);
                        currentPosition = newPosition;

                        progress.report({ message: "Ollama completion finished." });
                    }
                });

        await new Promise(resolve => response.data.on('end', () => resolve(true)));

      } catch (err: any) {
        vscode.window.showErrorMessage("Ollama encountered an error: " + err.message);
        console.log(err);
      }
    }
  );
}
