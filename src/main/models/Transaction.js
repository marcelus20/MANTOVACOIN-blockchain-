/**
 * The transaction class  will be made of 2 public address, the Sender address and the receiver address, and the value of
 * the transaction
 *
 */

module.exports = class Transaction{
    constructor(senderAddress, receiverAddress, value){
        this.senderAddress = senderAddress;
        this.receiverAddress = receiverAddress;
        this.value = value;
    }
 }