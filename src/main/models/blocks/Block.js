//importing the library for the hashing function
const  SHA256  = require('crypto-js/sha256');

module.exports = class Block{
    constructor(timestamp = Date.now(), previousBlockHash = '', hash = '', nonce = 0){
        this.timestamp = timestamp;
        this.previousBlockHash = previousBlockHash;
        this.hash = hash
        this.nonce = nonce; // the only value allowed to change in order to mine the block;
    }

    withHash (hash = SHA256(Block.name + this.timestamp + this.previousBlockHash + this.nonce).toString()){
        return new Block(
            this.timestamp,
            this.previousBlockHash,
            hash,
            this.nonce);
    }

    withTimestamp (timestamp = Date.now()){
        return new Block(
            timestamp,
            this.previousBlockHash,
            this.hash,
            this.nonce);
    }

    withPreviousBlockHash (previousBlockHash = ''){
        return new Block(
            this.timestamp,
            previousBlockHash,
            this.hash,
            this.nonce);
    }

    withNonce (nonce = 0){
        return new Block(
            this.timestamp,
            this.previousBlockHash,
            this.hash,
            nonce);
    }

    /**
     * Mining block method
     * PROOF OF WORK
     * @param difficulty
     */
    mine(difficulty = 0){
        let blockToReturn = new Block(this.timestamp, this.previousBlockHash, this.hash, this.nonce)
        while(blockToReturn.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){
            blockToReturn = blockToReturn
                .withNonce(blockToReturn.nonce +1)
                .withHash()
        }
        return blockToReturn;
    }
}