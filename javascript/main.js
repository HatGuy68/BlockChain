const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timeStamp, data, previousHash) {
        this.index = index
        this.timeStamp = timeStamp
        this.data = data
        this.previousHash = previousHash
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timeStamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2021", "Genesis Block", 0);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}

let heyCoin = new Blockchain();
heyCoin.addBlock(new Block(1, "09/08/2021", { message: "First element in a blockchain" }))
heyCoin.addBlock(new Block(2, "11/08/2021", { message: "Second element in a blockchain" }))

console.log(JSON.stringify(heyCoin, null, 4));