/**
 * The SLTHTTPStatus class holds HTTP status codes.
 * @private
 */
class SLTHTTPStatus {

    /**
     * Specifies the bad request HTTP status code.
     */
    static HTTP_STATUS_400: number = 400;

    /**
     * Specifies the forbidden HTTP status code.
     */
    static HTTP_STATUS_403: number = 403;

    /**
     * Specifies the page not found HTTP status code.
     */
    static HTTP_STATUS_404: number = 404;

    /**
     * Specifies the internal server error HTTP status code.
     */
    static HTTP_STATUS_500: number = 500;

    /**
     * Specifies the internal server error HTTP status code.
     */
    static HTTP_STATUS_502: number = 502;

    /**
     * Specifies the bad gateway HTTP status code.
     */
    static HTTP_STATUS_503: number = 503;

    /**
     * Specifies the OK HTTP status code.
     */
    static HTTP_STATUS_OK: number = 200;

    /**
     * Specifies the not modified HTTP status code.
     */
    static HTTP_STATUS_NOT_MODIFIED: number = 304;

    /**
     * Checks the HTTP status code successes.
     * @param statusCode The HTTP status code to check.
     * @return <code>true</code> if provided http status code is success code.
     */
    static isInSuccessCodes(statusCode: number): boolean {
        return statusCode === SLTHTTPStatus.HTTP_STATUS_OK;
    }
}