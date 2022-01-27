import * as vscode from 'vscode';
import fs = require('fs');

import { parseString } from 'xml2js';
import { Entity, Field, Index, Table } from './generators/entity';

export function load(filePath: string): Promise<Entity | null> {
    var fileContent = fs.readFileSync(filePath).toString();
    return new Promise<Entity | null>(resolve => {
        parseString(fileContent, (err: Error, content: any) => {
            if (err) {
                vscode.window.showErrorMessage(err.message);
                resolve(null);
            } else {
                resolve(resolveContent(content));
            }
        });
    });
}

interface AttributeOption {
    defaultValue?: string,
    error?: string,
    key: string
}

function readAttribute(object: any, option: AttributeOption): string {
    let v = object['$'][option.key];
    if (v) {
        return v as string;
    }
    if (option.defaultValue !== undefined) {
        return option.defaultValue;
    }
    if (option.error) {
        throw Error(option.error);
    }
    throw Error(`attribute not found:${option.key}`);
}

function readAttributeDefaultEmpty(object: any, key: string) {
    return readAttribute(object, {key: key, defaultValue: ''});
}

function readAttributeBool(object: any, key: string): boolean {
    let v = readAttribute(object, {key: key, defaultValue: '0'});
    return v === '1' || v === 'true';
}

function resolveContent(object: any): Entity | null {
    console.log(object);
    try {
        let entity = new Entity();

        let dao = object['dao'];
        if (!dao) {
            throw Error('the root name is not dao!');
        }
        entity.prefix = readAttribute(dao, {error: '\'prefix\' not provided', key: 'prefix'});

        entity.dbType = readAttribute(dao, {key: 'db'});
        if (['sqlite', 'mysql', 'sqlserver'].indexOf(entity.dbType) === -1) {
            throw Error('unknown database type declaration');
        }

        let tbs = dao['tb'];
        for (let i = 0; i < tbs.length; i++) {
            let tb = tbs[i];

            let table = new Table();

            table.name = readAttributeDefaultEmpty(tb, 'name');
            if (table.name.length === 0) {
                continue;
            }
            
            table.metaType = readAttributeBool(tb, 'declaremetatype');
            table.engine = readAttributeDefaultEmpty(tb, 'engine');

            let items = tb['item'];
            for (let j = 0; j < items.length; j++) {
                let item = items[j];
                let field = new Field();

                field.name = readAttributeDefaultEmpty(item, 'name');
                if (field.name.length === 0) {
                    continue;
                }

				field.type = readAttribute(item, {key: 'type', defaultValue: 'int'});
				field.note = readAttributeDefaultEmpty(item, 'note');
				field.constraint = readAttributeDefaultEmpty(item, 'constraints');
				field.defaultValue = readAttributeDefaultEmpty(item, 'default');
				field.jsonKey = readAttributeDefaultEmpty(item, 'jsonkey');
				field.jsonTimeFormat = readAttributeDefaultEmpty(item, 'jsontimeformat');
				field.autoIncrement = readAttributeBool(item, 'autoincrement');
				field.transient = readAttributeBool(item, 'transient');
				//extra
				field.bitSize = +readAttribute(item, {key: 'bitsize', defaultValue: '0'});
				field.decimalPoint = +readAttribute(item, {key: 'decimal-d', defaultValue: '0'});

                table.fields.push(field);
            }

            let indexes = tb['index'];
            if (indexes) {
                for (let j = 0; j < indexes.length; j++) {
                    let index = indexes[j];
                    let tbIndex = new Index();

                    if (entity.dbType !== 'sqlserver') {
                        tbIndex.indexType = readAttribute(index, {key: 'type', defaultValue: 'index'});
                    } else {
                        tbIndex.indexType = readAttribute(index, {key: 'type', defaultValue: 'nonclustered'});
                        
                        let optionIgnoreDupKey = readAttributeDefaultEmpty(index, 'ignore_dup_key');
                        if (optionIgnoreDupKey.length !== 0) {
                            tbIndex.indexOptions += `IGNORE_DUP_KEY=${optionIgnoreDupKey},`;
                        }
                        let allowRowLocks = readAttributeDefaultEmpty(index, 'allow_row_locks');
                        if (allowRowLocks.length !== 0) {
                            tbIndex.indexOptions += `ALLOW_ROW_LOCKS=${allowRowLocks},`;
                        }
                        let allowPageLocks = readAttributeDefaultEmpty(index, 'allow_page_locks');
                        if (allowPageLocks.length !== 0) {
                            tbIndex.indexOptions += `ALLOW_PAGE_LOCKS=${allowPageLocks},`;
                        }
                        let dataCompression = readAttributeDefaultEmpty(index, 'data_compression');
                        if (dataCompression.length !== 0) {  
                            tbIndex.indexOptions += `DATA_COMPRESSION=${dataCompression},`;
                        }
                        if (tbIndex.indexOptions.length !== 0) {
                            tbIndex.indexOptions = tbIndex.indexOptions.slice(0, -1);
                        }
                    }
                    let fields = index['field'];
                    for (let k = 0; k < fields.length; k++) {
                        let field = fields[k];
                        let seq = readAttributeDefaultEmpty(field, 'seq');
                        if (seq.length === 0) {
                            tbIndex.fields.push(field['_']);
                        } else {
                            tbIndex.fields.push(field['_'] + ' ' + seq);
                        }
                    }
                    table.indexes.push(tbIndex);
                }
            }

            let constructors = tb['constructor'];
            if (constructors) {
                for (let j = 0; j < constructors.length; j++) {
                    let constructor = constructors[j];
                    if (constructor) {
                        let fields = constructor['field'];
                        if (fields) {
                            let fieldStrs = [];
                            for (let k = 0; k < fields.length; k++) {
                                fieldStrs.push(fields[k]);
                            }
                            table.customConstructor.push(fieldStrs);
                        }
                    }
                }
            }

            entity.tables.push(table);
        }
        
        return entity;
    } catch (e) {
        vscode.window.showErrorMessage('Parse Error:' + (e as Error).message);
    }
    return null;
}