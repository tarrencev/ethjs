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
    }

    send(method, params = []) {
        return this[CLIENT].post('', {
            ...BASE_CONF,
            id: this[REQUEST_INCREMENTER]++,
            method,
            params,
        }).then(res => {
            if (res.data.error) throw res.data.error;
            return res.data;
        });
    }

    get contracts() {
        return new contracts(this);
    }
}
