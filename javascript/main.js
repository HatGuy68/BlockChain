const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }
}

class Block {
    constructor(timeStamp, transactions, previousHash) {
        this.timeStamp = timeStamp
        this.transactions = transactions
        this.nonce = 0
        this.previousHash = previousHash
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timeStamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log('Block mined:', this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransaction = []
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block("01/01/2021", "Genesis Block", 0);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransaction, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined: ", block);
        this.chain.push(block);

        this.pendingTransaction = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]
    }

    createTransaction(transaction) {
        this.pendingTransaction.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    // addBlock(newBlock) {
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty)
    //     this.chain.push(newBlock);
    // }

    verifyIntegrity() {
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

let heyCoin = new Blockchain();
heyCoin.createTransaction(new Transaction('address1', 'address2', 100));
heyCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('Starting miner....');
heyCoin.minePendingTransactions('rahuls-address');
console.log('Balance of Rahul is', heyCoin.getBalanceOfAddress('rahuls-address'));

console.log('\nStarting miner again....');
heyCoin.minePendingTransactions('rahuls-address');
console.log('Balance of Rahul is', heyCoin.getBalanceOfAddress('rahuls-address'));


/* 
    // let heyCoin = new Blockchain();
    // heyCoin.addBlock(new Block(1, "09/08/2021", { message: "First element in a blockchain" }))
    // heyCoin.addBlock(new Block(2, "11/08/2021", { message: "Second element in a blockchain" }))

    // console.log(JSON.stringify(heyCoin, null, 4));
    // console.log(heyCoin.verifyIntegrity());

    // heyCoin.chain[1].data = { message: "Changed Element in a blockchain." }

    // console.log(JSON.stringify(heyCoin, null, 4));
    // console.log(heyCoin.verifyIntegrity());


    // console.log('Mining Block 1...')
    // heyCoin.addBlock(new Block(1, "09/08/2021", { message: "First element in a blockchain" }))
    // console.log('Mining Block 2...')
    // heyCoin.addBlock(new Block(2, "11/08/2021", { message: "Second element in a blockchain" }))
*/