import {TimerEvent} from "./TimerEvent";

export class Timer {

    private readonly _notifications: any;
    private _delay: number;
    private _running: boolean;
    private _timer: number;
    private _currentCount: number;
    private readonly _repeatCount: number;

    constructor(delay: number, repeatCount: number = 0) {
        this._delay = delay || 1000;
        this._running = false;
        this._timer = null;
        this._repeatCount = repeatCount;
        this._currentCount = 0;
        this._notifications = {};
    }

    public start(): void {
        if (!this._running) {
            this._running = true;
            this.tick();
        }
    }

    public stop(): void {
        if (this._running) {
            this._running = false;
            clearTimeout(this._timer);
            this._timer = null;
            this.dispatchEvent(TimerEvent.TIMER_COMPLETE);
        }
    }

    public reset(): void {
        this.stop();
        this._currentCount = 0;
    }

    private tick(): void {
        if (this._running) {
            this._currentCount++;

            this.dispatchEvent(TimerEvent.TIMER);

            if (this._currentCount == this._repeatCount) {
                this.stop();
            }
            else {
                clearTimeout(this._timer);
                this._timer = setTimeout(this.tick.bind(this), this._delay);
            }
        }
    }

    public addEventListener(event: string, callback: (...args: any[]) => void, thisArg: any = null): void {
        let listeners: any[] = this._notifications[event] || [];

        listeners.push({
            callback: callback,
            thisArg: thisArg
        });

        this._notifications[event] = listeners;
    }

    public removeEventListener(event: string, callback: (...args: any[]) => void, thisArg: any = null): void {
        let listeners: any[] = this._notifications[event];

        if (listeners) {
            let index: number = -1;
            listeners.forEach((notification: any, i: number) => {
                if (notification.callback == callback && notification.thisArg == thisArg) {
                    index = i;
                }
            });

            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
    }

    private dispatchEvent(event: string): void {
        this._notifications[event] && this._notifications[event].forEach((notification: any) => {
            notification.callback.call(notification.thisArg);
        });
    }


    public get running(): boolean {
        return this._running || false;
    }


    public get currentCount(): number {
        return this._currentCount || 0;
    }


    public get delay(): number {
        return this._delay || 0;
    }

    public set delay(value: number) {
        this._delay = value;
    }
}
