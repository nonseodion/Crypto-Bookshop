const {
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

const OpenBooks = artifacts.require("OpenBooks");

contract("OpenBooks", accounts => {
  let instance;
  const baseURI = "https://firebase.io/";
  const book1URI = "book1";
  const alice = accounts[0];

  beforeEach( async () => {
    instance = await OpenBooks.new(baseURI);
  });

  /*
  When the contract is deployed the BaseURI is set in the constructor.
  This test checks if it was set correctly by comparing with the string value provided;
  */
  it("should set the baseURI", async () => {
    const _baseURI = await instance.baseURI.call();
    expect(_baseURI, "BaseURI not set to " + baseURI).to.equal(baseURI);
  })

  /*
  An NFT which acts like the right to sell a book can be minted by anyone.
  This set of tests check if the book is minted properly
  */
  describe("Mint a book", () => {
    let receipt;
    beforeEach( async () => {
      receipt = await instance.mint(book1URI, {from: alice});
    });

    /*
    Minting a book should increase total supply.
    This test checks if the total supply of the NFT contract has been increased by one when a book is minted.
    */
    it("should increase totalSupply", async () => {
      const totalSupply = await instance.totalSupply.call();
      expect(totalSupply.toString(), "Total Supply not increased by 1").to.equal("1");
    })

    /* 
    This test checks if the contract set the owner of the book to the caller of the mint function.
    */
    it("should set alice to book id 1 owner", async () => {
      const owner = await instance.ownerOf.call(1);
      expect(owner, `${owner} isn't ${alice}`).to.equal(alice);
    })

    /*
    Checks if the balance of the minter's address has been increased by one when a book is minted.
    */
    it("should increase alice balance", async () => {
      const balance = await instance.balanceOf(alice);
      expect(balance.toString(), `alice balance remains ${balance}`).to.equal("1");
    })

    /*
      Checks if the minted book exists in the smart contract.
    */
    it("token id 1 should exist", async () => {
      const exists = await instance.exists(1);
      expect(exists, "token id 1 does not exist").to.be.true;
    })

    /*
    Checks if a Transfer event from the zero address to the mint caller is emitted whenever a book is minted.
     */
    it("should emit a transfer event", async () => {
      expectEvent(receipt, "Transfer",{
        from: constants.ZERO_ADDRESS,
        to: alice,
        tokenId: "1"
      })
    })
  })

  /*
  An NFT which acts like the right to sell a book can be burnt by only the owner of the NFT,
  This set of tests check if the book is burnt properly
  */
  describe("Burn a book", () => {
    let receipt;
    beforeEach( async () => {
      await instance.mint(book1URI, {from: alice});
      receipt = await instance.burn(1, {from: alice});
    });

    /*
    Burning a book should decrease total supply.
    This test checks if the total supply of the NFT contract has been decreased by one when a book is burnt.
    */
    it("should decrease totalSupply", async () => {
      const totalSupply = await instance.totalSupply.call();
      expect(totalSupply.toString(), "Total Supply not decreased by 1").to.equal("0");
    })

    /* 
    This test checks if a non-existent book can be burnt.
    */
    it("should revert when asked for balance of non-existent book", async () => {
      expectRevert( instance.ownerOf.call(1), "ERC721: owner query for nonexistent token");
    })

    /*
    Checks if the balance of the burner's address has been decreased by one when a book is burnt.
    */
    it("should decrease alice balance", async () => {
      const balance = await instance.balanceOf(alice);
      expect(balance.toString(), `alice balance remains ${balance}`).to.equal("0");
    })

    /*
    The burn function should remove the book from it's set of books.
    Checks if the burnt book still exists in the smart contract.
    */
    it("token id 1 should not exist", async () => {
      const exists = await instance.exists(1);
      expect(exists, "token id 1 exists").to.be.false;
    })

    /*
    Checks if a Transfer event from the mint caller to the zero address is emitted whenever a book is burnt.
    */
    it("should emit a transfer event", async () => {
      expectEvent(receipt, "Transfer",{
        from: alice,
        to: constants.ZERO_ADDRESS,
        tokenId: "1"
      })
    })
  })
})