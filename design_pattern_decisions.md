## 💡 Design Pattern Decisions
Design Decisions taken in writing the Crypto BookShop smart contracts.

### Pull Withdrawal Pattern
When buyers purchase a book the amount paid is added to the balance of the book's owner in `balances`. The book's owner explicitly has to call the `withdraw` function to get his payment. This is favoured over the push method where the money is sent directly to the book's owner to reduce the probability of having failed transactions.

### ERC721 Contract to hold books
The ERC721 `OpenBooks` smart contract was used to hold each book as a token. ERC721 already provided functions which the project needed like mint and burn and had a good method of keeping record of all the tokens present in the contract. The transfer and approval methods weren't needed but can still be called by the book's owner.

### Enumerable Uint to Uint Mapping to hold prices
The Bookshop contract only keeps a record of the prices of books to know the books on sale and those not on sale. Books on sale can't have a price of zero and all books not on sale cost zero ETH by default. The enumerable mapping is a modification of Open Zeppelins EnumerableMap and is used to allow easy retrieval of all books up for sale rather than iterating through all the tokens in the `OpenBooks` contract.

### Change Price
On the frontend, there's a "Change Price" button which isn't listed as a function in the smart contract. To facilitate this, the `list` function can be called for books already up for sale and a `List` event is emitted.

### Pausable 
The `withdraw` and `buy` functions of the `BookShop` can be paused separately by the BookShop owner whenever theres a bug. The `delist` and `list` functions aren't pausable since they don't involve moving money.
