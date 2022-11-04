export interface TypeReadInterface {
    getFieldCppType: (fieldType: string) => string;
    getDatabaseFieldType: (fieldType: string) => string;
    getCppDefaultValueString: (fieldType: string, defaultValue: string) => string;
    getDatabaseDefaultValueString: (fieldType: string, defaultValue: string) => string;
}

export class Field {
    name: string = ''; //required
    type: string = ''; //required

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

    get cppType() {
        return this.typeReader?.getFieldCppType(this.type);
    }

    get cppDefault() {
        return this.typeReader?.getCppDefaultValueString(this.type, this.defaultValue);
    }

    get sqlType() {
        return this.typeReader?.getDatabaseFieldType(this.type);
    }

    get sqlDefault() {
        return this.typeReader?.getDatabaseDefaultValueString(this.type, this.defaultValue);
    }
}

export class Index {
    indexType: string = '';
    fields: string[] = [];
    indexOptions: string = '';
}

export class Table {
    name: string = '';
    metaType: boolean = false;

    fields: Field[] = [];
    indexes: Index[] = [];
    
    customConstructor: string[][] = [];

    engine: string = ''; //mysql engine

    set typeInterface(reader: TypeReadInterface) {
        this.fields.forEach((e) => e.typeReader = reader);
    }
}

export class Entity {
    prefix: string = '';
    dbType: string = '';
    tables: Table[] = [];
}