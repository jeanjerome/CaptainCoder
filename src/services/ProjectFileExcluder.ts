import * as fs from 'fs-extra';
import * as path from 'path';
import { IProjectFileExcluder } from './ProjectInterfaces';

export class ProjectFileExcluder implements IProjectFileExcluder {
    private excludedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.mp4', '.avi', '.mkv', '.mov', '.exe', '.dll', '.bin', '.class', '.lock'];
    private excludedDirectories: { [key: string]: string[] } = {
        node: ['node_modules', '.git', 'dist', 'build', 'coverage', 'out'],
        maven: ['target', '.git'],
        gradle: ['build', '.git'],
        python: ['.venv', '__pycache__', '.git'],
        unknown: ['.git']
    };
    private excludedFiles: { [key: string]: string[] } = {
        node: ['package-lock.json'],
        maven: [],
        gradle: [],
        python: [],
        unknown: []
    };

    shouldExclude(file: string, stats: fs.Stats, projectType: string): boolean {
        const fileExtension = path.extname(file).toLowerCase();
        const directoriesToExclude = this.excludedDirectories[projectType] || this.excludedDirectories['unknown'];
        const filesToExclude = this.excludedFiles[projectType] || this.excludedFiles['unknown'];

        if (this.excludedExtensions.includes(fileExtension)) {
            return true;
        }

        if (stats.size > 1024 * 1024) {
            return true;
        }

        if (filesToExclude.includes(path.basename(file))) {
            return true;
        }

        for (const dir of directoriesToExclude) {
            if (file.includes(dir)) {
                return true;
            }
        }

        return false;
    }
}
