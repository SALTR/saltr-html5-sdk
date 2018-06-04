import {SLTStatus} from "../../status/SLTStatus";

class SLTApiCallResult {

    private _success: boolean;
    private _status: SLTStatus;
    private _data: any;

    public constructor() {
    }

    get success(): boolean {
        return this._success;
    }

    set success(value: boolean) {
        this._success = value;
    }

    get status(): SLTStatus {
        return this._status;
    }

    set status(value: SLTStatus) {
        this._status = value;
    }

    get data(): any {
        return this._data;
    }

    set data(value: any) {
        this._data = value;
    }
}

export {SLTApiCallResult}