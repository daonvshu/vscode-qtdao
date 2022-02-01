import * as vscode from 'vscode';
import path = require('path');
import { load } from './configloader';
import { posix } from 'path';
import { SqliteGenerator } from './generators/sqlitegenerator';
import { MysqlGeneator } from './generators/mysqlgenerator';
import { SqlServerGenerator } from './generators/sqlservergenerator';

export function generateEntityCode(filePath: string) {
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
                switch(entity.dbType) {
                    case 'sqlite':
                        new SqliteGenerator(fileDir, entity).generate();
                        break;
                    case 'mysql':
                        new MysqlGeneator(fileDir, entity).generate();
                        break;
                    case 'sqlserver':
                        new SqlServerGenerator(fileDir, entity).generate();
                        break;
                }
            }

            resolve();
        });
    });
}