import fg from 'fast-glob';
import * as fs from 'fs-extra';
import * as path from 'path';
import { IProjectCodePicker, IProjectFileExcluder } from './ProjectInterfaces';

export class ProjectCodePicker implements IProjectCodePicker {
    constructor(private fileExcluder: IProjectFileExcluder) {}

    async pickCodeContent(workspaceRoot: string, projectType: string): Promise<string> {
        try {
            const files = await fg("**/*", { cwd: workspaceRoot, onlyFiles: true });
            let codeContent = '';

            for (const file of files) {
                const filePath = path.join(workspaceRoot, file);
                const stats = await fs.stat(filePath);

                if (this.fileExcluder.shouldExclude(file, stats, projectType)) {
                    continue;
                }

                const fileContent = await fs.readFile(filePath, 'utf8');
                codeContent += `\n---\nFile: ${file}\n---\n${fileContent}\n`;
            }

            return codeContent;
        } catch (err: any) {
            throw new Error(`Error gathering files: ${err.message}`);
        }
    }
}
