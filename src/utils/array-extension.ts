Array.prototype.merge = function (): string {
    let str = '';
    this.forEach((e) => str += e);
    return str;
};

Array.prototype.escapeMerge = function (split: string): string {
    let str = '';
    this.forEach((e, i) => {
        str += 'QLatin1String("' + e + '")';
        if (i !== this.length - 1) {
            str += split;
        }
    });
    return str;
};

Array.prototype.isEmpty = function (): boolean {
    if (this === undefined || this === null) {
        return true;
    }
    if (this.length === 0) {
        return true;
    }
    return false;
};

Array.prototype.isNotEmpty = function (): boolean {
    return !this.isEmpty();
};

Array.prototype.contains = function<T>(t: T): boolean {
    return this.indexOf(t) !== -1;
};

export{};