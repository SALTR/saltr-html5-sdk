class SLTLogger {

    private static INSTANCE: SLTLogger;

    private _isDebug: boolean;
    private _verboseLogging: boolean;


    private constructor() {
        this._isDebug = false;
        this._verboseLogging = false;
    }

    public static getInstance(): SLTLogger {
        if (!this.INSTANCE) {
            this.INSTANCE = new SLTLogger();
        }
        return this.INSTANCE;
    }

    public set debug(value: boolean) {
        this._isDebug = value;
    }

    public set verboseLogging(value: boolean) {
        this._verboseLogging = value;
    }

    public log(message: string): void {
        if (this._isDebug && this._verboseLogging) {
            console.log('[SALTR]: ' + message);
        }
    }

}

export {SLTLogger}