# MANTOVACOIN-blockchain-
A blockchain created in JavaScript
<h3>This blockchain uses the criptography used in bitcoin blockchain, the SHA-256</h3>

This simulates a blockchain and its features such as:
<ul>

<li>Coins Transfer bettween users</li>
<li>The Users are based on a public address that could be any string for testing porpuses</li>
<li>Mining blocks with a certain level of difficulty</li>
<li>possibility of checking the balance of each public address</li>

</ul>

<h3>How to change the difficulty</h3>
Go to Blockchain class and change the attribute difficulty value.
<h1>WARNING</h1>
It is recomended to use the difficulty level between 0 and 5, because higher than 5
may take several minutes to mine the block and the CPU may work harder for the Hash problem solving process

<h3>How to instantiate the the blockchain</h3>
<p background="grey">
<code>const mantovaCoin = new Blockchain();</code>
</p>

<h3> Making transactions </h3>
<code>mantovaCoin.createTransaction(new Transaction(fromAdress, toAddress, ammount));</code>

<h3> mining the block </h3>
<code>mantovaCoin.miningPendingTransactions(minerAddress);</code>
The minerAddress is passed as a parameter because the system will reward the miner with 100 coins for every block mined.

<h3> Checking the balance of a given address </h3>
<code>mantovaCoin.checkBalanceOfTheAddress(address)</code>

<h3> Checking integrity of the blockchain (if it has not been tampered with)</h3>
<code>mantovaCoin.isValid();</code>


<h3>An example of how to tamper with a block on the blockchain</h3>
mantovaCoin.chain[1].transactions[0].value = 8000;
mantovaCoin.isValid() should return false flag from the above line and on

<h3> How to print the whole blockchain </h3>
<code>console.log(JSON.stringify(mantovaCoin.chain, null, 4));</code>
