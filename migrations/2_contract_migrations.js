var OpenBooks = artifacts.require("OpenBooks.sol");
var BookShop = artifacts.require("BookShop.sol");

module.exports = function(deployer) {
  deployer.deploy(OpenBooks, "").then( () => {
    return deployer.deploy(BookShop, OpenBooks.address);
  })
};
