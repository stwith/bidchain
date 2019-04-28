const { default: Nervos } = require('@nervos/chain');

const config = require('./config');

if (typeof window.nervos !== 'undefined') {
  window.nervos = Nervos(window.nervos.currentProvider);
  window.nervos.currentProvider.setHost('http://121.196.200.225:1337'); // set CITA node IP address and port
} else {
  console.log('No nervos? You should consider trying Neuron!');
  window.nervos = Nervos(config.chain);
}
//var nervos = window.nervos;

const nervos = Nervos(config.chain)
const account = nervos.appchain.accounts.privateKeyToAccount(config.privateKey) // create account by private key from config
//const account =  nervos.eth.accounts.privateKeyToAccount(config.privateKey);

// nervos.appchain.accounts.wallet.add(account); // add account to nervos


module.exports = nervos;
