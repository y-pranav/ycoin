const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transaction, previousHash = '') {
        this._timestamp = timestamp;
        this._transaction = transaction;
        this._previousHash = previousHash;
        this._nonce = 0;
        this._hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this._previousHash + this._timestamp + JSON.stringify(this._transaction) + this._nonce).toString();
    }

    mineBlock(difficulty) {
        while (this._hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this._nonce++;
            this._hash = this.calculateHash();
        }
        console.log('Block mined: ' + this._hash);
    }

    set timestamp(newTimestamp) {
        this._timestamp = newTimestamp;
        this.calculateHash();
    }

    get timestamp() {
        return this._timestamp;
    }

    set transaction(newtransaction) {
        this._transaction = newtransaction;
        this.calculateHash();
    }

    get transaction() {
        return this._transaction;
    }

    set previousHash(newPreviousHash) {
        this._previousHash = newPreviousHash;
        this.calculateHash();
    }

    get previousHash() {
        return this._previousHash;
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
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Pending transactions successfully mined!");

        this.chain.push(block);

        // Miner has to be rewarded for mining 
        // So another transaction is added to the pending transaction list
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }


    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    checkBalance(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const transaction of block.transaction) {
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

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}


let ycoin = new Blockchain();

ycoin.createTransaction(new Transaction("address1", "address2", 90));
ycoin.createTransaction(new Transaction("address2", "address1", 180));

console.log("Starting the miner...");

ycoin.minePendingTransactions("yp9");
console.log("Balance of yp9", ycoin.checkBalance("yp9"))

ycoin.minePendingTransactions("yp9");
console.log("Balance of yp9", ycoin.checkBalance("yp9"))

// console.log("Balance of address1", ycoin.checkBalance("address1"))
// console.log("Balance of address2", ycoin.checkBalance("address2"))










