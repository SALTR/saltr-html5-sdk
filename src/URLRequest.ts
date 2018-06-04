import {URLRequestHeader} from "./URLRequestHeader";
import {URLRequestMethod} from "./URLRequestMethod";
import {CoreOptions, Headers} from "request";

export class URLRequest implements CoreOptions{
    url: string;
    form: { [key: string]: any };
    json: boolean;
    method: string;
}

