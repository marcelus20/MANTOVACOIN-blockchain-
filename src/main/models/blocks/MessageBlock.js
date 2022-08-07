
const Block = require("./Block");
const  SHA256  = require('crypto-js/sha256');

module.exports = class MessageBlock extends Block{
    constructor(timestamp, previousBlockHash = '', message = ""){
        super(timestamp, previousBlockHash)
        this.message = message;
        this.hash = this.createHash()
    }

    createHash(){
        return SHA256(this.timestamp + this.previousBlockHash + this.message + this.nonce).toString();
    }
}