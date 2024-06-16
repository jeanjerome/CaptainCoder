import * as vscode from 'vscode';
import { listLocalModels } from '../api/ollamaApi';

class ModelTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
    }

    contextValue = 'model';
}

export class ModelTreeDataProvider implements vscode.TreeDataProvider<ModelTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ModelTreeItem | undefined | void> = new vscode.EventEmitter<ModelTreeItem | undefined | void>();
    //readonly onDidChangeTreeData: vscode.Event<ModelTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    constructor() {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ModelTreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: ModelTreeItem): Promise<ModelTreeItem[]> {
        if (element) {
            return [];
        } else {
            const models = await listLocalModels();
            return models.map(model => new ModelTreeItem(model, vscode.TreeItemCollapsibleState.None, {
                command: 'captaincoder.deleteModel',
                title: 'Delete Model',
                arguments: [model]
            }));
        }
    }
}

export const modelTreeDataProvider = new ModelTreeDataProvider();
