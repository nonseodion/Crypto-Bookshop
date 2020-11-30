# Crypto-Bookshop
A bookshop running on the Ethererum blockchain. Anyone can put up a book for sale and get paid in ETH.

### Structure
The directory is made up of two open source smart [contracts](https://github.com/nonseodion/Crypto-Bookshop/tree/master/contracts) written in solidity in the contracts folder, OpenBooks and Bookshop currently deployed on the Ethereum Ropsten testnet you can find the addresses in [deployed_addresses.txt](https://github.com/nonseodion/Crypto-Bookshop/blob/master/deployed_addresses.txt). 
The [client](https://github.com/nonseodion/Crypto-Bookshop/tree/master/client) directory holds the frontend of the dapp built using Reactjs.

## Features
- ### Dashboard
  The dashboard shows all your books with different sections for books for sale and books not for sale. It also gives you buttons to withdraw funds made from selling books and to mint a new book.

- ### Market
 The market shows you all the books up for sale including your book
 
- ### Mint page
  Clicking on the "Mint Book" button on your dashboard takes you to a page to upload your book and its image and then mint the book.
  
- ### Book page
  This page gives you the option to delete, list, delist, buy or change the price of a book. You'll see different options depending on if you are the book's owner and if it is listed.
 

## How to Mint
If you have a book for sale and you own the rights to the book you can decide to put it up for sale. To do that you have to mint a book first. When minting a book you'll provide the name of the book, picture of the book and the book itself. They'll all be uploaded to Firebase (presently), and when the upload is done, you are told to mint by signing a mint transaction. This creates an ER721 token representation of your book owned by you address.

## How to Sell
After minting you'll see the wallet in your dashboard. Click on it for more information. You'll be able to List it for sale after entering a price. When a purchase is successfully made on your book, your balance on your dashboard is immediately updated and this can be withdrawn at anytime. When you withdraw you empty your balance.

## How to Buy
To buy a token it has to be listed for sale. You'll find tokens listed for sale with their prices in the maket section. To buy one you'll click on it to view properly then select the buy button before signing a transaction. When your transaction gets confirmed, you'll be shown the download button. You must download the book on that page as you won't be able to download it again.

## Others
You can also delete, delist or change the price of your book.

## Technologies
- Firebase: The images and book files are currently stored using firebase.
- ERC721: The OpenBooks smart contract implements the ERC721 standard.
- Reactjs, Solidity, Web3React, SWR


## Development
### Perequisites
Truffle (v5.1.5)
Node (v12.6.1)
**Note**: The versions specified are the versions used in the project's development. Other versions might also be compatible.

### Setup
#### Deploying the smart contract
- Clone this repository.
- Have a local blockchain instance(e.g [Ganache](https://www.trufflesuite.com/ganache)) running on port `8545` in your computer.
- Open your command line and run`truffle migrate --reset` which redeploys the contracts on your local instance and updates the addresses in your abi. 
- You have to run `npm install` in the root directory if you intend working on the smart contracts.

#### Running the client
- Navigate to the client directory and run `npm install` on your command line.
- Run `npm run start` to get the client running on port `3000` on your computer.
- If your browser does not open automatically go to `localhost:3000` in your browser to view the

#### Contract Interaction
- To interact with the smart contract from your browser, you need to have a plugin(e.g [Metamask](https://metamask.io/)) installed.
- Ensure you have a local blockchain instance running on your computer 
- Connect to `localhost:8545` or setup a custom RPC to that port
- Start interacting with the smartcontract with the client

#### Tests
- To run tests run `truffle test` in your command line.
- Ensure you have a local blockchain instance running before testing




