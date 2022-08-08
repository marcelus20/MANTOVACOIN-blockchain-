
const Block = require("./Block");
const  SHA256  = require('crypto-js/sha256');

module.exports = class MessageBlock extends Block{
    constructor(timestamp = Date.now(), previousBlockHash = '', hash = '', nonce = 0, message = ""){
        super(timestamp, previousBlockHash, hash, nonce)
        this.message = message;
    }


    withHash (hash = SHA256(MessageBlock.name + this.timestamp + this.previousBlockHash + this.nonce +  this.message).toString()){
        return new MessageBlock(
            this.timestamp,
            this.previousBlockHash,
            hash,
            this.nonce,
            this.message
        );
    }

    withTimestamp (timestamp = Date.now()){
        return new MessageBlock(
            timestamp,
            this.previousBlockHash,
            this.hash,
            this.nonce,
            this.message);
    }

    withPreviousBlockHash (previousBlockHash = ''){
        return new MessageBlock(
            this.timestamp,
            previousBlockHash,
            this.hash,
            this.nonce,
            this.message);
    }

    withNonce (nonce = 0){
        return new MessageBlock(
            this.timestamp,
            this.previousBlockHash,
            this.hash,
            nonce,
            this.message);
    }

    withMessage(message = ''){
        return new MessageBlock(
            this.timestamp,
            this.previousBlockHash,
            this.hash,
            this.nonce,
            message);
        
    }

    /**
     * Mining block method
     * PROOF OF WORK
     * @param difficulty
     */
    async mine(difficulty = 0){
        let blockToReturn = new MessageBlock(this.timestamp, this.previousBlockHash, this.hash, this.nonce, this.message)
        while(blockToReturn.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){
            
            blockToReturn = blockToReturn
                .withNonce(blockToReturn.nonce +1)
                .withHash()
        }
        return blockToReturn;
    }
}