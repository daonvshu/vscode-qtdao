import { Entity, Field, ForeignKey, Index, Table, TypeReadInterface } from "./entity";

import "../utils/array-extension.ts";
import "../utils/string-extension.ts";
import { FileUtil } from "../utils/fileutil";

const ejs = require('ejs');
const path = require('path');

interface EntityTemplateFieldMember {
    comment: string,
    declare: string,
}

interface EntityTemplateData {
    className: string;
    customTypeHeaders: string[];
    fields: Field[];
    indexes: Index[];
    engine: string;

    declareMetaType: boolean;
    members: EntityTemplateFieldMember[];
    fieldWithoutTransient: Field[];
    fieldWithoutDefault: Field[];
    customConstructFields: Field[][];
    databaseMemberDeclare: string[];
    autoincFields: Field[];
    foreignKeys: ForeignKey[];

    fromJsonDeclares: string[];
    toJsonDeclares: string[];
    
    tableName: string;
    nameInDatabase: (name: string) => string;
    foreignKeyActionToEnum: (actionName: string) => string;
    databaseTbNameFormat: (name: string) => string;
    serializableName: (field: Field) => string;
    checkSerialzableValue: (field: Field) => string;
}

interface DelegateTemplateData {
    typeName: string;
    entityTbNames: string[];
}

export class DatabaseGenerator {

    protected outputPath: string;

    protected entity: Entity;

    protected templateDir: string;

    protected loadTb!: Table;

    private currentPrimaryKeySize = 0;

    constructor(outputPath: string, entity: Entity, templateDir: string) {
        this.outputPath = outputPath;
        this.entity = entity;
        this.templateDir = templateDir;
    }

    protected getEntityTemplateData(prefix: string): EntityTemplateData {
        return {
            className: this.loadTb.name,
            customTypeHeaders: this.customTypeHeaders,
            fields: this.loadTb.fields,
            indexes: this.loadTb.indexes,
            engine: this.loadTb.engine,

            declareMetaType: this.loadTb.metaType,
            members: this.getMemberDeclare(),
            fieldWithoutTransient: this.fieldWithoutTransient,
            fieldWithoutDefault: this.fieldsWithoutDefault,
            customConstructFields: this.customConstructFields,
            databaseMemberDeclare: this.databaseMemberDeclare,
            autoincFields: this.autoincFields,
            foreignKeys: [...this.fieldWithoutTransient.map(field => field.refer), ...this.loadTb.refer],

            fromJsonDeclares: this.fromJsonDeclares,
            toJsonDeclares: this.toJsonDeclares,

            tableName: this.createTableName(prefix),
            nameInDatabase: (name: string) => this.getFieldNameInDatabase(name),
            foreignKeyActionToEnum: this.foreignKeyActionToEnum,
            databaseTbNameFormat: (name: string) => this.wrapWithCheckKeyworks(prefix + name.toLowerCase()),
            serializableName: this.serializableEntityFieldName,
            checkSerialzableValue: this.checkSerialzableValue,
        };
    };

    protected getDelegateData(): DelegateTemplateData {
        return {
            typeName: this.getSqlTypeName(),
            entityTbNames: this.entity.tables.map(tb => tb.name),
        };
    };

    private get customTypeHeaders(): string[] {
        return Array.from(
            new Set(
                this.loadTb.fields.flatMap(field => field.typeHeaders)
                ));
    }

    private getMemberDeclare(): EntityTemplateFieldMember[] {
        return this.loadTb.fields.map(field => {
            let defaultStr = field.defaultValue.isEmpty() ? "" : ` = ${field.cppDefault}`;
            return {
                comment: (field.transient ? "/// transient " : "// ") + field.note,
                declare: `${field.cppType} ${field.name}${defaultStr};`
            };
        });
    }

    private get fieldWithoutTransient(): Field[] {
        return this.loadTb.fields.filter(field => !field.transient );
    }

    private get fieldsWithoutDefault(): Field[] {
        return this.fieldWithoutTransient.filter(field => field.defaultValue.isEmpty() );
    }

    private get customConstructFields(): Field[][] {
        return this.loadTb.customConstructor.map(fieldList => {
            return this.fieldWithoutTransient.filter(field => fieldList.contains(field.name));
        });
    }

    private get autoincFields(): Field[] {
        return this.fieldWithoutTransient.filter(field => field.autoIncrement);
    }

