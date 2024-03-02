import { DatabaseGenerator } from "./databasegenerator";
import { keywordsOrReservedWords } from "../utils/keywords";
import { TypeReadInterface } from "./entity";

export class SqlServerGenerator extends DatabaseGenerator implements TypeReadInterface {

    public generate(): boolean {
        let changed = this.generateEntities(this);
        changed = this.generateDelegateFiles() || changed;
        changed = this.generateConfigFiles() || changed;
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

    getBinaryType(): string {
        return 'binary';
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

    protected wrapWithCheckKeyworks(name: string): string {
        if (keywordsOrReservedWords["sqlite"].contains(name.toUpperCase())) {
            return `[${name}]`;
        }
        return name;
    }
}