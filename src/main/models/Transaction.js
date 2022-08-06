/**
 * The transaction class  will be made of 2 public address, the Start address and Destination address, and the value of
 * the transaction
 *
 */

module.exports = class Transaction{
    constructor(startAddress, destinationAddress, value){
        this.startAddress = startAddress;
        this.destinationAddress = destinationAddress;
        this.value = value;
    }
 }