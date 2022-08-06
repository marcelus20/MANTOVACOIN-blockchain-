var assert = require('assert');
const Transaction = require('../../main/models/Transaction');
const TransactionalBlockchain = require('../../main/models/TransactionalBlockchain');

describe("TransactionalBlockchain",()=>{
    describe("constructor", ()=>{
        it("Should automatically create first block, therefore, the chain attribute should have size of 1", ()=>{
            // Given Blockchain
            const blockchain = new TransactionalBlockchain()

            // When
            const chain = blockchain.chain
            
            // Then
            assert.equal(chain.length, 1)
        })
    })
})

describe("TransactionalBlockchain",()=>{
    describe("pending transactions", ()=>{
        it("Should have size of 2 after two transactions have been inserted.", ()=>{
            // Given Blockchain
            const blockchain = new TransactionalBlockchain()

            // When
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 20))
            blockchain.createTransaction(new Transaction("dummyAddress2", "dummyAddress1", 10))
            
            // Then
            assert.equal(blockchain.pendingTransactions.length, 2)
        })
    })
})

describe("TransactionalBlockchain",()=>{
    describe("createTransaction", ()=>{
        it("Should not create transaction if an address is sending funds to itself", ()=>{
            // Given Blockchain
            const blockchain = new TransactionalBlockchain()

            // When
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress1", 20))
            
            // Then
            assert.equal(blockchain.pendingTransactions.length, 0)
        })
    })
})

describe("TransactionalBlockchain",()=>{
    describe("miningPendingTransactions", ()=>{
        it("Should create a new block if there are pending transactions", ()=>{
            // Given Blockchain
            const blockchain = new TransactionalBlockchain()

            // When
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 20))
            blockchain.miningPendingTransactions("minerAddress")
            
            // Then
            assert.equal(blockchain.chain.length, 2)
        })
    })
})

describe("TransactionalBlockchain",()=>{
    describe("miningPendingTransactions", ()=>{
        it("Should not mine if there are no new transactions in pending transactions", ()=>{
            // Given Blockchain
            const blockchain = new TransactionalBlockchain()

            // When
            blockchain.miningPendingTransactions("minerAddress")
            
            // Then
            assert.equal(blockchain.chain.length, 1)
        })
    })
})

describe("TransactionalBlockchain",()=>{
    describe("checkBalanceOfTheAddress", ()=>{
        it("When miner mines only 1 block and no more blocks were mined after this, the balance of 100 should not yet show available, so balance should be 0.", ()=>{
            // Given Blockchain
            const blockchain = new TransactionalBlockchain()

            // When
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 20))
            blockchain.miningPendingTransactions("minerAddress")
            
            // Then
            assert.equal(0, blockchain.checkBalanceOfTheAddress("minerAddress"))
        })
    })
})

describe("TransactionalBlockchain",()=>{
    describe("checkBalanceOfTheAddress", ()=>{
        it("When miner mines only 1 block, the balance of 100 will only show available after another block gets mined after.", ()=>{
            // Given Blockchain
            const blockchain = new TransactionalBlockchain()

            // When
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 20))
            blockchain.miningPendingTransactions("minerAddress") // Mining before the latest block
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 20))
            blockchain.miningPendingTransactions("minerAddress") // Mining the latest block

            // Then
            assert.equal(100, blockchain.checkBalanceOfTheAddress("minerAddress"))
        })
    })
})

describe("TransactionalBlockchain",()=>{
    describe("checkBalanceOfTheAddress", ()=>{
        it("When miner mines only 1 block, the balance of 100 will only show available after another block gets mined after, even if by another miner.", ()=>{
            // Given Blockchain
            const blockchain = new TransactionalBlockchain()

            // When
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 20))
            blockchain.miningPendingTransactions("minerAddress1") // Mining first block
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 20))
            blockchain.miningPendingTransactions("minerAddress2") // Mining second block

            // Then
            assert.equal(100, blockchain.checkBalanceOfTheAddress("minerAddress1"))
        })
    })
})

