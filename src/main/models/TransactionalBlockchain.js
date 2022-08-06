/**
 * The Blockchain class will be just an array of Blocks, as not blocks have been created yet,
 * the genesis block will be added manually, it will be done by a method that will be trigered if
 * The array is empty
 */

const TransactionalBlock = require("./blocks/TransactionalBlock")
const Transaction = require("./Transaction")

module.exports = class TransactionalBlockchain{

    constructor(){
        this.chain = [this.createGenesisBlock()];

        /**
         * The time of the proof of work will depend on the difficulty attribute
         * THe higher the difficulty value, the more time it will take to mine the block
         * @type {number}
         */
        this.difficulty = 2;

        //PENDING TRANSACTIONS
        this.pendingTransactions = [];

        //reward for the miner
        this.reward = 100;
    }

     /**
     * creates the very first block
     * @returns {TransactionalBlock}
     */
    createGenesisBlock () {

        return new TransactionalBlock(Date.now(), '', [new Transaction("","",0)]);
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

        if(this.pendingTransactions.length > 0){
            //creating instance of new block
            let block = new TransactionalBlock(Date.now(), '', this.pendingTransactions);
            block.previousBlockHash = this.getLatestBlock().hash;//pointing to the previous block
            block.mine(this.difficulty);

            this.chain.push(block);

            //reseting pending transactions property with the transaction of the reward
            //the first parameter is null cause the system itself is creating cois to transfer to the miner,
            //it is not comming from anywhere else, so there is no start address;
            this.pendingTransactions = [new Transaction(null, winnerMinerAddress, this.reward)];
        }
    }

    /**
     * method will just add the transaction to the array of pending transactions
     * @param transaction
     */
    createTransaction(transaction){
        if(transaction instanceof Transaction)
            if(transaction.startAddress != transaction.destinationAddress)
                this.pendingTransactions.push(transaction);
    }


    /**
     * This method will loop over the whole blockchain and check transactions involving the address parameter
     * and come up with the balance value by checking the value of the transactions of that address.
     * @param address
     */
    checkBalanceOfTheAddress(address){

        return this.chain
            .flatMap(block=>block.transactions)
            .filter((transaction) => transaction.destinationAddress == address)
            .map(filteredTransaction=>filteredTransaction.value)
            .reduce((value, acc)=> value + acc, 0)
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
            if(previousBlock.hash !== currentBlock.previousBlockHash){
                return false;
            }

            // if the block has been tampered, the currentBlock.hash won be the same as creating a new,
            //cause any information modified changed substantially the hash
            if(currentBlock.hash !== currentBlock.createHash()){
                return false;
            }
        }

        //if loop is finished and does not encounter anything wrong, then block is valid
        return true;
    
    
    }

    /**
     * Detects the first occurance of invalid block in the chain. 
     * @returns 
     */
    detectWhichBlockIsInvalid(){
        for(let i = 1; i < this.chain.length; i++){
            const previousBlock = this.chain[i-1];
            const currentBlock = this.chain[i];

            // if the previous block does not point to the actual, then it is not a valid block
            if(previousBlock.hash !== currentBlock.previousBlockHash){
                return i;
            }

            // if the block has been tampered, the currentBlock.hash won be the same as creating a new,
            //cause any information modified changed substantially the hash
            if(currentBlock.hash !== currentBlock.createHash()){
                return i;
            }
        }
        return -1
    }

    /**
     * 
     * Mines the block in the position given. It will only mine if the previous block is valid. 
     */
    mineSpecificBlock(blockPosition = 1){
        const block = this.chain[blockPosition]
        const toMineBlock = new TransactionalBlock(block.timestamp, block.previousBlockHash, block.pendingTransactions);
        toMineBlock.mine(this.difficulty);
        this.chain[blockPosition] = toMineBlock
    }
}
