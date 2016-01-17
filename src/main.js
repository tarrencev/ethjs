import { create } from 'axios';

const BASE_CONF = Symbol();
const CLIENT = Symbol();
const REQUEST_INCREMENTER = Symbol();

export default class Eth {
    constructor(providerUrl) {
        this[BASE_CONF] = {
            jsonrpc: '2.0',
        };

        this[CLIENT] = create({
            baseURL: providerUrl,
            timeout: 1000,
            headers: { 'Content-Type': 'application/json' },
        });

        this[REQUEST_INCREMENTER] = 0;
    }

    send(method, params) {
        return this[CLIENT].post('', {
            id: this[REQUEST_INCREMENTER]++,
            ...this[BASE_CONF],
            ...params,
            method,
        });
    }
}
