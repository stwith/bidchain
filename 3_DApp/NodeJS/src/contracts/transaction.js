const nervos = require('../nervos');

const transaction = {
    // from: nervos.appchain.accounts.wallet[0].address,
    // privateKey: nervos.appchain.accounts.wallet[0].privateKey,
    value: '0x0',
    nonce: 999990,
    quota: 1000000,
    chainId: 1,
    version: 0,
    valid_until_block: 999999
};

// console.log(transaction)

module.exports = transaction;