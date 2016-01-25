import ABI from 'ethereumjs-abi';
import { Observable } from '@reactivex/rxjs';

import { pollWithPromise, pollWithObservable } from './utils';

const ETH_CLIENT = Symbol();

const abiLib = new ABI();

function expectType(arg, expectedType) {
    return true;
    switch (expectedType) {
        case 'uint256':
            return arg instanceof number;
    }
}

// @TODO: Implement function signature checking
function expectCorrectArgs(args, inputs) {
    if (args.length !== inputs.length) {
        throw new Error('Incorrect function args');
    }

    inputs.forEach((input, i) => {
        expectType(args[i], input);
    });
}

function buildArgArray(inputs, property) {
    return inputs
        .reduce((arr, input) => {
            arr.push(input[property]);
            return arr;
        }, []);
}

function attachContractEventHandlers(ethClient, context, name, inputs, contractAddress) {
    context[name] = () => {
        return Observable.create(observer => {
            ethClient.newBlockFilter().then(res =>
                pollWithObservable(ethClient.getFilterChanges, 1000, res)
                    .subscribe(res => observer.next(res), err => observer.error(err))
            )
        });
    }
}

function attachContractFunctionHandlers(ethClient, context, name, inputs, contractAddress) {
    // Attach function to context object
    context[name] = (...args) => {
        // Do some arg enforcement
        expectCorrectArgs(args, inputs);
        // Encode ethereum function call transaction
        const encodedTransaction = abiLib.rawEncode(name, buildArgArray(inputs, 'type'), args);
        return Observable.create(observer => {
            ethClient.sendTransaction({
                from: '0xe0743179eaeb698e5e738ec388b0e44fbda8a492',
                data: encodedTransaction.toString('hex'),
                gas: 1000000,
            }).then(
                res => {
                    const txHash = res;
                    observer.next({
                        txHash,
                    });

                    pollWithPromise(ethClient.getTransactionReceipt, 2000, txHash)
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
    };
}

export default class Contract {
    constructor(ethClient, abi, contractAddress) {
        // https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI
        abi.reduce((context, node) => {
            const { type, inputs, name } = node;

            if (type === 'event') {
                attachContractEventHandlers(ethClient, context, name, inputs, contractAddress);
            } else if (type === 'constructor') {
                /* no-op ? since constructor woulnd't be of any use */
            } else {
                // Spec defines function as default
                attachContractFunctionHandlers(ethClient, context, name, inputs, contractAddress);
            }
            return context;
        }, this);

        this.address = contractAddress;
    }
}
