class SLTFeature {

    private readonly _token: string;
    private readonly _type: string;
    private _body:any;
    private readonly _isRequired:boolean;
    private _version:string;
    private _disabled:boolean;


    constructor(token: string, type: string, version: string, body: any = null, isRequired: boolean = false) {
        this._token = token;
        this._type = type;
        this._body = body;
        this._isRequired = isRequired;
        this._version = version;
        this._disabled = false;
    }

    get token(): string {
        return this._token;
    }

    get type(): string {
        return this._type;
    }

    get body(): any {
        return this._body;
    }

    get isRequired(): boolean {
        return this._isRequired;
    }

    get version(): string {
        return this._version;
    }

    get disabled(): boolean {
        return this._disabled;
    }

    set disabled(value: boolean) {
        this._disabled = this._isRequired ? false : value;
    }

    toString(): string {
        return "[SALTR] Feature { token : " + this._token + ", value : " + this._body + "}";
    }

    update(version:string, newBody:any = null):void {
        this._version = version;
        if (newBody != null) {
            this._body = newBody;
        }
    }
}

export {SLTFeature}