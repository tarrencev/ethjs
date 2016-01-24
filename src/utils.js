import { Observable } from '@reactivex/rxjs';

export function pollWithObservable(func, pollTimeoutMS, ...args) {
    return Observable.create(observer => {
        let pollTimeoutId;
        const pollFunc = () =>
            func(...args).then(
                res => {
                    clearTimeout(pollTimeoutId);
                    observer.next(res);
                    pollTimeoutId  = setTimeout(pollFunc, pollTimeoutMS);
                },
                err => observer.error(err)
            );

        pollFunc();
    });
};

export function pollWithPromise(func, pollTimeoutMS, ...args) {
    return new Promise((resolve, reject) => {
        let pollTimeoutId;
        const pollFunc = () =>
            func(...args).then(
                res => {
                    if (res) {
                        clearTimeout(pollTimeoutId);
                        resolve(res);
                    } else {
                        clearTimeout(pollTimeoutId);
                        pollTimeoutId  = setTimeout(pollFunc, pollTimeoutMS);
                    }
                },
                err => reject(err)
            );

        pollFunc();
    });
};

