export class Utils {

    public static isUndefined(obj: any): boolean {
        return typeof obj === 'undefined';
    }

    public static isNumber(obj: any): boolean {
        return Object.prototype.toString.call(obj) == '[object Number]';
    }

    public static isBoolean(obj: any): boolean {
        return Object.prototype.toString.call(obj) == '[object Boolean]';
    }

    public static isString(obj: any): boolean {
        return Object.prototype.toString.call(obj) == '[object String]';
    }

    public static isArray(obj: any): boolean {
        return Object.prototype.toString.call(obj) == '[object Array]';
    }

    public static isObject(obj: any): boolean {
        return Object.prototype.toString.call(obj) == '[object Object]';
    }

    public static randRange(min: number, max: number): number {
        return Math.floor(Math.random() * max) + min;
    }

    public static isMac(): boolean {
        return window.navigator.platform.toLowerCase().indexOf("mac") === 0;
    }
}