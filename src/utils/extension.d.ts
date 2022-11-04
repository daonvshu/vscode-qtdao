declare global {
    interface Array<T extends string> {
        merge(): string;
    }

    interface Array<T> {
        isEmpty(): boolean;
        isNotEmpty(): boolean;

        contains(t: T): boolean;
    }

    interface String {
        isEmpty(): boolean;
        isNotEmpty(): boolean;

        contains(subStr: string): boolean;

        replaceAll(searchValue: string, replaceValue: string): string;
        replaceMask(mask: string, replaceValue: string): string;

        snakeCase(): string;
        pascalCase(): string;
    }
}
export{};