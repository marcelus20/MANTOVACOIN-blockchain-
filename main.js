/**
 * Project: MANTOVACOIN - Blockchain-
 * Author: Felipe Mantovani
 * Date: 21/5/2018
 */


/**
The Block class will have the following attributes: an Index, timestamp, data and pHash.

 The index just represents the id of that block. When more blocks are created, the ID will increment.
 The timestamp is the date when the block is created and validated.
 data is the data itself, it could be a transaction, or a contract, I still do not know what this block chain
 will be about.
 the pHash stands for Previous Hash. As this is a block chain, the hash of the current block is related to the previous
  hash, so the hash of the previous block should be passed as parameter
 */




//importing the library for the hashing function
const SHA256 = require('crypto-js/sha256');



class Block{
    constructor(index, timestamp, data, pHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.pHash = pHash;
        this.hash = this.createHash();
        this.nonce = 0; // the only value allowed to change in order to mine the block;

    }


    /**
     * The hashing function utilised is the SHA256 imported from the crypto-js modules.
     */
    createHash (){

        /**
         * The return is the hashing of every attribute together.
         * in order to get the string vertion of the JSON stringfy, it will be called toSitring, cause
         * I want the SHA256 to hash a string, not a object.
         */
        return SHA256(this.index + this.timestamp + this.pHash + JSON.stringify(this.data) + this.nonce).toString();
    }

    /**
     * Mining block method
     * PROOF OF WORK
     * @param difficulty
     */
    mineBlock(difficulty){

        while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.createHash();

        }
    }
}


/**
 * The Blockchain class will be just an array of Blocks, as not blocks have been created yet,
 * the genesis block will be added manually, it will be done by a method that will be trigered if
 * The array is empty
 */

class Blockchain{

    constructor(){
        this.chain = [this.createGenesisBlock()];

        /**
         * The time of the proof of work will depend on the difficulty attribute
         * THe higher the difficulty value, the more time it will take to mine the block
         * @type {number}
         */
        this.difficulty = 5;
    }


    /**
     * creates the very first block
     * @returns {Block}
     */
    createGenesisBlock () {
        return new Block(0, "21/5/2018", "The very fisrt block", "0");
    }


    /**
     * getter for the latest block of the chain attribute
     * @returns The last block itself
     */
    getLatestBlock () {
        return this.chain[this.chain.length-1];
    }


    /**
     * Adding neww block to the chain.
     * @param newBlock
     */
    addBlock (newBlock){
        /**
         * For that, it will firstly retrieve the hash of the latest block
         */
        newBlock.pHash = this.getLatestBlock().hash;


        //updating the hash
        newBlock.mineBlock(this.difficulty);

        //finally adding to the chain:
        this.chain.push(newBlock);

        console.log("Block Mined! hash:" + newBlock.hash);
    }


    /**
     * Checking integrity of the block
     * If hash of any block is diferent from the previous hash of the next block, then
     * the block has been tampered
     */
    isValid(){


        /**
         * loop over until the end of the chain, begining from the second block
         */
        for(let i = 1; i < this.chain.length; i++){
            const previousBlock = this.chain[i-1];
            const currentBlock = this.chain[i];

            // if the previous block does not point to the actual, then it is not a valid block
            if(previousBlock.hash !== currentBlock.pHash){
                return false;
            }

            // if the block has been tampered, the currentBlock.hash won be the same as createing a ew,
            //cause any information modified changed substantially the hash
            if(currentBlock.hash !== currentBlock.createHash()){
                return false;
            }
        }


        //if loop is finished and does not encounter anything wrong, then block is valid
        return true;


    }

}



//TESTING THE BLOCKCHAIN
const mantovacoin = new Blockchain(); // instance

// adding blocks into it;

//proof of work test: CHANGE THE DIFFICULTY IN ORDER TO SEE THE DIFFERENCE IN TIME.


console.log("Mining block");
mantovacoin.addBlock(new Block(1, "28/1/2015", { transfered: 4}));
console.log("Mining block");
mantovacoin.addBlock(new Block(2, "28/1/2015", { transfered: 15}));
console.log("Mining block");
mantovacoin.addBlock(new Block(3, "28/1/2015", { transfered: 50}));
console.log("Mining block");
mantovacoin.addBlock(new Block(4, "28/1/2015", { transfered: 7}));







