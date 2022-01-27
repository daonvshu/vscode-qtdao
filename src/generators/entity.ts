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
}

export class Entity {
    prefix: string = '';
    dbType: string = '';
    tables: Table[] = [];
}