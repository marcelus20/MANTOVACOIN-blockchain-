var assert = require('assert');
const MessageBlock = require('../../../main/models/blocks/MessageBlock');

describe("MessageBlock",()=>{

    it("Should be instantiated with an empty string if no message is passed.", ()=>{
        // Given Block
        const emptyString = ""

        // When
        const message = new MessageBlock(Date.now()).message;
        
        // Then
        assert.equal(message, emptyString)
        
    })
    
})

describe("MessageBlock",()=>{
    describe("createHash function", ()=>{
        it("Should generate different hash between 2 blocks that have the same values in its fields except for the message.", ()=>{
            // Given 
            const sameDateForBothBlocks = Date.now()
            const samePreviousHashForBothBlocks = ""
            const block1 = new MessageBlock(sameDateForBothBlocks, samePreviousHashForBothBlocks);
            const block2 = new MessageBlock(sameDateForBothBlocks, samePreviousHashForBothBlocks, "different message here")

            // When
            const hashFromBlock1 = block1.createHash()
            const hashFromBlock2 = block2.createHash()
            
            // Then
            assert.notEqual(hashFromBlock1, hashFromBlock2)
        })
    })
})