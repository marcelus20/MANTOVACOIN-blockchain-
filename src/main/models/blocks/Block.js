//importing the library for the hashing function
const  SHA256  = require('crypto-js/sha256');

module.exports = class Block{
    constructor(timestamp = Date.now(), previousBlockHash = '', hash = this.createHash()){
        this.timestamp = timestamp;
        this.previousBlockHash = previousBlockHash;
        this.hash = hash
        this.nonce = 0; // the only value allowed to change in order to mine the block;
    }


    /**
     * The hashing function utilised is the SHA256 imported from the crypto-js modules.
     */
    createHash (){
        return SHA256(this.timestamp + this.previousBlockHash + this.nonce).toString();
    }


    /**
     * Mining block method
     * PROOF OF WORK
     * @param difficulty
     */
    mine(difficulty = 0){

        while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.createHash();
        }
    }
}