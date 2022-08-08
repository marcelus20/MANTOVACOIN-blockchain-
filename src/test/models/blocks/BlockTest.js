var assert = require('assert');
const Block = require('../../../main/models/blocks/Block');


describe("Block",()=>{
    describe("nonce attribue", ()=>{
        it("Should be initiated with the value of 0 when Block constructor is invoked.", ()=>{
            // Given Block
            const block = new Block();

            // When
            const nonce = block.nonce
            
            // Then
            assert.equal(nonce, 0)
        })
    })
})


describe("Block",()=>{
    describe("mine function", ()=>{
        it("Should have a the value equals 0 when block finishes its mining algorithm when difficulty is equals 0.", ()=>{
            // Given Block
            const block = new Block();

            // When
            block.mine(0)
            
            // Then
            assert.equal(block.nonce, 0)
        })
    })
})

describe("Block",()=>{
    describe("mine function", ()=>{
        it("Should generate a hash that starts with '000' when difficulty is 3", async ()=>{
            // Given Block
            const block = new Block();

            // When
            const minedBlock = await block.mine(3)
            
            // Then
            assert.equal(minedBlock.hash.startsWith("000"), true)
        })
    })
})



