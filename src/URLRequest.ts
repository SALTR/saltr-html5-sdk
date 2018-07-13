export class URLRequest {
    private _url: string;
    private _form: { [key: string]: any };
    private _json: boolean;
    private _method: string;

    get url(): string {
        return this._url;
    }

    set url(value: string) {
        this._url = value;
    }

    get form(): { [p: string]: any } {
        return this._form;
    }

    set form(value: { [p: string]: any }) {
        this._form = value;
    }

    get json(): boolean {
        return this._json;
    }

    set json(value: boolean) {
        this._json = value;
    }

    get method(): string {
        return this._method;
    }

    set method(value: string) {
        this._method = value;
    }
}

