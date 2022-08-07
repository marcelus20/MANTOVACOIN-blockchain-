# MANTOVACOIN-blockchain-

**RELEASE:** 1.0.0

### A blockchain created in JavaScript for education purposes only

The hash function used in this project is the same for hashing blocks in the bitcoin blockchain, the SHA-256

## Code examples
### Creating a transaction:

You can use the "with" methods:
```javascript
    const { Transaction } = require("mantovacoin")

    const transaction = new Transaction()
        .withSenderAddress("sender")
        .withReceiverAddress("receiver")
        .withValue(50)
    
```
Or you can use the full constructor parameter invokation
```javascript
    const { Transaction } = require("mantovacoin")

    const transaction = new Transaction("sender", "receiver", 50)
```

### Creating a generic Block:

You can use the "with" methods:
```javascript
    const { Block } = require("mantovacoin")

    const block = new Block()
        .withTimestamp(Date.now())
        .withPreviousBlockHash("")
        .withNonce(0)
        .withHash()
    
```
**PS:** It's recommended to invoke the withHash method at the end of the chain, so that it can get the correct hash value after all the other fields were initialised. If you call it before the end of the chain, the hash string returned may not be accurate, and may invalidate the blockchain. 

You can also use the full constructor parameter invokation
```javascript
    const { Block } = require("mantovacoin")

    const block = new Block(Date.now(), "", "", 0)

    // Generate the correct hash for the block after the other fields were initialised: 
    const blockWithHash = block.withHash()
```

### Creating a TransactionalBlock:

You can use the "with" methods:
```javascript
    const { TransactionalBlock } = require("mantovacoin")

    const transactionalBlock = new TransactionalBlock()
        .withTimestamp(Date.now())
        .withPreviousBlockHash("")
        .withNonce(0)
        .withTransaction([ // The array can also be empty.
            new Transaction()
                .withSenderAddress("sender")
                .withReceiverAddress("receiver")
                .withValue(50)
        ])
        .withHash()
    
```
**PS:** It's recommended to invoke the withHash method at the end of the chain, so that it can get the correct hash value after all the other fields were initialised. If you call it before the end of the chain, the hash string returned may not be accurate, and may invalidate the blockchain. 

You can also use the full constructor parameter invokation
```javascript
    const { TransactionalBlock } = require("mantovacoin")

    const transactionalBlock = new TransactionalBlock(Date.now(), "", "", 0, [new Transaction("sender", "receiver", 50)])

    // Generate the correct hash for the block after the other fields were initialised: 
    const blockWithHash = transactionalBlock.withHash()
```

### Creating a MessageBlock:

You can use the "with" methods:
```javascript
    const { MessageBlock } = require("mantovacoin")

    const messageBlock = new MessageBlock()
        .withTimestamp(Date.now())
        .withPreviousBlockHash("")
        .withNonce(0)
        .withMessage("Dummy Message Here")
        .withHash()
    
```
**PS:** It's recommended to invoke the withHash method at the end of the chain, so that it can get the correct hash value after all the other fields were initialised. If you call it before the end of the chain, the hash string returned may not be accurate, and may invalidate the blockchain. 

You can also use the full constructor parameter invokation
```javascript
    const { MessageBlock } = require("mantovacoin")

    const messageBlock = new MessageBlock(Date.now(), "", "", 0, "Dummy Message Here")

    // Generate the correct hash for the block after the other fields were initialised: 
    const blockWithHash = messageBlock.withHash()
```

## TransactionalBlockchain
The transactionalBlockchain uses the transactionalBlock in its underlying structure. The *TransactionalBlockchain.prototype.chain* field will store the *TransactionalBlock* objects.

The default constructor will generate the following default values:
* TransactionalBlockchain.prototype.chain = []
* TransactionalBlockchain.prototype.difficulty = 2
* TransactionalBlockchain.prototype.pendingTransactions = []
* TransactionalBlockchain.prototype.reward = 100

```javascript

    const { TransactionalBlockchain } = require("mantovacoin")

    // Invoking Blockchain empty constructor
    const blockchain = new TransactionalBlockchain()

    // Creating the first transaction
    blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 20))

    // Creating the second transaction:
    blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 5))

    // Mining the pending transactions
    blockchain.miningPendingTransactions("minerAddress1")

    // Checking integrity of the blockchain
    blockchain.isValid() // <= Returns true or false.

    // Checking the funds of an address: 
    blockchain.checkBalanceOfTheAddress("addresshere")

```

### Tampering with a TransactionalBlockchain use case: 

When the blocks already mined are tampered with, you can verify the validity of the chain by invoking the *TransactionalBlockchain.prototype.isValid* method. This should return *false* in this scenario.

Tampering with one block in the chain will cause the subsequent blocks to also be invalid. If you wish to retrieve the first invalid block, you can use the *TransactionalBlockchain.prototype.detectWhichBlockIsInvalid* method, it will return the index of the first invalid block in the chain. 

