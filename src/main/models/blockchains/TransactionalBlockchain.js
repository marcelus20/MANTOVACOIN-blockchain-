/**
 * The Blockchain class will be just an array of Blocks, as the blocks have not been yet created,
 * the genesis block will be added automatically as the first block, it will be done by the this.createGenesisBlock method.
 */

const TransactionalBlock = require("../blocks/TransactionalBlock")
const Transaction = require("../Transaction");
const Blockchain = require("./Blockchain");

module.exports = class TransactionalBlockchain extends Blockchain{

    constructor(chain = [], difficulty = 2, pendingTransactions = [], reward = 100){
        super(chain, difficulty)

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
