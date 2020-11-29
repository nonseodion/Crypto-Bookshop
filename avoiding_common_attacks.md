## 🚧 Avoiding Common Attacks
Steps I took to avoid common contract attacks

### Pull Withdrawal to Prevent DOS attacks
When books listed are bought, the book's owner balance is updated on the smart contract and the funds are held by the smart contract. The books owner has to explicity call the `withdraw` function to get his proceeds from sales. This is to prevent DOS attacks which can prevent anyone from buying the book because the owner cannot be paid.

### Check-Effects-Interaction to prevent Reentrancy
In the `withdraw` function, a check that ensures the function is not paused is done first. This is followed by changes to the balance of the message sender before calling the address and sending the balance. This prevents reentrancy attacks as the balance of the caller is already empty the second time `withdraw` is called in the same transaction.

### Burn Attacks
A book listed for sale on `BookShop` can be burnt on `OpenBooks`. This causes a DOS attack for the `BookShop` contract since it can't get all the books on sale. To prevent this, before a books information is retrieved it is first checked for existence on `OpenBooks` smart contract. If it doesn't exist, zero is put in place of the books Id, price and URI.
