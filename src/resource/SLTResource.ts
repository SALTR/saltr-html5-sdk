import {SLTResourceURLTicket} from "./SLTResourceURLTicket";
import {Timer} from "../timer/Timer";
import {TimerEvent} from "../timer/TimerEvent";
import {Utils} from "../utils/Utils";
import * as request from "request";
import {URLRequest} from "../URLRequest";

class SLTResource {
    private _data: any;
    private _fails: number;
    private readonly _ticket: SLTResourceURLTicket;
    private readonly _maxAttempts: number;
    private readonly _onSuccess: (...args: any[]) => void;
    private readonly _onFail: (...args: any[]) => void;

    /**
     * Class constructor.
     * @param ticket The ticket for loading the asset.
     * @param onSuccess The callback function if loading succeed, function signature is function(asset:Asset).
     * @param onFail The callback function if loading fail, function signature is function(asset:Asset).
     */
    public constructor(ticket: SLTResourceURLTicket, onSuccess: (...args: any[]) => void, onFail: (...args: any[]) => void) {
        this._ticket = ticket;
        this._onSuccess = onSuccess;
        this._onFail = onFail;
        this._maxAttempts = this._ticket.maxAttempts;
        this._fails = 0;
    }

    public get data(): string {
        return this._data || '';
    }


    public load(): void {
        let urlRequest: URLRequest = this._ticket.getURLRequest();
        request(urlRequest, (error, response, body) => {
            if (error || response.statusCode >= 400) {
                this.loadFailed();
            } else {
                this.completeHandler(body);
            }
        });
    }


    private completeHandler(body: any): void {
        this._data = body;
        this._onSuccess(this);
    }

    private loadFailed(): void {
        this._fails++;
        if (this._fails == this._maxAttempts) {
            this._onFail.call(null, this);
        }
        else {
            this.load();
        }
    }
}

export {SLTResource}