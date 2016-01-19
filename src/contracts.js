import { create } from 'axios';
import { Observable } from '@reactivex/rxjs';

import Contract from './contract';

const TRANSACTION_RECEIPT_POLL_MS = 2000;

const ETH_CLIENT = Symbol();

function getTransactionReceipt(ethClient, txHash) {
    return ethClient.send('eth_getTransactionReceipt', [ txHash ]);
}

function pollForTransactionReceipt(ethClient, txHash) {
    return new Promise((resolve, reject) => {
        let pollTimeoutId;
        const pollFunc = () =>
            getTransactionReceipt(ethClient, txHash)
                    .then(
                        res => {
                            if (res.result) {
                                clearTimeout(pollTimeoutId);
                                resolve(res.result);
                            } else {
                                clearTimeout(pollTimeoutId);
                                pollTimeoutId  = setTimeout(pollFunc, TRANSACTION_RECEIPT_POLL_MS);
                            }
                        },
                        err => reject(err)
                    );

        pollFunc();
    });
}

export default class Contracts {
    constructor(ethClient) {
        this[ETH_CLIENT] = ethClient;
    }

    create(abi, params) {
        // return new Contract(this[ETH_CLIENT], abi);
        return Observable.create(observer => {
            const ethClient = this[ETH_CLIENT];
            ethClient
                .send('eth_sendTransaction', [ params ])
                .then(
                    res => {
                        const txHash = res.result;
                        observer.next({
                            txHash,
                        });
                        pollForTransactionReceipt(ethClient, txHash)
                            .then(
                                res => {
                                    observer.next(res);
                                    observer.complete();
                                },
                                err => observer.error(err)
                            );
                    },
                    err => observer.error(err)
                );
        });
    }
}
