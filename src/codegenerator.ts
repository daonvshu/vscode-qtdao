import * as vscode from 'vscode';
import path = require('path');
import { load } from './configloader';
import { SqliteGenerator } from './generators/sqlitegenerator';
import { MysqlGeneator } from './generators/mysqlgenerator';
import { SqlServerGenerator } from './generators/sqlservergenerator';

export function generateEntityCode(filePath: string, templateDir: string) {
    vscode.window.withProgress({
        cancellable: false,
        location: vscode.ProgressLocation.Notification,
        title: "Generating entities..."
    }, (process, token) => {
        return new Promise<void>(async resolve => {
            let entity = await load(filePath);
            
            /*if (vscode.window.activeTextEditor) {
                let fileDir = path.dirname(filePath);
                const folderUri = vscode.window.activeTextEditor.document.uri;
                const fileUri = folderUri.with({ path: posix.join(fileDir, 'tmp.entity.json') });
                
                vscode.workspace.fs.writeFile(fileUri, Buffer.from(JSON.stringify(entity), 'utf-8'));
            }*/
            let fileDir = path.dirname(filePath);
            if (entity !== null) {
                let changed = false;
                switch(entity.dbType) {
                    case 'sqlite':
                        changed = new SqliteGenerator(fileDir, entity, templateDir).generate();
                        break;
                    case 'mysql':
                        changed = new MysqlGeneator(fileDir, entity, templateDir).generate();
                        break;
                    case 'sqlserver':
                        changed = new SqlServerGenerator(fileDir, entity, templateDir).generate();
                        break;
                }
                if (!changed) {
                    vscode.window.showWarningMessage('No changed!');
                } else {
                    vscode.window.showInformationMessage('Generated successfully!');
                }
            }

            resolve();
        });
    });
}