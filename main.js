/**
 * Project: MANTOVACOIN - Blockchain-
 * Author: Felipe Mantovani
 * Date: 21/5/2018
 */


/**
The Block class will have the following attributes: an Index, timestamp, data and pHash.

 The timestamp is the date when the block is created and validated.
 transactions will store the transaction between to public address wallets.
 will be about.
 the pHash stands for Previous Hash. As this is a block chain, the hash of the current block is related to the previous
  hash, so the hash of the previous block should be passed as parameter
 */




//importing the library for the hashing function
const SHA256 = require('crypto-js/sha256');


/**
 * The transaction class  will be made of 2 public address, the Start address and Destination address, and the value of
 * the transaction
 *
 */

class Transaction{
   constructor(startAddress, destinationAddress, value){
       this.startAddress = startAddress;
       this.destinationAddress = destinationAddress;
       this.value = value;
   }
}


class Block{
    constructor(timestamp, transactions, pHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
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
        return SHA256(this.timestamp + this.pHash + JSON.stringify(this.transactions) + this.nonce).toString();
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
        this.difficulty = 6;

        //PENDING TRANSACTIONS
        this.pendingTransactions = [];

        //reward for the miner
        this.reward = 100;
    }


    /**
     * creates the very first block
     * @returns {Block}
     */
    createGenesisBlock () {
        return new Block("21/5/2018", new Transaction("","",0));
    }


    /**
     * getter for the latest block of the chain attribute
     * @returns The last block itself
     */
    getLatestBlock () {
        return this.chain[this.chain.length-1];
    }


    /**
     * The parameter bellow indicates where the blockchain should transfer the creation of MANTOVACOINS by a given address
     * @param winnerMinerAddress
     */
    miningPendingTransactions(winnerMinerAddress){

        //creating instance of new block
        let block = new Block(Date.now(), this.pendingTransactions);
        block.pHash = this.getLatestBlock().hash;//pointing to the previous block
        block.mineBlock(this.difficulty);

        console.log("Block mined");
        console.log(block.hash);
        console.log("\n");
        this.chain.push(block);

        //reseting pending transactions property with the transaction of the reward
        //the first parameter is null cause the system itself is creating cois to transfer to the miner,
        //it is not comming from anywhere else, so there is no start address;
        this.pendingTransactions = [new Transaction(null, winnerMinerAddress, this.reward)];
    }

    /**
     * method will just add the transaction to the array of pending transactions
     * @param transaction
     */
    createTransaction(transaction){
        this.pendingTransactions.push(transaction);

    }


    /**
     * This method will loop over the whole blockchain and check transactions involving the address parameter
     * and come up with the balance value by checking the value of the transactions of that address.
     * @param address
     */
    checkBalanceOfTheAddress(address){
        let balance = 0;

        for(const block of this.chain){//iterating all blocks in the blockchain



            for (let i = 0; i < block.transactions.length; i++){//iterating the transactions of each block

                const trans = block.transactions[i];


                if(address === trans.destinationAddress){ // if you receive money, add to the balance
                    balance += trans.value;
                }

                if(address === trans.startAddress){// if you gave money, discount from the balance
                    balance -= trans.value;
                }

            }



        }
        return balance;

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


//DEFINING THE PUBLIC WALLETS
const address1 = "address1";
const address2 = "address2";
const minerAddress = "felipe";


//making some transactions
//address1 transfer 100 to address 2
mantovacoin.createTransaction(new Transaction(address1, address2, 100));
//address 2 transfer 20 to address1
mantovacoin.createTransaction(new Transaction(address2, address1, 2));



//mining the block
console.log("Mining Block...")
mantovacoin.miningPendingTransactions(minerAddress); // reward goes to felipe, the minerAddress

//felipe transfer 50 to address2
mantovacoin.createTransaction(new Transaction(minerAddress, address2, 50));


//mining the second block:
mantovacoin.miningPendingTransactions(minerAddress);


//checking the balance of address2:
console.log("The address2 wallet balance is: "+mantovacoin.checkBalanceOfTheAddress(address2)+" mantovacoins");
//checking the balance of address2:
console.log("The miner Address wallet balance is: "+mantovacoin.checkBalanceOfTheAddress(minerAddress)+" mantovacoins");
//at this point miner address value should be 150 because he has mined 2 blocks so far. it will show though just 50
//cause the value will be updated on the next mining.


//checking integrity of the block, it should be true
console.log("This blockchain has not been tampered: "+mantovacoin.isValid());

/*<-uncomment this to TAMPER with the blockchain
//tampering the blockchain:
//address 2 will change the first transaction of the second block
mantovacoin.chain[1].transactions[0].value = 1000; // wow, it made address2 rich

//checking integrity of the block: it should be false
console.log("This blockchain has not been tampered: "+mantovacoin.isValid());
*///*<-uncomment this to TAMPER with the blockchain

//printing the whole blockchain
console.log(JSON.stringify(mantovacoin.chain, null, 4));










