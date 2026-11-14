String.prototype.isEmpty = function(): boolean {
    if (this === undefined || this === null) {
        return true;
    }
    if (this.length === 0) {
        return true;
    }
    return false;
};

String.prototype.isNotEmpty = function (): boolean {
    return !this.isEmpty();
};

String.prototype.contains = function (subStr: string): boolean {
    return this.indexOf(subStr) !== -1;
};

String.prototype.replaceAll = function (searchValue: string, replaceValue: string): string {
    return this.replace(new RegExp(searchValue, 'gm'), replaceValue);
};

String.prototype.replaceMask = function (mask: string, replaceValue: string): string {
    return this.replaceAll(`\\${mask.substring(0, mask.length - 1)}\\$`, replaceValue);
};

String.prototype.snakeCase = function(): string {
    var result = '';
    var lastIndex = 0;
    for (var i = 0; i < this.length; i++) {
        var c = this.charAt(i);
        if (c >= 'A' && c <= 'Z') {
            result += this.substring(lastIndex, i).toLowerCase() + '_';
            lastIndex = i;
        }
    }
    result += this.substring(lastIndex).toLowerCase();
    return result;
};

String.prototype.pascalCase = function(): string {
    return this.charAt(0).toUpperCase() + this.substring(1);
};

export{};