    private get databaseMemberDeclare(): string[] {
        let declares: string[] = [];
        for (let field of this.fieldWithoutTransient) {
            let str = `${this.getFieldNameInDatabase(field.name)} ${field.sqlType}`;
            if (field.bitSize !== 0) {
                if (field.type === 'decimal' && field.decimalPoint !== 0) {
                    str += `(${field.bitSize},${field.decimalPoint})`;
                } else {
                    str += `(${field.bitSize})`;
                }
            } else {
                if (field.type === 'decimal' && field.decimalPoint !== 0) {
                    str += `(0, ${field.decimalPoint})`;
                }
            }
            if (field.constraint.isNotEmpty()) {
                if (field.constraint === 'primary key' && this.currentPrimaryKeySize === 1) {
                    str += ` ${field.constraint}`;
                    if (field.autoIncrement) {
                        str += ` ${this.getAutoIncrementStatement()}`;
                    }
                } else if (field.constraint === 'not null') {
                    str += ` not null`;
                } else if (field.constraint === 'unique') {
                    str += ` not null unique`;
                }
            }
            if (field.defaultValue.isNotEmpty() && !field.autoIncrement) {
                let defaultStr = field.sqlDefault!;
                if (defaultStr.isNotEmpty()) {
                    str += ' ';
                    if (field.constraint !== 'primary key') {
                        str += 'null ';
                    }
                    str += `default ${defaultStr}`;
                }
            }
            let comment = this.getComment(field.note);
            if (comment.isNotEmpty()) {
                str += comment;
            }
            declares.push(str);
        }
        return declares;
    }

    private checkSerialzableValue(field: Field): string {
        if (field.useCustomType) {
            return `dao::deserializeBinaryToCustomType<${field.cppType}>(value.toByteArray())`;
        }
        return `value.value<${field.cppType}>()`;
    }

    private get fromJsonDeclares(): string[] {
        let declares: string[] = [];
        for (let field of this.fieldWithoutTransient) {
            let str = `entity.${field.name} = `;
            let cppType = field.cppType;
            if (field.useCustomType) {
                str += `dao::deserializeBinaryToCustomType<${cppType}>(QByteArray::fromBase64(object.value(QLatin1String("`;
            } else {
                switch(cppType) {
                    case 'QByteArray':
                        str += 'QByteArray::fromBase64(object.value(QLatin1String("';
                        break;
                    case 'QDate':
                        str += 'QDate::fromString(object.value(QLatin1String("';
                        break;
                    case 'QDateTime':
                        str += 'QDateTime::fromString(object.value(QLatin1String("';
                        break;
                    case 'QTime':
                        str += 'QTime::fromString(object.value(QLatin1String("';
                        break;
                    default:
                        str += 'object.value(QLatin1String("';
                }
            }

            if (field.jsonKey.isEmpty()) {
                str += field.name.snakeCase();
            } else {
                str += field.jsonKey;
            }
            
            if (field.useCustomType) {
                str += '")).toString().toLatin1()));';
            } else {
                switch(cppType) {
                    case 'QByteArray':
                        str += '")).toString().toLatin1());';
                        break;
                    case 'QDate':
                    case 'QDateTime':
                    case 'QTime':
                        str += '")).toString(), QLatin1String("';
                        if (field.jsonTimeFormat.isEmpty()) {
                            if (cppType === 'QDate') {
                                str += 'yyyy-MM-dd';
                            } else if (cppType === 'QTime') {
                                str += 'HH:mm:ss';
                            } else {
                                str += 'yyyy-MM-dd HH:mm:ss';
                            }
                        } else {
                            str += field.jsonTimeFormat;
                        }
                        str += '"));';
                        break;
                    case 'QVariant':
                        str += '"));';
                        break;
                    default:
                        str += `")).toVariant().value<${field.cppType}>();`;
                }
            }
            declares.push(str);
        }
        return declares;
    }

