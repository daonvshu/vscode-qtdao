import { Entity, Field, ForeignKey, Index, Table } from "./entity";

import "../utils/array-extension.ts";
import "../utils/string-extension.ts";
import { templateDelegateHpp } from "../templates/delegate_h";
import { FileUtil } from "../utils/fileutil";
import { templateDelegateCpp } from "../templates/delegate_cpp";
import { templateGitIgnore } from "../templates/gitignore";

interface TemplateFieldMember {
    comment: string,
    declare: string,
}

interface TemplateData {
    className: string;
    customTypeHeaders: string[];
    fields: Field[];
    indexes: Index[];

    declareMetaType: boolean;
    members: TemplateFieldMember[];
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

export class DatabaseGenerator {

    protected outputPath: string;

    protected entity: Entity;

    protected templateDir: string;

    protected loadTb!: Table;

    private currentFieldSize = 0;
    private currentPrimaryKeySize = 0;

    constructor(outputPath: string, entity: Entity, templateDir: string) {
        this.outputPath = outputPath;
        this.entity = entity;
        this.templateDir = templateDir;
    }

    protected getTemplateData(prefix: string): TemplateData {
        return {
            className: this.loadTb.name,
            customTypeHeaders: this.customTypeHeaders,
            fields: this.loadTb.fields,
            indexes: this.loadTb.indexes,

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

    private get customTypeHeaders(): string[] {
        return Array.from(
            new Set(
                this.loadTb.fields.flatMap(field => field.typeHeaders)
                ));
    }

    private getMemberDeclare(): TemplateFieldMember[] {
        return this.loadTb.fields.map(field => {
            let defaultStr = field.defaultValue.isEmpty() ? "" : ` = ${field.defaultValue}`;
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
                str += `dao::deserializeBinaryToCustomType<${cppType}>(QByteArray::fromBase64(object.value("`;
            } else {
                switch(cppType) {
                    case 'QByteArray':
                        str += 'QByteArray::fromBase64(object.value("';
                        break;
                    case 'QDate':
                        str += 'QDate::fromString(object.value("';
                        break;
                    case 'QDateTime':
                        str += 'QDateTime::fromString(object.value("';
                        break;
                    case 'QTime':
                        str += 'QTime::fromString(object.value("';
                        break;
                    default:
                        str += 'object.value("';
                }
            }

            if (field.jsonKey.isEmpty()) {
                str += field.name.snakeCase();
            } else {
                str += field.jsonKey;
            }
            
            if (field.useCustomType) {
                str += '").toString().toLatin1()));';
            } else {
                switch(cppType) {
                    case 'QByteArray':
                        str += '").toString().toLatin1());';
                        break;
                    case 'QDate':
                    case 'QDateTime':
                    case 'QTime':
                        str += '").toString(), "';
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
                        str += '");';
                        break;
                    case 'QVariant':
                        str += '");';
                        break;
                    default:
                        str += `").toVariant().value<${field.cppType}>();`;
                }
            }
            declares.push(str);
        }
        return declares;
    }

    private get toJsonDeclares(): string[] {
        let declares: string[] = [];
        for (let field of this.fieldWithoutTransient) {
            let str = `object.insert("`;
            if (field.jsonKey.isEmpty()) {
                str += field.name.snakeCase();
            } else {
                str += field.jsonKey;
            }
            str += '", ';
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
                            str += '.toString("';
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
                            str += '")';
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

    //interfaces

    public generate(): boolean { return false; }

    protected getComment(note: string): string { return ''; }
    protected getAutoIncrementStatement(): string { return ''; }

    protected getSqlTypeName(): string { return ''; }
    protected getSqlClientTypeName(): string { return ''; }

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


    private tab1 = '    ';
    private tab2 = this.tab1 + this.tab1;
    private tab3 = this.tab1 + this.tab2;
    private tab4 = this.tab2 + this.tab2;
    private tab6 = this.tab4 + this.tab2;

    protected createCustomTypeHeaders(): string {
        let newArr: string[] = [];
        this.loadTb.fields.forEach((field) => {
            field.typeHeaders.forEach((h) => {
                if (newArr.indexOf(h) === -1) {
                    newArr.push(h);
                }
            });
        });
        if (newArr.length === 0) {
            return '';
        }
        return newArr
            .map((e) => e.endsWith(".h") ? `#include "${e}"` : `#include <${e}>`)
            .join('\n') + '\n#include "utils/serializing.h"\n';
    }
 
    protected createFieldList(): string {
        let transientFields = new Array<Field>();
        this.currentPrimaryKeySize = 0;
        let str = '';

        for (let field of this.loadTb.fields) {
            if (field.transient) {
                transientFields.push(field);
                continue;
            }
            if (field.constraint === 'primary key') {
                this.currentPrimaryKeySize++;
            }
            str += `${this.tab1}//${field.note}\n    ${field.cppType} ${field.name};\n`;
        }

        if (transientFields.isNotEmpty()) {
            str += '\n';
            str += transientFields
                .map((field) => `${this.tab1}///transient ${field.note}\n    ${field.cppType} ${field.name};\n`)
                .merge();
        }
        this.currentFieldSize = this.loadTb.fields.length - transientFields.length;
        return str;
    }

    protected createPropertyDeclare(): string {
        if (!this.loadTb.metaType) {
            return '';
        }
        let str = 'Q_GADGET\n\n';

        for (let field of this.loadTb.fields) {
            str += `${this.tab1}Q_PROPERTY(${field.cppType} ${field.name} MEMBER ${field.name})\n`;
        }
        str += `${this.tab1}Q_PROPERTY(QVariantMap extra MEMBER __extra)\n`;
        return str;
    }

    protected createConstruct(): string {
        
        let constructList = <string[]>[];
        let constructSet = <string[]>[];

        let fieldInit = this.createDefaultFieldInit();
        let initStr = fieldInit.isNotEmpty() ?
            `\n\n    $ClassName$() {\n${fieldInit}    }` :
            `\n\n    $ClassName$() {\n    }`;
        constructList.push(initStr);
        constructSet.push(initStr);

        var hasNotDefaultValue = this.loadTb.fields.some((field) => field.defaultValue.isEmpty() && !field.autoIncrement);
        var hasNotAutoIncrementField = this.loadTb.fields.some((field) => !field.autoIncrement);

        if (hasNotAutoIncrementField) {
            initStr = `\n\n    $ClassName$(\n${this.createConstructField()}\n    ) : ${this.createConstructCommit()}\n    {\n${this.createDefaultFieldInit(true)}    }`;
            if (!constructSet.contains(initStr)) {
                constructSet.push(initStr);
                constructList.push(initStr);
            }
        }

        if (hasNotDefaultValue) {
            initStr = `\n\n    $ClassName$(\n${this.createConstructField(true)}\n    ) : ${this.createConstructCommit(true)}\n    {\n${fieldInit}    }`;
            if (!constructSet.contains(initStr)) {
                constructSet.push(initStr);
                constructList.push(initStr);
            }
        }

        for (let customConstructor of this.loadTb.customConstructor) {
            if (customConstructor.isNotEmpty()) {
                initStr = `\n\n    $ClassName$(\n${this.createConstructField(true, customConstructor)}\n    ) : ${this.createConstructCommit(true, customConstructor)}\n    {\n${this.createDefaultFieldInit(false, customConstructor)}    }`;
                if (!constructSet.contains(initStr)) {
                    constructSet.push(initStr);
                    constructList.push(initStr);
                }
            }
        }
        return constructList.merge().replaceMask("$ClassName$", this.loadTb.name);
    }

    protected createDefaultFieldInit(onlyAutoIncrement: boolean = false, excludeFieldsWithDefault: string[] = []): string {
        let str = '';
        for (let field of this.loadTb.fields) {
            if (field.defaultValue.isEmpty()) {
                continue;
            }
            if (onlyAutoIncrement && !field.autoIncrement) {
                continue;
            }
            if (excludeFieldsWithDefault.isNotEmpty()) {
                if (excludeFieldsWithDefault.contains(field.name)) {
                    continue;
                }
            }
            str += `${this.tab2}${field.name} = ${field.cppDefault};\n`;
        }
        return str;
    }

    protected createConstructField(skipDefaultValue: boolean = false, enforceFields: string[] = []): string {
        if (this.loadTb.fields.isEmpty()) {
            return '';
        }

        let str = '';
        for (let field of this.loadTb.fields) {
            if (enforceFields.isEmpty()) {
                if (field.transient) {
                    continue;
                }
                if (field.autoIncrement) {
                    continue;
                }
                if (field.defaultValue.isNotEmpty() && skipDefaultValue) {
                    continue;
                }
            } else {
                if (!enforceFields.contains(field.name)) {
                    continue;
                }
            }
            str += `${this.tab2}const ${field.cppType}& ${field.name},\n`;
        }
        return str.substring(0, str.length - 2);
    }

    protected createConstructCommit(skipDefaultValue: boolean = false, enforceFields: string[] = []): string {
        if (this.loadTb.fields.isEmpty()) {
            return '';
        }

        let str = '';
        for (let field of this.loadTb.fields) {
            if (enforceFields.isEmpty()) {
                if (field.transient) {
                    continue;
                }
                if (field.autoIncrement) {
                    continue;
                }
                if (field.defaultValue.isNotEmpty() && skipDefaultValue) {
                    continue;
                }
            } else {
                if (!enforceFields.contains(field.name)) {
                    continue;
                }
            }
            str += `${field.name}(${field.name})\n    , `;
        }
        return str.substring(0, str.length - 7);
    }

    protected createFieldDeclare(prefix: string): string {
        return this.loadTb.fields
            .filter((field) => !field.transient)
            .map((field) => `\n${this.tab2}dao::EntityField<${field.cppType}> ${field.name}{"${this.getFieldNameInDatabase(field.name)}", "${this.createTableName(prefix)}", ${field.useCustomType}};`)
            .merge();
    }

    protected createFieldDeclareReset(): string {
        return this.loadTb.fields
            .filter((field) => !field.transient)
            .map((field) => `\n${this.tab3}${field.name}.resetTb(tbName);`)
            .merge();
    }

    protected createFieldSize(): string {
        return `${this.currentFieldSize}`;
    }

    protected createTableName(prefix: string): string {
        return this.wrapWithCheckKeyworks(prefix + this.loadTb.name.toLowerCase());
    }

    protected createTableEngine(engine: string): string {
        return engine.isEmpty() ? 'QString()' : `"${engine}"`;
    }

    protected createFields(): string {
        return this.loadTb.fields
            .filter((field) => !field.transient)
            .map((field) => `\n${this.tab4}<< "${this.getFieldNameInDatabase(field.name)}"`)
            .merge();
    }

    protected createFieldsWithoutAutoIncrement(): string {
        return this.loadTb.fields
            .filter((field) => !field.transient && !field.autoIncrement)
            .map((field) => `\n${this.tab4}<< "${this.getFieldNameInDatabase(field.name)}"`)
            .merge();
    }

    protected createDatabaseType(): string {
        let str = '';
        for (let field of this.loadTb.fields) {
            if (field.transient) {
                continue;
            }
            str += `\n${this.tab4}<< QStringLiteral("${this.getFieldNameInDatabase(field.name)} ${field.sqlType}`;
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
            str += '")';
        }
        return str;
    }

    protected createPrimaryKeys(): string {
        return this.loadTb.fields
            .filter((field) => !field.transient && field.constraint === 'primary key')
            .map((field) => ` << "${this.getFieldNameInDatabase(field.name)}"`)
            .merge();
    }

    protected createIndexFields(indexType: string = 'index'): string {
        const indexList = (index: Index): string => {
            return index.fields
                .map((field) => ` << "${this.getFieldNameInDatabase(field)}"`)
                .merge();
        };
        return this.loadTb.indexes
            .filter((index) => index.indexType === indexType)
            .map((index) => `\n${this.tab4}<< (QStringList()${indexList(index)})`)
            .merge();
    }

    protected createIndexOption(): string {
        const indexName = (index: Index): string => {
            return 'index' + index.fields.map((field) => `_${field.split(' ')[0]}`).merge();
        };
        var optionStr = this.loadTb.indexes
            .filter((index) => index.indexOptions.isNotEmpty())
            .map((index) => `if(name == "${indexName(index)}") {\n${this.tab4}return "${index.indexOptions}";\n${this.tab3}}\n${this.tab3}`)
            .merge();
        if (optionStr.isEmpty()) {
            return `Q_UNUSED(name);\n${this.tab3}`;
        }
        return optionStr;
    }

    protected createCheckNameIncrement(): string {
        let str = '';
        for (let field of this.loadTb.fields) {
            if (field.transient) {
                continue;
            }
            if (!field.autoIncrement) {
                continue;
            }
            if (str.isNotEmpty()) {
                str += `\n${this.tab6}|| `;
            }
            str += `name == "${this.getFieldNameInDatabase(field.name)}"`;
        }
        if (str.isEmpty()) {
            return `Q_UNUSED(name);\n${this.tab3}return false`;
        }
        return 'return ' + str;
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

    protected createForeignKeys(tbPrefix: string): string {
        let str = '';
        for (let field of this.loadTb.fields) {
            if (field.refer.referTable.isEmpty()) {
                continue;
            }
            str += `\n${this.tab4}ForeignKey("${this.wrapWithCheckKeyworks(tbPrefix + field.refer.referTable.toLowerCase())}", `;
            str += `${this.foreignKeyActionToEnum(field.refer.onUpdateAction)}, ${this.foreignKeyActionToEnum(field.refer.onDeleteAction)}, ${field.refer.deferrable})`;
            str += `.field(`;
            for (let i of field.refer.referFields) {
                str += `"${i}", `;
            }
            str = str.slice(0, -2);
            str += "),";
        }
        for (let fk of this.loadTb.refer) {
            str += `\n${this.tab4}ForeignKey("${this.wrapWithCheckKeyworks(tbPrefix + fk.referTable.toLowerCase())}", `;
            str += `${this.foreignKeyActionToEnum(fk.onUpdateAction)}, ${this.foreignKeyActionToEnum(fk.onDeleteAction)}, ${fk.deferrable})`;
            str += `.field(`;
            for (let i of fk.referFields) {
                str += `"${i}", `;
            }
            str = str.slice(0, -2);
            str += "),";
        }
        return str;
    }

    protected createValuesGetWithoutAutoIncrement(): string {
        let getStr = this.loadTb.fields
            .filter((field) => !field.transient && !field.autoIncrement)
            .map((field) => `\n${this.tab4}<< ${this.serializableEntityFieldName(field)}`)
            .merge();
        if (getStr.isEmpty()) {
            return `Q_UNUSED(entity);\n${this.tab6}return QVariantList()`;
        }
        return 'return QVariantList()' + getStr;
    }

    protected createGetValueByName(): string {
        return this.loadTb.fields
            .filter((field) => !field.transient)
            .map((field) => `if (target == "${field.name.snakeCase()}") {\n${this.tab4}return ${this.serializableEntityFieldName(field)};\n${this.tab3}}\n${this.tab3}`)
            .merge() + 'return entity.__extra.value(target);';
    }

    protected createBindAutoIncrementId(): string {
        let fields = this.loadTb.fields
            .filter((field) => !field.transient && field.autoIncrement);
        if (fields.isEmpty()) {
            return `Q_UNUSED(entity);\n${this.tab3}Q_UNUSED(id);`;
        }
        return `entity.${fields[0].name} = id.value<${fields[0].cppType}>();`;
    }

    protected createBindValue(): string {
        let checkSerialzable = (field: Field): string => {
            if (field.useCustomType) {
                return `dao::deserializeBinaryToCustomType<${field.cppType}>(value.toByteArray())`;
            }
            return `value.value<${field.cppType}>()`;
        };
        let bindStr = this.loadTb.fields
            .filter((field) => !field.transient)
            .map((field) => ` else if (target == "${field.name.snakeCase()}") {\n${this.tab4}entity.${field.name} = ${checkSerialzable(field)};\n${this.tab3}}`)
            .merge();
        if (bindStr.isNotEmpty()) {
            bindStr += ` else {\n${this.tab4}entity.__putExtra(target, value);\n${this.tab3}}`;
        }
        return bindStr.substring(6);
    }

    protected createJsonToEntity(): string {
        let str = '';
        for (let field of this.loadTb.fields) {
            if (field.transient) {
                continue;
            }
            str += `\n${this.tab3}entity.${field.name} = `;
            let cppType = field.cppType;
            if (field.useCustomType) {
                str += `dao::deserializeBinaryToCustomType<${cppType}>(QByteArray::fromBase64(object.value("`;
            } else {
                switch(cppType) {
                    case 'QByteArray':
                        str += 'QByteArray::fromBase64(object.value("';
                        break;
                    case 'QDate':
                        str += 'QDate::fromString(object.value("';
                        break;
                    case 'QDateTime':
                        str += 'QDateTime::fromString(object.value("';
                        break;
                    case 'QTime':
                        str += 'QTime::fromString(object.value("';
                        break;
                    default:
                        str += 'object.value("';
                }
            }

            if (field.jsonKey.isEmpty()) {
                str += field.name.snakeCase();
            } else {
                str += field.jsonKey;
            }
            
            if (field.useCustomType) {
                str += '").toString().toLatin1()));';
            } else {
                switch(cppType) {
                    case 'QByteArray':
                        str += '").toString().toLatin1());';
                        break;
                    case 'QDate':
                    case 'QDateTime':
                    case 'QTime':
                        str += '").toString(), "';
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
                        str += '");';
                        break;
                    case 'QVariant':
                        str += '");';
                        break;
                    default:
                        str += `").toVariant().value<${field.cppType}>();`;
                }
            }
        }
        return str;
    }

    protected createEntityToJson(): string {
        let str = '';
        for (let field of this.loadTb.fields) {
            if (field.transient) {
                continue;
            }
            str += `\n${this.tab3}object.insert("`;
            if (field.jsonKey.isEmpty()) {
                str += field.name.snakeCase();
            } else {
                str += field.jsonKey;
            }
            str += '", ';
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
                            str += '.toString("';
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
                            str += '")';
                        } else if (cppType === 'QChar') {
                            str += '.toLatin1()';
                        }
                        break;
                }
            }
            str += ');';
        }
        return str;
    }

    protected createOperatorEqual(): string {
        let str = this.loadTb.fields
            .filter((field) => !field.transient && !field.autoIncrement)
            .map((field) => `${field.name} == other.${field.name} &&\n${this.tab3}`)
            .merge();
        if (str.length !== 0) {
            str = str.substring(0, str.length - 16);
        }
        return str;
    }

    protected createSetterGetter(): string {
        return this.loadTb.fields
            .map((field) => {
                //setter
                let str = `\n${this.tab1}//`;
                if (field.note.isNotEmpty()) {
                    str += `set ${field.note}`;
                }
                str += `\n${this.tab1}inline void set${field.name.pascalCase()}(const ${field.cppType}& ${field.name}) {this->${field.name} = ${field.name};}`;
                //getter
                str += `\n${this.tab1}//`;
                if (field.note.isNotEmpty()) {
                    str += `get ${field.note}`;
                }
                str += `\n${this.tab1}inline ${field.cppType} get${field.name.pascalCase()}() const {return ${field.name};}`;
                
                return str;
            }).merge();
    }

    protected createMetaType(): string {
        if (this.loadTb.metaType) {
            return `Q_DECLARE_METATYPE(${this.loadTb.name});`;
        }
        return '';
    }

    protected generateEntityDelegate(tbNames: string[]): boolean {
        let header = templateDelegateHpp.replaceMask('$SqlType$', this.getSqlTypeName());
        let changed = FileUtil.writeContentWithCheckHash(header, `${this.outputPath}\\${this.getSqlTypeName().toLowerCase()}entityinclude.h`);

        let entityHeaders = '';
        let tableCreateList = '';
        let tableUpgradeList = '';
        tbNames.forEach((e) => {
            entityHeaders += `#include "${e.toLowerCase()}.h"\n`;
            tableCreateList += `        globalConfig->getClient()->createTable<(int)ConfigType::${this.getSqlTypeName()}, ${e}>();\n`;
            tableUpgradeList += `        globalConfig->getClient()->tableUpgrade<(int)ConfigType::${this.getSqlTypeName()}, ${e}>(oldVer, newVer);\n`;
        });

        let cpp = templateDelegateCpp
            .replaceMask('$DelegateHeader$', `${this.getSqlTypeName().toLowerCase()}entityinclude.h`)
            .replaceMask('$SqlType$', this.getSqlTypeName())
            .replaceMask('$SqlClientType$', this.getSqlClientTypeName())
            .replaceMask('$EntityHeaders$', entityHeaders)
            .replaceMask('$TableCreate$', tableCreateList.slice(0, -1))
            .replaceMask('$TableUpgrade$', tableUpgradeList.slice(0, -1))
            ;
        changed = FileUtil.writeContentWithCheckHash(cpp, `${this.outputPath}\\${this.getSqlTypeName().toLowerCase()}entityinclude.cpp`) || changed;
        return changed;
    }

    protected generateConfigureFile(tbNames: string[]): boolean {
        //ouput pri configure file
        let priContent = 
`# ----------------------------------------------------
# This file is generated by the vscode-qtdao.
# ----------------------------------------------------


HEADERS += ${tbNames.map((n) => `./${n.toLowerCase()}.h \\\n    `).merge()}./${this.getSqlTypeName().toLowerCase()}entityinclude.h
SOURCES += ./${this.getSqlTypeName().toLowerCase()}entityinclude.cpp
`;
        let changed = FileUtil.writeContentWithCheckHash(priContent, `${this.outputPath}\\entity.pri`);

        //output cmake configure file
        let cmakeCOntent =
`# ----------------------------------------------------
# This file is generated by the vscode-qtdao.
# ----------------------------------------------------


set(ENTITY_FILE_LIST
    $\{CMAKE_CURRENT_LIST_DIR\}/${this.getSqlTypeName().toLowerCase()}entityinclude.h
    $\{CMAKE_CURRENT_LIST_DIR\}/${this.getSqlTypeName().toLowerCase()}entityinclude.cpp

${tbNames.map((n) => `    $\{CMAKE_CURRENT_LIST_DIR\}/${n.toLowerCase()}.h\n`).merge()})`;

        changed = FileUtil.writeContentWithCheckHash(cmakeCOntent, `${this.outputPath}\\entity.cmake`) || changed;
        return changed;
    }

    protected generateGitIgnoreFile(tbNames: string[]): boolean {
        let entityHeaders = '';
        tbNames.forEach((e) => {
            entityHeaders += `${e.toLowerCase()}.h\n`;
        });
        entityHeaders += `${this.getSqlTypeName().toLowerCase()}entityinclude.h\n`;
        entityHeaders += `${this.getSqlTypeName().toLowerCase()}entityinclude.cpp`;

        let content = templateGitIgnore.replaceMask('$GenerateFileList$', entityHeaders);
        return FileUtil.writeContentWithCheckHash(content, `${this.outputPath}\\.gitignore`);
    }
}