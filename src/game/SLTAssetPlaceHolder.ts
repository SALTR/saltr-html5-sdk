export class SLTAssetPlaceHolder {
    private readonly _tags: any[];

    constructor(tags: any[]) {
        this._tags = tags;
    }

    get tags(): any[] {
        return this._tags;
    }
}