import { templateMysql } from "../templates/mysql";
import { DatabaseGenerator } from "./databasegenerator";
import { Table } from "./entity";
import { FileUtil } from "./fileutil";

export class MysqlGeneator extends DatabaseGenerator {

    public generate(): void {
        
        var tb: Table;
        this.entity.tables.forEach((tb) => {
            var header = templateMysql;


            FileUtil.writeContentWithCheckHash(header, this.outputPath + '\\' + FileUtil.outputTbFileName(tb));
        });
    }
}