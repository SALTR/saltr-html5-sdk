/**
 * The SLTExperiment class provides the currently running experiment data.
 * It is possible to A/B test any feature included in the game AND/OR different levels, level packs.
 */
class SLTExperiment {

    /**
     * Specifies the Feature type for the experiment.
     */
    public static readonly TYPE_FEATURE: string = "FEATURE";

    /**
     * Specifies the LevelPack type for the experiment.
     */
    public static readonly TYPE_LEVEL_PACK: string = "LEVEL_PACK";

    private readonly _partition: string;
    private readonly _token: string;
    private readonly _type: string;
    private readonly _customEvents: any[];

    /**
     * Class constructor.
     * @param token The unique identifier of the experiment.
     * @param partition The letter of the partition in which the user included in (A, B, C, etc.).
     * @param type The type of the experiment (Feature or LevelPack).
     * @param customEvents The array of comma separated event names for which A/B test data should be send.
     */
    public constructor(token: string, partition: string, type: string, customEvents: any[]) {
        this._token = token;
        this._partition = partition;
        this._type = type;
        this._customEvents = customEvents;
    }

    /**
     * The letter of the partition in which the user included in (A, B, C, etc.).
     */
    public get partition(): string {
        return this._partition || '';
    }

    /**
     * The unique identifier of the experiment.
     */
    public get token(): string {
        return this._token || '';
    }

    /**
     * The type of the experiment (Feature or LevelPack).
     */
    public get type(): string {
        return this._type || '';
    }

    /**
     * The array of comma separated event names for which A/B test data should be send.
     */
    public get customEvents(): any[] {
        return this._customEvents;
    }

}

export {SLTExperiment}