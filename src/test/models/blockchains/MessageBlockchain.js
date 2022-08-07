var assert = require('assert');
const MessageBlockchain = require('../../../main/models/blockchains/MessageBlockchain');

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
    describe("miningPendingMessage", ()=>{
        it("Should work even if the pendingMessage contains an empty string.", ()=>{
            // Given Blockchain
            const blockchain = new MessageBlockchain()

            // When message contains empty string.
            blockchain.createMessage("")
            blockchain.miningPendingMessage()

            
            // Then
            assert.equal(blockchain.chain.length, 2)
        })
    })
})

describe("MessageBlockchain",()=>{
    describe("miningPendingMessage", ()=>{
        it("Should mine after the message has been created.", ()=>{
            // Given Blockchain
            const blockchain = new MessageBlockchain()

            // When message contains empty string.
            blockchain.createMessage("dummy message here")
            blockchain.miningPendingMessage()

            
            // Then
            assert.equal(blockchain.chain.length, 2)
        })
    })
})

describe("MessageBlockchain",()=>{
    describe("isValid", ()=>{
        it("Should return true if blocks have not been tampered with.", ()=>{
            // Given Blockchain
            const blockchain = new MessageBlockchain()

            // When message contains empty string.
            blockchain.createMessage("dummy message here")
            blockchain.miningPendingMessage()
            blockchain.createMessage("another dummy message here in the second block")
            blockchain.miningPendingMessage()
            blockchain.createMessage("another dummy message here in the third block")
            blockchain.miningPendingMessage()

            
            // Then
            assert.equal(blockchain.isValid(), true)
        })
    })
})

describe("MessageBlockchain",()=>{
    describe("isValid", ()=>{
        it("Should return false if block 1 have been tampered with and blocks have not been remind until the end of chain.", ()=>{
            // Given Blockchain
            const blockchain = new MessageBlockchain()

            // When message contains empty string.
            blockchain.createMessage("dummy message here")
            blockchain.miningPendingMessage()
            blockchain.createMessage("another dummy message here in the second block")
            blockchain.miningPendingMessage()
            blockchain.createMessage("another dummy message here in the third block")
            blockchain.miningPendingMessage()

            // Tampering with the first block after genesis: 
            blockchain.chain[1].message = "Tampering with Dummy Message."


            
            // Then
            assert.equal(blockchain.isValid(), false)
        })
    })
})

describe("MessageBlockchain",()=>{
    describe("isValid", ()=>{
        it("Should return true if blocks were tampered with as long as each block gets re-mined until the end of the chain.", ()=>{
            // Given Blockchain
            const blockchain = new MessageBlockchain()

            // When message contains empty string.
            blockchain.createMessage("dummy message here")
            blockchain.miningPendingMessage()
            blockchain.createMessage("another dummy message here in the second block")
            blockchain.miningPendingMessage()
            blockchain.createMessage("another dummy message here in the third block")
            blockchain.miningPendingMessage()

            // Tampering with the first block after genesis: 
            blockchain.chain[1].message = "Tampering with Dummy Message."

            // Mining each block until the end of the chain.
            blockchain.mineSpecificBlock(1)
            blockchain.mineSpecificBlock(2)
            blockchain.mineSpecificBlock(3)
            
            // Then
            assert.equal(blockchain.isValid(), true)
        })
    })
})

describe("MessageBlockchain",()=>{
    describe("isValid", ()=>{
        it("Should return false if blocks were tampered with and blocks didn't get re-mined all the way to the end of the chain.", ()=>{
            // Given Blockchain
            const blockchain = new MessageBlockchain()

            // When message contains empty string.
            blockchain.createMessage("dummy message here")
            blockchain.miningPendingMessage()
            blockchain.createMessage("another dummy message here in the second block")
            blockchain.miningPendingMessage()
            blockchain.createMessage("another dummy message here in the third block")
            blockchain.miningPendingMessage()

            // Tampering with the first block after genesis: 
            blockchain.chain[1].message = "Tampering with Dummy Message."

            // Mining each block except the latest
            blockchain.mineSpecificBlock(1)
            blockchain.mineSpecificBlock(2)
            

            
            // Then
            assert.equal(blockchain.isValid(), false)
        })
    })
})

describe("MessageBlockchain",()=>{
    describe("mineSpecificBlock",()=>{
        it("Should set the previousBlockHash to an empty string if the parameter value is 0 (which defaults to genesis block)",()=>{
            //given 
            const blockchain = new MessageBlockchain()
            const emptyString = blockchain.chain[0].previousBlockHash
            // when
            blockchain.mineSpecificBlock(0)
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
            blockchain.miningPendingMessage()

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
            blockchain.miningPendingMessage()

            // Tampering with genesis block
            blockchain.chain[0].message = "tampered dummy message"

            // Then
            assert.equal(blockchain.detectWhichBlockIsInvalid(), 0)
        })
    })
})

describe("MessageBlockchain",()=>{
    describe("detectWhichBlockIsInvalid",()=>{
        it("Should return 2 when the third block gets tampered and didn't get re-mined all the way to the end of chain.",()=>{
            //given 
            const blockchain = new MessageBlockchain()

            // when
            // when
            blockchain.createMessage("dummy message")
            blockchain.miningPendingMessage()
            blockchain.createMessage("dummy message")
            blockchain.miningPendingMessage()
            blockchain.createMessage("dummy message")
            blockchain.miningPendingMessage()

            // Tampering with genesis block
            blockchain.chain[2].message = "tampered dummy message"

            // Then
            assert.equal(blockchain.detectWhichBlockIsInvalid(), 2)
        })
    })
})