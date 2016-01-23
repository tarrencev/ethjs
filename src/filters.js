import { Observable } from '@reactivex/rxjs';

const FILTER_CHANGES_POLL_MS = 1000;

// https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_newfilter
export function newFilter(ethClient, params) {
    return ethClient.send('eth_newFilter', [ params ]);
}

// https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getfilterchanges
export function getFilterChanges(ethClient, filterId) {
    return ethClient.send('eth_getFilterChanges', [ filterId ]);
}

export function pollForFilterChanges(ethClient, filterId) {
    return Observable.create(observer => {
        let pollTimeoutId;
        const pollFunc = () =>
            getFilterChanges(ethClient, filterId)
                    .then(
                        ({ result }) => {
                            clearTimeout(pollTimeoutId);
                            observer.next(result);
                            pollTimeoutId  = setTimeout(pollFunc, FILTER_CHANGES_POLL_MS);
                        },
                        err => observer.error(err)
                    );

        pollFunc();
    });
};
