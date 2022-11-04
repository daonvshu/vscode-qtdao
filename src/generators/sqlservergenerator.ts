import { DatabaseGenerator } from "./databasegenerator";
import { FileUtil } from "../utils/fileutil";
import "../utils/string-extension.ts";
import { templateSqlServer } from "../templates/sqlserver";
import { keywordsOrReservedWords } from "../utils/keywords";
import { TypeReadInterface } from "./entity";

export class SqlServerGenerator extends DatabaseGenerator implements TypeReadInterface {

    public generate(): boolean {
        
        var tbNames = new Array<string>();
        var changed = false;
        this.entity.tables.forEach((tb) => {
            tbNames.push(tb.name);

            tb.typeInterface = this;
            this.loadTb = tb;

            var header = templateSqlServer
                //set classname
                .replaceMask('$ClassName$', tb.name)
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
                .replaceMask('$FieldsWithoutTimestamp$', this.createFieldsWithoutTimestamp())
                //set database type
                .replaceMask('$FieldType$', this.createDatabaseType())
                //set primary keys
                .replaceMask('$PrimaryKey$', this.createPrimaryKeys())
                //set index
                .replaceMask('$ClusteredFieldIndex$', this.createIndexFields('clustered'))
                .replaceMask('$UniqueClusteredFieldIndex$', this.createIndexFields('unique clustered'))
                .replaceMask('$NonClusteredFieldIndex$', this.createIndexFields('nonclustered'))
                .replaceMask('$UniqueNonClusteredFieldIndex$', this.createIndexFields('unique nonclustered'))
                .replaceMask('$GetIndexOption$', this.createIndexOption())
                //set check name autoincrement
                .replaceMask('$CheckNameIncrement$', this.createCheckNameIncrement())
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
                .replaceMask('$MemberGetterSetter$', this.createSetterGetter())
                //set meta type
                .replaceMask('$DECLARE_META_TYPE$', this.createMetaType())
            ;

            changed = FileUtil.writeContentWithCheckHash(header, this.outputPath + '\\' + FileUtil.outputTbFileName(tb)) || changed;
        });

        changed = this.generateEntityDelegate(tbNames) || changed;
        changed = this.generateConfigureFile(tbNames) || changed;
        return changed;
    }

    getFieldCppType(fieldType: string): string {
        switch(fieldType) {
            case 'tinyint':
                return 'uchar';
            case 'smallint':
                return 'short';
            case 'int':
                return 'int';
            case 'bigint':
                return 'qint64';
            case 'float':
            case 'double':
            case 'decimal':
            case 'numeric':
            case 'real':
                return 'qreal';
            case 'date':
                return 'QDate';
            case 'time':
                return 'QTime';
            case 'datetime':
            case 'datetime2':
            case 'datetimeoffset':
                return 'QDateTime';
            case 'timestamp':
                return 'QByteArray';
            case 'char':
            case 'varchar':
            case 'varchar(max)':
            case 'nchar':
            case 'nvarchar':
            case 'nvarchar(max)':
            case 'text':
            case 'ntext':
                return 'QString';
            case 'bit':
                return 'bool';
            case 'binary':
            case 'varbinary':
            case 'varbinary(max)':
                return 'QByteArray';
            case 'sql_variant':
                return 'QVariant';
            case 'uniqueidentifier':
            case 'xml':
                return 'QByteArray';
        }
        return 'unknown';
    }

    getCppDefaultValueString(fieldType: string, defaultValue: string): string {

        switch(fieldType) {
            case 'timestamp':
                return 'QByteArray()';
            case 'sql_variant':
            case 'uniqueidentifier':
            case 'xml':
                return defaultValue;
        }

        let defV = defaultValue.toLowerCase();
        if (defV === 'null') {
            return this.getFieldCppType(fieldType) + '()';
        }

        switch(fieldType) {
            case 'date':
                if (defV === 'now') {
                    return 'QDate::currentDate()';
                }
                if (defaultValue.contains('QDate')) {
                    return defaultValue;
                }
                return `QDate::fromString("${defaultValue}")`;
            case 'time':
                if (defV === 'now') {
                    return 'QTime::currentTime()';
                }
                if (defaultValue.contains('QTime')) {
                    return defaultValue;
                }
                return `QTime::fromString("${defaultValue}")`;
            case 'datetime':
            case 'datetime2':
            case 'datetimeoffset':
                if (defV === 'now') {
                    return 'QDateTime::currentDateTime()';
                }
                if (defaultValue.contains('QDateTime')) {
                    return defaultValue;
                }
                return `QDateTime::fromString("${defaultValue}")`;
            case 'char':
            case 'varchar':
            case 'varchar(max)':
            case 'nchar':
            case 'nvarchar':
            case 'nvarchar(max)':
            case 'text':
            case 'ntext':
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
            case 'binary':
            case 'varbinary':
            case 'varbinary(max)':
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
        
        switch(fieldType) {
            case 'timestamp':
            case 'binary':
            case 'varbinary':
            case 'varbinary(max)':
            case 'sql_variant':
            case 'uniqueidentifier':
            case 'xml':
                return 'null';
        }

        let defV = defaultValue.toLowerCase();
        if (defV === 'null') {
            return 'null';
        }

        switch(fieldType) {
            case 'tinyint':
            case 'smallint':
            case 'int':
            case 'bigint':
            case 'float':
            case 'double':
            case 'decimal':
            case 'numeric':
            case 'bit':
                return defaultValue;
            case 'date':
            case 'time':
            case 'datetime':
            case 'datetime2':
            case 'datetimeoffset':
                if (defV === 'now') {
                    return 'getdate()';
                }
                if (defaultValue.contains('QTime') || defaultValue.contains('QDate') || defaultValue.contains('QDateTime')) {
                    return 'null';
                }
                return `'${defaultValue}'`;
            case 'char':
            case 'varchar':
            case 'varchar(max)':
            case 'nchar':
            case 'nvarchar':
            case 'nvarchar(max)':
            case 'text':
            case 'ntext':
                if (defV === 'empty') {
                    return "''";
                }
                if (defaultValue.contains('QString')) {
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
        return fieldType;
    }

    protected getComment(note: string): string {
        return '';
    }

    protected getAutoIncrementStatement(): string {
        return 'identity(1,1)'; //from 1 step 1
    }

    protected getSqlTypeName(): string {
        return 'SqlServer';
    }

    protected getSqlClientTypeName(): string {
        return 'ClientSqlServer';
    }

    protected wrapWithCheckKeyworks(name: string): string {
        if (keywordsOrReservedWords["sqlite"].contains(name.toUpperCase())) {
            return `[${name}]`;
        }
        return name;
    }
}