describe("TransactionalBlockchain",()=>{
    describe("checkBalanceOfTheAddress", ()=>{
        it("Should return 20 to dummyAddress 2 after it receives the transaction and block gets mined.", ()=>{
            // Given Blockchain
            const blockchain = new TransactionalBlockchain()

            // When
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 20))
            blockchain.miningPendingTransactions("minerAddress1")
            
            // Then
            assert.equal(20, blockchain.checkBalanceOfTheAddress("dummyAddress2"))
        })
    })
})

describe("TransactionalBlockchain",()=>{
    describe("checkBalanceOfTheAddress", ()=>{
        it("Should return 0 to dummyAddress 2 after it receives the transaction, but transaction is still pending (needs mining).", ()=>{
            // Given Blockchain
            const blockchain = new TransactionalBlockchain()

            // When
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 20))
            
            // Then
            assert.equal(0, blockchain.checkBalanceOfTheAddress("dummyAddress2"))
        })
    })
})


describe("TransactionalBlockchain",()=>{
    describe("isValid", ()=>{
        it("Should return true if after mining, data about it wasn't changed/manipulated", ()=>{
            // Given Blockchain
            const blockchain = new TransactionalBlockchain()

            // When
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 20))
            blockchain.miningPendingTransactions("minerAddress1")
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 50))
            blockchain.miningPendingTransactions("minerAddress1")
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 50))
            blockchain.miningPendingTransactions("minerAddress1")
            
            // Then
            assert.equal(true, blockchain.isValid())
        })
    })
})

describe("TransactionalBlockchain",()=>{
    describe("isValid", ()=>{
        it("Should return false if after mining, data about it is changed and not mined/validated after", ()=>{
            // Given Blockchain
            const blockchain = new TransactionalBlockchain()

            // When
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 20))
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 5))
            blockchain.miningPendingTransactions("minerAddress1")
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 50))
            blockchain.miningPendingTransactions("minerAddress1")
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 50))
            blockchain.miningPendingTransactions("minerAddress1")

            // Changing/tampering the value of the second transaction of the first block to 500
            blockchain.chain[1].transactions[1].value = 500
            
            // Then
            assert.equal(false, blockchain.isValid())
        })
    })
})

describe("TransactionalBlockchain",()=>{
    describe("detectWhichBlockIsInvalid", ()=>{
        it("Should return 1 if the second block got tampered with.", ()=>{
            // Given Blockchain
            const blockchain = new TransactionalBlockchain()

            // When
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 20))// <- second block
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 5))
            blockchain.miningPendingTransactions("minerAddress1")
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 50))
            blockchain.miningPendingTransactions("minerAddress1")
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 50))
            blockchain.miningPendingTransactions("minerAddress1")

            // Changing/tampering the value of the second transaction of the second block to 500
            blockchain.chain[1].transactions[1].value = 500

            
            // Then
            assert.equal(1, blockchain.detectWhichBlockIsInvalid())
        })
    })
})

describe("TransactionalBlockchain",()=>{
    describe("isValid", ()=>{
        it("Should return true when tampered with as long as each block gets re-validated/mined again.", ()=>{
            // Given Blockchain
            const blockchain = new TransactionalBlockchain()
            blockchain.difficulty = 1

            // When
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 20))
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 5))
            blockchain.miningPendingTransactions("minerAddress1")
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 50))
            blockchain.miningPendingTransactions("minerAddress1")
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 50))
            blockchain.miningPendingTransactions("minerAddress1")

            // Changing/tampering the value of the second transaction of the first block to 500

            blockchain.chain[1].transactions[1].value = 500

            // Now mining each block one by one. 
            blockchain.mineSpecificBlock(1);
            blockchain.mineSpecificBlock(2);
            blockchain.mineSpecificBlock(3);
            
            // Then
            assert.equal(blockchain.isValid(), true)
        })
    })
})

