const Transaction = require("../Transaction");
const Block = require("./Block");
const  SHA256  = require('crypto-js/sha256');

module.exports = class TransactionalBlock extends Block{
    constructor(timestamp, previousBlockHash = '', transactions = []){
        super(timestamp, previousBlockHash)
        this.transactions = transactions;
    }

    createHash(){
        return SHA256(this.timestamp + this.previousBlockHash + JSON.stringify(this.transactions) + this.nonce).toString();
    }
}