To get the blocks validated again, you should mine one by one. For that, you can use the *TransactionalBlockchain.prototype.mineSpecificBlock* method, by passing the index of the block you wish to mine. You will need to mine the first and all subsequent blocks one by one all the way to the end of the chain in order for the *TransactionalBlockchain.prototype.isValid* to return true again.
```javascript

    const blockchain = new TransactionalBlockchain()
    // Assigning difficulty level 5
    blockchain.difficulty = 5

    
    blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 20))
    blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 5))
    // Mining the second block (index 1)
    blockchain.miningPendingTransactions("minerAddress1")
    blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 50))
    // Mining the third block (index 2)
    blockchain.miningPendingTransactions("minerAddress1")
    blockchain.createTransaction(new Transaction("dummyAddress1", "dummyAddress2", 50))
    // Mining the second block (index 3)
    blockchain.miningPendingTransactions("minerAddress1")

    // Changing/tampering with the value of the second transaction of the first block, second transaction to 500
    blockchain.chain[1].transactions[1].value = 500

    blockchain.isValid() // <= Will return false

    // Now mining each block one by one till the end of the chain. 
    blockchain.mineSpecificBlock(1);
    blockchain.mineSpecificBlock(2);
    blockchain.mineSpecificBlock(3);

    blockchain.isValid() // <= Will return true
```
**PS**: For this release, the blockchain doesn't check if the sender has sufficient funds for the transaction. 

## MessageBlockchain
The messageBlockhain uses the messageBlock in its underlying structure. The *MessageBlockchain.prototype.chain* field will store the *MessageBlock* objects.

The MessageBlockchain is only focused on checking integrity of messages, as oposed to transactions. Instead of having a transactions array field, it will only contain a string type message field. Since no transaction is invoved, there is no reward to whoever is validating the block. 

The default constructor will generate the following default values:
* MessageBlockchain.prototype.chain = []
* MessageBlockchain.prototype.difficulty = 2
* MessageBlockchain.prototype.pendingMessage = ""

```javascript

    const { MessageBlockchain } = require("mantovacoin")

    // Invoking Blockchain empty constructor
    const blockchain = new MessageBlockchain()

    // Creating a message
    blockchain.createMessage("Message here")

    // Mining the block with the created message 
    blockchain.miningPendingMessage()

    // Checking integrity of the blockchain
    blockchain.isValid() // <= Returns true or false.

```

### Tampering with a MessageBlockchain use case: 

When the blocks already mined are tampered with, you can verify the validity of the chain by invoking the *MessageBlockchain.prototype.isValid* method. This should return *false* in this scenario.

Tampering with one block in the chain will cause the subsequent blocks to also be invalid. If you wish to retrieve the first invalid block, you can use the *MessageBlockchain.prototype.detectWhichBlockIsInvalid* method, it will return the index of the first invalid block in the chain. 

To get the blocks validated again, you should mine one by one. For that, you can use the *MessageBlockchain.prototype.mineSpecificBlock* method, by passing the index of the block you wish to mine. You will need to mine the first and all subsequent blocks one by one all the way to the end of the chain in order for the *MessageBlockchain.prototype.isValid* to return true again.
```javascript

    const blockchain = new MessageBlockchain()
    // Assigning difficulty level 5
    blockchain.difficulty = 5

    blockchain.createMessage("dummy message here")
    // Mining second block (index 1)
    blockchain.miningPendingMessage()
    blockchain.createMessage("another dummy message here in the third block")
    // Mining second block (index 2)
    blockchain.miningPendingMessage()
    blockchain.createMessage("another dummy message here in the fourth block")
    // Mining second block (index 2)
    blockchain.miningPendingMessage()

    // Tampering with the first block after genesis:
    const currentBlock = blockchain.chain[1]
    const tamperedBlock = new MessageBlock()
        .withTimestamp(currentBlock.timestamp)
        .withPreviousBlockHash(currentBlock.previousBlockHash)
        .withHash(currentBlock.hash)
        .withNonce(currentBlock.nonce)
        .withMessage("Tampering with Dummy Message.")

    // Assigning the tampered block back to the chain
    blockchain.chain[1] = tamperedBlock

    blockchain.isValid() // Will return false

    // Mining each block until the end of the chain.
    blockchain.mineSpecificBlock(1)
    blockchain.mineSpecificBlock(2)
    blockchain.mineSpecificBlock(3)

    blockchain.isValid // Will return true
```

## Considerations

The higher the difficulty rate, the longer the mining process will take and the more processing power it will consume. So if you have a weak set up, consider not using a value greater than 6 in the blockchain difficulty field. 

```javascript

    const blockchain = new MessageBlockchain()

    blockchain.difficulty = 6

    blocchain.createMessage("This is going to take a good few minutes to complete due to difficulty 6")

    blockchain.miningPendingMessage()
```

## License
[ISC](https://www.isc.org/licenses/)