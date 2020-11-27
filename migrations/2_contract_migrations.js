var OpenBooks = artifacts.require("OpenBooks.sol");
var BookShop = artifacts.require("BookShop.sol");

module.exports = function(deployer) {
  deployer.deploy(OpenBooks, "https://firebase.io/bookshop").then( () => {
    return deployer.deploy(BookShop, OpenBooks.address);
  })
};
