class SLTBasicProperties {
    private _age: string;
    private _gender: string;         //Gender "F", "M", "female", "male"

    private _appVersion: string;     // Version of the client app, e.g. 4.1.1

    private _systemName: string;     //The name of the OS the current device is running. E.g. iPhone OS.
    private _systemVersion: string;  //The version number of the OS the current device is running. E.g. 6.0.

    private _browserName: string;    //The name of the browser the current device is running. E.g. Chrome.
    private _browserVersion: string; //The version number of the browser the current device is running. E.g. 17.0.

    private _deviceName: string;     //A human-readable name representing the device.
    private _deviceType: string;     //The Type name of the device. E.g. iPad.

    private _locale: string;         //The current locale the user is in. E.g. en_US.

    private _country: string;        //The country the user is in, specified by ISO 2-letter code. E.g. US for United States.
    //Set to (locate) to detect the country based on the IP address of the caller.

    private _region: string;         //The region (state) the user is in. E.g. ca for California.
    //Set to (locate) to detect the region based on the IP address of the caller.

    private _city: string;           //The city the user is in. E.g. San Francisco.
    //Set to (locate) to detect the city based on the IP address of the caller.

    private _location: string;       //The location (latitude/longitude) of the user. E.g. 37.775,-122.4183.
    //Set to (locate) to detect the location based on the IP address of the caller.

    private _paying: boolean;        //The flag indicating is the user paying or not.
    
    constructor(appVersion:string, locale:string) {
        this._appVersion = appVersion;
        this._locale = locale;
        this._country = "locate";
        this._region = "locate";
        this._city = "locate";
        this._location = "locate";
    }


    get age(): string {
        return this._age;
    }

    set age(value: string) {
        this._age = value;
    }

    get gender(): string {
        return this._gender;
    }

    set gender(value: string) {
        this._gender = value;
    }

    get appVersion(): string {
        return this._appVersion;
    }

    set appVersion(value: string) {
        this._appVersion = value;
    }

    get systemName(): string {
        return this._systemName;
    }

    set systemName(value: string) {
        this._systemName = value;
    }

    get systemVersion(): string {
        return this._systemVersion;
    }

    set systemVersion(value: string) {
        this._systemVersion = value;
    }

    get browserName(): string {
        return this._browserName;
    }

    set browserName(value: string) {
        this._browserName = value;
    }

    get browserVersion(): string {
        return this._browserVersion;
    }

    set browserVersion(value: string) {
        this._browserVersion = value;
    }

    get deviceName(): string {
        return this._deviceName;
    }

    set deviceName(value: string) {
        this._deviceName = value;
    }

    get deviceType(): string {
        return this._deviceType;
    }

    set deviceType(value: string) {
        this._deviceType = value;
    }

    get locale(): string {
        return this._locale;
    }

    set locale(value: string) {
        this._locale = value;
    }

    get country(): string {
        return this._country;
    }

    set country(value: string) {
        this._country = value;
    }

    get region(): string {
        return this._region;
    }

    set region(value: string) {
        this._region = value;
    }

    get city(): string {
        return this._city;
    }

    set city(value: string) {
        this._city = value;
    }

    get location(): string {
        return this._location;
    }

    set location(value: string) {
        this._location = value;
    }

    get paying(): boolean {
        return this._paying;
    }

    set paying(value: boolean) {
        this._paying = value;
    }
}

export {SLTBasicProperties};