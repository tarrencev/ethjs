
const TRANSACTION_RECEIPT_POLL_MS = 2000;

// https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendtransaction
export function sendTransaction(ethClient, params) {
    return ethClient.send('eth_sendTransaction', [ params ])
}

// https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionreceipt
export function getTransactionReceipt(ethClient, txHash) {
    return ethClient.send('eth_getTransactionReceipt', [ txHash ]);
};

export function pollForTransactionReceipt(ethClient, txHash) {
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
};

