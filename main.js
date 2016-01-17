import Eth from './src';

const client = new Eth('http://localhost:8543');
client.send('eth_coinbase').then(res => console.log(res));
client.send('eth_coinbase').then(res => console.log(res));
client.send('eth_coinbase').then(res => console.log(res));
