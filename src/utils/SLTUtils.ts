import {Dictionary} from "../Dictionary";
import {Utils} from "./Utils";

class SLTUtils {

    /**
     * Formats a string in .Net-style, with curly braces ("{0}").
     * Does not support any number formatting options yet.
     * @param format The string to format.
     * @param args
     * @return Formatted string.
     */
    public static formatString(format: string, ...args: any[]): string {
        for (let i: number = 0, length: number = args.length; i < length; ++i)
            format = format.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);

        return format;
    }

    /**
     * Provides the size of dictionary.
     * @param dictionary The dictionary which size needs to calculate.
     * @return The size of dictionary.
     */
    public static getDictionarySize(dictionary: Dictionary<any>): number {
        let count: number = 0;
        for (let i in dictionary) {
            ++count;
        }

        return count;
    }

    /**
     * Checks the email validity.
     * @param email The email to check.
     * @return <code>true</code> if valid.
     */
    public static checkEmailValidation(email: string): boolean {
        let emailExpression: RegExp = /([a-z0-9._-]+?)@([a-z0-9.-]+)\.([a-z]{2,4})/;
        return emailExpression.test(email);
    }

    /**
     * Shuffle vector.
     * @param vect The vector to shuffle.
     */
    public static shuffleVector(vect: any[]): void {
        let totalItems: number = vect.length;
        for (let i: number = 0; i < totalItems; ++i) {
            SLTUtils.swapVectorItems(vect, i, i + Math.random() * (totalItems - i));
        }
    }

    /**
     * Swap vector items.
     * @param vect The vector.
     * @param a The item one index
     * @param b The item two index
     */
    public static swapVectorItems(vect: any, a: number, b: number): void {
        let temp: any = vect[a];
        vect[a] = vect[b];
        vect[b] = temp;
    }

    /**
     * Clone object.
     * @param object The object.
     */
    public static cloneObject(object: any): any {
        if (Utils.isNumber(object) || Utils.isString(object) || Utils.isBoolean(object) || object == null) {
            return object;
        }
        else if (Utils.isArray(object)) {
            return [...object];
        }
    }

    public static validateFeatureToken(token: string): boolean {
        let pattern: RegExp = /[^a-zA-Z0-9._-]/;
        return !(null == token || "" == token || -1 != token.search(pattern));

    }
}

export {SLTUtils}