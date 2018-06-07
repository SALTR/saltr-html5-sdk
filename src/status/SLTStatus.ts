class SLTStatus {

    /**
     * Specifies the authorization error.
     */
    public static readonly AUTHORIZATION_ERROR: number = 1001;

    /**
     * Specifies the validation error.
     */
    public static readonly VALIDATION_ERROR: number = 1002;

    /**
     * Specifies the API error.
     */
    public static readonly API_ERROR: number = 1003;

    /**
     * Specifies the parse error.
     */
    public static readonly PARSE_ERROR: number = 1004;


    /**
     * Specifies the registration required error.
     */
    public static readonly REGISTRATION_REQUIRED_ERROR_CODE: number = 2001;

    /**
     * Specifies the client error.
     */
    public static readonly CLIENT_ERROR_CODE: number = 2002;


    /**
     * Specifies the client app data load fail.
     */
    public static readonly CLIENT_APP_DATA_LOAD_FAIL: number = 2040;

    /**
     * Specifies the client level content load fail.
     */
    public static readonly CLIENT_LEVEL_CONTENT_LOAD_FAIL: number = 2041;

    /**
     * Specifies the client app data concurrent load refused.
     */
    public static readonly CLIENT_APP_DATA_CONCURRENT_LOAD_REFUSED: number = 2042;

    /**
     * Specifies the client features parse error.
     */
    public static readonly CLIENT_FEATURES_PARSE_ERROR: number = 2050;

    /**
     * Specifies the client experiments parse error.
     */
    public static readonly CLIENT_EXPERIMENTS_PARSE_ERROR: number = 2051;

    /**
     * Specifies the client board parse error.
     */
    public static readonly CLIENT_BOARD_PARSE_ERROR: number = 2052;


    /**
     * Specifies the client app data parse error.
     */
    public static readonly CLIENT_APP_DATA_PARSE_ERROR: number = 2053;

    /**
     * Specifies the client level parse error.
     */
    public static readonly CLIENT_LEVELS_PARSE_ERROR: number = 2054;

    private readonly _statusCode: string;
    private readonly _statusMessage: string;

    /**
     * Class constructor.
     * @param code The status code.
     * @param message The status message.
     */
    public constructor(code: string, message: string) {
        this._statusCode = code;
        this._statusMessage = message;
        console.log("[SALTR] " + message);
    }

    /**
     * The status message.
     */
    public get statusMessage(): string {
        return this._statusMessage || '';
    }

    /**
     * The status code.
     */
    public get statusCode(): string {
        return this._statusCode || '';
    }
}

export { SLTStatus };