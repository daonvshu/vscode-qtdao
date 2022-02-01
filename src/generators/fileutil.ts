import { Table } from "./entity";

import fs = require('fs');
import crypto = require('crypto');

export class FileUtil {

    static outputTbFileName(tb: Table): string {
        return `${tb.name}.h`;
    }

    static getStrMd5(str: string): string {
        const hash = crypto.createHash('md5');
        hash.update(str, 'utf8');
        return hash.digest('hex');
    }

    static getFileMd5(fileName: string): string {
        if (!fs.existsSync(fileName)) {
            return '';
        }
        var fileContent = fs.readFileSync(fileName, {encoding: 'utf-8'});
        return this.getStrMd5(fileContent);
    }

    static writeContentWithCheckHash(content: string, filePath: string) {
        var contentHash = this.getStrMd5('\ufeff' + content);
        var fileHash = this.getFileMd5(filePath);
        if (fs.existsSync(filePath)) {
            console.log(fs.realpathSync(filePath));
        }
        if (contentHash !== fileHash) {
            this.writeUtf8ContentWithBomHeader(content, filePath);
        }
    }

    static writeUtf8ContentWithBomHeader(content: string, filePath: string) {
        fs.writeFileSync(filePath, '\ufeff' + content);
    }
}