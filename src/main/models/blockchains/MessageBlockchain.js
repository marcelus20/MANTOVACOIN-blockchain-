
const MessageBlock = require("../blocks/MessageBlock")
const Blockchain = require("./Blockchain")

module.exports = class MessageBlockchain extends Blockchain{
    
    constructor(chain = [], difficulty = 2, pendingMessage = ""){
        super(chain, difficulty)

        //PENDING TRANSACTIONS
        this.pendingMessage = pendingMessage

        // pushing the genesis block to this.chain
        this.chain.push(this.createGenesisBlock())
    }

    /**
     * creates the very first block
     * @returns {MessageBlock}
     */
    createGenesisBlock () {
        return new MessageBlock(Date.now(), '', "This is the genesis block!");
    }



    miningPendingMessage(){
        let block = new MessageBlock(Date.now(), '', this.pendingMessage);
        block.previousBlockHash = this.getLatestBlock().hash;//pointing to the previous block
        block.mine(this.difficulty);

        this.chain.push(block);

        this.pendingMessage = "";        
    }

    /**
     * method will just add a message to the pendingMessageField
     * @param transaction
     */
    createMessage(message){
        this.pendingMessage = message;
    }

    /**
     * 
     * Mines the block in the position given. It will only mine if the previous block is valid. 
     */
    mineSpecificBlock(blockPosition = 1){
        const block = this.chain[blockPosition < 0 ? 0 : blockPosition]
        const toMineBlock = new MessageBlock(
            block.timestamp,
            blockPosition <= 0? '' : this.chain[blockPosition-1].hash,
            block.message
        );
        toMineBlock.mine(this.difficulty);
        this.chain[blockPosition] = toMineBlock
    }
}