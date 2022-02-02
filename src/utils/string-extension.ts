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

export{};