import { create } from 'axios';

const CLIENT = Symbol();
const BASE_CONF = Symbol();

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
    }

    send(method, params) {
        return this[CLIENT].post('', {
            ...this[BASE_CONF],
            ...params,
            method,
        });
    }
}
