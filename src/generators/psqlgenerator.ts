import { DatabaseGenerator } from "./databasegenerator";
import { keywordsOrReservedWords } from "../utils/keywords";
import { Entity, Field, ForeignKey, Index, Table, TypeReadInterface } from "./entity";

export class PSqlGenerator extends DatabaseGenerator implements TypeReadInterface {

    constructor(outputPath: string, entity: Entity, templateDir: string) {
        super(outputPath, entity, templateDir);

        //check auto increment field type
        const autoIncrementTypes = ['smallserial', 'serial', 'bigserial'];
        this.entity.tables.forEach(tb => {
            tb.fields.forEach(field => {
                if (autoIncrementTypes.includes(field.type)) {
                    field.autoIncrement = true;
                }
            });
        });
    }

    public generate(): boolean {
        let changed = this.generateEntities(this);
        changed = this.generateDelegateFiles() || changed;
        changed = this.generateConfigFiles() || changed;
        return changed;
    }

    getFieldCppType(fieldType: string): string {
        switch(fieldType) {
            case 'bit':
                return 'char';
            case 'smallint':
            case 'smallserial':
                return 'short';
            case 'integer':
            case 'serial':
                return 'int';
            case 'bigint':
            case 'bigserial':
                return 'qint64';
            case 'decimal':
            case 'numeric':
            case 'double precision':
            case 'real':
                return 'qreal';
            case 'boolean':
                return 'bool';
            case 'date':
                return 'QDate';
            case 'time':
                return 'QTime';
            case 'timestamp':
                return 'QDateTime';
            case 'interval':
                return 'QString';
            case 'char':
                return 'QChar';
            case 'varchar':
            case 'text':
                return 'QString';
            case 'bytea':
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
                if (defV === 'now' || defV === 'CURRENT_DATE') {
                    return 'QDate::currentDate()';
                }
                if (defaultValue.contains('QDate')) {
                    return defaultValue;
                }
                return `QDate::fromString("${defaultValue}")`;
            case 'time':
                if (defV === 'now' || defV === 'CURRENT_TIME') {
                    return 'QTime::currentTime()';
                }
                if (defaultValue.contains('QTime')) {
                    return defaultValue;
                }
                return `QTime::fromString("${defaultValue}")`;
            case 'timestamp':
                if (defV === 'now' || defV.startsWith('CURRENT_TIMESTAMP')) {
                    return 'QDateTime::currentDateTime()';
                }
                if (defaultValue.contains('QDateTime')) {
                    return defaultValue;
                }
                return `QDateTime::fromString("${defaultValue}")`;
            case 'char':
                return `'${defaultValue}'`;
            case 'varchar':
            case 'text':
            case 'interval':
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
            case 'bytea':
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
            case 'bit':
                return `B'${defaultValue}'`;
            case 'smallint':
            case 'smallserial':
            case 'integer':
            case 'serial':
            case 'bigint':
            case 'bigserial':
            case 'decimal':
            case 'numeric':
            case 'double precision':
            case 'real':
            case 'boolean':
                return defaultValue;
            case 'date':
                if (defV === 'now' || defV === 'CURRENT_DATE') {
                    return 'CURRENT_DATE';
                }
                if (defaultValue.contains('QDate')) {
                    return 'null';
                }
                return `'${defaultValue}'`;
            case 'time':
                if (defV === 'now' || defV === 'CURRENT_TIME') {
                    return 'CURRENT_TIME';
                }
                if (defaultValue.contains('QTime')) {
                    return 'null';
                }
                return `'${defaultValue}'`;
            case 'timestamp':
                if (defV === 'now') {
                    return 'CURRENT_TIMESTAMP';
                }
                if (defaultValue.startsWith('CURRENT_TIMESTAMP')) {
                    return defaultValue;
                }
                if (defaultValue.contains('QDateTime')) {
                    return 'null';
                }
                return `'${defaultValue}'`;
            case 'char':
                return `'${defaultValue}'`;
            case 'varchar':
            case 'text':
            case 'interval':
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
        return 'bytea';
    }

    protected getComment(note: string): string {
        return '';
    }

    protected getAutoIncrementStatement(): string {
        return '';
    }

    protected getSqlTypeName(): string {
        return 'PSql';
    }

    protected wrapWithCheckKeyworks(name: string): string {
        if (keywordsOrReservedWords["psql"].contains(name.toUpperCase())) {
            return `\\"${name}\\"`;
        }
        return name;
    }
}