class SLTFeature {

    private readonly _token: string;
    private readonly _type: string;
    private readonly _properties: any;
    private readonly _required: boolean;

    public constructor(token: string, type: string, properties: any = null, required: boolean = false) {
        this._token = token;
        this._type = type;
        this._properties = properties;
        this._required = required;
    }

    public get token(): string {
        return this._token || '';
    }

    public get type(): string {
        return this._type || '';
    }

    public get properties(): any {
        return this._properties;
    }

    public get required(): boolean {
        return this._required || false;
    }

    public toString(): string {
        return "[SALTR] Feature { token : " + this._token + ", value : " + this._properties + "}";
    }
}

export {SLTFeature}