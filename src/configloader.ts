import * as vscode from 'vscode';
import fs = require('fs');

import { parseString } from 'xml2js';
import { Entity, Field, ForeignKey, Index, Table } from './generators/entity';

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
    let v;
    if (object['$'] && (v = object['$'][option.key])) {
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

function checkUniqueForeignReferenceKey(entity: Entity, foreignkey: ForeignKey) {
    if (foreignkey.referTable.isEmpty()) {
        return;
    }
    let referTb = entity.tables.find(tb => tb.name === foreignkey.referTable) || null;
    if (referTb === null) {
        throw Error(`The table '${foreignkey.table}' cannot find foreign key reference table: '${foreignkey.referTable}'`);
    }
    let referFields = foreignkey.referFields.filter((_, index) => index % 2 === 1);
    //check field unique or primary key
    if (referFields.length === 1) {
        let isUniqueField = referTb?.fields.some(field =>
            field.name === referFields[0] &&
            (field.constraint === "unique" || field.constraint === "primary key")
        );
        if (!isUniqueField) {
            throw Error(`The table '${foreignkey.table}' foreign key referenced field that not defined unique or primary key in '${foreignkey.referTable}': ${referFields[0]}`);
        }
        return;
    }

    //check composite unique index
    let isUniqueIndex = referTb?.indexes.some(index => 
        indexIsUniqueIndex(index.indexType, entity.dbType) &&
        arraysEqual([...referFields].sort(), [...index.fields].sort())
    );

    function indexIsUniqueIndex(indexType: string, dbType: string): Boolean {
        if (dbType === "sqlserver") {
            return indexType === "unique clustered" || indexType === "unique nonclustered";
        }
        return indexType === "unique index";
    }
    
    function arraysEqual(a: any[], b: any[]): Boolean {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i].split(' ')[0]) {
                return false;
            }
        }
        return true;
    }
    
    if (!isUniqueIndex) {
        throw Error(`The table '${foreignkey.table}' composite foreign key referenced non-unique index in '${foreignkey.referTable}': ${referFields.join(' ')}`);
    }
}

function resolveContent(object: any): Entity | null {
    //console.log(object);
    try {
        let entity = new Entity();

        let dao = object['dao'];
        if (!dao) {
            throw Error('the root name is not dao!');
        }
        entity.prefix = readAttributeDefaultEmpty(dao, 'prefix');

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
                field.customTypeName = readAttributeDefaultEmpty(item, 'customtype');
                field.analyzeCustomType();
                field.note = readAttributeDefaultEmpty(item, 'note');
                field.constraint = readAttributeDefaultEmpty(item, 'constraints');
                field.defaultValue = readAttributeDefaultEmpty(item, 'default');
                field.jsonKey = readAttributeDefaultEmpty(item, 'jsonkey');
                field.jsonTimeFormat = readAttributeDefaultEmpty(item, 'jsontimeformat');
                field.autoIncrement = readAttributeBool(item, 'autoincrement');
                field.transient = readAttributeBool(item, 'transient');
                //foreigkey
                field.refer.table = table.name;
                field.refer.referTable = readAttributeDefaultEmpty(item, 'reftb');
                field.refer.referFields.push(field.name, readAttributeDefaultEmpty(item, 'refitem'));
                field.refer.onUpdateAction = readAttribute(item, {key: 'refonupdate', defaultValue: 'notset'});
                field.refer.onDeleteAction = readAttribute(item, {key: 'refondelete', defaultValue: 'notset'});
                field.refer.deferrable = readAttributeBool(item, 'deferrable');
                field.refer.refvirtual = readAttributeBool(item, 'refvirtual');
                checkUniqueForeignReferenceKey(entity, field.refer);
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
                            tbIndex.fields.push(field['_'] ?? field);
                        } else {
                            tbIndex.fields.push((field['_'] ?? field) + ' ' + seq);
                        }
                    }
                    table.indexes.push(tbIndex);
                }
            }

            let foreigkey = tb['foreignkey'];
            if (foreigkey) {
                for (let j = 0; j < foreigkey.length; j++) {
                    let item = foreigkey[j];
                    let foreignkeyData = new ForeignKey();
                    foreignkeyData.table = table.name;
                    foreignkeyData.referTable = readAttributeDefaultEmpty(item, 'reftb');
                    foreignkeyData.onUpdateAction = readAttribute(item, {key: 'refonupdate', defaultValue: 'notset'});
                    foreignkeyData.onDeleteAction = readAttribute(item, {key: 'refondelete', defaultValue: 'notset'});
                    foreignkeyData.deferrable = readAttributeBool(item, 'deferrable');
                    foreignkeyData.refvirtual = readAttributeBool(item, 'refvirtual');
                    let fields = item['field'];
                    for (let k = 0; k < fields.length; k++) {
                        let field = fields[k];
                        let refFrom = readAttribute(field, {key: 'name'});
                        let refTo = readAttribute(field, {key: 'refitem'});
                        foreignkeyData.referFields.push(refFrom, refTo);
                    }
                    checkUniqueForeignReferenceKey(entity, foreignkeyData);
                    table.refer.push(foreignkeyData);
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
        console.log((e as Error).stack);
    }
    return null;
}