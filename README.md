# Crypto-Bookshop
A bookshop running on the Ethererum blockchain. Anyone can put up a book for sale and get paid in ETH.

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
To buy a token it has to be listed for sale. You'll find tokens listed for sale with their prices in the maket section. To buy one you'll click on it to view properly then select the buy button before signing a transaction. When your transaction gets confirmed, you'll be shown the download button. You must download the book in that page because you won't be able to download it again.

## Others
You can also delete, delist or change the price of your book.


## Development
The directory is made up of the open source smart contracts currently deployed on the Ethereum blockchain
