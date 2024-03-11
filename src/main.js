const { Blockchain, Transaction } = require("./blockchain"); 
const EC = require("elliptic").ec;
const ec = new EC('secp256k1')

// private key
const myKey = ec.keyFromPrivate('8be6ff150d406df439a6b0aab3da15b2303428358edee255ceb01adda9e3b9b9');

// public key
const myWalletAddress = myKey.getPublic('hex'); 


let ycoin = new Blockchain();

// making a transaction
// no second person in blockchain as of now, so take dummy toAddress
const tx1 = new Transaction(myWalletAddress, "receiver", 19);

// sender signs transaction with his private key
tx1.signTransaction(myKey);

// add transaction to pending transactions
ycoin.addTransaction(tx1);

// initiating mining process
console.log("Starting the miner...");
console.log();
ycoin.minePendingTransactions(myWalletAddress);

// check balance after transaction
console.log("Balance of " + myWalletAddress.slice(0,5), ycoin.checkBalance(myWalletAddress));
console.log("Balance of receiever", ycoin.checkBalance("receiver"));
console.log();


// check balance for mining reward
ycoin.minePendingTransactions(myWalletAddress);
console.log("Balance of " + myWalletAddress.slice(0,5) + " after receiving mining reward", ycoin.checkBalance(myWalletAddress));
console.log();


// check if chain is valid
console.log("Is the chain valid?", ycoin.isChainValid());