    private get toJsonDeclares(): string[] {
        let declares: string[] = [];
        for (let field of this.fieldWithoutTransient) {
            let str = `object.insert(QLatin1String("`;
            if (field.jsonKey.isEmpty()) {
                str += field.name.snakeCase();
            } else {
                str += field.jsonKey;
            }
            str += '"), ';
            let cppType = field.cppType!;
            if (field.useCustomType) {
                str += `QString::fromLatin1(dao::serializeCustomTypeToBinary(entity.${field.name}).toBase64())`;
            } else {
                switch(cppType) {
                    case 'QByteArray':
                        str += `QString::fromLatin1(entity.${field.name}.toBase64())`;
                        break;
                    case 'QVariant':
                        str += `QJsonValue::fromVariant(entity.${field.name})`;
                        break;
                    default:
                        str += `entity.${field.name}`;
                        if (['QDate', 'QTime', 'QDateTime'].indexOf(cppType) !== -1) {
                            str += '.toString(QLatin1String("';
                            if (field.jsonTimeFormat.isEmpty()) {
                                if (cppType === 'QDate') {
                                    str += 'yyyy-MM-dd';
                                } else if (cppType === 'QTime') {
                                    str += 'HH:mm:ss';
                                } else {
                                    str += 'yyyy-MM-dd HH:mm:ss';
                                }
                            } else {
                                str += field.jsonTimeFormat;
                            }
                            str += '"))';
                        } else if (cppType === 'QChar') {
                            str += '.toLatin1()';
                        }
                        break;
                }
            }
            str += ');';
            declares.push(str);
        }
        return declares;
    }


    protected renderTemplate(saveFileName: string, templateFileName: string, data: any): boolean {
        let changed = false;
        const templatePath = path.join(this.templateDir, templateFileName);
        ejs.renderFile(templatePath, data, {}, (err: any, str: string) => {
            if (err) {
                console.error('Error rendering EJS template:', err);
            } else {
                changed = FileUtil.writeContentWithCheckHash(str, this.outputPath + '\\' + saveFileName);
            }
        });
        return changed;
    }


    protected generateEntities(typeReader: TypeReadInterface): boolean { 
        let changed = false;
        this.entity.tables.forEach((tb) => {
            tb.typeInterface = typeReader;
            this.loadTb = tb;
            changed = this.renderTemplate(FileUtil.outputTbFileName(tb.name), this.getSqlTypeName().toLowerCase() + ".ejs", this.getEntityTemplateData(this.entity.prefix)) || changed;
        });
        return changed;
    }

    protected generateDelegateFiles(): boolean {
        let fileName = this.getSqlTypeName().toLowerCase() + "entityinclude";
        let data = this.getDelegateData();
        let changed = this.renderTemplate(fileName + ".h", "delegate_h.ejs", data);
        changed = this.renderTemplate(fileName + ".cpp", "delegate_cpp.ejs", data) || changed;
        return changed;
    }

    protected generateConfigFiles(): boolean {
        let data = this.getDelegateData();
        let changed = this.renderTemplate("entity.pri", "pri.ejs", data);
        changed = this.renderTemplate("entity.cmake", "cmake.ejs", data) || changed;
        changed = this.renderTemplate(".gitignore", "gitignore.ejs", data) || changed;
        return changed;
    }


    //interfaces

    public generate(): boolean { return false; }

    protected getComment(note: string): string { return ''; }
    protected getAutoIncrementStatement(): string { return ''; }

    protected getSqlTypeName(): string { return ''; }

    protected getFieldNameInDatabase(str: string, ignoreMix: boolean = false): string {
        let words = str.snakeCase().split(' ');
        if (words.length === 1) {
            return this.wrapWithCheckKeyworks(words[0]);
        }
        words[0] = this.wrapWithCheckKeyworks(words[0]);
        return words.join(' ');
    }

    protected wrapWithCheckKeyworks(name: string): string {
        return name;
    }

    protected serializableEntityFieldName(field: Field): string {
        if (field.useCustomType) {
            return `dao::serializeCustomTypeToBinary(entity.${field.name})`;
        }
        return `entity.${field.name}`;
    }

    protected createTableName(prefix: string): string {
        return this.wrapWithCheckKeyworks(prefix + this.loadTb.name.toLowerCase());
    }

    private foreignKeyActionToEnum(actionName: string): string {
        const keyMap = new Map<string, string>([
            ["no_action", "ForeignKey::FK_NO_ACTION"],
            ["restrict", "ForeignKey::FK_RESTRICT"],
            ["set_null", "ForeignKey::FK_SET_NULL"],
            ["set_default", "ForeignKey::FK_SET_DEFAULT"],
            ["cascade", "ForeignKey::FK_CASCADE"],
        ]);
        if (keyMap.has(actionName)) {
            return keyMap.get(actionName) as string;
        } 
        return "ForeignKey::FK_NotSet";
    }
}