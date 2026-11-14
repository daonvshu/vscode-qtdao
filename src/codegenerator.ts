import path = require('path');
import { load } from './configloader';
import { SqliteGenerator } from './generators/sqlitegenerator';
import { MysqlGenerator } from './generators/mysqlgenerator';
import { SqlServerGenerator } from './generators/sqlservergenerator';
import { PSqlGenerator } from './generators/psqlgenerator';
import { reportWarning, reportInfo } from './notifier';

export async function generateEntityCode(filePath: string, templateDir: string) {
    let entity = await load(filePath);
    let fileDir = path.dirname(filePath);
    if (entity !== null) {
        let changed = false;
        switch(entity.dbType) {
            case 'sqlite':
                changed = new SqliteGenerator(fileDir, entity, templateDir).generate();
                break;
            case 'mysql':
                changed = new MysqlGenerator(fileDir, entity, templateDir).generate();
                break;
            case 'sqlserver':
                changed = new SqlServerGenerator(fileDir, entity, templateDir).generate();
                break;
            case 'psql':
                changed = new PSqlGenerator(fileDir, entity, templateDir).generate();
                break;
        }
        if (!changed) {
            reportWarning('No changed!');
        } else {
            reportInfo('Generated successfully!');
        }
    }
}
