import * as vscode from 'vscode';
import path = require('path');
import { load } from './configloader';

export function generateEntityCode(filePath: string) {
    vscode.window.withProgress({
        cancellable: false,
        location: vscode.ProgressLocation.Notification,
        title: "Generating entities..."
    }, (process, token) => {
        return new Promise<void>(async resolve => {
            let entity = await load(filePath);
            let fileDir = path.dirname(filePath);
            resolve();
        });
    });
}