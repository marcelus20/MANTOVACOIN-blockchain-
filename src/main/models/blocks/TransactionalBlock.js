const Transaction = require("../Transaction");
const Block = require("./Block");
const  SHA256  = require('crypto-js/sha256');

module.exports = class TransactionalBlock extends Block{
    constructor(timestamp = Date.now(), previousBlockHash = '', hash = '', nonce = 0, transactions = []){
        super(timestamp, previousBlockHash, hash, nonce)
        this.transactions = transactions;
    }


    withHash (hash = SHA256(TransactionalBlock.name + this.timestamp + this.previousBlockHash + JSON.stringify(this.transactions) + this.nonce).toString()){
        return new TransactionalBlock(
            this.timestamp,
            this.previousBlockHash,
            hash,
            this.nonce,
            this.transactions);
    }

    withTimestamp (timestamp = Date.now()){
        return new TransactionalBlock(
            timestamp,
            this.previousBlockHash,
            this.hash,
            this.nonce,
            this.transactions);
    }

    withPreviousBlockHash (previousBlockHash = ''){
        return new TransactionalBlock(
            this.timestamp,
            previousBlockHash,
            this.hash,
            this.nonce,
            this.transactions);
    }

    withNonce (nonce = 0){
        return new TransactionalBlock(
            this.timestamp,
            this.previousBlockHash,
            this.hash,
            nonce,
            this.transactions);
    }

    withTransactions (transactions = []){
        return new TransactionalBlock(
            this.timestamp,
            this.previousBlockHash,
            this.hash,
            this.nonce,
            transactions);
    }

    /**
     * Mining block method
     * PROOF OF WORK
     * @param difficulty
     */
    async mine(difficulty = 0){
        let blockToReturn = new TransactionalBlock(this.timestamp, this.previousBlockHash, this.hash, this.nonce, this.transactions)
        while(blockToReturn.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){
            blockToReturn = blockToReturn
                .withNonce(blockToReturn.nonce +1)
                .withHash()
        }
        return blockToReturn;
    }
}