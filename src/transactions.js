
const TRANSACTION_RECEIPT_POLL_MS = 2000;

export function sendTransaction(ethClient, params) {
    return ethClient.send('eth_sendTransaction', [ params ])
}

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

