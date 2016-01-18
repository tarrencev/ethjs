import ABI from 'ethereumjs-abi';

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

function attachContractFunctionHandler(ethClient, context, name, inputs) {
    // Attach function to context object
    context[name] = (...args) => {
        // Do some arg enforcement
        expectCorrectArgs(args, inputs);
        // Encode ethereum function call transaction
        const encodedTransaction = abiLib.rawEncode(name, buildArgArray(inputs, 'type'), args);
        return ethClient.send('eth_sendTransaction', [{
            from: '0xe0743179eaeb698e5e738ec388b0e44fbda8a492',
            data: encodedTransaction.toString('hex'),
            gas: 1000000,
        }]);
    };
    return context;
}

export default class Contract {
    constructor(ethClient, abi) {
        // https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI
        abi.reduce((context, node) => {
            const { type, inputs, name } = node;

            if (type === 'event') {
                // @TODO: Attach event streams
            } else if (type === 'constructor') {
                /* no-op ? since constructor woulnd't be of any use */
            } else {
                // Spec defines function as default
                attachContractFunctionHandler(ethClient, context, name, inputs);
            }
            return context;
        }, this);
    }
}
