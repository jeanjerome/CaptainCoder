import * as fs from 'fs';
import * as path from 'path';
import { simpleGit, SimpleGit } from 'simple-git';
import * as tmp from 'tmp';

export class CodebaseToText {
    inputPath: string;
    outputPath: string;
    verbose: boolean;
    excludeHidden: boolean;
    tempFolderPath: string | null;
    git: SimpleGit;

    constructor(inputPath: string, outputPath: string, verbose: boolean, excludeHidden: boolean) {
        this.inputPath = inputPath;
        this.outputPath = outputPath;
        this.verbose = verbose;
        this.excludeHidden = excludeHidden;
        this.tempFolderPath = null;
        this.git = simpleGit();
    }

    private parseFolder(folderPath: string): string {
        let tree = '';
        const walk = (dir: string, level: number) => {
            const indent = ' '.repeat(4 * level);
            tree += `${indent}${path.basename(dir)}/\n`;
            fs.readdirSync(dir).forEach(file => {
                const filePath = path.join(dir, file);
                if (fs.statSync(filePath).isDirectory()) {
                    walk(filePath, level + 1);
                } else {
                    tree += `${' '.repeat(4 * (level + 1))}${file}\n`;
                }
            });
        };
        walk(folderPath, 0);
        if (this.verbose) {
            console.log(`The file tree to be processed:\n${tree}`);
        }
        return tree;
    }

    private getFileContents(filePath: string): string {
        return fs.readFileSync(filePath, 'utf-8');
    }

    private isHiddenFile(filePath: string): boolean {
        const components = filePath.split(path.sep);
        return components.some(c => c.startsWith('.') || c.startsWith('__'));
    }

    private processFiles(folderPath: string): string {
        let content = '';
        const walk = (dir: string) => {
            fs.readdirSync(dir).forEach(file => {
                const filePath = path.join(dir, file);
                if (this.excludeHidden && this.isHiddenFile(filePath)) {
                    if (this.verbose) {
                        console.log(`Ignoring hidden file ${filePath}`);
                    }
                    return;
                }
                try {
                    if (this.verbose) {
                        console.log(`Processing: ${filePath}`);
                    }
                    const fileContent = this.getFileContents(filePath);
                    content += `\n\n${filePath}\n`;
                    content += `File type: ${path.extname(filePath)}\n`;
                    content += fileContent;
                    content += `\n\n${'-'.repeat(50)}\nFile End\n${'-'.repeat(50)}\n`;
                } catch {
                    console.log(`Couldn't process ${filePath}`);
                }
            });
        };
        walk(folderPath);
        return content;
    }

    private async cloneGitHubRepo(): Promise<void> {
        this.tempFolderPath = tmp.dirSync({ prefix: 'github_repo_' }).name;
        if (this.tempFolderPath) {
            try {
                await this.git.clone(this.inputPath, this.tempFolderPath);
                if (this.verbose) {
                    console.log('GitHub repository cloned successfully.');
                }
            } catch (e) {
                console.log(`Error cloning GitHub repository: ${e}`);
            }
        } else {
            console.log('Failed to create temporary folder.');
        }
    }

    private isGitHubRepo(): boolean {
        return this.inputPath.startsWith('https://github.com/') || this.inputPath.startsWith('git@github.com:');
    }

    private cleanUpTempFolder(): void {
        if (this.tempFolderPath) {
            fs.rmSync(this.tempFolderPath, { recursive: true, force: true });
        }
    }

    public async getText(): Promise<string> {
        let folderStructure = '';
        let fileContents = '';

        if (this.isGitHubRepo()) {
            await this.cloneGitHubRepo();
            folderStructure = this.parseFolder(this.tempFolderPath!);
            fileContents = this.processFiles(this.tempFolderPath!);
        } else {
            folderStructure = this.parseFolder(this.inputPath);
            fileContents = this.processFiles(this.inputPath);
        }

        const folderStructureHeader = 'Folder Structure';
        const fileContentsHeader = 'File Contents';
        const delimiter = '-'.repeat(50);

        const finalText = `${folderStructureHeader}\n${delimiter}\n${folderStructure}\n\n${fileContentsHeader}\n${delimiter}\n${fileContents}`;
        return finalText;
    }

    public async getFile(): Promise<void> {
        const text = await this.getText();
        fs.writeFileSync(this.outputPath, text);
    }
}
