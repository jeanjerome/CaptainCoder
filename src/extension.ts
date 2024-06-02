import * as vscode from 'vscode';
import { OllamaService } from './api/ollamaService';
import { CacheManager } from './utils/cacheManager';
import { autocompleteCommand } from './commands/autocomplete';
import { provideCompletionItems } from './completionProvider';

let VSConfig: vscode.WorkspaceConfiguration;
let apiEndpoint: string;
let apiModel: string;
let apiMessageHeader: string;
let apiTemperature: number;
let numPredict: number;
let promptWindowSize: number;
let completionKeys: string;
let responsePreview: boolean | undefined;
let responsePreviewMaxTokens: number;
let responsePreviewDelay: number;
let continueInline: boolean | undefined;

function updateVSConfig() {
  VSConfig = vscode.workspace.getConfiguration("captaincoder");
  apiEndpoint = VSConfig.get("endpoint") || "http://localhost:11434/api/generate";
  apiModel = VSConfig.get("model") || "codestral:22b-v0.1-q4_K_M";
  apiMessageHeader = VSConfig.get("message header") || "";
  numPredict = VSConfig.get("max tokens predicted") || 1000;
  promptWindowSize = VSConfig.get("prompt window size") || 2000;
  completionKeys = VSConfig.get("completion keys") || " ";
  responsePreview = VSConfig.get("response preview");
  responsePreviewMaxTokens = VSConfig.get("preview max tokens") || 50;
  responsePreviewDelay = VSConfig.get("preview delay") || 0;
  continueInline = VSConfig.get("continue inline");
  apiTemperature = VSConfig.get("temperature") || 0.5;
}

updateVSConfig();

vscode.workspace.onDidChangeConfiguration(updateVSConfig);

function messageHeaderSub(document: vscode.TextDocument) {
  const sub = apiMessageHeader
    .replace("{LANG}", document.languageId)
    .replace("{FILE_NAME}", document.fileName)
    .replace("{PROJECT_NAME}", vscode.workspace.name || "Untitled");
  return sub;
}

function activate(context: vscode.ExtensionContext) {
  const ollamaService = new OllamaService(apiEndpoint, apiModel, apiTemperature, numPredict);
  const cacheManager = new CacheManager();

  const completionProvider = vscode.languages.registerCompletionItemProvider("*", {
    provideCompletionItems: (document, position, cancellationToken) =>
      provideCompletionItems(document, position, cancellationToken, ollamaService, messageHeaderSub(document), promptWindowSize, responsePreview!, responsePreviewMaxTokens, responsePreviewDelay, continueInline!)
  }, ...completionKeys.split(""));

  const externalAutocompleteCommand = vscode.commands.registerTextEditorCommand(
    "captaincoder.autocomplete",
    (textEditor, _, cancellationToken) =>
      autocompleteCommand(textEditor, cancellationToken, ollamaService, messageHeaderSub(textEditor.document), promptWindowSize)
  );

  context.subscriptions.push(completionProvider, externalAutocompleteCommand);
}

function deactivate() { }

module.exports = {
  activate,
  deactivate,
};
