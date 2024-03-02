import { DatabaseGenerator } from "./databasegenerator";
import { keywordsOrReservedWords } from "../utils/keywords";
import { TypeReadInterface } from "./entity";

export class MysqlGeneator extends DatabaseGenerator implements TypeReadInterface {

    public generate(): boolean {
        let changed = this.generateEntities(this);
        changed = this.generateDelegateFiles() || changed;
        changed = this.generateConfigFiles() || changed;
        return changed;
    }

    getFieldCppType(fieldType: string): string {
        switch(fieldType) {
            case 'tinyint':
                return 'char';
            case 'smallint':
                return 'short';
            case 'mediumint':
            case 'int':
                return 'int';
            case 'bigint':
                return 'qint64';
            case 'float':
            case 'double':
            case 'decimal':
                return 'qreal';
            case 'date':
                return 'QDate';
            case 'time':
                return 'QString'; //see qsql_mysql.cpp#313
            case 'datetime':
            case 'timestamp':
                return 'QDateTime';
            case 'char':
                return 'QChar';
            case 'varchar':
            case 'tinytext':
            case 'text':
            case 'mediumtext':
            case 'longtext':
                return 'QString';
            case 'tinyblob':
            case 'blob':
            case 'mediumblob':
            case 'longblob':
                return 'QByteArray';
        }
        return 'unknown';
    }

    getCppDefaultValueString(fieldType: string, defaultValue: string): string {
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
                    return 'QTime::currentTime().toString("HH:mm:ss")';
                }
                if (defaultValue.contains('QTime')) {
                    return defaultValue;
                }
                return `"${defaultValue}"`;
            case 'datetime':
            case 'timestamp':
                if (defV === 'now') {
                    return 'QDateTime::currentDateTime()';
                }
                if (defaultValue.contains('QDateTime')) {
                    return defaultValue;
                }
                defV = defaultValue.toUpperCase();
                if (defV.startsWith('NULL ON UPDATE CURRENT_TIMESTAMP')) {
                    return 'QDateTime()';
                }
                if (defV.startsWith('CURRENT_TIMESTAMP')) {
                    return 'QDateTime::currentDateTime()';
                }
                return `QDateTime::fromString("${defaultValue}")`;
            case 'char':
                return `'${defaultValue}'`;
            case 'varchar':
            case 'tinytext':
            case 'text':
            case 'mediumtext':
            case 'longtext':
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
            case 'tinyblob':
            case 'blob':
            case 'mediumblob':
            case 'longblob':
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
            case 'tinyint':
            case 'smallint':
            case 'mediumint':
            case 'int':
            case 'bigint':
            case 'float':
            case 'double':
            case 'decimal':
                return defaultValue;
            case 'date':
            case 'time':
                if (defV === 'now') {
                    return 'null';
                }
                if (defaultValue.contains('QTime') || defaultValue.contains('QDate')) {
                    return 'null';
                }
                return `'${defaultValue}'`;
            case 'datetime':
            case 'timestamp':
                if (defV === 'now') {
                    return 'CURRENT_TIMESTAMP';
                }
                if (defaultValue.contains('QDateTime')) {
                    return 'null';
                }
                defV = defaultValue.toUpperCase();
                if (defV.startsWith('NULL ON UPDATE CURRENT_TIMESTAMP')) {
                    return defaultValue;
                }
                if (defV.startsWith('CURRENT_TIMESTAMP')) {
                    return defaultValue;
                }
                return `'${defaultValue}'`;
            case 'char':
                return `'${defaultValue}'`;
            case 'varchar':
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
        return 'blob';
    }

    protected getComment(note: string): string {
        return ` comment '${note}'`;
    }

    protected getAutoIncrementStatement(): string {
        return 'auto_increment';
    }

    protected getSqlTypeName(): string {
        return 'Mysql';
    }

    protected wrapWithCheckKeyworks(name: string): string {
        if (keywordsOrReservedWords["sqlite"].contains(name.toUpperCase())) {
            return `\`${name}\``;
        }
        return name;
    }
}