// https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_newfilter
export function newFilter(ethClient, params) {
    return ethClient.send('eth_newFilter', [ params ]);
}

// https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getfilterchanges
export function getFilterChanges(ethClient, quantity) {
    return ethClient.send('eth_getFilterChanges', quantity);
}
