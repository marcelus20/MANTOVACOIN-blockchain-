var assert = require('assert');
const TransactionalBlock = require('../../../main/models/blocks/TransactionalBlock');
const Transaction = require('../../../main/models/Transaction');

describe("TransactionalBlock",()=>{

    it("Should be instantiated with an empty transactions array, if transactions are not specified", ()=>{
        // Given Block
        const emptyTransactionsArray = []

        // When
        const transactions = new TransactionalBlock(Date.now()).transactions;
        
        // Then
        assert.deepEqual(transactions, emptyTransactionsArray)
        
    })
    
})

describe("TransactionalBlock",()=>{
    describe("createHash function", ()=>{
        it("Should generate different hash between 2 blocks that have the same values in its fields except for the transactions.", ()=>{
            // Given 
            const sameDateForBothBlocks = Date.now()
            const samePreviousHashForBothBlocks = ""
            const sameNonceForBothBlocks = 0
            const block1 = new TransactionalBlock()
                .withTimestamp(sameDateForBothBlocks)
                .withPreviousBlockHash(samePreviousHashForBothBlocks)
                .withNonce(sameNonceForBothBlocks)
                .withTransactions([])
            const block2 = new TransactionalBlock()
                .withTimestamp(sameDateForBothBlocks)
                .withPreviousBlockHash(samePreviousHashForBothBlocks)
                .withNonce(sameNonceForBothBlocks)
                .withTransactions([new Transaction()
                    .withSenderAddress("address1")
                    .withReceiverAddress("address2")
                    .withValue(10)])

            // When
            const hashFromBlock1 = block1.withHash().hash
            const hashFromBlock2 = block2.withHash().hash
            
            // Then
            assert.notEqual(hashFromBlock1, hashFromBlock2)
        })
    })
})


describe("TransactionalBlock",()=>{
    describe("mine function", ()=>{
        it("Should have a the value equals 0 when block finishes its mining algorithm when difficulty is equals 0.", ()=>{
            // Given Block
            const block = new TransactionalBlock();

            // When
            block.mine(0)
            
            // Then
            assert.equal(block.nonce, 0)
        })
    })
})

describe("TransactionalBlock",()=>{
    describe("mine function", ()=>{
        it("Should generate a hash that starts with '000' when difficulty is 3", ()=>{
            // Given Block
            const block = new TransactionalBlock();

            // When
            const minedBlock = block.mine(3)
            
            // Then
            assert.equal(minedBlock.hash.startsWith("000"), true)
        })
    })
})