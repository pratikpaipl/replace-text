import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoadingService {
    loading$: Subject<boolean> = new Subject();

    constructor() {}

    startLoading() {
        this.loading$.next(true);
    }

    stopLoading() {
        this.loading$.next(false);
    }
}