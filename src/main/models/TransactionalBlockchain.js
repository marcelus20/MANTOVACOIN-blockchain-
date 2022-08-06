/**
 * The Blockchain class will be just an array of Blocks, as the blocks have not been yet created,
 * the genesis block will be added automatically as the first block, it will be done by the this.createGenesisBlock method.
 */

const TransactionalBlock = require("./blocks/TransactionalBlock")
const Transaction = require("./Transaction")

module.exports = class TransactionalBlockchain{

    constructor(chain = [], difficulty = 2, pendingTransactions = [], reward = 100){
        this.chain = chain

        /**
         * The time of the proof of work will depend on the difficulty attribute
         * THe higher the difficulty value, the more time it will take to mine the block
         * @type {number}
         */
        this.difficulty = difficulty;

        //PENDING TRANSACTIONS
        this.pendingTransactions = pendingTransactions

        //reward for the miner
        this.reward = reward

        // pushing the genesis block to this.chain
        this.chain.push(this.createGenesisBlock())
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
            if(transaction.senderAddress != transaction.receiverAddress)
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
            .filter((transaction) => transaction.receiverAddress == address)
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
         * loop over until the end of the chain
         */
        return this.chain.map((block, i)=>{
            // if block is the genesis block
            if(i == 0){

                return block.hash === block.createHash()
            }else{
                const previousBlock = this.chain[i-1]
                const currentBlock = block

                // if the previous block does not point to the actual, or createHash and current block hash don't match
                if(previousBlock.hash !== currentBlock.previousBlockHash || currentBlock.hash !== currentBlock.createHash()){
                    return false;
                }
                return true;
            }
            
        }).reduce((acc, valid)=>acc && valid, true)
    }

    /**
     * Detects the first occurance of invalid block in the chain. 
     * @returns 
     */
    detectWhichBlockIsInvalid(){
        for(let i = 0; i < this.chain.length; i++){
            if(i == 0)
                return this.chain[i].hash === this.chain[i].createHash()
            const previousBlock = this.chain[i-1];
            const currentBlock = this.chain[i];

            // if the previous block does not point to the actual, or if current hash and current create hash don't match.
            if(previousBlock.hash !== currentBlock.previousBlockHash || currentBlock.hash !== currentBlock.createHash()){
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
        const block = this.chain[blockPosition < 0 ? 0 : blockPosition]
        const toMineBlock = new TransactionalBlock(
            block.timestamp,
            blockPosition <= 0? '' : this.chain[blockPosition-1].hash,
            block.transactions
        );
        toMineBlock.mine(this.difficulty);
        this.chain[blockPosition] = toMineBlock
    }
}
