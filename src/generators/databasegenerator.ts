import { Entity, Field, Index, Table } from "./entity";

import "../utils/array-extension.ts";
import "../utils/string-extension.ts";
import { templateDelegateHpp } from "../templates/delegate_h";
import { FileUtil } from "../utils/fileutil";
import { templateDelegateCpp } from "../templates/delegate_cpp";

export class DatabaseGenerator {

    protected outputPath: string;

    protected entity: Entity;

    protected loadTb!: Table;

    private currentFieldSize = 0;
    private currentPrimaryKeySize = 0;

    constructor(outputPath: string, entity: Entity) {
        this.outputPath = outputPath;
        this.entity = entity;
    }

    //interfaces

    public generate(): boolean { return false; }

    protected getFieldCppType(fieldType: string): string { return ''; }
    protected getCppDefaultValueString(fieldType: string, defaultValue: string): string { return ''; }
    protected getDatabaseDefaultValueString(fieldType: string, defaultValue: string): string { return ''; }
    protected getDatabaseFieldType(fieldType: string): string { return ''; }
    protected getComment(note: string): string { return ''; }
    protected getAutoIncrementStatement(): string { return ''; }

    protected getSqlTypeName(): string { return ''; }
    protected getSqlClientTypeName(): string { return ''; }

    
    protected lowerAndSplitWithUnderline(str: string): string {
        var result = '';
        var lastIndex = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            if (c >= 'A' && c <= 'Z') {
                result += str.substring(lastIndex, i - lastIndex).toLowerCase() + '_';
                lastIndex = i;
            }
        }
        result += str.substring(lastIndex).toLowerCase();
        return result;
    }

    protected upperFirstChar(str: string): string {
        return str.charAt(0).toUpperCase() + str.substring(1);
    }

    protected getFieldNameInDatabase(str: string, ignoreMix: boolean = false): string {
        return this.lowerAndSplitWithUnderline(str);
    }


    private tab1 = '    ';
    private tab2 = this.tab1 + this.tab1;
    private tab3 = this.tab1 + this.tab2;
    private tab4 = this.tab2 + this.tab2;
    private tab6 = this.tab4 + this.tab2;

    private fieldDeclare(field: Field): string {
        return `${this.getFieldCppType(field.type)} ${field.name}`;
    }

    private constFieldDeclare(field: Field): string {
        return `const ${this.getFieldCppType(field.type)}& ${field.name}`;
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
            str += `    //${field.note}\n    ${this.fieldDeclare(field)};\n`;
        }

        if (transientFields.isNotEmpty()) {
            str += '\n';
            str += transientFields
                .map((field) => `    ///transient ${field.note}\n    ${this.fieldDeclare(field)};\n`)
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
            str += `    Q_PROPERTY(${this.fieldDeclare(field)} MEMBER ${field.name})\n`;
        }
        str += `    Q_PROPERTY(QVariantMap extra MEMBER __extra)\n`;
        return str;
    }

    protected createConstruct(): string {
        
        let constructList = <string[]>[];
        let constructSet = <string[]>[];

        let fieldInit = this.createDefaultFieldInit();
        let initStr = fieldInit.isNotEmpty() ?
            `\n\n   $ClassName$() {\n${fieldInit}   }` :
            `\n\n   $ClassName$() {\n   }`;
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
            str += `${this.tab2}${field.name} = ${this.getCppDefaultValueString(field.type, field.defaultValue)};\n`;
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
            str += `${this.tab2}${this.constFieldDeclare(field)},\n`;
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
            .map((field) => `\n${this.tab2}dao::EntityField<${this.getFieldCppType(field.type)}> ${field.name} = dao::EntityField<${this.getFieldCppType(field.type)}>("${this.getFieldNameInDatabase(field.name)}", "${this.createTableName(prefix)}");`)
            .merge();
    }

    protected createFieldDeclareReset(): string {
        return this.loadTb.fields
            .filter((field) => !field.transient)
            .map((field) => `\n${this.tab3}${field.name} = dao::EntityField<${this.getFieldCppType(field.type)}>("${this.getFieldNameInDatabase(field.name)}", tbName);`)
            .merge();
    }

    protected createFieldSize(): string {
        return `${this.currentFieldSize}`;
    }

    protected createTableName(prefix: string): string {
        return prefix + this.loadTb.name.toLowerCase();
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

    protected createFieldsWithoutTimestamp(): string {
        return this.loadTb.fields
            .filter((field) => !field.transient && field.type !== 'timestamp')
            .map((field) => `\n${this.tab4}<< "${this.getFieldNameInDatabase(field.name)}"`)
            .merge();
    }

    protected createDatabaseType(): string {
        let str = '';
        for (let field of this.loadTb.fields) {
            if (field.transient) {
                continue;
            }
            str += `\n${this.tab4}<< QStringLiteral("${this.getFieldNameInDatabase(field.name)} ${this.getDatabaseFieldType(field.type)}`;
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
                let defaultStr = this.getDatabaseDefaultValueString(field.type, field.defaultValue);
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

    protected createValuesGetWithoutAutoIncrement(): string {
        let getStr = this.loadTb.fields
            .filter((field) => !field.transient && !field.autoIncrement)
            .map((field) => `\n${this.tab4}<< entity.${field.name}`)
            .merge();
        if (getStr.isEmpty()) {
            return `Q_UNUSED(entity);\n${this.tab6}return QVariantList()`;
        }
        return 'return QVariantList()' + getStr;
    }

    protected createGetValueByName(): string {
        return this.loadTb.fields
            .filter((field) => !field.transient)
            .map((field) => `if (target == "${this.getFieldNameInDatabase(field.name)}") {\n${this.tab4}return entity.${field.name};\n${this.tab3}}\n${this.tab3}`)
            .merge() + 'return entity.__extra.value(target);';
    }

    protected createBindAutoIncrementId(): string {
        let fields = this.loadTb.fields
            .filter((field) => !field.transient && field.autoIncrement);
        if (fields.isEmpty()) {
            return `Q_UNUSED(entity);\n${this.tab3}Q_UNUSED(id);`;
        }
        return `entity.${fields[0].name} = id.value<${this.getFieldCppType(fields[0].type)}>();`;
    }

    protected createBindValue(): string {
        let bindStr = this.loadTb.fields
            .filter((field) => !field.transient)
            .map((field) => ` else if (target == "${this.getFieldNameInDatabase(field.name)}") {\n${this.tab4}entity.${field.name} = value.value<${this.getFieldCppType(field.type)}>();\n${this.tab3}}`)
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
            let cppType = this.getFieldCppType(field.type);
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

            if (field.jsonKey.isEmpty()) {
                str += this.getFieldNameInDatabase(field.name, true);
            } else {
                str += field.jsonKey;
            }

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
                    str += `").toVariant().value<${this.getFieldCppType(field.type)}>();`;
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
                str += this.getFieldNameInDatabase(field.name, true);
            } else {
                str += field.jsonKey;
            }
            str += '", ';
            let cppType = this.getFieldCppType(field.type);
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
                str += `\n${this.tab1}inline void set${this.upperFirstChar(field.name)}(${this.constFieldDeclare(field)}) {this->${field.name} = ${field.name};}`;
                //getter
                str += `\n${this.tab1}//`;
                if (field.note.isNotEmpty()) {
                    str += `get ${field.note}`;
                }
                str += `\n${this.tab1}inline ${this.getFieldCppType(field.type)} get${this.upperFirstChar(field.name)}() const {return ${field.name};}`;
                
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
        let entityListStr = '';
        tbNames.forEach((e) => {
            entityHeaders += `#include "${e.toLowerCase()}.h"\n`;
            entityListStr += `${e}, `;
        });

        let cpp = templateDelegateCpp
            .replaceMask('$DelegateHeader$', `${this.getSqlTypeName().toLowerCase()}entityinclude.h`)
            .replaceMask('$SqlType$', this.getSqlTypeName())
            .replaceMask('$SqlClientType$', this.getSqlClientTypeName())
            .replaceMask('$EntityHeaders$', entityHeaders)
            .replaceMask('$EntityList$', entityListStr.substring(0, entityListStr.length - 2))
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
}