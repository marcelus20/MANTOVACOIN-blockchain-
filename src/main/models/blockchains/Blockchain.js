module.exports = class Blockchain{


    constructor(chain = [], difficulty = 2){
        this.chain = chain
        this.difficulty = difficulty
    }

    /**
     * getter for the latest block of the chain attribute
     * @returns The last block itself
     */
    getLatestBlock () {
        return this.chain[this.chain.length-1];
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

                return block.hash === block.withHash().hash
            }else{
                const previousBlock = this.chain[i-1]
                const currentBlock = block

                // if the previous block does not point to the actual, or createHash and current block hash don't match
                if(previousBlock.hash !== currentBlock.previousBlockHash || currentBlock.hash !== currentBlock.withHash().hash){
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
            if(i == 0){
                if (this.chain[i].hash !== this.chain[i].withHash().hash){
                    return 0
                }
            }else{
                const previousBlock = this.chain[i-1];
                const currentBlock = this.chain[i];

    
                // if the previous block does not point to the actual, or if current hash and current create hash don't match.
                if(previousBlock.hash !== currentBlock.previousBlockHash || currentBlock.hash !== currentBlock.withHash().hash){
                    return i;
                }
            }  
        }
        return -1
    }
}