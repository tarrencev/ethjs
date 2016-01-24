import { create } from 'axios';
import contracts from './contracts';

const BASE_CONF = {
    jsonrpc: '2.0',
};

const CLIENT = Symbol();
const REQUEST_INCREMENTER = Symbol();

export default class Eth {
    constructor(providerUrl) {
        this[CLIENT] = create({
            baseURL: providerUrl,
            timeout: 1000,
            headers: { 'Content-Type': 'application/json' },
        });

        this[REQUEST_INCREMENTER] = 0;

        this.getAccounts = this.getAccounts.bind(this);
        this.getCoinbase = this.getCoinbase.bind(this);
        this.newFilter = this.newFilter.bind(this);
        this.getFilterChanges = this.getFilterChanges.bind(this);
        this.sendTransaction = this.sendTransaction.bind(this);
        this.getTransactionReceipt = this.getTransactionReceipt.bind(this);
    }

    send(method, params = []) {
        return this[CLIENT].post('', {
            ...BASE_CONF,
            id: this[REQUEST_INCREMENTER]++,
            method,
            params,
        }).then(res => {
            if (res.data.error) throw res.data.error;
            return res.data.result;
        });
    }

    get contracts() {
        return new contracts(this);
    }

    // https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_accounts
    getAccounts() {
        return this.send('eth_accounts');
    }

    // https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getbalance
    getBalance(address, blockParam) {
        return this.send('eth_getBalance', [ address, blockParam ]);
    }

    // https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_coinbase
    getCoinbase() {
        return this.send('eth_coinbase');
    }

    // https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_newfilter
    newFilter(params) {
        return this.send('eth_newFilter', [ params ]);
    }

    // https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getfilterchanges
    getFilterChanges(filterId) {
        return this.send('eth_getFilterChanges', [ filterId ]);
    }

    // https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendtransaction
    sendTransaction(params) {
        return this.send('eth_sendTransaction', [ params ])
    }

    // https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionreceipt
    getTransactionReceipt(txHash) {
        return this.send('eth_getTransactionReceipt', [ txHash ]);
    };

}
