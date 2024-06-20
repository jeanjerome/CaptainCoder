import * as vscode from 'vscode';
import { Position, TextDocument } from 'vscode';

export function getAdditionalContext(document: TextDocument, position: Position): string {
    const surroundingText = getSurroundingText(document, position, 500); // Adjust the context window size as needed
    return `Context: ${surroundingText}`;
}

function getSurroundingText(document: TextDocument, position: Position, windowSize: number): string {
    const start = new Position(Math.max(position.line - windowSize, 0), 0);
    const end = new Position(Math.min(position.line + windowSize, document.lineCount - 1), 0);
    return document.getText(new vscode.Range(start, end));
}
