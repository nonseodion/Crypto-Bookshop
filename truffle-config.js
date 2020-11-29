const path = require("path");

require("dotenv").config()
const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");

const web3 = new Web3(HDWalletProvider);
const mnemonic = process.env["MNEMONIC"];
const InfuraAPIKey = process.env["API_KEY"];
const hdWalletProvider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/" + InfuraAPIKey);

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      gas: 46000000,
      network_id: "5777"
    },
    ropsten: {
      provider: hdWalletProvider,
      gas: 4600000,
      gasPrice: web3.utils.toWei("20", "gwei"),
      network_id: "3",
    }
  },
  compilers:{
    solc:{
      version: "^0.6.0",
    }
  }
};
