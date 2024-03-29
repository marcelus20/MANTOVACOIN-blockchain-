var assert = require('assert');
const MessageBlockchain = require('../../../main/models/blockchains/MessageBlockchain');
const MessageBlock = require('../../../main/models/blocks/MessageBlock');

describe("MessageBlockchain",()=>{
    describe("constructor", ()=>{
        it("Should automatically create first block, therefore, the chain attribute should have size of 1", ()=>{
            // Given Blockchain
            const blockchain = new MessageBlockchain()

            // When
            const chain = blockchain.chain
            
            // Then
            assert.equal(chain.length, 1)
        })
    })
})

describe("MessageBlockchain",()=>{
    describe("minePendingTransactions", ()=>{
        it("Should work even if the pendingMessage contains an empty string.", async ()=>{
            // Given Blockchain
            const blockchain = new MessageBlockchain()

            // When message contains empty string.
            blockchain.createMessage("")
            await blockchain.minePendingMessage()

            
            // Then
            assert.equal(blockchain.chain.length, 2)
        })
    })
})

describe("MessageBlockchain",()=>{
    describe("minePendingTransactions", ()=>{
        it("Should mine after the message has been created.", async ()=>{
            // Given Blockchain
            const blockchain = new MessageBlockchain()

            // When message contains empty string.
            blockchain.createMessage("dummy message here")
            await blockchain.minePendingMessage()

            
            // Then
            assert.equal(blockchain.chain.length, 2)
        })
    })
})

describe("MessageBlockchain",()=>{
    describe("isValid", ()=>{
        it("Should return true if blocks have not been tampered with.", async ()=>{
            // Given Blockchain
            const blockchain = new MessageBlockchain()

            // When message contains empty string.
            blockchain.createMessage("dummy message here")
            await blockchain.minePendingMessage()
            blockchain.createMessage("another dummy message here in the second block")
            await blockchain.minePendingMessage()
            blockchain.createMessage("another dummy message here in the third block")
            await blockchain.minePendingMessage()

            
            // Then
            assert.equal(true, blockchain.isValid())
        })
    })
})

describe("MessageBlockchain",()=>{
    describe("isValid", ()=>{
        it("Should return false if block 1 have been tampered with and blocks have not been remind until the end of chain.", async ()=>{
            // Given Blockchain
            const blockchain = new MessageBlockchain()

            // When message contains empty string.
            blockchain.createMessage("dummy message here")
            await blockchain.minePendingMessage()
            blockchain.createMessage("another dummy message here in the second block")
            await blockchain.minePendingMessage()
            blockchain.createMessage("another dummy message here in the third block")
            await blockchain.minePendingMessage()

            // Tampering with the first block after genesis: 
            blockchain.chain[1].message = "Tampering with Dummy Message."


            
            // Then
            assert.equal(blockchain.isValid(), false)
        })
    })
})

describe("MessageBlockchain",()=>{
    describe("isValid", ()=>{
        it("Should return true if blocks were tampered with as long as each block gets re-mined until the end of the chain.", async ()=>{
            // Given Blockchain
            const blockchain = new MessageBlockchain()

            // When message contains empty string.
            blockchain.createMessage("dummy message here")
            await blockchain.minePendingMessage()
            blockchain.createMessage("another dummy message here in the second block")
            await blockchain.minePendingMessage()
            blockchain.createMessage("another dummy message here in the third block")
            await blockchain.minePendingMessage()

            // Tampering with the first block after genesis:
            const currentBlock = blockchain.chain[1]
            const tamperedBlock = new MessageBlock()
                .withTimestamp(currentBlock.timestamp)
                .withPreviousBlockHash(currentBlock.previousBlockHash)
                .withHash(currentBlock.hash)
                .withNonce(currentBlock.nonce)
                .withMessage("Tampering with Dummy Message.")

            blockchain.chain[1] = tamperedBlock

            // Mining each block until the end of the chain.
            await blockchain.mineSpecificBlock(1)
            await blockchain.mineSpecificBlock(2)
            await blockchain.mineSpecificBlock(3)
            
            // Then
            assert.equal(true, blockchain.isValid())
        })
    })
})

describe("MessageBlockchain",()=>{
    describe("isValid", ()=>{
        it("Should return false if blocks were tampered with and blocks didn't get re-mined all the way to the end of the chain.", async ()=>{
            // Given Blockchain
            const blockchain = new MessageBlockchain()

            // When message contains empty string.
            blockchain.createMessage("dummy message here")
            await blockchain.minePendingMessage()
            blockchain.createMessage("another dummy message here in the second block")
            await blockchain.minePendingMessage()
            blockchain.createMessage("another dummy message here in the third block")
            await blockchain.minePendingMessage()

            // Tampering with the first block after genesis: 
            blockchain.chain[1].message = "Tampering with Dummy Message."

            // Mining each block except the latest
            await blockchain.mineSpecificBlock(1)
            await blockchain.mineSpecificBlock(2)
            

            
            // Then
            assert.equal(blockchain.isValid(), false)
        })
    })
})

describe("MessageBlockchain",()=>{
    describe("mineSpecificBlock",()=>{
        it("Should set the previousBlockHash to an empty string if the parameter value is 0 (which defaults to genesis block)", async ()=>{
            //given 
            const blockchain = new MessageBlockchain()
            const emptyString = blockchain.chain[0].previousBlockHash
            // when
            await blockchain.mineSpecificBlock(0)
            // Then
            assert.equal(blockchain.chain[0].previousBlockHash, emptyString)
        })
    })
})

describe("MessageBlockchain",()=>{
    describe("isValid",()=>{
        it("Should return false when the genesis block has been tampered with.",()=>{
            //given 
            const blockchain = new MessageBlockchain()

            // when
            blockchain.createMessage("dummy message")
            blockchain.minePendingMessage()

            // Tampering with genesis block
            blockchain.chain[0].message = "tampered dummy message"

            // Then
            assert.equal(blockchain.isValid(), false)
        })
    })
})

describe("MessageBlockchain",()=>{
    describe("detectWhichBlockIsInvalid",()=>{
        it("Should return 0 when genesis block got tampered with.",()=>{
            //given 
            const blockchain = new MessageBlockchain()

            // when
            // when
            blockchain.createMessage("dummy message")
            blockchain.minePendingMessage()

            // Tampering with genesis block
            // blockchain.chain[0].message = "tampered dummy message"
            const genesisBlock = {...blockchain.chain[0]}
            const tamperedBlock = new MessageBlock()
                .withTimestamp(genesisBlock.timestamp)
                .withPreviousBlockHash(genesisBlock.previousBlockHash)
                .withHash(genesisBlock.hash)
                .withNonce(genesisBlock.nonce)
                .withMessage("tampered dummy message")

                blockchain.chain[0] = tamperedBlock


            // Then
            assert.equal(blockchain.detectWhichBlockIsInvalid(), 0)
        })
    })
})

describe("MessageBlockchain",()=>{
    describe("detectWhichBlockIsInvalid",()=>{
        it("Should return 2 when the third block gets tampered and didn't get re-mined all the way to the end of chain.", async ()=>{
            //given 
            const blockchain = new MessageBlockchain()

            // when
            // when
            blockchain.createMessage("dummy message")
            await blockchain.minePendingMessage()
            blockchain.createMessage("dummy message")
            await blockchain.minePendingMessage()
            blockchain.createMessage("dummy message")
            await blockchain.minePendingMessage()

            // Tampering with genesis block
            blockchain.chain[2].message = "tampered dummy message"

            // Then
            assert.equal(blockchain.detectWhichBlockIsInvalid(), 2)
        })
    })
})