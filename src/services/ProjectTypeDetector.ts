import fg from 'fast-glob';
import { IProjectTypeDetector } from './ProjectInterfaces';

export class ProjectTypeDetector implements IProjectTypeDetector {
    async detect(workspaceRoot: string): Promise<string> {
        const projectFiles = await fg(['package.json', 'pom.xml', 'build.gradle', 'requirements.txt'], { cwd: workspaceRoot, onlyFiles: true });

        if (projectFiles.includes('package.json')) {
            return 'node';
        } else if (projectFiles.includes('pom.xml')) {
            return 'maven';
        } else if (projectFiles.includes('build.gradle')) {
            return 'gradle';
        } else if (projectFiles.includes('requirements.txt')) {
            return 'python';
        } else {
            return 'unknown';
        }
    }
}
