const SHA256 = require('crypto-js/sha256');
const EC = require("elliptic").ec;
const ec = new EC('secp256k1')


class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    // a digital signature is created using a private key and verified using the corresponding public key
    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') != this.fromAddress) {
            throw new Error('You cannot sign this transaction!');
        }

        // here, signingKey is the object containing pub and priv keys
        const hashTx = this.calculateHash(); // hash of transaction
        const sign = signingKey.sign(hashTx, 'base64')
        this.signature = sign.toDER('hex');
    }

    // sign creation uses *hash of transaction + sender's priv key*
    // sign verification uses *hash of transaction + sender's pub key* and verifies whether: sign created initially === sign generated from hash and public key 
    isValid() {
        // mining reward case, the from address is the system itself
        if (this.fromAddress === null) {
            return true;
        }

        if (!this.signature || this.signature.length === 0) {
            throw new Error("This transaction is not signed!");   
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}


class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log('Block mined: ' + this.hash);
    }

    // checking if a block has any invalid transaction or not
    hasValidTransactions() {
        for (const tx of this.transactions) {
            if (!tx.isValid()) {
                return false;
            } 
        }
        return true;
    }

}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }


    createGenesisBlock() {
        return new Block(0, '01/01/2017', 'Genesis block', '0');
    }


    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }


    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }


    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log("Pending transactions successfully mined!");

        this.chain.push(block);

        // Miner has to be rewarded for mining 
        // So another transaction is added to the pending transaction list
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }


    addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error("Transaction must contain a from and to address.");
        }

        if (!transaction.isValid()) {
            throw new Error("Invalid Transaction! Cannot add to chain.");
        }

        this.pendingTransactions.push(transaction);
    }

    checkBalance(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                if (transaction.fromAddress === address) {
                    balance -= transaction.amount;
                }
                if (transaction.toAddress === address) {
                    balance += transaction.amount;
                }
            }
        }
        return balance;
    }


    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // checking if block has any invalid transaction
            if (!currentBlock.hasValidTransactions()) {
                console.log(1);
                return false;
            }

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log(2);
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log(3);
                console.log(previousBlock)
                console.log(currentBlock)

                return false;
            }
        }
        return true;
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
