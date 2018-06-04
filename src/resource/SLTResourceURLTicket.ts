import {URLRequestHeader} from "../URLRequestHeader";
import {URLRequestMethod} from "../URLRequestMethod";
import * as request from "request";
import {URLRequest} from "../URLRequest";

class SLTResourceURLTicket {

    //URLRequest variables
    private _authenticate: boolean;
    private _cacheResponse: boolean;
    private _contentType: string;
    private _variables: any;
    private _followRedirects: boolean;
    private _idleTimeout: number;
    private _manageCookies: boolean;
    private _method: string;
    private _requestHeaders: URLRequestHeader[];
    private _url: string;
    private _useCache: boolean;
    private _userAgent: string;

    //Transport specific variables
    private _checkPolicy: boolean;
    private _useSameDomain: boolean;
    private _maxAttempts: number;
    private _dropTimeout: number;
    private _timeoutIncrease: number;

    /**
     * Class constructor.
     * @param url The URL.
     * @param variables The URL variables.
     */
    public constructor(url: string, variables: any = null) {
        this._authenticate = true;
        this._cacheResponse = true;
        this._followRedirects = true;
        this._manageCookies = true;
        this._useCache = true;

        this._idleTimeout = 3000.0;
        this._userAgent = null;
        this._url = url;
        this._variables = variables;
        this._method = variables.method;
        this._requestHeaders = [];
        this._checkPolicy = false;
        this._maxAttempts = 3;
        this._useSameDomain = true;
        this._dropTimeout = 0.0;
        this._timeoutIncrease = 0;
    }

    /**
     * Provides the URL request.
     * @return The URL request.
     */
    public getURLRequest(): URLRequest {
        const request: URLRequest = new URLRequest();
        request.url = this._url;
        request.json = true;
        if (this.method) {
            request.method = this.method;
        } else {
            request.form = this._variables;
            request.method = "POST";
        }
        return request;
    }

    /**
     * Adds request header.
     * @param name The name of the header.
     * @param value The value of the header.
     */
    public addHeader(name: string, value: string): void {
        this._requestHeaders.push(new URLRequestHeader(name, value));
    }

    /**
     * Provides the value of the request header.
     * @param name The name of the header.
     * @return The value of the header, <code>null</code> if there is no existing header with provided name.
     */
    public getHeaderValue(name: string): string {
        for (let i = this._requestHeaders.length - 1; i >= 0; i--) {
            let header: URLRequestHeader = this._requestHeaders[i];
            if (header.name == name) {
                return header.value;
            }
        }
        return null;
    }

    /**
     * Authentication.
     */
    public get authenticate(): boolean {
        return this._authenticate || false;
    }

    /**
     * @private
     */
    public set authenticate(value: boolean) {
        this._authenticate = value;
    }

    /**
     * Response caching.
     */
    public get cacheResponse(): boolean {
        return this._cacheResponse || false;
    }

    /**
     * @private
     */
    public set cacheResponse(value: boolean) {
        this._cacheResponse = value;
    }

    /**
     * The type of content.
     */
    public get contentType(): string {
        return this._contentType || '';
    }

    /**
     * @private
     */
    public set contentType(value: string) {
        this._contentType = value;
    }

    /**
     * URL variables.
     */
    public get variables() {
        return this._variables;
    }

    /**
     * @private
     */
    public set variables(value: any) {
        this._variables = value;
    }

    /**
     * Follow redirects.
     */
    public get followRedirects(): boolean {
        return this._followRedirects || false;
    }

    /**
     * @private
     */
    public set followRedirects(value: boolean) {
        this._followRedirects = value;
    }

    /**
     * Idle timeout.
     */
    public get idleTimeout(): number {
        return this._idleTimeout || 0;
    }

    /**
     * @private
     */
    public set idleTimeout(value: number) {
        this._idleTimeout = value;
    }

    /**
     * Manage cookies.
     */
    public get manageCookies(): boolean {
        return this._manageCookies || false;
    }

    /**
     * @private
     */
    public set manageCookies(value: boolean) {
        this._manageCookies = value;
    }

    /**
     * Method.
     */
    public get method(): string {
        return this._method;
    }

    /**
     * @private
     */
    public set method(value: string) {
        this._method = value;
    }

    /**
     * Request headers.
     */
    public get requestHeaders(): any[] {
        return this._requestHeaders;
    }

    /**
     * @private
     */
    public set requestHeaders(value: any[]) {
        this._requestHeaders = value;
    }

    /**
     * URL.
     */
    public get url(): string {
        return this._url || '';
    }

    /**
     * @private
     */
    public set url(value: string) {
        this._url = value;
    }

    /**
     * Use cache.
     */
    public get useCache(): boolean {
        return this._useCache || false;
    }

    /**
     * @private
     */
    public set useCache(value: boolean) {
        this._useCache = value;
    }

    /**
     * User agent.
     */
    public get userAgent(): string {
        return this._userAgent || '';
    }

    /**
     * @private
     */
    public set userAgent(value: string) {
        this._userAgent = value;
    }

    /**
     * Maximum attempts.
     */
    public get maxAttempts(): number {
        return this._maxAttempts || 0;
    }

    /**
     * @private
     */
    public set maxAttempts(value: number) {
        this._maxAttempts = value;
    }

    /**
     * Policy checking.
     */
    public get checkPolicy(): boolean {
        return this._checkPolicy || false;
    }

    /**
     * @private
     */
    public set checkPolicy(value: boolean) {
        this._checkPolicy = value;
    }

    /**
     * Use same domain.
     */
    public get useSameDomain(): boolean {
        return this._useSameDomain || false;
    }

    /**
     * @private
     */
    public set useSameDomain(value: boolean) {
        this._useSameDomain = value;
    }

    /**
     * Dropping timeout.
     */
    public get dropTimeout(): number {
        return this._dropTimeout || 0;
    }

    /**
     * @private
     */
    public set dropTimeout(value: number) {
        this._dropTimeout = value;
    }

    /**
     * @private
     */
    public get timeoutIncrease(): number {
        return this._timeoutIncrease || 0;
    }

    /**
     * @private
     */
    public set timeoutIncrease(value: number) {
        this._timeoutIncrease = value;
    }

}

export {SLTResourceURLTicket}