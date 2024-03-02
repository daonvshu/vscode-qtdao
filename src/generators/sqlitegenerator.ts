import { DatabaseGenerator } from "./databasegenerator";
import { keywordsOrReservedWords } from "../utils/keywords";
import { TypeReadInterface } from "./entity";

export class SqliteGenerator extends DatabaseGenerator implements TypeReadInterface {

    public generate(): boolean {
        let changed = this.generateEntities(this);
        changed = this.generateDelegateFiles() || changed;
        changed = this.generateConfigFiles() || changed;
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

    protected wrapWithCheckKeyworks(name: string): string {
        if (keywordsOrReservedWords["sqlite"].contains(name.toUpperCase())) {
            return `\\"${name}\\"`;
        }
        return name;
    }
}