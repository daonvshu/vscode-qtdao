import { Entity, Table } from "./entity";

export class DatabaseGenerator {

    protected outputPath: string;

    protected entity: Entity;

    constructor(outputPath: string, entity: Entity) {
        this.outputPath = outputPath;
        this.entity = entity;
    }

    public generate() {}

    
    protected lowerAndSplitWithUnderline(str: string): string {
        var result = '';
        var lastIndex = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            if (c >= 'A' && c <= 'Z') {
                result += str.substring(lastIndex, i - lastIndex).toLowerCase() + '_';
                lastIndex = i;
            }
        }
        result += str.substring(lastIndex).toLowerCase();
        return result;
    }

    protected upperFirstChar(str: string): string {
        return str.charAt(0).toUpperCase() + str.substring(1);
    }

    protected getFieldNameInDatabase(str: string, ignoreMix: boolean): string {
        return this.lowerAndSplitWithUnderline(str);
    }


    
}