import { create } from 'axios';

const ETH_CLIENT = Symbol();

export default class Contracts {
    constructor(ethClient) {
        this[ETH_CLIENT] = ethClient;
    }

    create(params) {
        return this[ETH_CLIENT]
            .send('eth_sendTransaction', [ params ])
            .then(res => res.data);
    }
}