describe("TransactionalBlockchain",()=>{
    describe("isValid", ()=>{
        it("Should return true when tampered with in the genesis block as long as each block gets re-validated/mined again until the end of the chain.", ()=>{
            // Given Blockchain
            const blockchain = new TransactionalBlockchain()
            blockchain.difficulty = 1

            // When
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 20))
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 5))
            blockchain.miningPendingTransactions("minerAddress1")
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 50))
            blockchain.miningPendingTransactions("minerAddress1")
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 50))
            blockchain.miningPendingTransactions("minerAddress1")

            // Changing/tampering the value of the transaction of the genesis block

            blockchain.chain[0].transactions[0].value = 500

            // Now mining each block one by one. 
            blockchain.mineSpecificBlock(0);
            blockchain.mineSpecificBlock(1);
            blockchain.mineSpecificBlock(2);
            blockchain.mineSpecificBlock(3);
            
            // Then
            assert.equal(blockchain.isValid(), true)
        })
    })
})

describe("TransactionalBlockchain",()=>{
    describe("isValid", ()=>{
        it("If Genesis Block has been tampered with, there is no use of mining from the second block and on until the end of the chain, without mining the genesis block beforehand.", ()=>{
            // Given Blockchain
            const blockchain = new TransactionalBlockchain()
            blockchain.difficulty = 1

            // When
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 20))
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 5))
            blockchain.miningPendingTransactions("minerAddress1")
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 50))
            blockchain.miningPendingTransactions("minerAddress1")
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 50))
            blockchain.miningPendingTransactions("minerAddress1")

            // Changing/tampering the value of the transaction of the genesis block

            blockchain.chain[0].transactions[0].value = 500

            // Now mining each block one by one, ignoring genesis. 
            blockchain.mineSpecificBlock(1);
            blockchain.mineSpecificBlock(2);
            blockchain.mineSpecificBlock(3);
            
            // Then
            assert.equal(blockchain.isValid(), false)
        })
    })
})

describe("TransactionalBlockchain",()=>{
    describe("mineSpecificBlock",()=>{
        it("Should set the previousBlockHash to an empty string if the parameter value is lower than 0 (which indicates that the block is the genesis block)",()=>{
            //given 
            const blockchain = new TransactionalBlockchain()
            const emptyString = blockchain.chain[0].previousBlockHash
            // when
            blockchain.mineSpecificBlock(-10)
            // Then
            assert.equal(blockchain.chain[0].previousBlockHash, emptyString)
        })
    })
})

describe("TransactionalBlockchain",()=>{
    describe("mineSpecificBlock",()=>{
        it("Should set the previousBlockHash to an empty string if the parameter value is 0 (which defaults to genesis block)",()=>{
            //given 
            const blockchain = new TransactionalBlockchain()
            const emptyString = blockchain.chain[0].previousBlockHash
            // when
            blockchain.mineSpecificBlock(0)
            // Then
            assert.equal(blockchain.chain[0].previousBlockHash, emptyString)
        })
    })
})

describe("TransactionalBlockchain",()=>{
    describe("isValid",()=>{
        it("Should return false when the genesis block has been tampered with.",()=>{
            //given 
            const blockchain = new TransactionalBlockchain()

            // when
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 20))
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 5))
            blockchain.miningPendingTransactions("minerAddress1")

            // Tampering with genesis block
            blockchain.chain[0].transactions.push(new Transaction("dummyAddress1", "dummyAddress2", 200))

            // Then
            assert.equal(blockchain.isValid(), false)
        })
    })
})

describe("TransactionalBlockchain",()=>{
    describe("detectWhichBlockIsInvalid",()=>{
        it("Should return 0 when genesis block got tampered with.",()=>{
            //given 
            const blockchain = new TransactionalBlockchain()

            // when
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 20))
            blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 5))
            blockchain.miningPendingTransactions("minerAddress1")

            // Tampering with genesis block
            blockchain.chain[0].transactions.push(new Transaction("dummyAddress1", "dummyAddress2", 200))

            // Then
            assert.equal(blockchain.detectWhichBlockIsInvalid(), 0)
        })
    })
})