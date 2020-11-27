const {
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');

const BookShop = artifacts.require("BookShop");
const OpenBooks = artifacts.require("OpenBooks");

contract("BookShop", (accounts) => {
  let openBooksInstance, bookShopInstance;
  const baseURI = "https://firebase.io/";
  const alice = accounts[0];
  const bob = accounts[1];
  const book1URI = "book1";
  const book2URI = "book2";

  before( async () => {
    openBooksInstance = await OpenBooks.new(baseURI);
    await openBooksInstance.mint(book1URI, {from: alice});
    await openBooksInstance.mint(book2URI, {from: alice});
  })

  beforeEach( async () => {
    bookShopInstance = await BookShop.new(openBooksInstance.address);
  })

  /*
  When the BookShop contract is initialized the OpenBooks contract address is set.
  This test checks if the address was set to the provided deployed OpenBooks contract address.
  */
  it("should get OpenBooks instance address", async () => {
    let address = await bookShopInstance.getOpenBooks.call();
    expect(address, "OpenBook address not set on initialization").to.equal(openBooksInstance.address)
  })

  /*
  The following set of tests check if the contract is correctly updated when a book is listed for sale.
   */
  describe("List a book", () => {
    /*
    Checks if a book is listed by checking if it's price returns the provided price.
    */
    it("should list a book", async () => {
      await bookShopInstance.list(1, web3.utils.toWei("1"), {from: alice});
      const price = await bookShopInstance.getPrice(1);
      expect(price.toString(), "book not listed").to.equal(web3.utils.toWei("1"));
    })

    /*
    The default price of a book is zero when not listed.
    Checks if a book can be listed for sale with a price of zero.
    */
    it("should not let price to equal zero", async () => {
      expectRevert(bookShopInstance.list(1, 0), "BookShop: Price cannot be zero");
    })

    /*
    Only the owner of a book should be able to list it for sale.
    Checks if a book can be listed for sale by anyone.
     */
    it("should let only owner list a book", async () => {
      expectRevert(bookShopInstance.list(1, web3.utils.toWei("1"), {from: bob}), "BookShop: Not owner of book");
    })

    /*
    A List event is emitted anytime a book is listed for sale.
    Checks if a List event with the owner as the list function caller, bookId as the token's Id and the provided price as price is emitted. 
    */
    it("should emit a list event", async () => {
      const receipt = await bookShopInstance.list(1, web3.utils.toWei("1"), {from: alice});
      expectEvent(receipt, "List", {
        owner: alice,
        bookId: "1",
        price: web3.utils.toWei("1")
      })
    })
  })

  describe("DeList a book", () => {
    
    beforeEach(() => bookShopInstance.list(1, web3.utils.toWei("1"), {from: alice}));

    /*
    Checks if a book is delisted by checking if it's price returns zero.
    */
    it("should deList a book", async () => {
      await bookShopInstance.deList(1, {from: alice});
      const price = await bookShopInstance.getPrice(1);
      expect(price.toString(), "book listed").to.equal(web3.utils.toWei("0"));
    })

    /*
    Checks if a book not listed can be delisted.
    */
    it("must be listed", async () => {
      expectRevert(bookShopInstance.deList(2, {from: alice}), "BookShop: Not Listed");
    })

    /*
    Only the owner of a book should be able to delis it.
    Checks if anyone can delist a book.
    */
    it("should let only owner deList a book", async () => {
      expectRevert(bookShopInstance.deList(1, {from: bob}), "BookShop: Not owner of book");
    })

    /*
    A deList event is emitted anytime a book is delisted.
    Checks if a DeList event with the owner as the list function caller, bookId as the token's Id and the provided price as price is emitted. 
    */    
    it("should emit a deList event", async () => {
      const receipt = await bookShopInstance.deList(1, {from: alice});
      expectEvent(receipt, "DeList", {
        owner: alice,
        bookId: "1",
      })
    })
  })
})