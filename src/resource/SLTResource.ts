import {SLTResourceURLTicket} from "./SLTResourceURLTicket";
import Axios from "axios";
import {URLRequest} from "../URLRequest";
import * as FormData from "form-data";

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
        const urlRequest: URLRequest = this._ticket.getURLRequest();

        let config: any = {
            url: urlRequest.url,
            method: urlRequest.method,
            responseType: "json",
        };

        if (urlRequest.method !== "GET") {
            const data: FormData = new FormData();
            Object.keys(urlRequest.form).forEach(key => {
                data.append(key, urlRequest.form[key]);
            });

            config = {
                ...config,
                data: data,
                headers: data.getHeaders()
            }
        }

        Axios.request(config).then((response: any) => {
            this.completeHandler(response.data);
        }).catch(() => {
            this.loadFailed();
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