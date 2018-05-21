/**
 * Project: MANTOVACOIN
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

    }


    /**
     * The hashing function utilised is the SHA256 imported from the crypto-js modules.
     */
    createHash = () =>{

        /**
         * The return is the hashing of every attribute together.
         * in order to get the string vertion of the JSON stringfy, it will be called toSitring, cause
         * I want the SHA256 to hash a string, not a object.
         */
        return SHA256(this.index + this.timestamp + this.pHash + JSON.stringify(data).toString());
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
    }


    /**
     * creates the very first block
     * @returns {Block}
     */
    createGenesisBlock = () => {
        return new Block(0, "21/5/2018", "The very fisrt block", "0");
    }


    /**
     * getter for the latest block of the chain attribute
     * @returns The last block itself
     */
    getLatestBlock = () => {
        return this.chain[this.chain.length-1];
    }


    /**
     * Adding neww block to the chain.
     * @param newBlock
     */
    addBlock = (newBlock) => {
        /**
         * For that, it will firstly retrieve the hash of the latest block
         */
        newBlock.pHash = this.getLatestBlock().hash;


        //updating the hash
        newBlock.hash = newBlock.createHash();

        //finally adding to the chain:
        this.chain.push(newBlock);
    }

}

