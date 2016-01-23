import { Observable } from '@reactivex/rxjs';

export function pollWithObservable(func, pollTimeoutMS, ...args) {
    return Observable.create(observer => {
        let pollTimeoutId;
        const pollFunc = () =>
            func(...args).then(
                ({ result }) => {
                    clearTimeout(pollTimeoutId);
                    observer.next(result);
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
                    if (res.result) {
                        clearTimeout(pollTimeoutId);
                        resolve(res.result);
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

