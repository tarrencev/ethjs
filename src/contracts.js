import { create } from 'axios';
import { Observable } from '@reactivex/rxjs';

import Contract from './contract';
import { pollForTransactionReceipt, sendTransaction } from './transactions';

const ETH_CLIENT = Symbol();

export default class Contracts {
    constructor(ethClient) {
        this[ETH_CLIENT] = ethClient;
    }

    at(abi, contractAddress) {
        return new Contract(this[ETH_CLIENT], abi, contractAddress);
    }

    create(abi, params) {
        return Observable.create(observer => {
            const ethClient = this[ETH_CLIENT];
            sendTransaction(ethClient, params)
                .then(
                    res => {
                        const txHash = res.result;
                        observer.next({
                            txHash,
                        });
                        pollForTransactionReceipt(ethClient, txHash)
                            .then(
                                res => {
                                    const { contractAddress } = res;
                                    const contract = new Contract(ethClient, abi, contractAddress);
                                    observer.next(contract);
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
