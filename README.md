# JavaScript Blockchain with Proof-of-Work (PoW)

This is a basic blockchain implementation in JavaScript that includes Proof-of-Work (PoW) for mining, digital signatures for transactions, and a simple balance-checking system. It demonstrates fundamental blockchain concepts such as cryptographic hashing, transaction validation, and chain integrity verification.

---

## How It Works

### Proof-of-Work (PoW)
This blockchain uses a basic **Proof-of-Work** mechanism to secure the network. PoW is a computational puzzle that miners must solve to add a new block to the chain. It helps prevent spam transactions and ensures that modifying past blocks is computationally expensive.

#### How PoW Works in This Blockchain
1. Each block has a **nonce** value that is adjusted until the hash of the block starts with a certain number of leading zeros.
2. The difficulty level determines how many leading zeros are required, making mining more or less time-consuming.
3. Miners must repeatedly change the nonce and recalculate the hash until they find a valid one.

#### Code Implementation
```js
mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
        this.nonce++;
        this.hash = this.calculateHash();
    }
    console.log('Block mined: ' + this.hash);
}
```
- The **nonce** changes in each iteration until a valid hash is found.
- A higher difficulty means more leading zeros are required, increasing mining time.
- Once a valid hash is found, the block is added to the blockchain.

---

## Features
- **Proof-of-Work mining** to secure transactions.
- **Signed transactions** using elliptic curve cryptography.
- **Balance checking** based on transaction history.
- **Blockchain validation** to detect tampering.

---

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/blockchain-js.git
   ```

2. Install dependencies:
   ```sh
   npm install crypto-js elliptic
   ```

---

## Usage

### 1. Generate a Wallet (Public & Private Key)
Each user needs a wallet, which consists of a **public key** (wallet address) and a **private key** (used to sign transactions).

```js
const EC = require("elliptic").ec;
const ec = new EC('secp256k1');

const key = ec.genKeyPair();
console.log("Public Key:", key.getPublic('hex'));
console.log("Private Key:", key.getPrivate('hex'));
```

- **Public Key**: Acts as the wallet address.
- **Private Key**: Used to sign transactions (should be kept secret).

---

### 2. Create a Blockchain and Add Transactions

```js
const { Blockchain, Transaction } = require("./blockchain");
const myKey = ec.keyFromPrivate('your_private_key_here');
const myWalletAddress = myKey.getPublic('hex');

let myBlockchain = new Blockchain();

// Create a new transaction
const tx1 = new Transaction(myWalletAddress, "receiver_address", 19);
tx1.signTransaction(myKey);
myBlockchain.addTransaction(tx1);
```
- Transactions must be signed by the sender’s private key.
- Unsigned or invalid transactions will be rejected.

---

### 3. Mine Transactions

Once transactions are added, they must be mined before they are confirmed and recorded on the blockchain.

```js
console.log("Starting mining...");
myBlockchain.minePendingTransactions(myWalletAddress);
console.log("Balance:", myBlockchain.checkBalance(myWalletAddress));
```

- Mining processes the pending transactions and adds a new block.
- Miners receive a **reward** for mining a block.

---

### 4. Validate the Blockchain

To ensure the blockchain hasn't been tampered with, run:

```js
console.log("Is blockchain valid?", myBlockchain.isChainValid());
```

- The function verifies:
  - Each block’s hash is correct.
  - Transactions are properly signed.
  - Blocks are correctly linked.

---

## Project Structure
```
📂 blockchain-js
│── 📜 blockchain.js   # Blockchain logic
│── 📜 index.js        # Script to run transactions and mining
│── 📜 README.md       # Documentation
```

---

## Limitations and Future Improvements
- Currently, transactions and balances are stored in memory, making it **unsuitable for real-world use**.
- A **peer-to-peer (P2P) network** could be implemented to distribute the blockchain.
- A user interface could be built for easier interaction.

---


## Summary
This project is a simple **proof-of-work blockchain** implemented in JavaScript. It allows users to create wallets, sign transactions, mine new blocks, and validate the chain’s integrity. While it's not ready for production use, it provides a hands-on introduction to blockchain mechanics.
