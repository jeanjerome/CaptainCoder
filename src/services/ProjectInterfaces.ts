import * as fs from 'fs-extra';

export interface IProjectTypeDetector {
    detect(workspaceRoot: string): Promise<string>;
}

export interface IProjectFileExcluder {
    shouldExclude(file: string, stats: fs.Stats, projectType: string): boolean;
}

export interface IProjectCodePicker {
    pickCodeContent(workspaceRoot: string, projectType: string): Promise<string>;
}
