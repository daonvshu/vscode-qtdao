import { templateMysql } from "../templates/mysql";
import { DatabaseGenerator } from "./databasegenerator";
import { FileUtil } from "../utils/fileutil";
import "../utils/string-extension.ts";

export class MysqlGeneator extends DatabaseGenerator {

    public generate(): boolean {
        
        var tbNames = new Array<string>();
        var changed = false;
        this.entity.tables.forEach((tb) => {
            tbNames.push(tb.name);

            this.loadTb = tb;

            var header = templateMysql
                //set classname
                .replaceMask('$ClassName$', tb.name)
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
                //set engine
                .replaceMask('$TbEngine$', this.createTableEngine(tb.engine))
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
                //setter and getter
                .replaceMask('$MemberGetterSetter$', this.createSetterGetter())
                //set meta type
                .replaceMask('$DECLARE_META_TYPE$', this.createMetaType())
            ;

            changed ||= FileUtil.writeContentWithCheckHash(header, this.outputPath + '\\' + FileUtil.outputTbFileName(tb));
        });

        changed ||= this.generateEntityDelegate(tbNames);
        changed ||= this.generateConfigureFile(tbNames);
        return changed;
    }

    protected getFieldCppType(fieldType: string): string {
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

    protected getCppDefaultValueString(fieldType: string, defaultValue: string): string {
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
                if (defaultValue.startsWith('NULL ON UPDATE CURRENT_TIMESTAMP')) {
                    return 'QDateTime()';
                }
                if (defaultValue.startsWith('CURRENT_TIMESTAMP')) {
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

    protected getDatabaseDefaultValueString(fieldType: string, defaultValue: string): string {
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
                if (defaultValue.startsWith('NULL ON UPDATE CURRENT_TIMESTAMP')) {
                    return defaultValue;
                }
                if (defaultValue.startsWith('CURRENT_TIMESTAMP')) {
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

    protected getDatabaseFieldType(fieldType: string): string {
        return fieldType;
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

    protected getSqlClientTypeName(): string {
        return 'ClientMysql';
    }
}