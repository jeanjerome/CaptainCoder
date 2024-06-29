import * as vscode from 'vscode';
import * as path from 'path';
import { IProjectTypeDetector, IProjectCodePicker } from '../services/ProjectInterfaces';
import * as fs from 'fs-extra';

export class PickProjectFilesCommand {
    constructor(
        private projectTypeDetector: IProjectTypeDetector,
        private projectCodePicker: IProjectCodePicker
    ) {}

    async execute() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace is opened.');
            return;
        }

        const workspaceRoot = workspaceFolders[0].uri.fsPath;

        const projectType = await this.projectTypeDetector.detect(workspaceRoot);

        let codeContent = await this.projectCodePicker.pickCodeContent(workspaceRoot, projectType);

        const outputPath = path.join(workspaceRoot, 'code_content.txt');
        await fs.writeFile(outputPath, codeContent, 'utf8');

        vscode.window.showInformationMessage(`Files content picked in ${outputPath}`);
    }
}
