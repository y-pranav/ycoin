const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this._index = index;
        this._timestamp = timestamp;
        this._data = data;
        this._previousHash = previousHash;
        this._nonce = 0;
        this._hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this._index + this._previousHash + this._timestamp + JSON.stringify(this._data) + this._nonce).toString();
    }

    mineBlock(difficulty) {
        while (this._hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this._nonce++;
            this._hash = this.calculateHash();
        }
        console.log('Block mined: ' + this._hash);
    }

    set index(newIndex) {
        this._index = newIndex;
        this.calculateHash();
    }

    get index() {
        return this._index;
    }

    set timestamp(newTimestamp) {
        this._timestamp = newTimestamp;
        this.calculateHash();
    }

    get timestamp() {
        return this._timestamp;
    }

    set data(newData) {
        this._data = newData;
        this.calculateHash();
    }

    get data() {
        return this._data;
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
        this.difficulty = 5;
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

console.log("Mining block 1...");
ycoin.addBlock(new Block(1, '10/07/2017', { amount: 4 }));

console.log("Mining block 2...");
ycoin.addBlock(new Block(2, '12/07/2017', { amount: 10 }));



