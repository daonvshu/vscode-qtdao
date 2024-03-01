import { DatabaseGenerator } from "./databasegenerator";
import { FileUtil } from "../utils/fileutil";
import "../utils/string-extension.ts";
import { templateSqlite } from "../templates/sqlite";
import { keywordsOrReservedWords } from "../utils/keywords";
import { TypeReadInterface } from "./entity";

export class SqliteGenerator extends DatabaseGenerator implements TypeReadInterface {

    public generate(): boolean {
        
        var tbNames = new Array<string>();
        var changed = false;
        this.entity.tables.forEach((tb) => {
            tbNames.push(tb.name);

            tb.typeInterface = this;
            this.loadTb = tb;

            var header = templateSqlite
                //set classname
                .replaceMask('$ClassName$', tb.name)
                //custom type headers
                .replaceMask('$CustomTypeHeaders$', this.createCustomTypeHeaders())
                //set property declare
                .replaceMask('$PropertyDeclare$', this.createPropertyDeclare())
                //set field list
                .replaceMask('$Members$', this.createFieldList())
                //set constructor
                .replaceMask('$Construct$', this.createConstruct())
                //set field declare
                .replaceMask('$FieldDeclare$', this.createFieldDeclare(this.entity.prefix))
                .replaceMask('$FieldDeclareReset$', this.createFieldDeclareReset())
                //set field size
                .replaceMask('$FieldSize$', this.createFieldSize())
                //set tablename
                .replaceMask('$TbName$', this.createTableName(this.entity.prefix))
                //set fields
                .replaceMask('$Fields$', this.createFields())
                .replaceMask('$FieldsWithoutAuto$', this.createFieldsWithoutAutoIncrement())
                //set database type
                .replaceMask('$FieldType$', this.createDatabaseType())
                //set primary keys
                .replaceMask('$PrimaryKey$', this.createPrimaryKeys())
                //set index
                .replaceMask('$FieldIndex$', this.createIndexFields())
                .replaceMask('$UniqueFieldIndex$', this.createIndexFields('unique index'))
                //set check name autoincrement
                .replaceMask('$CheckNameIncrement$', this.createCheckNameIncrement())
                //set foreignkey
                .replaceMask('$ForeignKeys$', this.createForeignKeys(this.entity.prefix))
                //set bind id
                .replaceMask('$BindAutoIncrementId$', this.createBindAutoIncrementId())
                //set bind value
                .replaceMask('$BindValues$', this.createBindValue())
                //set json to entity
                .replaceMask('$JsonToEntity$', this.createJsonToEntity())
                //set entity to json
                .replaceMask('$EntityToJson$', this.createEntityToJson())
                //set values getter
                .replaceMask('$ValuesWithAuto$', this.createValuesGetWithoutAutoIncrement())
                //set value getter
                .replaceMask('$GetValueByName$', this.createGetValueByName())
                //operator equal
                .replaceMask('$OperatorEqual$', this.createOperatorEqual())
                //setter and getter
                //.replaceMask('$MemberGetterSetter$', this.createSetterGetter())
                //set meta type
                .replaceMask('$DECLARE_META_TYPE$', this.createMetaType())
            ;

            changed = FileUtil.writeContentWithCheckHash(header, this.outputPath + '\\' + FileUtil.outputTbFileName(tb)) || changed;
        });

        changed = this.generateEntityDelegate(tbNames) || changed;
        changed = this.generateConfigureFile(tbNames) || changed;
        changed = this.generateGitIgnoreFile(tbNames) || changed;
        return changed;
    }

    getFieldCppType(fieldType: string): string {
        switch(fieldType) {
            case 'int':
                return 'int';
            case 'long':
                return 'qint64';
            case 'real':
                return 'qreal';
            case 'text':
                return 'QString';
            case 'blob':
                return 'QByteArray';
            case 'variant':
                return 'QVariant';
        }
        return 'unknown';
    }

    getCppDefaultValueString(fieldType: string, defaultValue: string): string {

        if (fieldType === 'variant') {
            return defaultValue;
        }

        let defV = defaultValue.toLowerCase();
        if (defV === 'null') {
            return this.getFieldCppType(fieldType) + '()';
        }

        switch(fieldType) {
            case 'text':
                if (defV === 'empty') {
                    return 'QString()';
                }
                if (defaultValue.contains('QString')) {
                    return defaultValue;
                }
                if (defaultValue.startsWith('"')) {
                    return defaultValue;
                }
                return `"${defaultValue}"`;
            case 'blob':
                if (defV === 'empty') {
                    return 'QByteArray()';
                }
                if (defaultValue.contains('QByteArray')) {
                    return defaultValue;
                }
                if (defaultValue.startsWith('"')) {
                    return defaultValue;
                }
                return `"${defaultValue}"`;
        }
        return defaultValue;
    }

    getDatabaseDefaultValueString(fieldType: string, defaultValue: string): string {
        let defV = defaultValue.toLowerCase();
        if (defV === 'null') {
            return 'null';
        }

        switch(fieldType) {
            case 'int':
            case 'long':
            case 'real':
                return defaultValue;
            case 'text':
            case 'blob':
                if (defV === 'empty') {
                    return "''";
                }
                if (fieldType === 'text' && defaultValue.contains('QString')) {
                    return 'null';
                }
                if (fieldType === 'blob' && defaultValue.contains('QByteArray')) {
                    return 'null';
                }
                if (defaultValue.startsWith('"')) {
                    return defaultValue.replaceAll('"', "'");
                }
                return `'${defaultValue}'`;
        }
        return 'null';
    }

    getDatabaseFieldType(fieldType: string): string {
        switch(fieldType) {
            case 'int':
            case 'long':
                return 'integer';
            case 'variant':
                return 'blob';
        }
        return fieldType;
    }

    getBinaryType(): string {
        return 'blob';
    }

    protected getComment(note: string): string {
        return '';
    }

    protected getAutoIncrementStatement(): string {
        return 'autoincrement';
    }

    protected getSqlTypeName(): string {
        return 'Sqlite';
    }

    protected getSqlClientTypeName(): string {
        return 'ClientSqlite';
    }

    protected wrapWithCheckKeyworks(name: string): string {
        if (keywordsOrReservedWords["sqlite"].contains(name.toUpperCase())) {
            return `\\"${name}\\"`;
        }
        return name;
    }
}