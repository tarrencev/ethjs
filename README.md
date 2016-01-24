# ethjs 

**`Still a work in progress`**

A light weight Ethereum RPC interface written in ES6. RPC calls return a promise/stream.

## Installation

`npm install ethjs`

## Usage
### Init
```
import Eth from 'ethjs';

const client = new Eth('<httpProviderUrl>');
```
### RPC methods
[RPC methods](https://github.com/ethereum/wiki/wiki/JSON-RPC) exposed on client and follow function signature of RPC spec
```js
client.getCoinbase()
  .then(address => console.log(address), err => console.error(err));
```

### Contracts
Create contracts and generate an JS contract interface using the ABI.
```js
const contract = client.contracts.create(abi, {
    from: '<fromAddress>',
    data: contractCode,
    gas: 1000000,
}).subscribe(res => console.log(res), err => console.error(err));
```
Contract functions can then be called
```js
contract.aFunctionName(10, 'an argument').subscribe(res => console.log(res), err => console.error(err));
```
Events can be subscribed to
```js
contract.AnEvent().subscribe(res => console.log(res), err => console.error(err));
```
