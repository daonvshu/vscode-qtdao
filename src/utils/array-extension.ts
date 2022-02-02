Array.prototype.merge = function (): string {
    let str = '';
    this.forEach((e) => str += e);
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