
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
        return new MessageBlock()
            .withTimestamp(Date.now())
            .withPreviousBlockHash('')
            .withNonce(0)
            .withMessage("This is the genesis block!")
            .withHash();
    }



    miningPendingMessage(){
        const block = new MessageBlock()
            .withTimestamp(Date.now())
            .withPreviousBlockHash(this.getLatestBlock().hash)
            .withNonce(0)
            .withMessage(this.pendingMessage)
            .withHash();

        
        const minedBlock = block.mine(this.difficulty);
        this.chain.push(minedBlock);

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
        const toMineBlock = new MessageBlock()
            .withTimestamp(block.timestamp)
            .withPreviousBlockHash(blockPosition <= 0? '' : this.chain[blockPosition-1].hash)
            .withNonce(block.nonce)
            .withMessage(block.message)
            .withHash()

        const minedBlock = toMineBlock.mine(this.difficulty)
        this.chain[blockPosition] = minedBlock
    }
}