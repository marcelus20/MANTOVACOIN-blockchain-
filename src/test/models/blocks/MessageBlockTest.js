var assert = require('assert');
const Block = require('../../../main/models/blocks/Block');
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
            const sameNonceForBothBlocks = 0
            const block1 = new MessageBlock()
                .withTimestamp(sameDateForBothBlocks)
                .withPreviousBlockHash(samePreviousHashForBothBlocks)
                .withNonce(sameNonceForBothBlocks)
            const block2 = new MessageBlock()
                .withTimestamp(sameDateForBothBlocks)
                .withPreviousBlockHash(samePreviousHashForBothBlocks)
                .withNonce(sameNonceForBothBlocks)
                .withMessage("different message here")

            // When
            const hashFromBlock1 = block1.withHash().hash
            const hashFromBlock2 = block2.withHash().hash
            
            // Then
            assert.notEqual(hashFromBlock1, hashFromBlock2)
        })
    })
})

describe("MessageBlock", ()=>{
    describe("createHash", ()=>{
        it("Should create a different hash from Block.prototype.createHash even when the message contains an empty string and all other fields are the same.", ()=>{
            // Given
            const now = Date.now()
            const prevHash = ''
            const nonce = 0

            const block = new Block()
                .withTimestamp(now)
                .withPreviousBlockHash(prevHash)
                .withNonce(nonce)
                .withHash()

            const messageBlock = new MessageBlock()
                .withTimestamp(now)
                .withPreviousBlockHash(prevHash)
                .withNonce(nonce)
                .withMessage('')
                .withHash()

            // When 
            const blockHash = block.hash
            const messageBlockHash = messageBlock.hash


            // Then
            assert.notEqual(blockHash, messageBlockHash)
        })
    })
})