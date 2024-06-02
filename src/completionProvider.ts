import * as vscode from 'vscode';
import { OllamaService } from './api/ollamaService';

export async function provideCompletionItems(
  document: vscode.TextDocument,
  position: vscode.Position,
  cancellationToken: vscode.CancellationToken,
  ollamaService: OllamaService,
  messageHeader: string,
  promptWindowSize: number,
  responsePreview: boolean,
  responsePreviewMaxTokens: number,
  responsePreviewDelay: number,
  continueInline: boolean
) {
  const item = new vscode.CompletionItem("Autocomplete with Ollama");
  item.insertText = new vscode.SnippetString('${1:}');

  if (responsePreview) { await new Promise(resolve => setTimeout(resolve, responsePreviewDelay * 1000)); }
  if (cancellationToken.isCancellationRequested) {
    return [item];
  }

  if (responsePreview) {
    let prompt = document.getText(new vscode.Range(document.lineAt(0).range.start, position));
    prompt = prompt.substring(Math.max(0, prompt.length - promptWindowSize), prompt.length);
    const response_preview = await ollamaService.fetchPreview(prompt, messageHeader, responsePreviewMaxTokens, cancellationToken);

    if (response_preview.data.response.trim() !== "") {
      item.label = response_preview.data.response.trimStart();
      item.insertText = response_preview.data.response.trimStart();
    }
  }

  item.documentation = new vscode.MarkdownString('Press `Enter` to get an autocompletion from Ollama');
  if (continueInline || !responsePreview) {
    item.command = {
      command: 'captaincoder.autocomplete',
      title: 'Autocomplete with Ollama',
      arguments: [cancellationToken]
    };
  }
  return [item];
}
