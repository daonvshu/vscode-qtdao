import { findSerializableTypeHeaderName } from "../utils/serializabletypes";

export interface TypeReadInterface {
    getFieldCppType: (fieldType: string) => string;
    getDatabaseFieldType: (fieldType: string) => string;
    getCppDefaultValueString: (fieldType: string, defaultValue: string) => string;
    getDatabaseDefaultValueString: (fieldType: string, defaultValue: string) => string;
    getBinaryType: () => string;
}

export class Field {
    name: string = ''; //required
    type: string = ''; //required
    customTypeName: string = '';
    useCustomType: boolean = false;
    typeHeaders: string[] = [];

    note: string = '';
    constraint: string = '';
    defaultValue: string = '';

    autoIncrement: boolean = false;
    transient: boolean = false;

    jsonKey: string = '';
    jsonTimeFormat: string = '';

    bitSize: number = 0; //sqlserver precision of decimal type 
    decimalPoint: number = 0; //sqlserver decimal point of decimal type

    typeReader?: TypeReadInterface;

    refer: ForeignKey = new ForeignKey();

    analyzeCustomType() {
        if (this.type === "custom") {
            this.useCustomType = true;
            this.typeHeaders = findSerializableTypeHeaderName(this.customTypeName);
        }
    }

    get cppType() {
        if (this.useCustomType) {
            return this.customTypeName;
        }
        return this.typeReader?.getFieldCppType(this.type);
    }

    get cppDefault() {
        if (this.useCustomType) {
            return this.defaultValue;
        }
        return this.typeReader?.getCppDefaultValueString(this.type, this.defaultValue);
    }

    get sqlType() {
        if (this.useCustomType) {
            return this.typeReader?.getBinaryType();
        }
        return this.typeReader?.getDatabaseFieldType(this.type);
    }

    get sqlDefault() {
        if (this.useCustomType) {
            return "";
        }
        return this.typeReader?.getDatabaseDefaultValueString(this.type, this.defaultValue);
    }
}

export class Index {
    indexType: string = '';
    fields: string[] = [];
    indexOptions: string = '';
}

export class ForeignKey {
    table: string = '';
    referTable: string = '';
    onUpdateAction: string = '';
    onDeleteAction: string = '';
    referFields: string[] = [];
    deferrable: boolean = false;
}

export class Table {
    name: string = '';
    metaType: boolean = false;

    fields: Field[] = [];
    indexes: Index[] = [];
    
    customConstructor: string[][] = [];

    engine: string = ''; //mysql engine

    refer: ForeignKey[] = [];

    set typeInterface(reader: TypeReadInterface) {
        this.fields.forEach((e) => e.typeReader = reader);
    }
}

export class Entity {
    prefix: string = '';
    dbType: string = '';
    tables: Table[] = [];
}